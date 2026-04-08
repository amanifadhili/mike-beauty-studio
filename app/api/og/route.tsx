import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Read the dynamic query parameters
    const title = searchParams.has('title')
      ? searchParams.get('title')
      : 'Mike Beauty Studio | Premium Lash Extensions';
      
    const description = searchParams.has('description')
      ? searchParams.get('description')?.slice(0, 100) + '...'
      : 'Award-winning luxury beauty studio offering premium eyelash extensions in Kigali, Rwanda.';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            backgroundColor: '#1E1E1E', // Charcoal
            padding: '80px',
            border: '24px solid #DFB574', // Gold frame
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
            }}
          >
            {/* Super header */}
            <div
              style={{
                color: '#DFB574', // Gold
                fontSize: 32,
                letterSpacing: '5px',
                textTransform: 'uppercase',
                marginBottom: 30,
              }}
            >
              Mike Beauty Studio Kigali
            </div>

            {/* Dynamic Title */}
            <div
              style={{
                color: '#FFFFFF',
                fontSize: 84,
                lineHeight: 1.1,
                fontWeight: 600,
                marginBottom: 30,
                whiteSpace: 'pre-wrap',
                maxWidth: '90%',
              }}
            >
              {title}
            </div>

            {/* Dynamic Description */}
            <div
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: 38,
                lineHeight: 1.4,
                maxWidth: '85%',
              }}
            >
              {description}
            </div>
          </div>
          
          <div
             style={{
               position: 'absolute',
               bottom: 80,
               left: 80,
               color: '#DFB574',
               fontSize: 28,
               letterSpacing: '3px',
             }}
          >
             mikebeautystudio.com
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.error(e);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
