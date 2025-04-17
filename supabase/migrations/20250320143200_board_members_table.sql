-- Yönetim Kurulu üyeleri için tablo oluşturma
CREATE TABLE IF NOT EXISTS board_members (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  email TEXT,
  image TEXT,
  bio TEXT,
  is_president BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS politikaları
ALTER TABLE board_members ENABLE ROW LEVEL SECURITY;

-- Kimliği doğrulanmış kullanıcılar için tüm işlemlere izin veren politika
CREATE POLICY "Authenticated users can do all operations on board_members" ON board_members
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Anonim kullanıcılar için sadece okuma izni
CREATE POLICY "Anyone can view board_members" ON board_members
  FOR SELECT
  TO anon
  USING (true);
