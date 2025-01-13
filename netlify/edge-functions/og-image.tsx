/** @jsx h */
/** @jsxFrag Fragment */
import { h } from 'https://esm.sh/preact';
import { ImageResponse } from 'https://deno.land/x/og_edge@0.0.6/mod.ts';

export default async (req: Request) => {
  try {
    return new ImageResponse(
      <div style={{ width: 1200, height: 630, backgroundColor: '#000' }}>
        <p style={{ color: '#fff', fontSize: '48px' }}>Test Image</p>
      </div>,
      { width: 1200, height: 630 }
    );
  } catch (error) {
    console.error("Error generating image:", error);
    return new Response("Failed to generate image", { status: 500 });
  }
};

export const config = {
  path: '/preview-image',
};
