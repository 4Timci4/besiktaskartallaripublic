/* eslint-env node */
/* global process */
import express from 'express';
import { sendMembershipFormEmail, sendContactFormEmail } from '../../services/emailService';
import fs from 'fs';
import path from 'path';

// Node.js process tiplerini doğrudan kullanalım
/// <reference types="node" />

const router = express.Router();

// Test route - API'nin çalıştığını kontrol etmek için
router.get('/test', (req, res) => {
  console.log('Email API test edildi');
  res.json({
    success: true,
    message: 'Email API çalışıyor',
    timestamp: new Date()
  });
});

// Form verilerini dosyaya kaydet
const saveFormDataToFile = (formData: Record<string, unknown>, fileName: string) => {
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

// Üyelik formu gönderme endpoint'i
router.post('/send-membership-form', async (req, res) => {
  try {
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
      const success = await sendMembershipFormEmail(formData, recipientEmail);

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
  } catch (error) {
    console.error('Form işleme hatası:', error);
    return res.status(500).json({
      success: false,
      message: 'Form işlenirken bir hata oluştu'
    });
  }
});

// İletişim formu gönderme endpoint'i
router.post('/send-contact-form', async (req, res) => {
  console.log('İletişim formu isteği alındı:', req.body);
  try {
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
      const success = await sendContactFormEmail(formData, recipientEmail);
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
  } catch (error) {
    console.error('İletişim formu işleme hatası:', error);
    return res.status(500).json({
      success: false,
      message: 'Form işlenirken bir hata oluştu',
      error: String(error)
    });
  }
});

export default router; 