-- Activities (Faaliyetler) tablosunu oluştur
CREATE TABLE IF NOT EXISTS public.activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    date DATE NOT NULL,
    description TEXT,
    image TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Gallery (Galeri) tablosunu oluştur
CREATE TABLE IF NOT EXISTS public.gallery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'genel',
    image TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Örnek faaliyetler ekle
INSERT INTO public.activities (title, date, description, image, is_active)
VALUES 
('Beşiktaş Maç İzleme Etkinliği', '2024-01-15', 'Dernek üyeleri ile birlikte Beşiktaş - Galatasaray derbisini izleme etkinliğimiz.', 'https://images.unsplash.com/photo-1522778526097-ce0a22ceb253?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80', true),
('Çocuklara Futbol Eğitimi', '2024-02-10', 'Mahallemizdeki çocuklara ücretsiz futbol eğitimi etkinliğimiz.', 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80', true),
('Beşiktaş Tarihi Gezisi', '2024-03-05', 'Beşiktaş kulübünün tarihi mekanlarına düzenlediğimiz kültür gezisi.', 'https://images.unsplash.com/photo-1589459072535-550f4fae08d2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80', true),
('Kariyer Günü: Spor Yönetimi', '2024-04-12', 'Üniversite öğrencileri için spor yönetimi alanında kariyer fırsatları hakkında bilgilendirme etkinliği.', 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80', true),
('Sağlık Koşusu', '2024-05-15', 'Sağlıklı yaşam için Beşiktaş sahilinde düzenlediğimiz sabah koşusu etkinliği.', 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80', true),
('Beşiktaş Amblemi Sergi', '2024-06-20', 'Beşiktaş ambleminin tarihsel dönüşümünü anlatan özel sergi etkinliğimiz.', 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80', false);

-- Örnek galeri öğeleri ekle
INSERT INTO public.gallery (title, description, category, image, display_order, is_active)
VALUES 
('Dernek Açılışı', 'Beşiktaş Kartalları Derneği resmi açılış töreni', 'etkinlik', 'https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80', 1, true),
('Yılbaşı Kutlaması', 'Dernek üyeleri ile yılbaşı kutlaması', 'etkinlik', 'https://images.unsplash.com/photo-1546074177-31bfa593f731?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80', 2, true),
('Şampiyonluk Kutlaması', 'Beşiktaş şampiyonluk kutlaması', 'kutlama', 'https://images.unsplash.com/photo-1563208212-af4066c48b28?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80', 3, true),
('Çocuk Şenliği', 'Çocuklar için düzenlediğimiz şenlik', 'etkinlik', 'https://images.unsplash.com/photo-1536296621510-abf88afa4a8e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80', 4, true),
('Vodafone Park Gezisi', 'Dernek üyeleri ile Vodafone Park Stadyumu gezisi', 'gezi', 'https://images.unsplash.com/photo-1540744276164-9dc988c9f6d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80', 5, true),
('İftar Yemeği', 'Ramazan ayı boyunca düzenlediğimiz iftar programı', 'etkinlik', 'https://images.unsplash.com/photo-1538128845193-f5645c601351?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80', 6, false);

-- RLS (Row Level Security) politikalarını ayarla
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

-- Anonim kullanıcılar için SELECT izni verelim
CREATE POLICY "Anonim kullanıcılar faaliyetleri görüntüleyebilir" 
ON public.activities FOR SELECT TO anon USING (true);

CREATE POLICY "Anonim kullanıcılar galeri öğelerini görüntüleyebilir" 
ON public.gallery FOR SELECT TO anon USING (true);
