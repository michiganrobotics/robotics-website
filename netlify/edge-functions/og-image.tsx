import { ImageResponse } from 'https://deno.land/x/og_edge@0.0.6/mod.ts';
import React from 'https://esm.sh/react';
export default async (req: Request) => {
  const url = new URL(req.url);
  const img = url.searchParams.get('img') || '/social/og-default.jpg'; // fallback
  const logoUrl = 'https://umrob.netlify.app/robotics-og-logo.png';
  const backgroundUrl = `https://umrob.netlify.app${img}`;

  console.log('Logo URL:', logoUrl);
  console.log('Background URL:', backgroundUrl);

  try {
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
  excludedPath: ['/robotics-og-logo.png', '/assets/*'], // Exclude static assets
};
