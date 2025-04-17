import { format, isValid, parseISO } from 'date-fns';
import { tr } from 'date-fns/locale';

/**
 * Tarih dizesini biçimlendirir
 * @param dateString - Biçimlendirilecek tarih dizesi
 * @param formatStr - Biçimlendirme şablonu (varsayılan: 'd MMMM yyyy')
 * @returns Biçimlendirilmiş tarih dizesi
 */
export function formatDate(dateString: string, formatStr = 'd MMMM yyyy'): string {
  try {
    // Önce ISO formatında ayrıştırmayı dene
    const date = parseISO(dateString);
    
    // Geçerli bir tarih mi kontrol et
    if (isValid(date)) {
      return format(date, formatStr, { locale: tr });
    }
    
    // Doğrudan Date constructor ile dene
    const fallbackDate = new Date(dateString);
    if (isValid(fallbackDate)) {
      return format(fallbackDate, formatStr, { locale: tr });
    }
    
    // Geçerli bir tarih değilse orijinal diziyi döndür
    return dateString;
  } catch (error) {
    console.error('Tarih biçimlendirme hatası:', error);
    return dateString;
  }
}

/**
 * Tarihi yerel formatta biçimlendirir (tr-TR)
 * @param dateString - Biçimlendirilecek tarih dizesi
 * @returns Yerel formatta biçimlendirilmiş tarih dizesi
 */
export function formatLocalDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isValid(date)) {
      return date.toLocaleDateString('tr-TR');
    }
    return dateString;
  } catch (error) {
    console.error('Yerel tarih biçimlendirme hatası:', error);
    return dateString;
  }
} 