// Sadece ana hero görselini import et
import heroImage from '../assets/images/hero.jpg';

interface HeroProps {
  title: string;
  description?: string; // Opsiyonel hale getirildi, ancak kullanılmayacak
}

const Hero = ({ title }: HeroProps) => {
  // Tüm sayfalar için aynı arka plan görselini kullan
  const getBackgroundImage = () => {
    return heroImage;
  };

  // Hero alanını tam ekranı kaplayacak şekilde ayarla
  const heroHeight = "h-screen"; // Ekranın tam yüksekliği

  return (
    <div className={`relative ${heroHeight} w-full bg-black`}>
      {/* Background Image */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-no-repeat"
        style={{
          backgroundImage: `url(${getBackgroundImage()})`,
          backgroundPosition: 'center 0%', // Fotoğrafı biraz aşağı kaydır
          backgroundSize: '110%' // Fotoğrafı büyüt
        }}
      />

      {/* Gradient Overlay */}
      <div 
        className="absolute inset-0 w-full h-full bg-gradient-to-b from-black/70 to-transparent"
      />

      {/* Content */}
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center transform -translate-y-20">
        <div className="text-center">
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold text-white animate-fade-in font-['BlackCloudsWhiteSky'] font-heading">
            {title}
          </h1>
          {/* Açıklama metni kaldırıldı */}
        </div>
      </div>
    </div>
  );
};

export default Hero;
