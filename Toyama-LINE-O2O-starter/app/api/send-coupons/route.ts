import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { sendEventCouponsMulticast } from '@/lib/line';

export async function POST(req: NextRequest) {
  try {
    const { eventId, secretKey } = await req.json();

    // Basic admin auth check
    if (secretKey !== process.env.ADMIN_SECRET_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch attended users for this event
    const { data: attendances, error } = await supabaseAdmin
      .from('event_attendances')
      .select('users(line_user_id)')
      .eq('event_id', eventId);

    if (error) throw error;

    const lineUserIds = attendances
      ?.map((a: any) => a.users?.line_user_id)
      .filter(Boolean) || [];

    const liffUrl = process.env.NEXT_PUBLIC_LIFF_URL!;
    await sendEventCouponsMulticast(lineUserIds, liffUrl);

    return NextResponse.json({
      success: true,
      sentCount: lineUserIds.length,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
