/* eslint-env node */
/* global process */
import nodemailer from 'nodemailer';

// Form veri tipi tanımlaması
export interface FormData {
  fullName: string;
  bjkId: string;
  birthDate: string;
  bloodType: string;
  birthCity: string;
  educationLevel: string;
  occupation: string;
  workplace: string;
  phone: string;
  email: string;
  residenceCity: string;
  residenceDistrict: string;
  address: string;
  kvkkConsent: boolean;
}

// İletişim formu veri tipi tanımlaması
export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

// E-posta göndermek için transporter oluştur
const createTransporter = () => {
  console.log('E-posta transporter oluşturuluyor...');
  console.log('E-posta ayarları:', {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true',
    user: process.env.EMAIL_USER ? '***' : 'tanımlanmamış',
    pass: process.env.EMAIL_PASSWORD ? '***' : 'tanımlanmamış',
  });
  
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true', // true: 465, false: diğer portlar
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      // SSL/TLS bağlantı sorunlarını gidermek için ayarlar
      rejectUnauthorized: false, // Kendi kendine imzalanmış sertifikaları kabul et
      minVersion: 'TLSv1'        // Eski TLS sürümleriyle uyumluluğu sağla
    }
  });
};

// E-posta gönder
export const sendEmail = async (options: EmailOptions): Promise<boolean> => {
  try {
    console.log('E-posta gönderiliyor:', {
      to: options.to,
      subject: options.subject,
    });
    
    const transporter = createTransporter();
    
    // Bağlantıyı test et
    console.log('SMTP sunucusu bağlantısı test ediliyor...');
    const verifyResult = await transporter.verify();
    console.log('SMTP sunucusu bağlantısı başarılı:', verifyResult);
    
    const result = await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME || 'Beşiktaş Kartalları Derneği'}" <${process.env.EMAIL_FROM_ADDRESS || 'info@besiktaskartallari.com'}>`,
      ...options,
    });
    
    console.log('E-posta gönderildi:', result.messageId);
    return true;
  } catch (error) {
    console.error('E-posta gönderimi başarısız:', error);
    return false;
  }
};

// Üyelik formu bilgilerini HTML olarak biçimlendir
export const formatMembershipData = (data: FormData): string => {
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

// Üyelik formu verileri ile e-posta gönder
export const sendMembershipFormEmail = async (data: FormData, recipientEmail: string): Promise<boolean> => {
  const htmlContent = formatMembershipData(data);
  
  return sendEmail({
    to: recipientEmail,
    subject: 'Yeni Üyelik Başvurusu - ' + data.fullName,
    html: htmlContent
  });
};

// İletişim formu bilgilerini HTML olarak biçimlendir
export const formatContactData = (data: ContactFormData): string => {
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

// İletişim formu verileri ile e-posta gönder
export const sendContactFormEmail = async (data: ContactFormData, recipientEmail: string): Promise<boolean> => {
  const htmlContent = formatContactData(data);
  
  return sendEmail({
    to: recipientEmail,
    subject: 'Yeni İletişim Mesajı - ' + data.subject,
    html: htmlContent
  });
}; 