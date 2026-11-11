import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { couponId, lineUserId, pinCode } = await req.json();

    // 1. Get User ID
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('user_id')
      .eq('line_user_id', lineUserId)
      .single();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 2. Fetch Coupon & Store PIN
    const { data: coupon } = await supabaseAdmin
      .from('coupons')
      .select('store_id, stores(pin_code)')
      .eq('coupon_id', couponId)
      .single();

    if (!coupon) {
      return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });
    }

    const storePin = (coupon.stores as any)?.pin_code;
    if (pinCode !== storePin) {
      return NextResponse.json({ error: '店舗確認PINコードが違います' }, { status: 400 });
    }

    // 3. Record Redemption
    const { error: insertErr } = await supabaseAdmin
      .from('coupon_redemptions')
      .insert({
        coupon_id: couponId,
        user_id: user.user_id,
        store_id: coupon.store_id,
      });

    if (insertErr) {
      if (insertErr.code === '23505') { // Unique constraint violation
        return NextResponse.json({ error: '既に使用済みのクーポンです' }, { status: 400 });
      }
      throw insertErr;
    }

    return NextResponse.json({ success: true, message: '消込完了！' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
