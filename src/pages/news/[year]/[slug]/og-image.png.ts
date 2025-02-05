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
    // Check cache first in production
    if (import.meta.env.PROD) {
      const fileName = `${params.year}-${params.slug}.png`;
      const cachePath = `.netlify/cache/og-images/${fileName}`;
      
      try {
        const cachedImage = await fs.readFile(cachePath);
        console.log('Serving cached OG image for:', fileName);
        return new Response(cachedImage, {
          headers: {
            "Content-Type": "image/png",
            "Cache-Control": "public, max-age=31536000",
          },
        });
      } catch {
        console.log('No cached version found, generating new OG image');
      }
    }

    let bgImage = 'social/og-default.jpg';
  
    try {
      if (props.data?.image) {
        // Handle Astro Image object
        if (typeof props.data.image === 'object' && props.data.image !== null) {
          const imageObj = props.data.image as { src?: { src: string } };
          if (imageObj.src?.src) {
            // Check if it's the default OG image
            if (imageObj.src.src.includes('og-default')) {
              bgImage = 'social/og-default.jpg';
            }
            // Handle asset paths that start with /assets/
            else if (imageObj.src.src.startsWith('/assets/')) {
              bgImage = imageObj.src.src.slice(1); // Remove leading slash
            } 
            // Handle content images that start with images/
            else if (imageObj.src.src.startsWith('images/')) {
              bgImage = `news/${params.year}/${imageObj.src.src}`;
            } else {
              bgImage = imageObj.src.src.replace(/^\//, '').replace(/^(public|src)\//, '');
            }
          }
        }
      }

      console.log('Final image path:', bgImage);
      
      const isDefaultImage = bgImage === 'social/og-default.jpg' || bgImage.includes('og-default');
      const isAssetImage = !isDefaultImage && bgImage.startsWith('assets/');
      
      // Load and process the background image
      let backgroundData;
      try {
        if (isDefaultImage) {
          backgroundData = await fs.readFile(`./public/social/og-default.jpg`);
        } else if (isAssetImage) {
          try {
            backgroundData = await fs.readFile(`./src/${bgImage}`);
          } catch (error) {
            try {
              backgroundData = await fs.readFile(`./dist/${bgImage}`);
            } catch (error2) {
              try {
                backgroundData = await fs.readFile(`./public/${bgImage}`);
              } catch (error3) {
                console.error('Failed to find image in any location:', bgImage);
                backgroundData = await fs.readFile(`./public/social/og-default.jpg`);
              }
            }
          }
        } else {
          backgroundData = await fs.readFile(`./src/content/${bgImage}`);
        }
        
        // Convert PNG to JPEG if necessary
        if (bgImage.toLowerCase().endsWith('.png')) {
          backgroundData = await sharp(backgroundData)
            .jpeg()
            .toBuffer();
        }
        
        console.log('Successfully loaded image data');
      } catch (error) {
        console.error('Error loading background image:', error);
        backgroundData = await fs.readFile(`./public/social/og-default.jpg`);
      }

      // Load font and logo
      const [robotoData, logoData] = await Promise.all([
        fs.readFile("./public/fonts/Roboto-Bold.ttf"),
        isDefaultImage ? null : fs.readFile("./public/robotics-og-logo.png")
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

      // Add static file generation during build
      if (import.meta.env.PROD) {
        const outputDir = 'dist/_generated-og';
        const cacheDir = '.netlify/cache/og-images';
        
        await fs.mkdir(outputDir, { recursive: true });
        await fs.mkdir(cacheDir, { recursive: true });
        
        const fileName = `${params.year}-${params.slug}.png`;
        const outputPath = `${outputDir}/${fileName}`;
        const cachePath = `${cacheDir}/${fileName}`;

        // Check if cached version exists
        try {
          const cachedImage = await fs.readFile(cachePath);
          await fs.writeFile(outputPath, cachedImage);
          console.log('Using cached OG image for:', fileName);
        } catch {
          // Generate new image if not in cache
          await fs.writeFile(outputPath, png);
          await fs.writeFile(cachePath, png);
          console.log('Generated new OG image for:', fileName);
        }
      }

      return new Response(png, {
        headers: {
          "Content-Type": "image/png",
          "Cache-Control": "public, max-age=31536000",
        },
      });
    } catch (error) {
      console.error('Error generating OG image:', error);
      console.error('Debug info:', {
        imagePath: bgImage,
        contentData: props.data,
        imageData: props.data?.image,
        params,
        defaultImage: bgImage === 'social/og-default.jpg' || bgImage.includes('og-default'),
        isAssetImage: bgImage.startsWith('assets/')
      });
      return new Response('Error generating image', { status: 500 });
    }
  } catch (error) {
    console.error('Error generating OG image:', error);
    console.error('Debug info:', {
      imagePath: bgImage,
      contentData: props.data,
      imageData: props.data?.image,
      params,
      defaultImage: bgImage === 'social/og-default.jpg' || bgImage.includes('og-default'),
      isAssetImage: bgImage.startsWith('assets/')
    });
    return new Response('Error generating image', { status: 500 });
  }
};