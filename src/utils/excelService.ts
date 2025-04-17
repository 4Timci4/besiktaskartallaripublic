import * as XLSX from 'xlsx';
import { MembershipApplication } from './supabase';

/**
 * Üyelik başvurularını Excel dosyasına dönüştürür
 * @param applications Üyelik başvuruları listesi
 * @param fileName Oluşturulacak dosyanın adı (varsayılan: uyelik-basvurulari.xlsx)
 */
export const exportMembershipApplicationsToExcel = (
  applications: MembershipApplication[],
  fileName: string = 'uyelik-basvurulari.xlsx'
): void => {
  // Durum metni
  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Beklemede';
      case 'approved':
        return 'Onaylandı';
      case 'rejected':
        return 'Reddedildi';
      default:
        return status;
    }
  };

  // Tarih formatı
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('tr-TR');
    } catch (error) {
      return dateString;
    }
  };

  // Excel için veri hazırlama
  const data = applications.map(app => ({
    'Ad Soyad': app.full_name,
    'BJK Sicil No': app.bjk_id,
    'Doğum Tarihi': app.birth_date,
    'Kan Grubu': app.blood_type,
    'Doğum Yeri': app.birth_city,
    'Eğitim Seviyesi': app.education_level,
    'Mezun Olunan Okul': app.graduated_school || '',
    'Meslek': app.occupation,
    'Çalıştığı Kurum': app.workplace,
    'Ünvan': app.title || '',
    'E-posta': app.email,
    'Telefon': app.phone,
    'İkamet İli': app.residence_city,
    'İkamet İlçesi': app.residence_district,
    'KVKK Onayı': app.kvkk_consent ? 'Evet' : 'Hayır',
    'Durum': getStatusText(app.status),
    'Başvuru Tarihi': formatDate(app.created_at),
    'Son Güncelleme': formatDate(app.updated_at)
  }));

  // Excel çalışma kitabı oluşturma
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Üyelik Başvuruları');

  // Sütun genişliklerini ayarlama
  const maxWidth = Object.keys(data[0] || {}).reduce<Record<string, number>>((acc, key) => {
    return { ...acc, [key]: Math.max(key.length, 15) };
  }, {});

  worksheet['!cols'] = Object.keys(maxWidth).map(key => ({ wch: maxWidth[key] }));

  // Excel dosyasını indirme
  XLSX.writeFile(workbook, fileName);
};

/**
 * İletişim mesajlarını Excel dosyasına dönüştürür
 * @param messages İletişim mesajları listesi
 * @param fileName Oluşturulacak dosyanın adı (varsayılan: iletisim-mesajlari.xlsx)
 */
export const exportContactMessagesToExcel = (
  messages: any[],
  fileName: string = 'iletisim-mesajlari.xlsx'
): void => {
  // Tarih formatı
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('tr-TR');
    } catch (error) {
      return dateString;
    }
  };

  // Excel için veri hazırlama
  const data = messages.map(msg => ({
    'Ad Soyad': msg.name,
    'E-posta': msg.email,
    'Telefon': msg.phone,
    'Konu': msg.subject,
    'Mesaj': msg.message,
    'Okundu': msg.is_read ? 'Evet' : 'Hayır',
    'Tarih': formatDate(msg.created_at)
  }));

  // Excel çalışma kitabı oluşturma
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'İletişim Mesajları');

  // Sütun genişliklerini ayarlama
  const maxWidth = Object.keys(data[0] || {}).reduce<Record<string, number>>((acc, key) => {
    return { ...acc, [key]: Math.max(key.length, 15) };
  }, {});

  worksheet['!cols'] = Object.keys(maxWidth).map(key => ({ wch: maxWidth[key] }));

  // Excel dosyasını indirme
  XLSX.writeFile(workbook, fileName);
};
