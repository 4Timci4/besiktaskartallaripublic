import React from 'react';

interface ImagePlaceholderProps {
  width: number;
  height: number;
  text: string;
  bgColor?: string;
  textColor?: string;
}

/**
 * Görsel yerleştirilene kadar kullanılacak geçici placeholder bileşen
 */
const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({
  width,
  height,
  text,
  bgColor = '#1A1A1A',
  textColor = '#FFFFFF'
}) => {
  // SVG görseli oluştur
  const svgContent = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${width}" height="${height}" fill="${bgColor}" />
      <text x="50%" y="50%" font-family="Arial" font-size="14" fill="${textColor}" text-anchor="middle" dominant-baseline="middle">${text}</text>
    </svg>
  `;

  // SVG içeriğini data URL'e dönüştür
  const dataUrl = `data:image/svg+xml;base64,${btoa(svgContent)}`;

  return <img src={dataUrl} alt={text} style={{ width, height }} />;
};

export default ImagePlaceholder; 