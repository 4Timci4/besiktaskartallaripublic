import { useState, useEffect, useCallback } from 'react';
import Hero from '../components/Hero';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useData } from '../hooks/useData';
import LoadingSpinner from '../components/LoadingSpinner';

const GalleryPage = () => {
  const { galleryItems, loading, error } = useData();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = useCallback(() => {
    setSelectedImageIndex(null);
    document.body.style.overflow = 'unset';
  }, []);

  const navigateImage = useCallback((direction: 'prev' | 'next') => {
    if (selectedImageIndex === null) return;

    let newIndex;
    if (direction === 'prev') {
      newIndex = selectedImageIndex === 0 ? galleryItems.length - 1 : selectedImageIndex - 1;
    } else {
      newIndex = selectedImageIndex === galleryItems.length - 1 ? 0 : selectedImageIndex + 1;
    }
    setSelectedImageIndex(newIndex);
  }, [selectedImageIndex, galleryItems.length]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (selectedImageIndex === null) return;

    switch (e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowLeft':
        navigateImage('prev');
        break;
      case 'ArrowRight':
        navigateImage('next');
        break;
    }
  }, [selectedImageIndex, closeLightbox, navigateImage]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [handleKeyDown]);

  if (loading.gallery) {
    return <LoadingSpinner />;
  }

  if (error.gallery) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Bir hata oluştu: {error.gallery.message}</p>
      </div>
    );
  }

  return (
    <div>
      <Hero 
        title="Galeri"
        description="Beşiktaş Kartalları Derneği'nin etkinliklerinden kareler"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {galleryItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => handleImageClick(index)}
              className="relative group aspect-square focus:outline-none"
            >
              <div className="w-full h-full rounded-lg overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300 rounded-lg"></div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {selectedImageIndex !== null && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 backdrop-blur-sm"
          onClick={closeLightbox}
        >
          <div className="relative max-w-7xl mx-auto px-4 w-full h-full flex items-center justify-center">
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors focus:outline-none"
              aria-label="Kapat"
            >
              <X className="w-8 h-8" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateImage('prev');
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors focus:outline-none"
              aria-label="Önceki"
            >
              <ChevronLeft className="w-10 h-10" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateImage('next');
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors focus:outline-none"
              aria-label="Sonraki"
            >
              <ChevronRight className="w-10 h-10" />
            </button>

            {selectedImageIndex !== null && (
              <img
                src={galleryItems[selectedImageIndex].image}
                alt={galleryItems[selectedImageIndex].title}
                className="max-w-full max-h-[90vh] object-contain"
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;