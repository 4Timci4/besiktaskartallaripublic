# SQL Klasörü

Bu klasör, BJK websitesi için veritabanı şemalarını ve fonksiyonlarını içeren SQL dosyalarını barındırır.

## Mevcut SQL Dosyaları

Bu klasördeki SQL dosyaları, Supabase üzerinde çalıştırılmak üzere tasarlanmıştır. Her dosya belirli bir veritabanı yapısını veya fonksiyonunu oluşturur:

1. `create_activities_table.sql` - Faaliyetler tablosunu oluşturur
2. `create_gallery_table.sql` - Galeri tablosunu oluşturur
3. `create_press_table.sql` - Basın haberleri tablosunu oluşturur
4. `create_membership_applications_table.sql` - Üyelik başvuruları tablosunu oluşturur

## Kurulum Adımları

1. Supabase projesi dashboard'una giriş yapın
2. Sol menüden "SQL Editor" bölümüne tıklayın
3. "New Query" butonuna tıklayın
4. İlgili SQL dosyasının içeriğini kopyalayıp editöre yapıştırın
5. "Run" butonuna tıklayarak sorguyu çalıştırın

## Önemli Notlar

- SQL dosyalarını çalıştırmadan önce mevcut veritabanı yapısını kontrol edin
- Tüm SQL dosyaları `IF NOT EXISTS` şeklinde yazıldığından, aynı dosyayı birden fazla defa çalıştırmak güvenlidir
- Veritabanı yapılarını değiştirme veya silme işlemleri için önce bir yedek alın

## İstatistikler ve Raporlama

Daha detaylı istatistik raporları için şu adımları takip edebilirsiniz:

1. Supabase Dashboard'da "Table Editor" bölümüne gidin
2. İlgili tabloya tıklayın
3. "Insights" sekmesine tıklayın
4. Burada temel istatistikleri görebilirsiniz

Alternatif olarak, daha gelişmiş ölçümler için Google Analytics, Plausible veya Umami gibi bir analytics servisi entegre etmeyi düşünebilirsiniz. 