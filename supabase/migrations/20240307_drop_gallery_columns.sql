-- Galeri tablosundan gereksiz alanları kaldırma
ALTER TABLE gallery 
DROP COLUMN IF EXISTS category,
DROP COLUMN IF EXISTS description;

-- Yeni verilerin doğru bir şekilde eklenmesi için RLS politikalarını güncelleme
BEGIN;
  -- Yeni politikaları oluşturmadan önce eskileri kaldırın (eğer mevcutsa)
  DROP POLICY IF EXISTS "Admin kullanıcıları tüm gallery kayıtlarına erişebilir" ON gallery;
  DROP POLICY IF EXISTS "Galeri öğelerini herkes görebilir" ON gallery;
  
  -- Yeniden oluşturun
  CREATE POLICY "Admin kullanıcıları tüm gallery kayıtlarına erişebilir"
  ON gallery
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM admins
      WHERE admins.email = auth.jwt() ->> 'email'
    )
  );
  
  CREATE POLICY "Galeri öğelerini herkes görebilir"
  ON gallery
  FOR SELECT
  TO anon
  USING (is_active = true);
COMMIT; 