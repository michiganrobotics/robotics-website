/** @jsx h */
/** @jsxFrag Fragment */
import { h } from 'https://esm.sh/preact';
import { ImageResponse } from 'https://deno.land/x/og_edge@0.0.6/mod.ts';

export default async (req: Request) => {
  console.log("Edge function is running");

  try {
    return new Response("Hello, world!", { status: 200 });
  } catch (error) {
    console.error("Error in Edge Function:", error);
    return new Response("Failed to process request", { status: 500 });
  }
};

export const config = {
  path: '/preview-image',
};
