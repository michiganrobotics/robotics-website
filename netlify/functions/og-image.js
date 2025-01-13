const fetch = require('node-fetch'); // For fetching images
const satori = require('satori'); // For rendering JSX to SVG
const { Resvg } = require('@resvg/resvg-js'); // For converting SVG to PNG

exports.handler = async (event) => {
  try {
    const { queryStringParameters } = event;
    const img = queryStringParameters.img || '/social/og-default.jpg'; // Fallback image
    const logoUrl = 'https://umrob.netlify.app/robotics-og-logo.png';
    const backgroundUrl = `https://umrob.netlify.app${img}`;

    console.log('Logo URL:', logoUrl);
    console.log('Background URL:', backgroundUrl);

    // Fetch background image
    const bgResponse = await fetch(backgroundUrl);
    if (!bgResponse.ok) throw new Error(`Failed to fetch background image: ${bgResponse.statusText}`);
    const bgBuffer = await bgResponse.arrayBuffer();

    // Fetch logo image
    const logoResponse = await fetch(logoUrl);
    if (!logoResponse.ok) throw new Error(`Failed to fetch logo: ${logoResponse.statusText}`);
    const logoBuffer = await logoResponse.arrayBuffer();

    console.log('Background Image Size:', bgBuffer.byteLength);
    console.log('Logo Image Size:', logoBuffer.byteLength);

    // Render JSX to SVG using Satori
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
        fonts: [], // Add custom fonts if needed
      }
    );

    // Convert SVG to PNG using Resvg
    const resvg = new Resvg(svg);
    const pngData = resvg.render().asPng();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'image/png',
        // Optional caching headers:
        'Cache-Control': 'public, max-age=3600, immutable',
      },
      body: pngData.toString('base64'),
      isBase64Encoded: true, // Required for binary responses in Netlify Functions
    };
  } catch (error) {
    console.error('Error generating image:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
