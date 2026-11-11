-- Supabase PostgreSQL Schema for Toyama-LINE-O2O

-- 1. Users Table (LINE Attributes)
CREATE TABLE IF NOT EXISTS users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    line_user_id VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(255),
    age_group VARCHAR(50),
    region_type VARCHAR(50) DEFAULT 'local', -- 'local', 'domestic_tourist', 'inbound'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Event Attendances Table (Check-in Log)
CREATE TABLE IF NOT EXISTS event_attendances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    event_id VARCHAR(100) NOT NULL,
    checked_in_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_user_event UNIQUE (user_id, event_id)
);

-- 3. Stores Table (Local Merchants)
CREATE TABLE IF NOT EXISTS stores (
    store_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_name VARCHAR(255) NOT NULL,
    area_name VARCHAR(100) NOT NULL, -- 'horobetsu', 'noboribetsu_station'
    pin_code VARCHAR(10) NOT NULL, -- 店舗スタッフ用消込PINコード
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Coupons Master
CREATE TABLE IF NOT EXISTS coupons (
    coupon_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID REFERENCES stores(store_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    discount_detail TEXT NOT NULL,
    valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Coupon Redemptions Log (Prevent Double Use)
CREATE TABLE IF NOT EXISTS coupon_redemptions (
    redemption_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coupon_id UUID REFERENCES coupons(coupon_id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    store_id UUID REFERENCES stores(store_id) ON DELETE CASCADE,
    redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_user_coupon UNIQUE (coupon_id, user_id)
);

-- Indexes for Speed
CREATE INDEX IF NOT EXISTS idx_users_line_id ON users(line_user_id);
CREATE INDEX IF NOT EXISTS idx_attendances_event_user ON event_attendances(event_id, user_id);
