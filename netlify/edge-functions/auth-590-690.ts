import type { Context } from "https://edge.netlify.com";
import { jwtVerify, createRemoteJWKSet } from "https://esm.sh/jose@5.9.6";

const DISCOVERY_URL = 'https://shibboleth.umich.edu/.well-known/openid-configuration';
const SCOPE = 'openid profile email';

function getClientConfig(request: Request) {
  const url = new URL(request.url);
  return {
    clientId: Deno.env.get('UMICH_590_690_CLIENT_ID') || '',
    clientSecret: Deno.env.get('UMICH_590_690_CLIENT_SECRET') || '',
    redirectUri: `${url.protocol}//${url.host}/auth/590-690/callback`,
  };
}

let JWKS: ReturnType<typeof createRemoteJWKSet> | null = null;

async function getJWKS(jwksUri: string) {
  if (!JWKS) {
    JWKS = createRemoteJWKSet(new URL(jwksUri));
  }
  return JWKS;
}

async function fetchOIDCDiscovery() {
  const response = await fetch(DISCOVERY_URL);
  return response.json();
}

export default async function(request: Request, context: Context) {
  const url = new URL(request.url);
  const baseUrl = `${url.protocol}//${url.host}`;
  console.log('590-690 Auth function called for:', url.pathname);
  const token = context.cookies.get('umich_590_690_token');

  // Only check auth for 590-690 pages and callback
  if (!url.pathname.startsWith('/academics/courses/course-offerings/current-590-690') &&
      url.pathname !== '/auth/590-690/callback') {
    console.log('Skipping auth for non-590-690 path');
    return context.next();
  }

  // Get OIDC endpoints from discovery URL
  const discovery = await fetchOIDCDiscovery();
  const clientConfig = getClientConfig(request);
  console.log('Got OIDC config for 590-690');

  // Development bypass
  if (Deno.env.get('NODE_ENV') === 'development') {
    console.log('Development mode - bypassing 590-690 auth');
    return context.next();
  }

  if (url.pathname === '/auth/590-690/callback') {
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state') || '/academics/courses/course-offerings/current-590-690';
    console.log('590-690 Callback received with code:', code);

    if (!code) {
      console.log('No code in callback, redirecting to access denied');
      return new Response(`
        <!DOCTYPE html>
        <html>
        <head><title>Access Denied</title></head>
        <body>
          <h1>Access Denied</h1>
          <p>Authentication failed. Missing authorization code.</p>
          <a href="/">Return to Home</a>
        </body>
        </html>
      `, {
        headers: { 'Content-Type': 'text/html' },
        status: 403
      });
    }

    // Exchange code for token
    const tokenResponse = await fetch(discovery.token_endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: clientConfig.clientId,
        client_secret: clientConfig.clientSecret,
        redirect_uri: clientConfig.redirectUri,
      }),
    });

    const tokenData = await tokenResponse.json();
    console.log('590-690 Token exchange response status:', tokenResponse.status);

    if (!tokenData.id_token) {
      console.error('Token exchange failed for 590-690:', tokenData);
      return Response.redirect(`${baseUrl}/`);
    }

    // Verify the token before setting cookie
    try {
      const jwks = await getJWKS(discovery.jwks_uri);
      await jwtVerify(tokenData.id_token, jwks, {
        issuer: "https://shibboleth.umich.edu",
        audience: clientConfig.clientId
      });
    } catch (error) {
      console.error('Initial token verification failed for 590-690:', error);
      return Response.redirect(`${baseUrl}/`);
    }

    return new Response('', {
      status: 302,
      headers: {
        'Location': state,
        'Set-Cookie': `umich_590_690_token=${tokenData.id_token}; Path=/; HttpOnly; Secure; SameSite=Lax`,
      },
    });
  }

  // No token = redirect to login
  if (!token) {
    const authUrl = new URL(discovery.authorization_endpoint);
    authUrl.searchParams.set('client_id', clientConfig.clientId);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', SCOPE);
    authUrl.searchParams.set('redirect_uri', clientConfig.redirectUri);
    authUrl.searchParams.set('state', url.pathname);

    return Response.redirect(authUrl.toString());
  }

  // Verify existing token
  try {
    const jwks = await getJWKS(discovery.jwks_uri);
    console.log('Verifying existing 590-690 token...');

    const verified = await jwtVerify(token, jwks, {
      issuer: "https://shibboleth.umich.edu",
      audience: clientConfig.clientId,
      clockTolerance: '5 minutes'
    });
    console.log('590-690 token verified successfully');
    return context.next();
  } catch (error) {
    console.error('590-690 token verification failed:', error);

    // If token is expired or invalid, clear it and redirect to login
    const authUrl = new URL(discovery.authorization_endpoint);
    authUrl.searchParams.set('client_id', clientConfig.clientId);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', SCOPE);
    authUrl.searchParams.set('redirect_uri', clientConfig.redirectUri);
    authUrl.searchParams.set('state', url.pathname);

    return new Response(null, {
      status: 302,
      headers: {
        'Location': authUrl.toString(),
        'Set-Cookie': 'umich_590_690_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax'
      }
    });
  }
}
