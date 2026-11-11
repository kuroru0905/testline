'use client';

import { useEffect, useState } from 'react';
import liff from '@line/liff';

interface Coupon {
  coupon_id: string;
  title: string;
  discount_detail: string;
  store_name: string;
  is_used?: boolean;
}

export default function LiffCouponPage() {
  const [lineUserId, setLineUserId] = useState<string>('');
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [pinInput, setPinInput] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initLiff = async () => {
      try {
        await liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID! });
        if (liff.isLoggedIn()) {
          const profile = await liff.getProfile();
          setLineUserId(profile.userId);
          // Fetch Coupons logic would go here
        } else {
          liff.login();
        }
      } catch (err) {
        console.error('LIFF Init Error:', err);
      } finally {
        setLoading(false);
      }
    };
    initLiff();
  }, []);

  const handleRedeem = async () => {
    if (!selectedCoupon || !pinInput) return;
    setMessage('');
    try {
      const res = await fetch('/api/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          couponId: selectedCoupon.coupon_id,
          lineUserId,
          pinCode: pinInput,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setMessage('🎉 クーポンのご利用が完了しました！');
      setCoupons(prev =>
        prev.map(c => c.coupon_id === selectedCoupon.coupon_id ? { ...c, is_used: true } : c)
      );
      setSelectedCoupon(null);
      setPinInput('');
    } catch (err: any) {
      setMessage(`❌ エラー: ${err.message}`);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-600">読み込み中...</div>;
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4 font-sans text-gray-800">
      <header className="mb-6 rounded-xl bg-gradient-to-r from-emerald-600 to-green-500 p-6 text-white shadow-lg">
        <h1 className="text-2xl font-bold">登別下町 ナイトクーポン</h1>
        <p className="mt-1 text-xs opacity-90">幌別・登別駅前エリア 協賛店舗一覧</p>
      </header>

      {message && (
        <div className="mb-4 rounded-lg bg-emerald-100 p-3 text-sm font-semibold text-emerald-800">
          {message}
        </div>
      )}

      {/* Coupon Modal for PIN Entry */}
      {selectedCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900">{selectedCoupon.title}</h3>
            <p className="mt-1 text-sm text-gray-600">{selectedCoupon.discount_detail}</p>
            <div className="mt-4 rounded-lg bg-amber-50 p-3 text-xs text-amber-800 border border-amber-200">
              ⚠️ 店員さんに画面を提示し、店舗PINコードを入力してもらってください。
            </div>
            <input
              type="password"
              placeholder="店舗PINコード入力"
              value={pinInput}
              onChange={e => setPinInput(e.target.value)}
              className="mt-4 w-full rounded-xl border border-gray-300 p-3 text-center text-lg tracking-widest outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setSelectedCoupon(null)}
                className="flex-1 rounded-xl bg-gray-200 py-3 text-sm font-bold text-gray-700"
              >
                キャンセル
              </button>
              <button
                onClick={handleRedeem}
                className="flex-1 rounded-xl bg-emerald-600 py-3 text-sm font-bold text-white hover:bg-emerald-700"
              >
                消込実行
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
