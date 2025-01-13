/** @jsx h */
/** @jsxFrag Fragment */
import { h } from 'https://esm.sh/preact';
import { ImageResponse } from 'https://deno.land/x/og_edge@0.0.6/mod.ts';

export default async (req: Request) => {
  const url = new URL(req.url);
  const img = url.searchParams.get('img') || '/social/og-default.jpg'; // fallback
  const logoUrl = 'https://umrob.netlify.app/robotics-og-logo.png';
  const backgroundUrl = `https://umrob.netlify.app${img}`;

  console.log('Logo URL:', logoUrl);
  console.log('Background URL:', backgroundUrl);

  try {
    // Fetch background image
    const bgResponse = await fetch(backgroundUrl);
    console.log('Background Image Status:', bgResponse.status);
    console.log('Background Image Content-Type:', bgResponse.headers.get('Content-Type'));
    if (!bgResponse.ok) throw new Error(`Failed to fetch background image: ${bgResponse.statusText}`);

    // Fetch logo image
    const logoResponse = await fetch(logoUrl);
    console.log('Logo Image Status:', logoResponse.status);
    console.log('Logo Image Content-Type:', logoResponse.headers.get('Content-Type'));
    if (!logoResponse.ok) throw new Error(`Failed to fetch logo: ${logoResponse.statusText}`);

    return new ImageResponse(
      <div style={{ width: 1200, height: 630, position: 'relative' }}>
        <img
          src={backgroundUrl}
          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
        />
        <img
          src={logoUrl}
          style={{
            position: 'absolute',
            top: 30,
            left: 30,
            width: 180,
            height: 'auto',
          }}
        />
      </div>,
      { width: 1200, height: 630 }
    );
  } catch (error) {
    console.error('Error generating image:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
};

export const config = {
  path: '/preview-image',
};
