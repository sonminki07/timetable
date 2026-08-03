-- ============================================================
-- 🎓 시간표 웹 서비스 Supabase 마스터 DB 스키마 (v1.0.0)
-- 1인 1계정 인증 (Google / Kakao OAuth), 결제, 시간표 저장, 쿠폰
-- ============================================================

-- 1. 사용자 프로필 (auth.users 1인 1계정 연동)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    display_name TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'free' CHECK (role IN ('free', 'pro')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. 구독 정보 (학기별 6개월 단건 결제)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    plan TEXT NOT NULL DEFAULT 'pro',
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
    payment_id UUID,
    starts_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. 결제 이력 (PortOne V2 API)
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    portone_payment_id TEXT UNIQUE,
    amount INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' 
        CHECK (status IN ('pending', 'paid', 'failed', 'cancelled', 'refunded')),
    method TEXT,
    metadata JSONB DEFAULT '{}',
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. 시간표 클라우드 저장
CREATE TABLE IF NOT EXISTS public.timetables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT '새 시간표',
    semester TEXT,
    groups_data JSONB NOT NULL DEFAULT '[]',
    settings_data JSONB NOT NULL DEFAULT '{}',
    schedules_data JSONB DEFAULT '[]',
    is_archived BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. 쿠폰 마스터 (선착순 제한 수량 지원)
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    benefit_type TEXT NOT NULL CHECK (benefit_type IN ('period', 'credit', 'hybrid', 'ad_free')),
    duration_days INTEGER DEFAULT 0,
    credits_grant JSONB DEFAULT '{"ai_v2": 0, "pdf_export": 0}'::jsonb,
    max_redemptions INTEGER DEFAULT NULL, -- 선착순 발급 수량 제한
    current_redemptions INTEGER DEFAULT 0,
    valid_from TIMESTAMPTZ DEFAULT now(),
    valid_until TIMESTAMPTZ,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. 유저 쿠폰 사용 이력 (1인 1계정당 1회 입력 제한)
CREATE TABLE IF NOT EXISTS public.user_coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    coupon_id UUID NOT NULL REFERENCES public.coupons(id) ON DELETE CASCADE,
    redeemed_code TEXT NOT NULL,
    applied_benefits JSONB NOT NULL,
    redeemed_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT unique_user_coupon UNIQUE (user_id, coupon_id)
);

-- 7. 유저 크레딧 및 기간제 VIP 잔액
CREATE TABLE IF NOT EXISTS public.user_credits (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    ai_v2_count INTEGER DEFAULT 0,
    pdf_export_count INTEGER DEFAULT 0,
    ad_free_until TIMESTAMPTZ,
    vip_until TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- RLS (Row Level Security) 설정
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles self management" ON public.profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Subscriptions self view" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Payments self view" ON public.payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Timetables self management" ON public.timetables FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Active coupons view" ON public.coupons FOR SELECT USING (is_active = true);
CREATE POLICY "User coupons self view" ON public.user_coupons FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "User credits self view" ON public.user_credits FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- 신규 유저 회원가입 시 profiles 자동 생성 트리거
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, display_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', '')
    );

    INSERT INTO public.user_credits (user_id)
    VALUES (NEW.id);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
