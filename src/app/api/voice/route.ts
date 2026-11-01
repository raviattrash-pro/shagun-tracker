import { NextRequest, NextResponse } from 'next/server';
import { parseVoiceInput } from '@/lib/voice-parser';

export async function POST(req: NextRequest) {
  try {
    const { transcript, language } = await req.json();

    if (!transcript) {
      return NextResponse.json(
        { success: false, error: 'Transcript is required' },
        { status: 400 }
      );
    }

    const parsed = parseVoiceInput(transcript, language || 'hi-IN');
    return NextResponse.json({ success: true, data: parsed });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
