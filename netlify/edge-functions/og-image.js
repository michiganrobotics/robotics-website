import satori from 'satori';
import { html } from 'satori-html';

export default async (request, context) => {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'Michigan Robotics';
    const description = searchParams.get('description') || 'Work together. Create smart machines. Serve society.';
    const bgImage = searchParams.get('bgImage') || '/social/og-default.jpg';

    // Load and encode all assets
    const [logoData, backgroundData] = await Promise.all([
      fetch(new URL('/robotics-og-logo.jpg', request.url)).then(res => res.arrayBuffer()),
      fetch(new URL(bgImage, request.url)).then(res => res.arrayBuffer()),
    ]);

    const markup = html`
      <div style="height: 100%; width: 100%; display: flex; flex-direction: column; position: relative;">
        <img
          src="data:image/jpeg;base64,${Buffer.from(backgroundData).toString('base64')}"
          alt=""
          style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover;"
        />
        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 39, 76, 0.7);">
        </div>
        <img
          src="data:image/jpeg;base64,${Buffer.from(logoData).toString('base64')}"
          alt="Michigan Robotics"
          style="position: absolute; top: 40px; left: 40px; width: 200px; height: auto;"
        />
        <div style="position: relative; display: flex; flex-direction: column; align-items: flex-start; justify-content: flex-end; padding: 60px; height: 100%;">
          <h1 style="font-size: 60px; font-weight: bold; color: #FFCB05; margin: 0 0 20px; line-height: 1.2; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">
            ${title}
          </h1>
          <p style="font-size: 32px; color: white; margin: 0; line-height: 1.4; text-shadow: 1px 1px 2px rgba(0,0,0,0.5);">
            ${description}
          </p>
        </div>
      </div>
    `;

    const svg = await satori(markup, {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'sans-serif',
          weight: 400,
          style: 'normal',
        },
      ],
    });

    return new Response(svg, {
      headers: {
        'content-type': 'image/svg+xml',
        'cache-control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (e) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
} 