import fs from "fs/promises";
import satori from "satori";
import sharp from "sharp";
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export async function getStaticPaths() {
  const posts = await getCollection("news");
  return posts.map((post) => ({
    params: { slug: post.id },
    props: post,
  }));
}


export const GET: APIRoute = async function get({ params, request }) {
  try {
    const url = new URL(request.url);
    const bgImage = url.searchParams.get('bg') || 'social/og-default.jpg';
    
    console.log('Loading files from paths:', {
      bg: `./public/${bgImage}`,
      font: './public/fonts/Roboto-Bold.ttf',
      logo: './public/robotics-og-logo.png'
    });

    const [robotoData, logoData, backgroundData] = await Promise.all([
      fs.readFile("./public/fonts/Roboto-Bold.ttf").catch(e => {
        console.error('Failed to load font:', e);
        throw e;
      }),
      fs.readFile("./public/robotics-og-logo.png").catch(e => {
        console.error('Failed to load logo:', e);
        throw e;
      }),
      fs.readFile(`./public/${bgImage}`).catch(e => {
        console.error('Failed to load background:', e);
        throw e;
      })
    ]);

    // Add size checks
    console.log('File sizes:', {
      font: robotoData.length,
      logo: logoData.length,
      background: backgroundData.length
    });
    
    console.log('Generating SVG with Satori...');
    const svg = await satori(
      {
        type: 'div',
        props: {
          style: {
            width: '1200px',
            height: '630px',
            display: 'flex',
            position: 'relative',
            backgroundColor: '#ffffff',
          },
          children: [
            {
              type: 'img',
              props: {
                src: `data:image/jpeg;base64,${backgroundData.toString('base64')}`,
                style: {
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '1200px',
                  height: '630px',
                  objectFit: 'cover',
                },
              },
            },
            {
              type: 'img',
              props: {
                src: `data:image/png;base64,${logoData.toString('base64')}`,
                style: {
                  position: 'absolute',
                  top: '20px',
                  left: '20px',
                  width: '150px',
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
        fonts: [
          {
            name: "Roboto",
            data: robotoData,
            weight: "normal",
            style: "normal",
          },
        ],
      }
    );

    console.log('SVG generated, converting to PNG...');
    const png = await sharp(Buffer.from(svg))
      .png()
      .toBuffer();
    
    console.log('PNG generated, size:', png.length);

    return new Response(png, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000",
      },
    });
  } catch (error) {
    console.error('Error generating OG image:', error);
    return new Response('Error generating image', { status: 500 });
  }
};