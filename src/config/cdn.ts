/**
 * CDN Yapılandırması
 * 
 * Bu dosya, medya içeriklerinin CDN üzerinden sunulması için gerekli yapılandırmayı içerir.
 * Üretim ortamında CDN_URL değişkeni kullanılır, geliştirme ortamında ise yerel dosyalar kullanılır.
 */

// CDN URL'si (üretim ortamında kullanılacak)
// Not: Gerçek bir CDN kullanılmadığında bu değer boş bırakılabilir
const CDN_URL = import.meta.env.VITE_CDN_URL || '';

// Ortam kontrolü
const isDevelopment = import.meta.env.DEV;

/**
 * Bir varlık için URL oluşturur
 * @param path Varlık yolu (örn: "images/logo.png")
 * @returns Tam URL
 */
export function getAssetUrl(path: string): string {
  // Geliştirme ortamında yerel dosyaları kullan
  if (isDevelopment || !CDN_URL) {
    return `/src/assets/${path}`;
  }
  
  // Üretim ortamında CDN URL'sini kullan
  return `${CDN_URL}/assets/${path}`;
}

/**
 * Bir resim için URL oluşturur
 * @param imageName Resim adı (örn: "logo.png")
 * @returns Tam URL
 */
export function getImageUrl(imageName: string): string {
  return getAssetUrl(`images/${imageName}`);
}

/**
 * Bir resim için WebP formatında URL oluşturur (eğer mevcutsa)
 * @param imageName Resim adı (örn: "logo.png")
 * @returns WebP formatında tam URL
 */
export function getWebPImageUrl(imageName: string): string {
  // Dosya uzantısını değiştir
  const baseName = imageName.substring(0, imageName.lastIndexOf('.'));
  return getAssetUrl(`images/${baseName}.webp`);
}

export default {
  getAssetUrl,
  getImageUrl,
  getWebPImageUrl
}; 