import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import fs from "fs/promises";
import satori from "satori";
import sharp from "sharp";
import sizeOf from "image-size";

export async function getStaticPaths() {
  const posts = await getCollection("news");
  return posts.map((post) => {
    const year = post.data.date.split('-')[0];
    const slug = post.id.split('/')[1];
    
    return {
      params: { year, slug },
      props: post,
    };
  });
}

export const GET: APIRoute = async function get({ params, props }) {
  try {
    // Add far-future cache headers
    const cacheHeaders = {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
      "CDN-Cache-Control": "public, max-age=31536000, immutable",
      "Surrogate-Control": "public, max-age=31536000, immutable"
    };

    // Check if image exists in _generated-og directory
    const ogImagePath = `./public/_generated-og/${params.year}-${params.slug}.png`;
    try {
      const existingImage = await fs.readFile(ogImagePath);
      return new Response(existingImage, { headers: cacheHeaders });
    } catch (e) {
      // Image doesn't exist yet, generate it
    }

    const bgImage = typeof props.data?.image === 'object' 
      ? props.data.image.src 
      : props.data?.image || 'social/og-default.jpg';

    const isDefaultImage = bgImage === 'social/og-default.jpg';
    const cleanBgPath = bgImage.replace('../content/', '');

    // Only load logo if not using default image
    const [robotoData, logoData, backgroundData] = await Promise.all([
      fs.readFile("./public/fonts/Roboto-Bold.ttf"),
      isDefaultImage ? null : fs.readFile("./public/robotics-og-logo.png"),
      fs.readFile(isDefaultImage ? `./public/${bgImage}` : `./src/content/${cleanBgPath}`)
    ]);

    const bgDimensions = sizeOf(backgroundData);
    
    if (!bgDimensions.width || !bgDimensions.height) {
      throw new Error('Invalid image dimensions');
    }

    const targetWidth = 1200;
    const targetHeight = 630;
    const scale = Math.max(
      targetWidth / bgDimensions.width,
      targetHeight / bgDimensions.height
    );
    
    const scaledWidth = bgDimensions.width * scale;
    const scaledHeight = bgDimensions.height * scale;
    const x = (targetWidth - scaledWidth) / 2;
    const y = (targetHeight - scaledHeight) / 2;

    const logoAspectRatio = 300 / 64;
    const logoHeight = 64;
    const logoWidth = logoHeight * logoAspectRatio;

    // Prepare children array based on whether we're using default image
    const children = [
      {
        type: 'img',
        props: {
          src: `data:image/jpeg;base64,${backgroundData.toString('base64')}`,
          style: {
            position: 'absolute',
            top: `${y}px`,
            left: `${x}px`,
            width: `${scaledWidth}px`,
            height: `${scaledHeight}px`,
          },
        },
      }
    ];

    // Only add gradient and logo for non-default images
    if (!isDefaultImage) {
      children.push(
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '120px',
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 100%)',
              zIndex: 1,
            },
          },
        },
        {
          type: 'div',
          props: {
            style: {
              position: 'absolute',
              top: '60px',
              left: '0px',
              width: `${logoWidth}px`,
              height: `${logoHeight}px`,
              backgroundImage: `url(data:image/png;base64,${logoData.toString('base64')})`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              zIndex: 2,
              filter: 'drop-shadow(0px 3px 6px rgba(0, 0, 0, 0.5))',
            },
          },
        }
      );
    }

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
            overflow: 'hidden',
          },
          children
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

    const png = await sharp(Buffer.from(svg))
      .png()
      .toBuffer();

    // Save the generated image for future use
    await fs.mkdir('./public/_generated-og', { recursive: true });
    await fs.writeFile(ogImagePath, png);

    return new Response(png, { headers: cacheHeaders });
  } catch (error) {
    return new Response('Error generating image', { status: 500 });
  }
};