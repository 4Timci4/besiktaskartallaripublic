/**
 * Bu script placeholders klasörüne gerekli görsel placeholder'ları oluşturur.
 * Gerçek görüntüler hazır olduğunda bu placeholder'ları kaldırıp yerlerine gerçek
 * görselleri koyabilirsiniz.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ES Module'de __dirname eşdeğeri oluştur
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Placeholder görseller için gerekli dizin
const imagesDir = path.join(__dirname, '../assets/images');

// Eğer klasör yoksa oluştur
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
  console.log('✅ Images klasörü oluşturuldu.');
}

// SVG Oluşturucu Fonksiyon
function createSvgPlaceholder(width, height, text, bgColor = '#1A1A1A', textColor = '#FFFFFF') {
  return `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="${bgColor}" />
  <text x="50%" y="50%" font-family="Arial" font-size="${Math.floor(width/10)}px" fill="${textColor}" text-anchor="middle" dominant-baseline="middle">${text}</text>
</svg>
`;
}

// Oluşturulacak görseller
const placeholders = [
  { filename: 'logo.png', width: 200, height: 200, text: 'BJK Logo', bgColor: '#000000', textColor: '#FFFFFF' },
  { filename: 'favicon.png', width: 32, height: 32, text: 'BJK', bgColor: '#000000', textColor: '#FFFFFF' },
  { filename: 'hero.jpg', width: 1920, height: 600, text: 'Ana Sayfa Hero', bgColor: '#2a2a2a', textColor: '#FFFFFF' },
  { filename: 'hero-about.jpg', width: 1920, height: 600, text: 'Hakkımızda Hero', bgColor: '#2a2a2a', textColor: '#FFFFFF' },
  { filename: 'hero-activities.jpg', width: 1920, height: 600, text: 'Faaliyetler Hero', bgColor: '#2a2a2a', textColor: '#FFFFFF' },
  { filename: 'hero-gallery.jpg', width: 1920, height: 600, text: 'Galeri Hero', bgColor: '#2a2a2a', textColor: '#FFFFFF' },
];

// Her bir placeholder'ı oluştur
placeholders.forEach(({ filename, width, height, text, bgColor, textColor }) => {
  const filePath = path.join(imagesDir, filename);
  const svg = createSvgPlaceholder(width, height, text, bgColor, textColor);
  
  fs.writeFileSync(filePath, svg);
  console.log(`✅ ${filename} oluşturuldu.`);
});

console.log('✅ Tüm placeholder görseller başarıyla oluşturuldu.');
console.log('📝 Not: Gerçek görseller hazır olduğunda bu placeholder\'ları değiştirmeyi unutmayın.'); 