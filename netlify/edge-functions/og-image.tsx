import React from "https://esm.sh/react@18.2.0";
import { ImageResponse } from 'https://deno.land/x/og_edge@0.0.6/mod.ts';
import type { Context } from '@netlify/edge-functions';

export default async (req: Request, ctx: Context) => {
  const url = new URL(req.url);
  const img = url.searchParams.get('img') 
             || '/social/og-default.jpg'; // fallback
  const isCustomImage = img !== '/social/og-default.jpg';

  const logoUrl = new URL('/robotics-og-logo.png', req.url).toString();
  const backgroundUrl = new URL(img, req.url).toString();

  return new ImageResponse(
    <div style={{ width: 1200, height: 630, position: 'relative' }}>
      <img
        src={backgroundUrl}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />
      {isCustomImage && (
        <img 
          src={logoUrl}
          style={{
            position: 'absolute', top: 30, left: 30, width: 180
          }}
        />
      )}
    </div>,
    {
      width: 1200,
      height: 630,
    }
  );
};

export const config = {
  path: '/preview-image'
};
