/*
  # Veritabanı Şeması Oluşturma

  1. Yeni Tablolar
    - `activities` (Faaliyetler)
      - `id` (uuid, primary key)
      - `title` (text)
      - `date` (date)
      - `description` (text)
      - `image` (text)
      - `is_active` (boolean)
      - `created_at` (timestamptz)
    
    - `gallery` (Galeri)
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `category` (text)
      - `image` (text)
      - `display_order` (integer)
      - `created_at` (timestamptz)

  2. Güvenlik
    - Her iki tablo için RLS aktif
    - Herkes okuyabilir
    - Sadece yetkilendirilmiş kullanıcılar yazabilir
*/

-- Önceki tabloları temizle (eğer varsa)
DROP TABLE IF EXISTS activities CASCADE;
DROP TABLE IF EXISTS gallery CASCADE;

-- Activities tablosu
CREATE TABLE activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  date date NOT NULL,
  description text NOT NULL,
  image text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Gallery tablosu
CREATE TABLE gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  image text NOT NULL,
  display_order integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- RLS aktivasyonu
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

-- Okuma politikaları (herkes okuyabilir)
CREATE POLICY "Activities are viewable by everyone" ON activities
  FOR SELECT USING (true);

CREATE POLICY "Gallery items are viewable by everyone" ON gallery
  FOR SELECT USING (true);

-- Yazma politikaları (sadece yetkilendirilmiş kullanıcılar)
CREATE POLICY "Activities can be modified by authenticated users only" ON activities
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Gallery items can be modified by authenticated users only" ON gallery
  FOR ALL USING (auth.role() = 'authenticated');

-- Örnek veriler
INSERT INTO activities (title, date, description, image, is_active) VALUES
  ('Çocuk Spor Akademisi', '2024-03-15', 'Geleceğin sporcularını yetiştirmek için profesyonel eğitmenler eşliğinde spor eğitimleri düzenliyoruz.', 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60', true),
  ('Taraftar Buluşması', '2024-03-10', 'Her ay düzenli olarak taraftarlarımızla bir araya geliyor, Beşiktaş sevgisini paylaşıyoruz.', 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60', true),
  ('Eğitim Destek Programı', '2024-03-05', 'İhtiyaç sahibi öğrencilere eğitim bursu ve materyal desteği sağlıyoruz.', 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60', true);

INSERT INTO gallery (title, description, category, image, display_order) VALUES
  ('Taraftar Buluşması', 'Beşiktaş taraftarları bir araya geldi', 'Etkinlikler', 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60', 1),
  ('Spor Akademisi', 'Genç sporcularımızla antrenman', 'Spor', 'https://images.unsplash.com/photo-1526232761682-d26e03ac148e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60', 2),
  ('Sosyal Sorumluluk', 'Eğitim destek programı', 'Sosyal Sorumluluk', 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60', 3);