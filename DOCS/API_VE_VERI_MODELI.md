# BJK Projesi API ve Veri Modeli Dokümantasyonu

Bu doküman, BJK web projesi için API yapısını ve veri modelini detaylı olarak açıklar.

## Veri Modelleri

Projede kullanılan temel veri modelleri aşağıdaki gibidir:

### Activity (Faaliyet) Modeli

```typescript
interface Activity {
  id: string;             // Benzersiz tanımlayıcı (UUID)
  title: string;          // Faaliyet başlığı
  date: string;           // Faaliyet tarihi (ISO formatında)
  description: string;    // Faaliyet açıklaması
  image: string;          // Faaliyet görsel URL'i
  is_active: boolean;     // Aktiflik durumu
  created_at: string;     // Oluşturma tarihi (ISO formatında)
}
```

### GalleryItem (Galeri Öğesi) Modeli

```typescript
interface GalleryItem {
  id: string;             // Benzersiz tanımlayıcı (UUID)
  title: string;          // Galeri öğesi başlığı
  description: string;    // Galeri öğesi açıklaması
  category: string;       // Kategori bilgisi
  image: string;          // Görsel URL'i
  display_order: number;  // Gösterim sırası
  is_active: boolean;     // Aktiflik durumu
  created_at: string;     // Oluşturma tarihi (ISO formatında)
}
```

### ContactMessage (İletişim Mesajı) Modeli

```typescript
interface ContactMessage {
  id: string;             // Benzersiz tanımlayıcı (UUID)
  name: string;           // Gönderen kişinin adı soyadı
  email: string;          // E-posta adresi
  phone: string;          // Telefon numarası
  subject: string;        // Mesaj konusu (maks. 50 karakter)
  message: string;        // Mesaj içeriği
  is_read: boolean;       // Okunma durumu
  created_at: string;     // Oluşturma tarihi (ISO formatında)
}
```

### PageView (Sayfa Görüntüleme) Modeli

```typescript
interface PageView {
  id: string;             // Benzersiz tanımlayıcı (UUID)
  page: string;           // Ziyaret edilen sayfa yolu
  user_agent: string;     // Kullanıcı tarayıcı bilgisi
  timestamp: string;      // Ziyaret zamanı (ISO formatında)
  created_at: string;     // Oluşturma tarihi (ISO formatında)
}
```

## API Dokümantasyonu

Projedeki tüm API işlemleri Supabase client üzerinden yapılmaktadır. API çağrıları ve kullanım şekilleri aşağıda belirtilmiştir:

### Faaliyetler API (activitiesApi)

#### Tüm Faaliyetleri Getirme

```typescript
const faaliyetler = await activitiesApi.getAll();
```

Bu fonksiyon, `is_active` durumu true olan ve tarihe göre azalan sırada sıralanmış tüm faaliyetleri getirir.

#### Admin İçin Tüm Faaliyetleri Getirme

```typescript
const tümFaaliyetler = await activitiesApi.getAllForAdmin();
```

Bu fonksiyon, tüm faaliyetleri (aktif olsun veya olmasın) tarihe göre azalan sırada getirir.

#### Yeni Faaliyet Oluşturma

```typescript
const yeniFaaliyet = await activitiesApi.create({
  title: "Faaliyetin Başlığı",
  date: "2024-01-01",
  description: "Faaliyetin açıklaması",
  image: "resim/url/yolu.jpg",
  is_active: true
});
```

#### Faaliyet Güncelleme

```typescript
const güncellenmisFaaliyet = await activitiesApi.update("faaliyet-id", {
  title: "Güncellenmiş Başlık",
  description: "Güncellenmiş açıklama"
});
```

#### Faaliyet Silme

```typescript
const silmeSonucu = await activitiesApi.delete("faaliyet-id");
```

#### Değişiklikleri Dinleme (Realtime)

```typescript
const subscription = activitiesApi.subscribeToChanges((payload) => {
  console.log("Yeni değişiklik:", payload);
});

// Aboneliği sonlandırmak için
subscription.unsubscribe();
```

### Galeri API (galleryApi)

#### Tüm Galeri Öğelerini Getirme

```typescript
const galeriOgeleri = await galleryApi.getAll();
```

Bu fonksiyon, `is_active` durumu true olan ve gösterim sırasına göre sıralanmış galeri öğelerini getirir.

#### Admin İçin Tüm Galeri Öğelerini Getirme

```typescript
const tümGaleriOgeleri = await galleryApi.getAllForAdmin();
```

#### Yeni Galeri Öğesi Oluşturma

```typescript
const yeniGaleriOgesi = await galleryApi.create({
  title: "Resim Başlığı",
  description: "Resim açıklaması",
  category: "etkinlik",
  image: "resim/url/yolu.jpg",
  display_order: 1,
  is_active: true
});
```

#### Galeri Öğesi Güncelleme

```typescript
const güncellenmiş = await galleryApi.update("galeri-ogesi-id", {
  title: "Güncellenmiş Başlık",
  category: "yeni-kategori"
});
```

#### Galeri Öğesi Silme

```typescript
const silmeSonucu = await galleryApi.delete("galeri-ogesi-id");
```

### İletişim Mesajları API (contactMessagesApi)

#### İletişim Formu Gönderme

```typescript
const mesaj = await contactMessagesApi.submitContactForm({
  name: "Ad Soyad",
  email: "ornek@mail.com",
  phone: "05XX XXX XX XX",
  subject: "Mesaj Konusu",  // Maksimum 50 karakter
  message: "Mesaj içeriği..."
});
```

