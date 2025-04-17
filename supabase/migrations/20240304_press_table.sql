-- Press (Basın) tablosunu oluştur
CREATE TABLE IF NOT EXISTS public.press (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    source TEXT NOT NULL,
    date DATE NOT NULL,
    image TEXT,
    summary TEXT,
    link TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Örnek basın haberleri ekle
INSERT INTO public.press (title, source, date, image, summary, is_active)
VALUES 
('Beşiktaş Kartalları Derneği''nden Anlamlı Proje', 'Spor Gazetesi', '2024-03-15', 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60', 'Derneğimizin başlattığı ''Geleceğin Kartalları'' projesi basında geniş yer buldu.', true),
('Taraftar Derneğinden Örnek Davranış', 'Günlük Haber', '2024-03-10', 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60', 'Sosyal sorumluluk projemiz ulusal basında kendine yer buldu.', true),
('Beşiktaş Ruhu Yaşatılıyor', 'Spor Dergisi', '2024-02-28', 'https://images.unsplash.com/photo-1486286701208-1d58e9338013?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60', 'Derneğimizin düzenlediği etkinlikler ve faaliyetler spor basınında övgüyle karşılandı.', true);

-- RLS (Row Level Security) politikalarını ayarla
ALTER TABLE public.press ENABLE ROW LEVEL SECURITY;

-- Anonim kullanıcılar için SELECT izni verelim
CREATE POLICY "Anonim kullanıcılar basın haberlerini görüntüleyebilir" 
ON public.press FOR SELECT TO anon USING (true);

-- Yetkilendirilmiş kullanıcılar için tüm işlemlere izin verelim
CREATE POLICY "Yetkili kullanıcılar basın haberlerini yönetebilir"
ON public.press FOR ALL TO authenticated
USING (true)
WITH CHECK (true); 