import satori from 'satori';
import { html } from 'satori-html';

export default async (request, context) => {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'Michigan Robotics';
    const description = searchParams.get('description') || 'Work together. Create smart machines. Serve society.';

    const markup = html`
      <div style="height: 100%; width: 100%; display: flex; flex-direction: column; position: relative; background: #00274C;">
        <div style="position: relative; display: flex; flex-direction: column; align-items: flex-start; justify-content: flex-end; padding: 60px; height: 100%;">
          <h1 style="font-size: 60px; font-weight: bold; color: #FFCB05; margin: 0 0 20px; line-height: 1.2;">
            ${title}
          </h1>
          <p style="font-size: 32px; color: white; margin: 0; line-height: 1.4;">
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
      },
    });
  } catch (e) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
} 