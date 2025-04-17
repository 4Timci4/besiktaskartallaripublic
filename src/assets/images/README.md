# Beşiktaş Kartalları Derneği Statik Görseller

Bu klasör, web sitesinde kullanılan statik görselleri içerir. Şu anda placeholder görseller bulunmaktadır, bunları gerçek görsellerle değiştirmeniz gerekecektir.

## Gerekli Görsel Dosyaları

1. **logo.png** - Navbar ve footer'da kullanılan dernek logosu
   - Boyut: 200x200 piksel
   - Format: PNG (şeffaf arka plan)

2. **favicon.png** - Web sitesi favikonu
   - Boyut: 32x32 piksel
   - Format: PNG

3. **Hero Görselleri** - Sayfaların üst kısmındaki büyük görseller
   - hero.jpg - Ana sayfa
   - hero-about.jpg - Hakkımızda sayfası
   - hero-activities.jpg - Faaliyetler sayfası
   - hero-gallery.jpg - Galeri sayfası
   - Boyut: 1920x600 piksel
   - Format: JPG veya WEBP

## Kullanım

Tüm görseller aşağıdaki bileşenlerde kullanılmaktadır:
- `src/config/site.ts` - Logo
- `src/components/Hero.tsx` - Hero görselleri
- `index.html` - Favicon

## Görsel Ekleme Talimatları

1. Görselleri bu klasöre aynı isimlerle kaydedin
2. Görsellerin boyutları yukarıda belirtilen ölçülerde olmalıdır
3. Güncelleme yaptıktan sonra uygulamayı yeniden başlatın

Görsel yükleme işlemi tamamlandığında, bu README dosyasını silebilirsiniz. 