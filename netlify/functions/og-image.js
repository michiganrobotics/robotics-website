import fetch from 'node-fetch';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

export async function handler(event) {
  try {
    const { queryStringParameters } = event;
    const img = queryStringParameters.img || '/social/og-default.jpg';
    const logoUrl = 'https://umrob.netlify.app/robotics-og-logo.png';
    const backgroundUrl = `https://umrob.netlify.app${img}`;

    console.log('Logo URL:', logoUrl);
    console.log('Background URL:', backgroundUrl);

    // Fetch images
    const bgResponse = await fetch(backgroundUrl);
    if (!bgResponse.ok) throw new Error(`Failed to fetch background image: ${bgResponse.statusText}`);
    const bgBuffer = await bgResponse.arrayBuffer();

    const logoResponse = await fetch(logoUrl);
    if (!logoResponse.ok) throw new Error(`Failed to fetch logo: ${logoResponse.statusText}`);
    const logoBuffer = await logoResponse.arrayBuffer();

    console.log('Background Image Size:', bgBuffer.byteLength);
    console.log('Logo Image Size:', logoBuffer.byteLength);

    // Render SVG using Satori
    const svg = await satori(
      {
        type: 'div',
        props: {
          style: {
            width: '1200px',
            height: '630px',
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#000',
          },
          children: [
            {
              type: 'img',
              props: {
                src: backgroundUrl,
                style: {
                  objectFit: 'cover',
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                },
              },
            },
            {
              type: 'img',
              props: {
                src: logoUrl,
                style: {
                  position: 'absolute',
                  top: '30px',
                  left: '30px',
                  width: '180px',
                  height: 'auto',
                },
              },
            },
          ],
        },
      },
      {
        width: 1200,
        height: 630,
        fonts: [],
      }
    );

    // Convert SVG to PNG using Resvg
    const resvg = new Resvg(svg);
    const pngData = resvg.render().asPng();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=3600, immutable',
      },
      body: pngData.toString('base64'),
      isBase64Encoded: true,
    };
  } catch (error) {
    console.error('Error generating image:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
