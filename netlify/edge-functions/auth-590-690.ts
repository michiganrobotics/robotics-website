import type { Context } from "@netlify/edge-functions";
import { jwtVerify, createRemoteJWKSet } from "jose";

const OIDC_CONFIG = {
  discoveryUrl: 'https://shibboleth.umich.edu/.well-known/openid-configuration',
  clientId: process.env.UMICH_590_690_CLIENT_ID!,
  clientSecret: process.env.UMICH_590_690_CLIENT_SECRET!,
  redirectUri: (request: Request) => {
    const url = new URL(request.url);
    return `${url.protocol}//${url.host}/auth/590-690/callback`;
  },
  scope: 'openid profile email eduperson_affiliation edumember'
};

// Required groups for 590-690 access
const REQUIRED_GROUPS = [
  'Robotics Faculty',
  'robotics-masters',
  'robotics-phd',
  'robotics-staff'
];

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

async function getUserInfo(accessToken: string, config: any) {
  const response = await fetch(config.userinfo_endpoint, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to get user info');
  }
  
  return response.json();
}

function checkGroupMembership(userGroups: string[] | undefined): boolean {
  if (!Array.isArray(userGroups)) {
    return false;
  }
  
  return REQUIRED_GROUPS.some(requiredGroup => userGroups.includes(requiredGroup));
}

export default async function(request: Request, context: Context) {
  const url = new URL(request.url);
  console.log('590-690 Auth function called for:', url.pathname);
  const token = context.cookies.get('umich_590_690_token');

  // Only check auth for 590-690 pages and callback
  if (!url.pathname.startsWith('/academics/courses/course-offerings/current-590-690') && 
      url.pathname !== '/auth/590-690/callback') {
    console.log('Skipping auth for non-590-690 path');
    return context.next();
  }

  // Get OIDC endpoints from discovery URL
  const config = await getOIDCConfig();
  console.log('Got OIDC config for 590-690');

  // Development bypass
  if (process.env.NODE_ENV === 'development') {
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
    console.log('590-690 Token exchange response status:', tokenResponse.status);
    
    if (!tokenData.access_token || !tokenData.id_token) {
      console.error('Token exchange failed for 590-690:', tokenData);
      return new Response(`
        <!DOCTYPE html>
        <html>
        <head><title>Authentication Failed</title></head>
        <body>
          <h1>Authentication Failed</h1>
          <p>Unable to authenticate with University of Michigan.</p>
          <a href="/">Return to Home</a>
        </body>
        </html>
      `, {
        headers: { 'Content-Type': 'text/html' },
        status: 403
      });
    }

    // Get user info to check group membership
    let userInfo;
    try {
      userInfo = await getUserInfo(tokenData.access_token, config);
      console.log('Got user info for 590-690, checking groups...');
      console.log('User groups (edumember_is_member_of):', userInfo.edumember_is_member_of);
    } catch (error) {
      console.error('Failed to get user info for 590-690:', error);
      return new Response(`
        <!DOCTYPE html>
        <html>
        <head><title>Authentication Failed</title></head>
        <body>
          <h1>Authentication Failed</h1>
          <p>Unable to retrieve user information.</p>
          <a href="/">Return to Home</a>
        </body>
        </html>
      `, {
        headers: { 'Content-Type': 'text/html' },
        status: 403
      });
    }

    // Check group membership
    const userGroups = userInfo.edumember_is_member_of || userInfo.groups || [];
    const hasAccess = checkGroupMembership(userGroups);
    
    if (!hasAccess) {
      console.log('User does not have required group membership for 590-690');
      console.log('User groups:', userGroups);
      console.log('Required groups:', REQUIRED_GROUPS);
      
      return new Response(`
        <!DOCTYPE html>
        <html>
        <head><title>Access Denied</title></head>
        <body>
          <h1>Access Denied</h1>
          <p>You must be a member of one of the following groups to access ROB 590/690 projects:</p>
          <ul>
            ${REQUIRED_GROUPS.map(group => `<li>${group}</li>`).join('')}
          </ul>
          <p>If you believe you should have access, please contact the Robotics department.</p>
          <a href="/">Return to Home</a>
        </body>
        </html>
      `, {
        headers: { 'Content-Type': 'text/html' },
        status: 403
      });
    }

    // Verify the token before setting cookie
    try {
      const JWKS = await getJWKS(config);
      await jwtVerify(tokenData.id_token, JWKS, {
        issuer: "https://shibboleth.umich.edu",
        audience: OIDC_CONFIG.clientId
      });
      console.log('Token verified for 590-690, user has access');
    } catch (error) {
      console.error('Token verification failed for 590-690:', error);
      return new Response(`
        <!DOCTYPE html>
        <html>
        <head><title>Authentication Failed</title></head>
        <body>
          <h1>Authentication Failed</h1>
          <p>Token verification failed.</p>
          <a href="/">Return to Home</a>
        </body>
        </html>
      `, {
        headers: { 'Content-Type': 'text/html' },
        status: 403
      });
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
    console.log('Verifying existing 590-690 token...');
    
    const verified = await jwtVerify(token, JWKS, {
      issuer: "https://shibboleth.umich.edu",
      audience: OIDC_CONFIG.clientId,
      clockTolerance: '5 minutes'
    });
    console.log('590-690 token verified successfully');
    return context.next();
  } catch (error) {
    console.error('590-690 token verification failed:', error);

    // If token is expired or invalid, clear it and redirect to login
    const authUrl = new URL(config.authorization_endpoint);
    authUrl.searchParams.set('client_id', OIDC_CONFIG.clientId);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', OIDC_CONFIG.scope);
    authUrl.searchParams.set('redirect_uri', OIDC_CONFIG.redirectUri(request));
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