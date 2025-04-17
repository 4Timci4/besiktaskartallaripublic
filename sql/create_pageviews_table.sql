-- page_views tablosunu oluştur
CREATE TABLE IF NOT EXISTS public.page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page TEXT NOT NULL,
  user_agent TEXT,
  timestamp TIMESTAMPTZ DEFAULT now() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Row Level Security kuralları
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Admin kullanıcıların tüm işlemleri yapabilmesine izin ver
CREATE POLICY "Adminler tüm page_views verilerini yönetebilir" ON public.page_views 
  FOR ALL 
  TO authenticated 
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Herkesin ziyaret kaydı eklemesine izin ver
CREATE POLICY "Herkes ziyaret kaydı ekleyebilir" ON public.page_views 
  FOR INSERT 
  TO anon, authenticated 
  WITH CHECK (true);

-- Günlük ziyaretçi sayısını getiren fonksiyon
CREATE OR REPLACE FUNCTION public.get_daily_visitors(start_date DATE, end_date DATE)
RETURNS TABLE (date DATE, count BIGINT)
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT 
    DATE(timestamp) as date,
    COUNT(DISTINCT id) as count 
  FROM page_views
  WHERE DATE(timestamp) BETWEEN start_date AND end_date
  GROUP BY DATE(timestamp)
  ORDER BY date;
$$; 