#### Tüm Mesajları Getirme (Admin Paneli İçin)

```typescript
const tümMesajlar = await contactMessagesApi.getAllMessages();
```

Bu fonksiyon, tüm iletişim mesajlarını oluşturulma tarihine göre azalan sırada getirir.

#### Tek Bir Mesajı Getirme

```typescript
const mesaj = await contactMessagesApi.getMessage("mesaj-id");
```

#### Mesajı Okundu Olarak İşaretleme

```typescript
const güncellenmisMesaj = await contactMessagesApi.markAsRead("mesaj-id", true);
```

#### Mesajı Silme

```typescript
const silmeSonucu = await contactMessagesApi.deleteMessage("mesaj-id");
```

### Dosya Depolama API (storageApi)

#### Dosya Yükleme

```typescript
const dosyaBilgisi = await storageApi.uploadFile(
  dosyaObjesi, // File nesnesi
  'gallery'    // 'gallery' veya 'activities'
);

// Dönen değer
// {
//   path: "gallery/1234567890.jpg",
//   url: "https://project-url.supabase.co/storage/v1/object/public/bjk-storage/gallery/1234567890.jpg"
// }
```

#### Dosya Silme

```typescript
const silmeSonucu = await storageApi.deleteFile("gallery/1234567890.jpg");
```

### İstatistik API (statisticsApi)

#### Sayfa Görüntüleme Kaydı

```typescript
const kaydedildi = await statisticsApi.recordPageView("/");
```

#### Aylık Ziyaretçi Sayısı

```typescript
const aylikZiyaretciSayisi = await statisticsApi.getMonthlyVisitors();
```

#### Günlük Ziyaretçi Sayısı

```typescript
const günlükZiyaretciSayisi = await statisticsApi.getDailyVisitors();
```

#### Ziyaretçi İstatistikleri (Son 7 Gün)

```typescript
const istatistikler = await statisticsApi.getVisitorStats();
// [{ date: "2024-01-01", count: 42 }, ...]
```

## Hata Yönetimi

Projede merkezi bir hata yönetim sistemi kullanılmaktadır. API çağrıları, `handleApiError` fonksiyonu ile sarmalanmıştır.

### Hata Tipleri

```typescript
enum ErrorType {
  NOT_FOUND = 'NOT_FOUND',        // Kayıt/veri bulunamadı
  UNAUTHORIZED = 'UNAUTHORIZED',  // Yetkisiz erişim
  VALIDATION = 'VALIDATION',      // Doğrulama hatası
  SERVER_ERROR = 'SERVER_ERROR',  // Sunucu hatası
  NETWORK_ERROR = 'NETWORK_ERROR',// Ağ bağlantı hatası
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',// Oturum süresi dolmuş
  UNKNOWN = 'UNKNOWN'             // Bilinmeyen hata
}
```

### Hata Yakalama Örneği

```typescript
try {
  const data = await activitiesApi.getAll();
  // İşlemler...
} catch (error) {
  if (error instanceof ApiError) {
    switch (error.type) {
      case ErrorType.UNAUTHORIZED:
        // Yetkilendirme hatası işlemleri
        break;
      case ErrorType.NOT_FOUND:
        // Kayıt bulunamadı işlemleri
        break;
      // Diğer hata tipleri...
      default:
        // Genel hata işlemleri
    }
  } else {
    // ApiError olmayan hatalar için işlemler
  }
}
```

## E-posta Entegrasyonu

Proje, Node.js tabanlı bir e-posta gönderim servisi kullanmaktadır. Bu servis, iletişim formu ve üyelik başvuruları için e-posta gönderimini sağlar.

### E-posta Yapılandırması

E-posta gönderimi için gerekli yapılandırma `.env` dosyasında tanımlanır:

```
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=kullanici@example.com
EMAIL_PASSWORD=sifre
EMAIL_FROM_NAME=Beşiktaş Kartalları Derneği
EMAIL_FROM_ADDRESS=info@example.com
```

### E-posta Gönderimi

İletişim formu verileri hem Supabase veritabanına kaydedilir hem de belirtilen e-posta adresine gönderilir:

```typescript
// İletişim formu gönderimi
const result = await fetch('/api/email/send-contact-form', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    formData: contactData,
    recipientEmail: 'alici@example.com'
  }),
});
```

## Kimlik Doğrulama

Proje, Supabase Authentication hizmetini kullanmaktadır.

```typescript
// Oturum kontrolü
const oturumVarMi = await isAuthenticated();

// Çıkış yapma
const cikisSonucu = await logout();

// Mevcut kullanıcı bilgisi
const kullanici = await getCurrentUser();

// Token yenileme
const yenilemeBasarili = await refreshAuthToken();
```

## Veritabanı Şeması

Proje, aşağıdaki veritabanı tablolarını kullanmaktadır:

- `activities`: Faaliyetleri saklar
- `gallery`: Galeri öğelerini saklar
- `page_views`: Ziyaretçi istatistiklerini saklar

### Page Views (Ziyaretçi Kayıtları) Tablosu

```sql
CREATE TABLE IF NOT EXISTS public.page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page TEXT NOT NULL,
  user_agent TEXT,
  timestamp TIMESTAMPTZ DEFAULT now() NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
```

Tablolarda Row Level Security (RLS) kuralları uygulanmıştır. Bu kurallar, kimlik doğrulamasına göre veri erişimini kontrol eder. 