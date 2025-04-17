-- Üyelik başvuruları tablosunu oluştur
CREATE TABLE IF NOT EXISTS public.membership_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    bjk_id TEXT NOT NULL,
    birth_date DATE NOT NULL,
    blood_type TEXT NOT NULL,
    birth_city TEXT NOT NULL,
    education_level TEXT NOT NULL,
    occupation TEXT NOT NULL,
    workplace TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    residence_city TEXT NOT NULL,
    residence_district TEXT NOT NULL,
    address TEXT,
    kvkk_consent BOOLEAN NOT NULL DEFAULT false,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- RLS (Row Level Security) politikalarını ayarla
ALTER TABLE public.membership_applications ENABLE ROW LEVEL SECURITY;

-- Tüm politikaları temizle
DROP POLICY IF EXISTS "Anonim kullanıcılar üyelik başvurusu yapabilir" ON public.membership_applications;
DROP POLICY IF EXISTS "Yetkilendirilmiş kullanıcılar başvuruları görüntüleyebilir" ON public.membership_applications;
DROP POLICY IF EXISTS "Yetkilendirilmiş kullanıcılar başvuruları güncelleyebilir" ON public.membership_applications;

-- Anonim kullanıcılar için INSERT izni
CREATE POLICY "enable_insert_for_anonymous_users" ON public.membership_applications
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Yetkilendirilmiş kullanıcılar için SELECT izni
CREATE POLICY "enable_select_for_authenticated_users" ON public.membership_applications
    FOR SELECT
    TO authenticated
    USING (true);

-- Yetkilendirilmiş kullanıcılar için UPDATE izni
CREATE POLICY "enable_update_for_authenticated_users" ON public.membership_applications
    FOR UPDATE
    TO authenticated
    USING (true);

-- updated_at kolonunu otomatik güncellemek için trigger oluştur
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_membership_applications_updated_at ON public.membership_applications;
CREATE TRIGGER update_membership_applications_updated_at
    BEFORE UPDATE ON public.membership_applications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 