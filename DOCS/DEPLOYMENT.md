# BJK Projesi Deployment (Dağıtım) Süreci

Bu doküman, BJK web projesinin canlı ortama nasıl dağıtılacağını detaylı olarak açıklar.

## Deployment Öncesi Kontroller

Uygulamayı canlı ortama yüklemeden önce aşağıdaki kontrolleri yapmanız önerilir:

1. **Tüm bağımlılıkların güncel olduğundan emin olun**
   ```bash
   npm outdated
   npm update
   ```

2. **Güvenlik açıklarını kontrol edin**
   ```bash
   npm audit
   npm audit fix
   ```

3. **Linter ve tip kontrollerini çalıştırın**
   ```bash
   npm run lint
   ```

4. **Production build'in başarılı olduğunu doğrulayın**
   ```bash
   npm run build
   npm run preview
   ```

5. **Çevre değişkenlerinin production için doğru ayarlandığından emin olun**
   - `.env` içinde Supabase üretim ortamı bilgilerinin doğru olduğunu kontrol edin
   - SMTP sunucu bilgilerinin üretim ortamı için doğru ayarlandığını kontrol edin
   - Hassas bilgilerin güvenli şekilde saklandığından emin olun

## Vercel ile Deployment

Proje, Vercel platformu üzerinden kolay bir şekilde deploy edilebilir. Bu kurulumda, önemli nokta **hem frontend hem de backend bileşenlerini uygun şekilde yapılandırmaktır**.

### İlk Kez Deployment

1. [Vercel](https://vercel.com)'e kaydolun ve giriş yapın
2. "New Project" butonuna tıklayın  
3. GitHub reponuzu import edin
4. Proje ayarlarını yapılandırın:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Environment Variables**: Supabase ve e-posta yapılandırmalarını ekleyin (aşağıda detaylı açıklanmıştır)
5. "Deploy" butonuna tıklayın

### Çevre Değişkenleri

Vercel'de projeniz için gerekli çevre değişkenlerini ayarlamanız gerekir:

1. Vercel Dashboard'da projenize gidin
2. "Settings" sekmesine tıklayın
3. "Environment Variables" bölümünü seçin
4. Aşağıdaki değişkenleri ekleyin:
   - `VITE_SUPABASE_URL`: Supabase projenizin URL'i
   - `VITE_SUPABASE_ANON_KEY`: Supabase projenizin anonim API anahtarı
   - `VITE_API_BASE_URL`: Backend API'nizin URL'i (ayrı bir servis olacaksa)
   - `EMAIL_HOST`: SMTP sunucusu adresiniz
   - `EMAIL_PORT`: SMTP portu
   - `EMAIL_SECURE`: SSL kullanımı (true/false)
   - `EMAIL_USER`: SMTP kullanıcı adınız
   - `EMAIL_PASSWORD`: SMTP şifreniz
   - `EMAIL_FROM_NAME`: Gönderen adı
   - `EMAIL_FROM_ADDRESS`: Gönderen e-posta adresi
5. "Save" butonuna tıklayarak değişiklikleri kaydedin

> **Not**: Kesinlikle `VITE_SUPABASE_SERVICE_KEY` gibi hassas anahtarları Vercel'de veya diğer frontend deployment ortamlarında saklamayın.

### E-posta API'si için Serverless Function Kurulumu

Vercel'de e-posta gönderimi için backend API'si olarak serverless fonksiyonlar kullanabilirsiniz:

1. Proje kök dizininde `api` klasörü oluşturun
2. Bu klasör içinde `email.js` dosyası oluşturun:

```javascript
// api/email.js
const nodemailer = require('nodemailer');

// Transporter oluştur
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// E-posta gönder
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { formData, recipientEmail } = req.body;
    
    if (!formData || !recipientEmail) {
      return res.status(400).json({
        success: false,
        message: 'Form verileri veya alıcı e-posta adresi eksik'
      });
    }
    
    const transporter = createTransporter();
    
    // E-posta içeriği oluştur
    const htmlContent = `
      <h2>Yeni İletişim Mesajı</h2>
      <table style="border-collapse: collapse; width: 100%;">
        <tr>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Bilgi</th>
          <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Değer</th>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;">Ad Soyad</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${formData.name}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;">E-posta</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${formData.email}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;">Telefon</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${formData.phone}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;">Konu</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${formData.subject}</td>
        </tr>
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;">Mesaj</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${formData.message.replace(/\n/g, '<br>')}</td>
        </tr>
      </table>
    `;
    
    const result = await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM_ADDRESS}>`,
      to: recipientEmail,
      subject: `Yeni İletişim Mesajı - ${formData.subject}`,
      html: htmlContent
    });
    
    return res.status(200).json({
      success: true,
      message: 'E-posta başarıyla gönderildi',
      messageId: result.messageId
    });
  } catch (error) {
    console.error('E-posta gönderimi başarısız:', error);
    return res.status(500).json({
      success: false,
      message: 'E-posta gönderiminde hata oluştu',
      error: error.message
    });
  }
}
```

3. Frontend kodunda API endpointini güncelleyin:
```typescript
const response = await fetch('/api/email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ formData, recipientEmail })
});
```

### Yeni Sürüm Deployment

Yeni kod değişikliklerini dağıtmak için:

1. Değişiklikleri main branch'e push edin
   ```bash
   git add .
   git commit -m "Değişikliklerin açıklaması"
   git push origin main
   ```

2. Vercel otomatik olarak yeni bir deployment başlatacaktır
3. Deployment durumunu Vercel Dashboard'dan izleyebilirsiniz

### Özel Domain Ayarları

Projenizi kendi alan adınızla kullanmak için:

1. Vercel Dashboard'da projenize gidin
2. "Settings" > "Domains" bölümüne gidin
3. Alan adınızı ekleyin (ör. `www.besiktaskartallaridernegi.com`)
4. Vercel'in sağladığı DNS kayıtlarını domain sağlayıcınızda yapılandırın
5. SSL sertifikasının otomatik olarak yapılandırılmasını bekleyin

## Netlify ile Deployment

Alternatif olarak, projeyi Netlify platformunda da deploy edebilirsiniz.

### Netlify Deployment Adımları

1. [Netlify](https://netlify.com)'e kaydolun ve giriş yapın
2. "New site from Git" butonuna tıklayın
3. GitHub reponuzu seçin
4. Aşağıdaki yapılandırmaları ayarlayın:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Environment variables**: Supabase ve e-posta bilgilerinizi ekleyin
5. "Deploy site" butonuna tıklayın

### Netlify Functions

Netlify'da e-posta göndermek için Netlify Functions kullanabilirsiniz:

1. Proje kök dizininde `netlify.toml` dosyası oluşturun:
```toml
[build]
  functions = "netlify/functions"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

