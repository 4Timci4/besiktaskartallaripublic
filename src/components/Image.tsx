import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { getImageUrl, getWebPImageUrl } from '../config/cdn';

interface ImageProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  placeholderSrc?: string;
  onClick?: () => void;
  useCdn?: boolean;
}

function Image({
  src,
  alt,
  width,
  height,
  className = '',
  placeholderSrc,
  onClick,
  useCdn = true,
}: ImageProps) {
  // CDN kullanımı etkinse ve src doğrudan URL değilse CDN URL'sini kullan
  const imageSrc = useCdn && !src.startsWith('http') && !src.startsWith('data:') && !src.startsWith('/')
    ? getImageUrl(src)
    : src;
    
  // Placeholder için CDN URL'sini kullan (eğer belirtilmişse)
  const placeholderImage = placeholderSrc && useCdn && !placeholderSrc.startsWith('http') && !placeholderSrc.startsWith('data:') && !placeholderSrc.startsWith('/')
    ? getImageUrl(placeholderSrc)
    : placeholderSrc;
    
  // WebP formatını destekleyen tarayıcılar için <picture> elementi kullan
  if (useCdn && !src.startsWith('http') && !src.startsWith('data:') && !src.startsWith('/')) {
    return (
      <picture>
        <source 
          srcSet={getWebPImageUrl(src)} 
          type="image/webp" 
        />
        <LazyLoadImage
          src={imageSrc}
          alt={alt}
          width={width}
          height={height}
          className={className}
          effect="blur"
          placeholderSrc={placeholderImage}
          onClick={onClick}
          wrapperClassName="lazy-load-image-wrapper"
          threshold={300} // 300px önce yüklemeye başla
        />
      </picture>
    );
  }
  
  // Standart görüntü için LazyLoadImage kullan
  return (
    <LazyLoadImage
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      effect="blur"
      placeholderSrc={placeholderImage}
      onClick={onClick}
      wrapperClassName="lazy-load-image-wrapper"
      threshold={300} // 300px önce yüklemeye başla
    />
  );
}

export default Image; 