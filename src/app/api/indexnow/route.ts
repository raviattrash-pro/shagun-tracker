import { NextResponse } from 'next/server';

const API_KEY = 'b627a887f45f83618ccb58cbe873da6c';
const HOST = 'shagun-tracker-seven.vercel.app';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const urls: string[] = body.urls || [
      `https://${HOST}/`,
      `https://${HOST}/registry`,
      `https://${HOST}/dashboard`,
      `https://${HOST}/gifts`,
      `https://${HOST}/guests`,
      `https://${HOST}/reciprocity`,
      `https://${HOST}/login`,
    ];

    const payload = {
      host: HOST,
      key: API_KEY,
      keyLocation: `https://${HOST}/${API_KEY}.txt`,
      urlList: urls,
    };

    // Broadcast instant index to Bing, Yandex, Naver, Seznam simultaneously via IndexNow
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    return NextResponse.json({
      success: response.ok,
      status: response.status,
      submittedUrls: urls.length,
      message: 'Instant index request submitted to search engines via IndexNow',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return POST(new Request('http://localhost'));
}
