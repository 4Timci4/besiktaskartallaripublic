const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Form verilerini dosyaya kaydet
const saveFormDataToFile = (formData, fileName) => {
  try {
    const formDataDir = path.join(process.cwd(), 'form-data');
    
    // form-data klasörü yoksa oluştur
    if (!fs.existsSync(formDataDir)) {
      fs.mkdirSync(formDataDir, { recursive: true });
    }
    
    // Form verilerini JSON olarak kaydet
    const filePath = path.join(formDataDir, `${fileName}-${Date.now()}.json`);
    fs.writeFileSync(filePath, JSON.stringify(formData, null, 2));
    console.log(`Form verileri dosyaya kaydedildi: ${filePath}`);
    
    return true;
  } catch (error) {
    console.error('Form verileri kaydedilemedi:', error);
    return false;
  }
};

// İki farklı transporter oluşturulacak
const createMainTransporter = () => {
  console.log('Ana e-posta transporter oluşturuluyor...');
  
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'mail.kurumsaleposta.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER || 'info@besiktaskartallari.com', 
      pass: process.env.EMAIL_PASSWORD || 'K@Rtallar903',
    },
    tls: {
      rejectUnauthorized: false,
      minVersion: 'TLSv1'
    },
    debug: true,
    logger: true
  });
};

// Yedek olarak Gmail transporter oluştur
const createBackupTransporter = () => {
  console.log('Yedek e-posta transporter (Gmail) oluşturuluyor...');
  
  // Gmail için transporter (yedek olarak)
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'your-gmail@gmail.com', // Gerçek bir Gmail hesabı ekleyin
      pass: 'your-gmail-app-password', // Gmail uygulama şifresi
    }
  });
};

// Ana transporter yerine kullan
const createTransporter = createMainTransporter;

// E-posta gönderme denemeleri
const sendEmail = async (options) => {
  try {
    console.log('E-posta gönderiliyor:', {
      to: options.to,
      subject: options.subject,
    });
    
    // İlk olarak ana transporter ile deneyin
    const transporter = createTransporter();
    
    try {
      // Bağlantıyı test et
      console.log('SMTP sunucusu bağlantısı test ediliyor...');
      await transporter.verify();
      
      // Gönderen e-posta bilgilerini belirle
      const fromName = process.env.EMAIL_FROM_NAME || 'Beşiktaş Kartalları Derneği';
      const fromEmail = process.env.EMAIL_FROM_ADDRESS || 'info@besiktaskartallari.com';
      const from = `"${fromName}" <${fromEmail}>`;
      
      // E-posta mesajını oluştur ve gönder
      const result = await transporter.sendMail({
        from: from,
        ...options,
      });
      
      console.log('E-posta gönderildi:', result.messageId);
      return true;
    } catch (primaryError) {
      console.error('Ana e-posta servisi ile gönderim başarısız:', primaryError);
      
      // Ana transporter başarısız olursa, yedek transporter dene
      console.log('Yedek e-posta servisi ile deneniyor...');
      
      /*
      // Yedek göndericiyi aktifleştirmek için yorum satırlarını kaldırın
      try {
        const backupTransporter = createBackupTransporter();
        
        const result = await backupTransporter.sendMail({
          from: 'your-gmail@gmail.com',
          ...options,
        });
        
        console.log('E-posta yedek servis ile gönderildi:', result.messageId);
        return true;
      } catch (backupError) {
        console.error('Yedek e-posta servisi ile de başarısız:', backupError);
        throw backupError;
      }
      */
      
      throw primaryError;
    }
  } catch (error) {
    console.error('E-posta gönderimi başarısız:', error);
    return false;
  }
};

// Üyelik formu bilgilerini HTML olarak biçimlendir
const formatMembershipData = (data) => {
  return `
    <h2>Yeni Üyelik Başvurusu</h2>
    <table style="border-collapse: collapse; width: 100%;">
      <tr>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">Bilgi</th>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">Değer</th>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">Ad Soyad</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${data.fullName}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">BJK Sicil No</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${data.bjkId}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">Doğum Tarihi</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${data.birthDate}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">Kan Grubu</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${data.bloodType}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">Doğum Yeri</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${data.birthCity}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">Eğitim Seviyesi</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${data.educationLevel}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">Meslek</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${data.occupation}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">Çalıştığı Kurum</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${data.workplace}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">Telefon</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${data.phone}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">E-posta</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${data.email}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">İkamet İli</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${data.residenceCity}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">İkamet İlçesi</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${data.residenceDistrict}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">Adres</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${data.address}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">KVKK Onayı</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${data.kvkkConsent ? 'Evet' : 'Hayır'}</td>
      </tr>
    </table>
  `;
};

