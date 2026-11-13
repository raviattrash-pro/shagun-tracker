import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Shagun Tracker — Digital Wedding Gift Registry & Cash Bahi-Khata';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #FFFDF9 0%, #FDF4E7 40%, #F5A962 100%)',
          fontFamily: 'sans-serif',
          padding: '60px',
          position: 'relative',
        }}
      >
        {/* Subtle Decorative Aura */}
        <div
          style={{
            position: 'absolute',
            top: 20,
            right: 40,
            fontSize: '90px',
            opacity: 0.15,
          }}
        >
          ॐ
        </div>

        {/* Central Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(255, 255, 255, 0.9)',
            padding: '12px 28px',
            borderRadius: '9999px',
            border: '2px solid rgba(192, 57, 43, 0.3)',
            boxShadow: '0 8px 24px rgba(192, 57, 43, 0.12)',
            marginBottom: '24px',
          }}
        >
          <span style={{ fontSize: '28px' }}>💍</span>
          <span
            style={{
              fontSize: '22px',
              fontWeight: 800,
              color: '#C0392B',
              letterSpacing: '1px',
            }}
          >
            SHAGUN TRACKER • विवाह बही-खाता
          </span>
        </div>

        {/* Main Title */}
        <div
          style={{
            fontSize: '56px',
            fontWeight: 900,
            color: '#1E293B',
            textAlign: 'center',
            lineHeight: 1.15,
            maxWidth: '1000px',
            letterSpacing: '-1px',
          }}
        >
          #1 Digital Wedding Gift Registry & Cash Ledger
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: '24px',
            color: '#64748B',
            textAlign: 'center',
            maxWidth: '850px',
            marginTop: '18px',
            lineHeight: 1.4,
          }}
        >
          Curate gift wishlists to eliminate duplicates • Track sacred shagun with +₹1 rules • Manage guest lifafas offline
        </div>

        {/* Feature Pills */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            marginTop: '36px',
          }}
        >
          <div
            style={{
              background: '#C0392B',
              color: '#FFFFFF',
              padding: '10px 22px',
              borderRadius: '9999px',
              fontSize: '18px',
              fontWeight: 700,
            }}
          >
            🎁 Live Gift Registry
          </div>
          <div
            style={{
              background: '#FFFFFF',
              color: '#0F172A',
              padding: '10px 22px',
              borderRadius: '9999px',
              fontSize: '18px',
              fontWeight: 700,
              border: '1px solid rgba(0,0,0,0.1)',
            }}
          >
            🪙 Auspicious +₹1 Rule
          </div>
          <div
            style={{
              background: '#FFFFFF',
              color: '#0F172A',
              padding: '10px 22px',
              borderRadius: '9999px',
              fontSize: '18px',
              fontWeight: 700,
              border: '1px solid rgba(0,0,0,0.1)',
            }}
          >
            ✨ Anti-Spam Verified
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
