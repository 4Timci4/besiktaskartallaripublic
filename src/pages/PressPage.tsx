import Hero from '../components/Hero';
import { useEffect, useState } from 'react';
import { pressApi, Press } from '../utils/supabase';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { FileText, CalendarDays } from 'lucide-react';
import Lightbox from '../components/Lightbox';

const PressPage = () => {
  const [pressItems, setPressItems] = useState<Press[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState({ url: '', alt: '' });

  useEffect(() => {
    const fetchPressItems = async () => {
      try {
        setLoading(true);
        const data = await pressApi.getAll();
        setPressItems(data);
      } catch (err) {
        console.error('Basın haberleri yüklenirken hata oluştu:', err);
        setError('Basın haberleri yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      } finally {
        setLoading(false);
      }
    };

    fetchPressItems();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'd MMMM yyyy', { locale: tr });
    } catch (e) {
      console.error('Tarih biçimlendirme hatası:', e);
      return dateString;
    }
  };
  
  // PDF URL'ini kontrol et
  const isPdfUrl = (url: string): boolean => {
    return url.toLowerCase().endsWith('.pdf') || 
           url.includes('storage.googleapis.com') || 
           url.includes('supabase.co');
  };
  
  // Resim URL'ini kontrol et (PDF olmayan URL'ler resim olarak kabul edilir)
  const isImageUrl = (url: string): boolean => {
    return !isPdfUrl(url) && (
      url.toLowerCase().endsWith('.jpg') || 
      url.toLowerCase().endsWith('.jpeg') || 
      url.toLowerCase().endsWith('.png') || 
      url.toLowerCase().endsWith('.gif') || 
      url.toLowerCase().endsWith('.webp') ||
      url.includes('images')
    );
  };
  
  // Karta tıklandığında
  const handleCardClick = (item: Press) => {
    // Önce link varsa ona git
    if (item.link) {
      window.open(item.link, '_blank');
      return;
    }
    
    // Link yoksa ve kaynak bir PDF ise, PDF'i aç
    if (isPdfUrl(item.source)) {
      window.open(item.source, '_blank');
      return;
    }
    
    // Kaynak bir resim dosyası ise, lightbox ile aç
    if (isImageUrl(item.source)) {
      setCurrentImage({ url: item.source, alt: item.title });
      setIsLightboxOpen(true);
      return;
    }
    
    // Diğer durumlarda kart resmi lightbox ile aç
    setCurrentImage({ url: item.image, alt: item.title });
    setIsLightboxOpen(true);
  };
  
  // Lightbox'ı kapat
  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  return (
    <div>
      <Lightbox 
        isOpen={isLightboxOpen} 
        onClose={closeLightbox} 
        imageUrl={currentImage.url} 
        alt={currentImage.alt} 
      />
      <Hero 
        title="Basında Biz" 
        description="Derneğimizin basında yer alan haberleri" 
      />

      <section className="py-24 bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center min-h-[300px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-600">{error}</div>
          ) : pressItems.length === 0 ? (
            <div className="text-center text-black">Henüz basın haberi bulunmamaktadır.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pressItems.map((item) => (
                <div 
                  key={item.id} 
                  className="group bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-500 ease-in-out hover:shadow-2xl hover:-translate-y-2 cursor-pointer"
                  onClick={() => handleCardClick(item)}
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <div className="relative h-52 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className={`w-full h-full object-contain object-center transition-transform duration-700 ease-in-out ${hoveredId === item.id ? 'scale-110' : 'scale-100'}`}
                      loading="lazy"
                      onClick={(e) => {
                        e.stopPropagation(); // Kart tıklamasını engelle
                        setCurrentImage({ url: item.image, alt: item.title });
                        setIsLightboxOpen(true);
                      }}
                      onError={(e) => {
                        // Resim yüklenemezse logo resmini göster
                        const target = e.target as HTMLImageElement;
                        target.onerror = null; // Sonsuz döngüyü önle
                        target.src = '../assets/images/logo.png';
                      }}
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                    <div className={`absolute bottom-0 left-0 w-full p-4 transform ${hoveredId === item.id ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'} transition-all duration-300 ease-in-out`}>
                      <span className="inline-block bg-besiktas-red text-white text-sm px-3 py-1 rounded-full">
                        {formatDate(item.date)}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-3 group-hover:text-besiktas-red transition-colors duration-300">{item.title}</h3>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-black">
                        <CalendarDays className="w-4 h-4 mr-2 text-besiktas-red" />
                        <span className="text-sm">
                          {formatDate(item.date)}
                        </span>
                      </div>
                      <div className="flex items-center text-black">
                        {item.source && item.source.includes('supabase.co') ? (
                          <span className="text-sm">Haberi görüntülemek için tıklayın.</span>
                        ) : (
                          <span className="text-sm">{item.source}</span>
                        )}
                      </div>
                    </div>
                    <p className="text-black mb-4 line-clamp-3">{item.summary}</p>
                    <div className="mt-4 h-0 overflow-hidden group-hover:h-8 transition-all duration-300">
                      <a 
                        href={item.link || item.source} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-besiktas-red hover:text-red-700 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Haberi görüntülemek için tıklayın <span className="ml-1">→</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default PressPage;
