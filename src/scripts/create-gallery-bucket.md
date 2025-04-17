# Supabase Storage Yapılandırma Kılavuzu

Resim yüklemelerinin çalışabilmesi için Supabase Storage'ı doğru şekilde yapılandırmanız gerekiyor. Sistemde "bjk-storage" adlı bir bucket ve bunun altında "gallery" ve "activities" klasörleri bulunduğu anlaşıldı.

## 1. Supabase Dashboard'a Giriş Yapın
- [Supabase Dashboard](https://app.supabase.io/)'a giriş yapın
- Projenizi seçin

## 2. Storage Bölümüne Gidin
- Sol menüden "Storage" seçeneğini tıklayın
- "Buckets" alt menüsüne gidin

## 3. Bucket Yapılandırmasını Kontrol Edin
- "bjk-storage" adlı bucket'ın varlığını doğrulayın
- Eğer bu bucket yoksa:
  - "New Bucket" butonuna tıklayın
  - Bucket adını "bjk-storage" olarak girin (bu isim tam olarak bu şekilde olmalı, büyük-küçük harfe duyarlıdır)
  - "Public bucket" (Herkese açık kova) seçeneğini işaretleyin
  - "Create bucket" butonuna tıklayın

## 4. Klasörleri Kontrol Edin
- "bjk-storage" bucket'ına tıklayın
- "gallery" ve "activities" klasörlerinin varlığını kontrol edin
- Eğer bu klasörler yoksa:
  - "Create folder" (Klasör Oluştur) düğmesine tıklayın
  - Klasör adı olarak "gallery" girin ve oluşturun
  - Aynı şekilde "activities" klasörünü de oluşturun

## 5. Erişim İzinlerini Yapılandırın
- "bjk-storage" bucket'ınızı seçin
- "Policies" (Politikalar) sekmesine tıklayın
- Mevcut politikaları kontrol edin

Eğer politikalar yoksa aşağıdakileri ekleyin:

### Aşağıdaki Politikaları Ekleyin:

#### Herkes Okuyabilir Politikası
- Policy Type: `GET` (okuma)
- Policy Name: `Dosyaları herkes görüntüleyebilir`
- Definition: `Predefined template seçin ve sonra "Allow read access to everyone" seçeneğini seçin`
- "Review" ve ardından "Save policy" butonlarına tıklayın

#### Admin Yazabilir/Silebilir Politikası
- Policy Type: `INSERT, UPDATE, DELETE` (yazma)
- Policy Name: `Admin kullanıcıları dosyaları yönetebilir`
- Definition: 
  - Custom Checkup seçin
  - `(auth.role() = 'authenticated') and (exists (select 1 from admins where admins.email = auth.jwt() ->> 'email'))`
- "Review" ve ardından "Save policy" butonlarına tıklayın

## 6. Kodu Kontrol Edin
- Uygulamanızda bulunan güncellenmiş kodda, "uploadFile" fonksiyonu artık "bjk-storage" bucket'ını kullanacak şekilde ayarlandı.
- Kodun en son sürümünü kullandığınızdan emin olun.

## 7. Uygulamayı Yenileyin ve Tekrar Deneyin
- Bu değişikliklerden sonra uygulamanızı yenileyin
- Artık görsel yükleme işlemi çalışmalıdır

## Sorun Devam Ederse
- Bucket adının tam olarak "bjk-storage" olduğundan emin olun (büyük-küçük harfe duyarlıdır)
- Supabase'in Developer Tools konsolunda hataları kontrol edin
- Supabase projenizin API anahtarlarının doğru ayarlandığından emin olun 