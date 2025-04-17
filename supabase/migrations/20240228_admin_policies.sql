-- Admin kullanıcıları için Row Level Security politikaları

-- 'activities' tablosu için politikalar
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Herkes okuyabilir politikası
CREATE POLICY "Herkes faaliyetleri görebilir" 
ON activities FOR SELECT 
USING (true);

-- Sadece kimliği doğrulanmış kullanıcılar ekleyebilir
CREATE POLICY "Kimliği doğrulanmış kullanıcılar faaliyet ekleyebilir" 
ON activities FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Sadece kimliği doğrulanmış kullanıcılar güncelleyebilir
CREATE POLICY "Kimliği doğrulanmış kullanıcılar faaliyet güncelleyebilir" 
ON activities FOR UPDATE 
TO authenticated 
USING (true);

-- Sadece kimliği doğrulanmış kullanıcılar silebilir
CREATE POLICY "Kimliği doğrulanmış kullanıcılar faaliyet silebilir" 
ON activities FOR DELETE 
TO authenticated 
USING (true);

-- 'gallery' tablosu için politikalar
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

-- Herkes okuyabilir politikası
CREATE POLICY "Herkes galeri öğelerini görebilir" 
ON gallery FOR SELECT 
USING (true);

-- Sadece kimliği doğrulanmış kullanıcılar ekleyebilir
CREATE POLICY "Kimliği doğrulanmış kullanıcılar galeri öğesi ekleyebilir" 
ON gallery FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Sadece kimliği doğrulanmış kullanıcılar güncelleyebilir
CREATE POLICY "Kimliği doğrulanmış kullanıcılar galeri öğesi güncelleyebilir" 
ON gallery FOR UPDATE 
TO authenticated 
USING (true);

-- Sadece kimliği doğrulanmış kullanıcılar silebilir
CREATE POLICY "Kimliği doğrulanmış kullanıcılar galeri öğesi silebilir" 
ON gallery FOR DELETE 
TO authenticated 
USING (true);

-- NOT: Bu politikalar temel bir yapılandırma sağlar
-- Daha güvenli bir yapı için admin rolü oluşturmayı ve sadece o role izin vermeyi düşünebilirsiniz. 