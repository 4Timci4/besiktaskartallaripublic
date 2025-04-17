# Gallery Tablosundan Sütunları Kaldırma Kılavuzu

Gallery tablosundaki gereksiz alanları (category ve description) kaldırmak için aşağıdaki adımları izleyin:

## 1. Supabase Studio'ya Giriş Yapma

- Supabase projenize giriş yapın
- Sol menüden "SQL Editor" seçeneğine tıklayın

## 2. SQL Sorgusunu Çalıştırma

Aşağıdaki SQL sorgusunu editöre kopyalayın ve çalıştırın:

```sql
-- Galeri tablosundan gereksiz alanları kaldırma
ALTER TABLE gallery 
DROP COLUMN IF EXISTS category,
DROP COLUMN IF EXISTS description;

-- Yeni verilerin doğru bir şekilde eklenmesi için RLS politikalarını güncelleme (gerekirse)
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
```

## 3. GalleryItem Arayüzünü Güncelleme

Ayrıca, `src/utils/supabase.ts` dosyasındaki `GalleryItem` arayüzünü de güncelleyin:

```typescript
export interface GalleryItem {
  id: string;
  title: string;
  image: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}
```

## 4. Uygulama Kodu Kontrol Listesi

Aşağıdaki kısımları kontrol edin ve gereken düzenlemeleri yapın:

- [x] `AdminGalleryPage.tsx` içindeki formData alanlarını kaldırma
- [x] `AdminGalleryPage.tsx` içindeki form alanlarını kaldırma
- [x] `AdminGalleryPage.tsx` içindeki insert ve update işlemlerini güncelleme
- [ ] `GalleryPage.tsx` içindeki kategori ve açıklama alanlarını kaldırma (gerekirse)
- [ ] Uygulamadaki diğer kategoriye bağlı filtreleme/sıralama işlevlerini güncelleme (gerekirse)

Bu değişiklikler yapıldıktan sonra, veritabanı şeması ve uygulama kodu birbirine uyumlu olacaktır. 