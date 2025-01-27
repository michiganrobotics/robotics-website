import { jwtVerify, createRemoteJWKSet } from "jose";

// Using the well-known configuration URL like the Flask example
const OIDC_CONFIG = {
  discoveryUrl: 'https://shibboleth.umich.edu/.well-known/openid-configuration',
  clientId: process.env.UMICH_CLIENT_ID!,
  clientSecret: process.env.UMICH_CLIENT_SECRET!,
  redirectUri: (request: Request) => {
    const url = new URL(request.url);
    return `${url.protocol}//${url.host}/auth/callback`;
  },
  scope: 'openid profile email eduperson_affiliation edumember'  // Match scopes from ITS
};

let JWKS: any = null;

async function getJWKS(config: any) {
  if (!JWKS) {
    JWKS = createRemoteJWKSet(new URL(config.jwks_uri));
  }
  return JWKS;
}

async function getOIDCConfig() {
  const response = await fetch(OIDC_CONFIG.discoveryUrl);
  return response.json();
}

export async function onRequest({ request, env, context }: { request: Request; env: any; context: any }) {
  const url = new URL(request.url);
  console.log('Auth function called for:', url.pathname);
  
  // Get token from cookie
  const token = request.headers.get('cookie')?.split(';')
    .find(c => c.trim().startsWith('umich_token='))
    ?.split('=')[1];

  // Only check auth for intranet pages
  if (!url.pathname.startsWith('/intranet') && url.pathname !== '/auth/callback') {
    console.log('Skipping auth for non-protected path');
    return await context.next();
  }

  // Get OIDC endpoints from discovery URL
  const config = await getOIDCConfig();
  console.log('Got OIDC config:', config);

  // Development bypass
  if (env.NODE_ENV === 'development') {
    console.log('Development mode - bypassing auth');
    return await context.next();
  }

  if (url.pathname === '/auth/callback') {
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state') || '/intranet';
    console.log('Callback received with code:', code);
    if (!code) {
      console.log('No code in callback, redirecting home');
      return Response.redirect('/');
    }

    // Exchange code for token using discovered token endpoint
    const tokenResponse = await fetch(config.token_endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: OIDC_CONFIG.clientId,
        client_secret: OIDC_CONFIG.clientSecret,
        redirect_uri: OIDC_CONFIG.redirectUri(request),
      }),
    });

    const tokenData = await tokenResponse.json();
    console.log('Token exchange response:', tokenData);
    if (!tokenData.id_token) {
      console.error('Token exchange failed:', tokenData);
      return Response.redirect('/');
    }

    // Verify the token before setting cookie
    try {
      const JWKS = await getJWKS(config);
      await jwtVerify(tokenData.id_token, JWKS, {
        issuer: "https://shibboleth.umich.edu",
        audience: OIDC_CONFIG.clientId
      });
    } catch (error) {
      console.error('Initial token verification failed:', error);
      return Response.redirect('/');
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
    const authUrl = new URL(config.authorization_endpoint);
    authUrl.searchParams.set('client_id', OIDC_CONFIG.clientId);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', OIDC_CONFIG.scope);
    authUrl.searchParams.set('redirect_uri', OIDC_CONFIG.redirectUri(request));
    authUrl.searchParams.set('state', url.pathname);

    return Response.redirect(authUrl.toString());
  }

  // Verify existing token
  try {
    const JWKS = await getJWKS(config);
    console.log('Got JWKS, verifying token...');
    
    await jwtVerify(token, JWKS, {
      issuer: "https://shibboleth.umich.edu",
      audience: OIDC_CONFIG.clientId,
      clockTolerance: '5 minutes'
    });
    console.log('Token verified');
    return await context.next();
  } catch (error) {
    console.error('Token verification failed:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }

    // If token is expired or invalid, clear it and redirect to login
    const authUrl = new URL(config.authorization_endpoint);
    authUrl.searchParams.set('client_id', OIDC_CONFIG.clientId);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', OIDC_CONFIG.scope);
    authUrl.searchParams.set('redirect_uri', OIDC_CONFIG.redirectUri(request));
    authUrl.searchParams.set('state', url.pathname);

    // Create a new Response with the cookie clearing header
    return new Response(null, {
      status: 302,
      headers: {
        'Location': authUrl.toString(),
        'Set-Cookie': 'umich_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax'
      }
    });
  }
} 