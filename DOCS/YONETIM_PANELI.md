# BJK Projesi Yönetim Paneli Kullanım Kılavuzu

Bu doküman, BJK web sitesi yönetim panelinin nasıl kullanılacağını detaylı olarak açıklar.

## Giriş

Yönetim paneline `/admin` URL'i üzerinden erişebilirsiniz. Örneğin, web siteniz `www.besiktaskartallaridernegi.com` ise, yönetim paneline `www.besiktaskartallaridernegi.com/admin` adresi üzerinden ulaşabilirsiniz.

## Oturum Açma

1. Tarayıcınızda `/admin` adresine gidin
2. Karşınıza gelen giriş ekranında e-posta adresinizi ve şifrenizi girin
3. "Giriş Yap" butonuna tıklayın

**Not**: Şifrenizi unuttuysanız "Şifremi Unuttum" bağlantısına tıklayabilirsiniz. Size şifre sıfırlama talimatlarını içeren bir e-posta gönderilecektir.

## Dashboard (Kontrol Paneli)

Giriş yaptıktan sonra, kontrol paneli sayfasına yönlendirileceksiniz. Bu sayfada aşağıdaki bilgileri görebilirsiniz:

- **Son Eklenen Faaliyetler**: En son eklenen 5 faaliyet
- **Son Eklenen Galeri Öğeleri**: En son eklenen 5 galeri öğesi
- **Son İletişim Mesajları**: En son alınan 5 iletişim mesajı

![Dashboard Ekranı](../assets/images/admin-dashboard.png)

## Faaliyetler Yönetimi

Sol menüdeki "Faaliyetler" bağlantısına tıklayarak faaliyetler sayfasına erişebilirsiniz.

### Faaliyet Listesi Görüntüleme

Faaliyetler sayfasında, mevcut tüm faaliyetlerin bir listesini göreceksiniz. Her bir faaliyet için şu bilgiler gösterilir:

- Başlık
- Tarih
- Durum (Aktif/Pasif)
- Oluşturulma Tarihi
- İşlemler (Düzenle/Sil)

### Yeni Faaliyet Ekleme

1. "Yeni Faaliyet Ekle" butonuna tıklayın
2. Açılan formda aşağıdaki bilgileri doldurun:
   - **Başlık**: Faaliyetin başlığı
   - **Tarih**: Faaliyetin gerçekleştiği veya gerçekleşeceği tarih
   - **Açıklama**: Faaliyet hakkında detaylı açıklama
   - **Görsel**: Faaliyetle ilgili bir görsel
   - **Durum**: Aktif veya pasif (Aktif seçilirse sitede görüntülenir)
3. "Kaydet" butonuna tıklayın

#### Görsel Yükleme Kuralları

- Görseller en fazla 5MB boyutunda olabilir
- Desteklenen formatlar: JPG, JPEG, PNG
- Önerilen boyut: 1200x800 piksel
- Görsel yükledikten sonra önizlemesi formda görüntülenecektir

### Faaliyet Düzenleme

1. Listeden düzenlemek istediğiniz faaliyetin yanındaki "Düzenle" butonuna tıklayın
2. Açılan formda istediğiniz değişiklikleri yapın
3. "Kaydet" butonuna tıklayarak değişiklikleri uygulayın

### Faaliyet Silme

1. Listeden silmek istediğiniz faaliyetin yanındaki "Sil" butonuna tıklayın
2. Onay penceresinde "Evet, Sil" butonuna tıklayarak işlemi onaylayın

**Önemli Not**: Silinen faaliyetler geri alınamaz. Bu nedenle silme işlemi öncesinde emin olun.

## Galeri Yönetimi

Sol menüdeki "Galeri" bağlantısına tıklayarak galeri sayfasına erişebilirsiniz.

### Galeri Öğeleri Listesi

Galeri sayfasında, mevcut tüm galeri öğelerinin bir listesini göreceksiniz. Her bir öğe için şu bilgiler gösterilir:

- Başlık
- Kategori
- Görsel (Küçük önizleme)
- Gösterim Sırası
- Durum (Aktif/Pasif)
- İşlemler (Düzenle/Sil)

### Yeni Galeri Öğesi Ekleme

1. "Yeni Galeri Öğesi Ekle" butonuna tıklayın
2. Açılan formda aşağıdaki bilgileri doldurun:
   - **Başlık**: Galeri öğesinin başlığı
   - **Açıklama**: Kısa bir açıklama
   - **Kategori**: Öğenin kategorisi (Etkinlik, Kupa Töreni, Maç, vb.)
   - **Görsel**: Yüklenecek görsel
   - **Gösterim Sırası**: Galerinin web sitede görüntülenme sırası
   - **Durum**: Aktif veya pasif
