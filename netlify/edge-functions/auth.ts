import type { Context } from "https://edge.netlify.com";
import { jwtVerify, createRemoteJWKSet } from "https://esm.sh/jose@5.9.6?target=deno";

const DISCOVERY_URL = 'https://shibboleth.umich.edu/.well-known/openid-configuration';
const SCOPE = 'openid profile email eduperson_affiliation edumember';

function getClientConfig(request: Request) {
  const url = new URL(request.url);
  return {
    clientId: Deno.env.get('UMICH_CLIENT_ID') || '',
    clientSecret: Deno.env.get('UMICH_CLIENT_SECRET') || '',
    redirectUri: `${url.protocol}//${url.host}/auth/callback`,
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
  try {
    const url = new URL(request.url);
    const baseUrl = `${url.protocol}//${url.host}`;
    console.log('Auth function called for:', url.pathname);
    const token = context.cookies.get('umich_token');

    // Only check auth for intranet pages
    if (!url.pathname.startsWith('/intranet') && url.pathname !== '/auth/callback') {
      console.log('Skipping auth for non-protected path');
      return context.next();
    }

    // Get OIDC endpoints from discovery URL
    console.log('Fetching OIDC discovery...');
    const discovery = await fetchOIDCDiscovery();
    const clientConfig = getClientConfig(request);
    console.log('Got OIDC config');

    // Development bypass
    if (Deno.env.get('NODE_ENV') === 'development') {
      console.log('Development mode - bypassing auth');
      return context.next();
    }

    if (url.pathname === '/auth/callback') {
      const code = url.searchParams.get('code');
      const state = url.searchParams.get('state') || '/intranet';
      console.log('Callback received with code:', code ? 'present' : 'missing');
      if (!code) {
        console.log('No code in callback, redirecting home');
        return Response.redirect(`${baseUrl}/`);
      }

      // Exchange code for token using discovered token endpoint
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
      console.log('Token exchange status:', tokenResponse.status);
      if (!tokenData.id_token) {
        console.error('Token exchange failed:', tokenData);
        return Response.redirect(`${baseUrl}/`);
      }

      // Verify the token before setting cookie
      try {
        console.log('Verifying new token...');
        const jwks = await getJWKS(discovery.jwks_uri);
        await jwtVerify(tokenData.id_token, jwks, {
          issuer: "https://shibboleth.umich.edu",
          audience: clientConfig.clientId
        });
        console.log('Token verified successfully');
      } catch (error) {
        console.error('Initial token verification failed:', error);
        return Response.redirect(`${baseUrl}/`);
      }

      return new Response('', {
        status: 302,
        headers: {
          'Location': state,
          'Set-Cookie': `umich_token=${tokenData.id_token}; Path=/; HttpOnly; Secure; SameSite=Lax`,
        },
      });
    }

    // No token = redirect to login
    if (!token) {
      console.log('No token, redirecting to login');
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
      console.log('Verifying existing token...');
      const jwks = await getJWKS(discovery.jwks_uri);
      console.log('Got JWKS');

      await jwtVerify(token, jwks, {
        issuer: "https://shibboleth.umich.edu",
        audience: clientConfig.clientId,
        clockTolerance: '5 minutes'
      });
      console.log('Token verified');
      return context.next();
    } catch (error) {
      console.error('Token verification failed:', error);

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
          'Set-Cookie': 'umich_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax'
        }
      });
    }
  } catch (error) {
    console.error('FATAL ERROR in auth function:', error);
    // Return a basic error response instead of crashing
    return new Response('Authentication service temporarily unavailable', {
      status: 503,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}
