import { ImageResponse } from 'next/og';

export const alt = 'vinai — AI Strategy, Products & CX Automation';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px',
          background: 'linear-gradient(160deg, #FFF8F0 0%, #FFFFFF 55%, #FDEEE4 100%)',
        }}
      >
        <div style={{ display: 'flex', fontSize: 32, fontWeight: 800, color: '#1F1F1F' }}>vinai</div>
        <div
          style={{
            display: 'flex',
            fontSize: 60,
            fontWeight: 800,
            color: '#1F1F1F',
            marginTop: 24,
            maxWidth: 900,
            lineHeight: 1.1,
          }}
        >
          AI systems built for production — not for demos.
        </div>
        <div style={{ display: 'flex', fontSize: 26, color: '#5B564C', marginTop: 24 }}>
          Vinoth Nataraj — AI Strategy, Products &amp; CX Automation
        </div>
      </div>
    ),
    { ...size }
  );
}