3. "Kaydet" butonuna tıklayın

### Galeri Öğesi Düzenleme

1. Listeden düzenlemek istediğiniz öğenin yanındaki "Düzenle" butonuna tıklayın
2. Açılan formda istediğiniz değişiklikleri yapın
3. "Kaydet" butonuna tıklayın

### Galeri Öğesi Silme

1. Listeden silmek istediğiniz öğenin yanındaki "Sil" butonuna tıklayın
2. Onay penceresinde "Evet, Sil" butonuna tıklayarak işlemi onaylayın

### Galeri Kategorileri Yönetimi

Galeri öğeleri, kategori bazında filtrelenebilir. Mevcut kategoriler formda bir açılır menü olarak sunulur. Yeni bir kategori eklemek için:

1. Galeri öğesi eklerken "Kategori" alanına yeni bir kategori ismi yazın
2. Yeni eklenen kategori, sistem tarafından otomatik olarak kaydedilir ve diğer öğeler için de kullanılabilir hale gelir

## Üyelik Başvuruları

Sol menüdeki "Üyelik Başvuruları" bağlantısına tıklayarak üyelik başvuruları sayfasına erişebilirsiniz.

### Başvuru Listesi Görüntüleme

Üyelik başvuruları sayfasında, web sitesi üzerinden yapılan tüm üyelik başvurularının bir listesini göreceksiniz. Her bir başvuru için şu bilgiler gösterilir:

- Ad Soyad
- E-posta
- Telefon
- Başvuru Tarihi
- Üyelik Tipi
- Durum (Beklemede/Onaylandı/Reddedildi)
- İşlemler (Görüntüle/Onayla/Reddet)

### Başvuru Detaylarını Görüntüleme

1. Listeden görüntülemek istediğiniz başvurunun yanındaki "Görüntüle" butonuna tıklayın
2. Açılan pencerede başvuru sahibinin tüm bilgilerini görebilirsiniz:
   - Kişisel bilgiler
   - İletişim bilgileri
   - Adres bilgileri
   - Başvuru tarihi ve saati

### Başvuru Onaylama

1. Listeden onaylamak istediğiniz başvurunun yanındaki "Onayla" butonuna tıklayın
2. Onay penceresinde "Evet, Onayla" butonuna tıklayın
3. Başvuru sahibine otomatik olarak bir onay e-postası gönderilecektir

### Başvuru Reddetme

1. Listeden reddetmek istediğiniz başvurunun yanındaki "Reddet" butonuna tıklayın
2. Açılan pencerede red gerekçesini yazın
3. "Gönder" butonuna tıklayın
4. Başvuru sahibine, belirttiğiniz gerekçeyi içeren bir e-posta gönderilecektir

## İletişim Mesajları

Sol menüdeki "İletişim Mesajları" bağlantısına tıklayarak iletişim formundan gelen mesajları görüntüleyebilirsiniz.

### Mesaj Listesi

İletişim mesajları sayfasında, web sitesi üzerindeki iletişim formundan gönderilen tüm mesajların bir listesini göreceksiniz. Her bir mesaj için şu bilgiler gösterilir:

- Gönderen Ad Soyad
- E-posta
- Konu
- Tarih
- Durum (Okundu/Okunmadı)
- İşlemler (Görüntüle/Yanıtla/Sil)

### İletişim Formu Özellikleri

İletişim formu şu özelliklere sahiptir:

- "Konu" alanı maksimum 50 karakter ile sınırlıdır
- Form gönderildiğinde veriler Supabase veritabanına kaydedilir
- Aynı zamanda site yöneticisine e-posta olarak iletilir
- Form verileri sunucuda dosya olarak da yedeklenir

### Mesaj Detaylarını Görüntüleme

1. Listeden görüntülemek istediğiniz mesajın yanındaki "Görüntüle" butonuna tıklayın
2. Açılan pencerede mesajın tüm içeriğini okuyabilirsiniz
3. Mesaj otomatik olarak "okundu" olarak işaretlenir

### Mesajı Yanıtlama

1. Mesaj detayları penceresinde veya listede "Yanıtla" butonuna tıklayın
2. Açılan yanıt formunda yanıtınızı yazın
3. "Gönder" butonuna tıklayın
4. Mesaj gönderene otomatik olarak yanıtınızı içeren bir e-posta gönderilecektir

### Mesajı Silme

