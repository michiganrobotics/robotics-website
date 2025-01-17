import type { Context } from "@netlify/edge-functions";
import { jwtVerify } from "jose";

// Using the well-known configuration URL like the Flask example
const OIDC_CONFIG = {
  discoveryUrl: 'https://shibboleth.umich.edu/.well-known/openid-configuration',
  clientId: process.env.UMICH_CLIENT_ID!,
  clientSecret: process.env.UMICH_CLIENT_SECRET!,
  redirectUri: (request: Request) => {
    const url = new URL(request.url);
    return `${url.protocol}//${url.host}/auth/callback`;
  },
  scope: 'openid profile email'  // Standard scopes from examples
};

async function getOIDCConfig() {
  const response = await fetch(OIDC_CONFIG.discoveryUrl);
  return response.json();
}

export default async function(request: Request, context: Context) {
  const url = new URL(request.url);
  console.log('Auth function called for:', url.pathname);
  const token = context.cookies.get('umich_token');

  // Only check auth for intranet pages
  if (!url.pathname.startsWith('/intranet') && url.pathname !== '/auth/callback') {
    console.log('Skipping auth for non-protected path');
    return context.next();
  }

  // Get OIDC endpoints from discovery URL
  const config = await getOIDCConfig();
  console.log('Got OIDC config:', config);

  // Development bypass
  if (process.env.NODE_ENV === 'development') {
    console.log('Development mode - bypassing auth');
    return context.next();
  }

  if (url.pathname === '/auth/callback') {
    const code = url.searchParams.get('code');
    if (!code) {
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
    if (!tokenData.access_token) {
      console.error('Token exchange failed:', tokenData);
      return Response.redirect('/');
    }
    
    return new Response('', {
      status: 302,
      headers: {
        'Location': '/intranet',
        'Set-Cookie': `umich_token=${tokenData.access_token}; Path=/; HttpOnly; Secure; SameSite=Lax`,
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
    await jwtVerify(token, new TextEncoder().encode(OIDC_CONFIG.clientSecret));
    return context.next();
  } catch {
    return Response.redirect('/');
  }
} 