// İletişim formu bilgilerini HTML olarak biçimlendir
const formatContactData = (data) => {
  return `
    <h2>Yeni İletişim Mesajı</h2>
    <table style="border-collapse: collapse; width: 100%;">
      <tr>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">Bilgi</th>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f2f2f2;">Değer</th>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">Ad Soyad</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${data.name}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">E-posta</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${data.email}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">Telefon</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${data.phone}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">Konu</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${data.subject}</td>
      </tr>
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">Mesaj</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${data.message.replace(/\n/g, '<br>')}</td>
      </tr>
    </table>
  `;
};

// API endpoint işleyicisi
module.exports = async (req, res) => {
  // CORS ayarları - tüm domainlere izin ver
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization,Accept');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // OPTIONS isteği için hızlı yanıt
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  console.log('API isteği alındı:', req.url, req.method);
  console.log('İstek başlıkları:', req.headers);

  // Sadece POST isteklerine izin ver
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const requestPath = req.url.split('/').pop();
    console.log('İstek yolu:', requestPath);
    console.log('İstek gövdesi:', req.body);

    // Üyelik formu işleme
    if (requestPath === 'send-membership-form') {
      const { formData, recipientEmail } = req.body;

      if (!formData || !recipientEmail) {
        return res.status(400).json({
          success: false,
          message: 'Form verileri veya alıcı e-posta adresi eksik'
        });
      }

      // Önce dosyaya kaydet (yedek çözüm)
      const saved = saveFormDataToFile(formData, 'membership-form');
      
      if (saved) {
        console.log('Form verisi başarıyla dosyaya kaydedildi.');
      }

      // E-posta göndermeyi dene
      try {
        const htmlContent = formatMembershipData(formData);
        const success = await sendEmail({
          to: recipientEmail,
          subject: 'Yeni Üyelik Başvurusu - ' + formData.fullName,
          html: htmlContent
        });

        if (success) {
          return res.status(200).json({
            success: true,
            message: 'E-posta başarıyla gönderildi'
          });
        } else {
          // E-posta gönderilemedi ama form kaydedildi
          return res.status(200).json({
            success: true,
            message: 'Form verileri kaydedildi fakat e-posta gönderilemedi, site yöneticisiyle iletişime geçin.'
          });
        }
      } catch (emailError) {
        console.error('E-posta gönderimi hatası:', emailError);
        
        // E-posta gönderilemedi ama form kaydedildi
        if (saved) {
          return res.status(200).json({
            success: true,
            message: 'Form verileri kaydedildi fakat e-posta gönderilemedi, site yöneticisiyle iletişime geçin.'
          });
        } else {
          throw emailError; // Hem e-posta gönderilemedi hem de kaydedilemedi
        }
      }
    } 
    // İletişim formu işleme
    else if (requestPath === 'send-contact-form') {
      console.log('İletişim formu isteği alındı:', req.body);
      
      const { formData, recipientEmail } = req.body;

      if (!formData || !recipientEmail) {
        console.error('Eksik form verileri:', { formData, recipientEmail });
        return res.status(400).json({
          success: false,
          message: 'Form verileri veya alıcı e-posta adresi eksik'
        });
      }

      console.log('İletişim formu verileri:', formData);
      console.log('Alıcı e-posta:', recipientEmail);

      // Önce dosyaya kaydet (yedek çözüm)
      const saved = saveFormDataToFile(formData, 'contact-form');
      
      if (saved) {
        console.log('İletişim formu verisi başarıyla dosyaya kaydedildi.');
      }

      // E-posta göndermeyi dene
      try {
        const htmlContent = formatContactData(formData);
        const success = await sendEmail({
          to: recipientEmail,
          subject: 'Yeni İletişim Mesajı - ' + formData.subject,
          html: htmlContent
        });
        
        console.log('E-posta gönderim sonucu:', success);

        if (success) {
          return res.status(200).json({
            success: true,
            message: 'E-posta başarıyla gönderildi'
          });
        } else {
          // E-posta gönderilemedi ama form kaydedildi
          return res.status(200).json({
            success: false,
            message: 'Form verileri kaydedildi fakat e-posta gönderilemedi, site yöneticisiyle iletişime geçin.'
          });
        }
      } catch (emailError) {
        console.error('E-posta gönderimi hatası:', emailError);
        
        // E-posta gönderilemedi ama form kaydedildi
        if (saved) {
          return res.status(200).json({
            success: false,
            message: 'Form verileri kaydedildi fakat e-posta gönderilemedi, site yöneticisiyle iletişime geçin.',
            error: String(emailError)
          });
        } else {
          throw emailError; // Hem e-posta gönderilemedi hem de kaydedilemedi
        }
      }
    } else {
      return res.status(404).json({ error: 'Endpoint not found' });
    }
  } catch (error) {
    console.error('API hatası:', error);
    return res.status(500).json({
      success: false,
      message: 'İşlem sırasında bir hata oluştu',
      error: String(error)
    });
  }
}; 