2. `netlify/functions` klasörü oluşturun
3. `netlify/functions/email.js` dosyasını oluşturun (içerik Vercel örneğine benzer)

## Ayrı Bir Backend Sunucusu ile Deployment

E-posta gönderimi ve veritabanı işlemleri için ayrı bir Node.js sunucusu kullanmak isterseniz:

### Backend Sunucusu Kurulumu (Örn. Digital Ocean, Heroku)

1. `src/server` klasörünüzü ayrı bir repo olarak ayarlayın
2. Paket yöneticisi için `package.json` oluşturun:
```json
{
  "name": "bjk-backend",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.0.0",
    "express": "^4.18.2",
    "nodemailer": "^6.9.0"
  }
}
```

3. `.env` dosyasında e-posta ayarlarınızı yapılandırın
4. CORS ayarlarını frontend domain'inize göre ayarlayın
5. Sunucuyu tercih ettiğiniz bulut sağlayıcıya deploy edin

### Frontend ve Backend Entegrasyonu

1. Frontend `.env` dosyasında backend API URL'ini belirtin:
```
VITE_API_BASE_URL=https://api.besiktaskartallaridernegi.com
```

2. API isteklerini bu URL'e yönlendirin:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const response = await fetch(`${API_BASE_URL}/api/email/send-contact-form`, {...});
```

## Manuel Deployment

Projeyi kendi sunucunuza manuel olarak deploy etmek isterseniz:

1. Projeyi build edin
   ```bash
   npm run build
   ```

2. Oluşan `dist` klasörünü web sunucunuza aktarın (FTP, SCP vb. ile)
   ```bash
   scp -r dist/* kullanici@sunucu:/var/www/html/
   ```

3. Web sunucunuzu yapılandırın (Apache, Nginx vb.)

### Express Sunucusunu Deploy Etme

Backend API'si için Express sunucusunu ayrıca deploy etmeniz gerekecektir:

1. `src/server` klasörünü sunucunuza aktarın
2. Bağımlılıkları yükleyin
   ```bash
   npm install
   ```
3. Sunucuyu PM2 gibi bir process manager ile başlatın
   ```bash
   pm2 start index.js --name bjk-api
   ```

### Apache Yapılandırma Örneği

```apache
<VirtualHost *:80>
    ServerName besiktaskartallaridernegi.com
    ServerAlias www.besiktaskartallaridernegi.com
    DocumentRoot /var/www/html/bjk-site
    
    <Directory /var/www/html/bjk-site>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    # SPA yönlendirmesi için
    RewriteEngine On
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ /index.html [L,QSA]
    
    # Backend proxy
    ProxyPass /api http://localhost:3001/api
    ProxyPassReverse /api http://localhost:3001/api
    
    ErrorLog ${APACHE_LOG_DIR}/bjk_error.log
    CustomLog ${APACHE_LOG_DIR}/bjk_access.log combined
</VirtualHost>
```

### Nginx Yapılandırma Örneği

```nginx
server {
    listen 80;
    server_name besiktaskartallaridernegi.com www.besiktaskartallaridernegi.com;
    root /var/www/html/bjk-site;
    index index.html;
    
    # SPA yönlendirmesi için
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Backend proxy
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Statik dosyalar için önbellek
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000";
    }
    
    # Güvenlik başlıkları
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";
}
```

## Deployment Sonrası Kontroller

Deployment tamamlandıktan sonra şu kontrolleri yapın:

1. **Tüm sayfaların düzgün yüklendiğini doğrulayın**
   - Ana sayfa
   - Galeri
   - Faaliyetler
   - Admin paneli

2. **Form gönderimlerini test edin**
   - Üyelik formu
   - İletişim formu (50 karakter sınırının çalıştığını kontrol edin)
   - Admin giriş formu

3. **E-posta gönderimini test edin**
   - İletişim formundan mesaj gönderin
   - E-postanın alıcıya ulaştığını doğrulayın
   - E-posta içeriğinin doğru formatlandığını kontrol edin

4. **Meta etiketlerini kontrol edin**
   - Başlık
   - Açıklama 
   - Sosyal medya paylaşım etiketleri

5. **Performans testleri yapın**
   - [PageSpeed Insights](https://pagespeed.web.dev/)
   - [Lighthouse](https://developers.google.com/web/tools/lighthouse)

6. **Hata izleme sisteminin çalıştığını doğrulayın**
   - Console hataları (DevTools ile)
   - API hataları

## Sorun Giderme

### Yaygın Deployment Sorunları

1. **404 Hatası**
   - `.htaccess` veya Nginx yapılandırmasının SPA yönlendirmelerini doğru şekilde yapılandırdığından emin olun

2. **API Bağlantı Hataları**
   - CORS ayarlarının doğru yapılandırıldığından emin olun
   - Environment variable'ların doğru ayarlandığını kontrol edin
   - Frontend ve Backend API URL'lerinin doğru yapılandırıldığını kontrol edin
   
3. **E-posta Gönderim Sorunları**
   - SMTP sunucu bilgilerinin doğru olduğunu kontrol edin
   - Sunucu güvenlik duvarının SMTP portlarına izin verdiğinden emin olun
   - SMTP şifresinin doğru olduğunu doğrulayın
   
4. **Beyaz Ekran / Boş Sayfa**
   - JavaScript hata konsol çıktılarını kontrol edin
   - Build dosyalarının doğru konumda olduğundan emin olun
   
5. **Önbellek Sorunları**
   - Hard refresh (Ctrl+F5) deneyin
   - Service worker kayıtlıysa kayıttan çıkarın

### Deployment Geri Alma (Rollback)

Deployment sonrası kritik sorunlar oluşursa hızlı bir şekilde önceki sürüme geri dönmek için:

1. **Vercel/Netlify**: Önceki deployment'a "Rollback" yapın
2. **Manuel deployment**: Önceki build klasörünü yedeklediyseniz, yeniden yükleyin

## Bakım Modu

Büyük güncellemeler sırasında bakım modu uygulamak için:

1. Kök dizinde `maintenance.html` dosyası oluşturun
2. Sunucu yapılandırmasını geçici olarak tüm istekleri bu dosyaya yönlendirecek şekilde değiştirin

### Apache Bakım Modu Örneği

```apache
RewriteEngine On
RewriteCond %{REQUEST_URI} !/maintenance.html$
RewriteCond %{REMOTE_ADDR} !^123\.123\.123\.123$
RewriteRule ^(.*)$ /maintenance.html [R=302,L]
```

> **Not**: `123.123.123.123` IP adresini kendi IP adresinizle değiştirin, böylece siz siteye erişebilirsiniz. 