1. Listeden silmek istediğiniz mesajın yanındaki "Sil" butonuna tıklayın
2. Onay penceresinde "Evet, Sil" butonuna tıklayarak işlemi onaylayın

**Önemli Not**: Silinen mesajlar geri alınamaz. Bu nedenle silme işlemi öncesinde emin olun.

## Hesap Yönetimi

### Kullanıcı Bilgilerini Güncelleme

1. Sağ üst köşedeki kullanıcı adınıza tıklayın
2. Açılan menüden "Profilim" seçeneğini tıklayın
3. Açılan sayfada aşağıdaki bilgileri güncelleyebilirsiniz:
   - Ad Soyad
   - E-posta adresi
   - Profil fotoğrafı
4. "Kaydet" butonuna tıklayarak değişiklikleri uygulayın

### Şifre Değiştirme

1. Profil sayfasında "Şifremi Değiştir" sekmesine tıklayın
2. Mevcut şifrenizi ve yeni şifrenizi girin
3. Yeni şifrenizi tekrar girin
4. "Şifremi Değiştir" butonuna tıklayın

Şifre gereksinimleri:
- En az 8 karakter uzunluğunda olmalıdır
- En az bir büyük harf içermelidir
- En az bir küçük harf içermelidir
- En az bir rakam içermelidir
- En az bir özel karakter içermelidir

### Oturumu Kapatma

Sağ üst köşedeki kullanıcı adınıza tıklayın ve açılan menüden "Çıkış Yap" seçeneğini tıklayın.

## Sık Sorulan Sorular ve Sorun Giderme

### Yönetim Paneline Erişemiyorum

1. İnternet bağlantınızı kontrol edin
2. Doğru URL'i kullandığınızdan emin olun (`/admin` uzantısı)
3. Tarayıcı önbelleğini temizleyin ve sayfayı yenileyin
4. E-posta adresinizi ve şifrenizi doğru girdiğinizden emin olun
5. Şifrenizi unuttuysanız, "Şifremi Unuttum" bağlantısını kullanın

### Görsel Yükleyemiyorum

1. Görselin boyutunun 5MB'den küçük olduğundan emin olun
2. Görselin desteklenen bir formatta olduğunu kontrol edin (JPG, JPEG, PNG)
3. Tarayıcınızı güncelleyin veya farklı bir tarayıcı kullanmayı deneyin
4. İnternet bağlantınızın stabil olduğundan emin olun

### İletişim Formu Sorunları

1. İletişim formu gönderiminde hata alıyorsanız:
   - E-posta servisinin sunucuda çalıştığından emin olun
   - SMTP sunucu ayarlarını kontrol edin
   - Form gönderilmezse, Supabase kayıtlarını ve sunucu loglarını kontrol edin
2. 50 karakterden uzun konu girişleri otomatik olarak kısaltılır

### Değişikliklerimi Kaydedemiyorum

1. Tüm zorunlu alanları doldurduğunuzdan emin olun
2. Tarayıcınızın JavaScript desteğinin etkin olduğunu kontrol edin
3. Tarayıcı önbelleğini temizleyin ve sayfayı yenileyin
4. Oturumunuzun süresi dolmuş olabilir, tekrar giriş yapın

### Yönetim Paneli Çok Yavaş

1. İnternet bağlantınızı kontrol edin
2. Tarayıcınızı güncelleyin
3. Tarayıcı önbelleğini ve çerezleri temizleyin
4. Çok sayıda sekme veya uygulama açıksa, gereksiz olanları kapatın

## İpuçları ve En İyi Uygulamalar

### Görsel Optimizasyonu

- Siteye yükleyeceğiniz görselleri önceden optimize edin
- Büyük boyutlu görselleri yüklemeden önce boyutlarını küçültün
- Web için optimize edilmiş görseller kullanın (WebP, optimized JPG)

### Düzenli Yedekleme

- Önemli içerik değişikliklerinden önce manuel yedek almayı düşünün
- Görselleri yedeklemek için düzenli olarak indirin

### Güvenlik

- Güçlü şifreler kullanın ve düzenli olarak değiştirin
- Yönetim paneline güvenilir cihazlardan erişin
- Oturumunuzu açık bırakmayın
- Şüpheli etkinlik görürseniz şifrenizi hemen değiştirin

## Yardım ve Destek

Yönetim paneli ile ilgili sorularınız veya sorunlarınız için:

- E-posta: destek@besiktaskartallaridernegi.com
- Telefon: +90 212 XXX XX XX

Destek ekibimiz, hafta içi 09:00-18:00 saatleri arasında hizmet vermektedir. 