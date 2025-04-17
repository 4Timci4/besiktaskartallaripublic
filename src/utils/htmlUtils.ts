/**
 * HTML içeriğinden etiketleri temizleyerek düz metin elde eder
 * @param html HTML içeriği
 * @returns Temizlenmiş düz metin
 */
export function stripHtml(html: string): string {
  if (!html) return '';
  
  // Geçici bir div oluştur
  const tempDiv = document.createElement('div');
  // HTML içeriğini div'e ekle
  tempDiv.innerHTML = html;
  // Div'in metin içeriğini al (bu, tüm HTML etiketlerini kaldırır)
  return tempDiv.textContent || tempDiv.innerText || '';
}

/**
 * HTML içeriğini belirli bir karakter sayısına kadar keser ve özet oluşturur
 * @param html HTML içeriği
 * @param maxLength Maksimum karakter sayısı
 * @returns Özet metin
 */
export function truncateHtml(html: string, maxLength: number = 150): string {
  if (!html) return '';
  
  const plainText = stripHtml(html);
  
  if (plainText.length <= maxLength) {
    return plainText;
  }
  
  return plainText.substring(0, maxLength) + '...';
}
