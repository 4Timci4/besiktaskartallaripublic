# BJK Projesi Kurulum ve Çalıştırma Talimatları

Bu doküman, BJK web projesi için detaylı kurulum ve çalıştırma talimatlarını içerir.

## Sistem Gereksinimleri

- Node.js (v16 veya üzeri)
- npm (v8 veya üzeri)
- Git

## Kurulum Adımları

### 1. Repoyu Klonlama

Projeyi bilgisayarınıza klonlamak için aşağıdaki komutu çalıştırın:

```bash
git clone https://github.com/username/bjk-project.git
cd bjk-project
```

### 2. Bağımlılıkları Yükleme

Projenin çalışması için gerekli bağımlılıkları yüklemek için aşağıdaki komutu çalıştırın:

```bash
npm install
```

Bu komut, `package.json` dosyasında belirtilen tüm bağımlılıkları `node_modules` klasörüne yükleyecektir.

### 3. Çevre Değişkenlerini Ayarlama

Proje, Supabase ile entegrasyon ve e-posta servisi için çevre değişkenlerine ihtiyaç duyar. Proje kök dizininde `.env` dosyası oluşturun ve aşağıdaki değişkenleri ekleyin:

```
# Supabase Yapılandırması
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_SERVICE_KEY=your_supabase_service_key

# API Ayarları
PORT=3001
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development

# E-posta Ayarları
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@example.com
EMAIL_PASSWORD=your_email_password
EMAIL_FROM_NAME=Beşiktaş Kartalları Derneği
EMAIL_FROM_ADDRESS=info@example.com
MEMBERSHIP_FORM_RECIPIENT_EMAIL=info@example.com
```

> **Not**: Supabase bilgilerini Supabase projenizin dashboard'undan alabilirsiniz (Settings > API bölümü).

### 4. Supabase Kurulumu

#### 4.1. Supabase Hesabı Oluşturma ve Proje Ayarları

1. [Supabase](https://supabase.com) adresine gidin ve bir hesap oluşturun
2. Yeni bir proje oluşturun
3. Sol menüden "Authentication" bölümüne giderek e-posta doğrulama özelliğini etkinleştirin
4. Proje API bilgilerini Settings > API bölümünden alın

#### 4.2. Veritabanı Tablolarını Oluşturma

1. Supabase projenizin dashboard'unda "SQL Editor" bölümüne gidin
2. "New Query" butonuna tıklayın
3. Aşağıdaki SQL sorgu dosyalarını sırayla çalıştırın:
   - `supabase/migrations/20250205141029_gentle_term.sql` (Temel tablolar)
   - `supabase/migrations/20250228084257_create_tables.sql` (Faaliyetler ve galeri)
   - `supabase/migrations/20240304_press_table.sql` (Basın haberleri)
   - `supabase/migrations/20240612_contact_messages.sql` (İletişim mesajları)

#### 4.3. Dosya Depolama Ayarları

1. Supabase projenizin dashboard'unda "Storage" bölümüne gidin
2. "New Bucket" butonuna tıklayarak "bjk-storage" adında bir bucket oluşturun
3. Bu bucket'ı public yapın (RLS kurulumuna dikkat edin)
4. "gallery" ve "activities" adında iki klasör oluşturun

### 5. E-posta Sunucusu Yapılandırması

Proje, iletişim formu ve üyelik formlarından gelen mesajları e-posta olarak gönderebilmek için bir e-posta sunucusuna ihtiyaç duyar.

#### 5.1. SMTP Sunucu Bilgileri

`.env` dosyasında aşağıdaki ayarları yapılandırın:

```
EMAIL_HOST=smtp.example.com         # SMTP sunucu adresi
EMAIL_PORT=587                      # SMTP port (genellikle 587 veya 465)
EMAIL_SECURE=false                  # Port 465 için true, 587 için false
EMAIL_USER=your_email@example.com   # SMTP kullanıcı adı
EMAIL_PASSWORD=your_password        # SMTP şifresi
EMAIL_FROM_NAME=Dernek Adı          # Gönderen ismi
EMAIL_FROM_ADDRESS=info@example.com # Gönderen e-posta adresi
```

#### 5.2. E-posta Sunucusunu Test Etme

E-posta sunucusunun doğru yapılandırıldığını test etmek için:

```bash
# Önce Express sunucusunu başlatın
npm run server

# Sonra tarayıcıda aşağıdaki URL'e gidin
http://localhost:3001/api/email/test
```

Bu test, yapılandırılan SMTP sunucusunun bağlantı durumunu kontrol edecektir.

### 6. Admin Kullanıcısı Oluşturma

Yönetici paneline giriş yapabilmek için bir admin kullanıcısı oluşturmanız gerekir:

```bash
npm run create-admin admin@ornek.com guclu-sifre123
```

Bu komut, belirtilen e-posta ve şifre ile bir admin kullanıcısı oluşturacaktır.

## Projeyi Çalıştırma

### Geliştirme Modunda Çalıştırma

Geliştirme sunucusunu başlatmak için:

```bash
# Sadece frontend'i başlatmak için
npm run dev

# Frontend ve backend (e-posta API) sunucularını birlikte başlatmak için
npm run dev:all
```

Frontend sunucusu varsayılan olarak `http://localhost:5173` adresinden, backend sunucusu ise `http://localhost:3001` adresinden erişilebilir olacaktır.

### Projeyi Derlemek (Production Build)

Projeyi canlı ortam için derlemek için:

```bash
npm run build
```

Bu komut, projeyi derleyecek ve `dist` klasörüne çıktıyı oluşturacaktır.

### Derlenen Projeyi Önizleme

Derleme sonrası projeyi önizlemek için:

```bash
npm run preview
```

Bu komut, `dist` klasöründeki derlenen projeyi yerel bir sunucuda önizlemenizi sağlar.

## Sorun Giderme

### Yaygın Sorunlar ve Çözümleri

1. **"Supabase yapılandırması eksik" hatası**
   - `.env` dosyasının doğru yapılandırıldığından emin olun
   - Çevre değişkenlerinin Vite tarafından doğru şekilde yüklendiğini kontrol edin

2. **"Authentication failed" hatası**
   - Supabase projenizdeki authentication ayarlarını kontrol edin
   - Kullanıcı kimlik bilgilerinin doğru olduğundan emin olun

3. **Dosya yükleme hataları**
   - Storage bucket'ın doğru yapılandırıldığından emin olun
   - RLS (Row Level Security) kurallarını kontrol edin

4. **E-posta gönderim sorunları**
   - E-posta sunucusu bilgilerinin doğru olduğundan emin olun
   - SMTP sunucusunun güvenlik duvarı veya port kısıtlamaları olup olmadığını kontrol edin
   - Gmail kullanıyorsanız, "Daha az güvenli uygulama erişimi" ayarını açın veya uygulama şifresi kullanın

5. **İletişim formu hataları**
   - Formun 50 karakter sınırı olan "Konu" alanı doğru şekilde çalışıyor mu kontrol edin
   - Form verilerinin Supabase'e başarıyla kaydedildiğini doğrulayın
   - Backend API'sinin çalıştığından emin olun

6. **"npm install" sırasında hatalar**
   - Node.js ve npm sürümünüzü güncelleyin
   - `npm cache clean --force` komutu ile önbelleği temizleyin ve yeniden deneyin

Daha fazla yardım için [Vite Dokümantasyonu](https://vitejs.dev/guide/) veya [Supabase Dokümantasyonu](https://supabase.com/docs)'na başvurabilirsiniz. 