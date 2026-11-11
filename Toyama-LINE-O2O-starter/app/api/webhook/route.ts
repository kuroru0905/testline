import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const events = body.events || [];

    for (const event of events) {
      const lineUserId = event.source?.userId;
      if (!lineUserId) continue;

      if (event.type === 'follow') {
        // Upsert user into database upon adding LINE Official Account
        await supabaseAdmin.from('users').upsert(
          { line_user_id: lineUserId },
          { onConflict: 'line_user_id' }
        );
      }
    }

    return NextResponse.json({ status: 'ok' });
  } catch (err: any) {
    console.error('Webhook Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
