# Toyama-LINE-O2O (登別地域還元型送客プラットフォーム)

登別市における音楽イベント後の「山（温泉街）から海（下町）」への外貨・若者送客を実現する、LINE API & Supabase 連携型システムの実装スターターキットです。

## 技術スタック
- **Framework**: Next.js 14 (App Router / TypeScript)
- **Database**: Supabase (PostgreSQL)
- **Messaging**: LINE Messaging API / LIFF
- **Styling**: Tailwind CSS

## 環境変数 (.env.local)

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
LINE_CHANNEL_ACCESS_TOKEN=your_line_channel_access_token
LINE_CHANNEL_SECRET=your_line_channel_secret
NEXT_PUBLIC_LIFF_ID=your_liff_id
NEXT_PUBLIC_LIFF_URL=https://liff.line.me/your_liff_id
ADMIN_SECRET_KEY=your_admin_secret_key
```

## セットアップ手順

1. **データベースの作成**
   - SupabaseのSQL Editorにて `supabase/schema.sql` の内容を実行してください。

2. **LINE Developers 設定**
   - Messaging APIチャネルを作成し、Webhook URLに `https://your-domain.com/api/webhook` を登録。
   - LIFFアプリを追加し、エンドポイントURLに `https://your-domain.com/liff/coupon` を登録。

3. **イベント終了時のクーポン送信**
   - 管理者権限で `/api/send-coupons` に POST リクエストを発行し、イベント参加者へMulticast一括送信。
