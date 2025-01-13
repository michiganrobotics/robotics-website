import { ImageResponse } from '@vercel/og';

export default async (request, context) => {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title') || 'Michigan Robotics';
    const description = searchParams.get('description') || 'Work together. Create smart machines. Serve society.';
    const bgImage = searchParams.get('bgImage') || '/social/og-default.jpg';

    // Load and encode the logo
    const logoData = await fetch(new URL('/robotics-og-logo.jpg', request.url)).then(res => res.arrayBuffer());
    const backgroundData = await fetch(new URL(bgImage, request.url)).then(res => res.arrayBuffer());

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
          }}
        >
          {/* Background Image */}
          <img
            src={backgroundData}
            alt=""
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          
          {/* Dark Overlay */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(0, 39, 76, 0.7)', // Michigan Blue with opacity
            }}
          />

          {/* Logo */}
          <img
            src={logoData}
            alt="Michigan Robotics"
            style={{
              position: 'absolute',
              top: '40px',
              left: '40px',
              width: '200px', // Adjust size as needed
              height: 'auto',
            }}
          />

          {/* Content */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'flex-end',
              padding: '60px',
              height: '100%',
            }}
          >
            <h1
              style={{
                fontSize: '60px',
                fontWeight: 'bold',
                color: '#FFCB05', // Michigan Yellow
                margin: '0 0 20px',
                lineHeight: 1.2,
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: '32px',
                color: 'white',
                margin: 0,
                lineHeight: 1.4,
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
              }}
            >
              {description}
            </p>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
} 