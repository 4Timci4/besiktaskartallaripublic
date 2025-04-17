import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface LightboxProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  alt?: string;
}

const Lightbox = ({ isOpen, onClose, imageUrl, alt = 'Resim' }: LightboxProps) => {
  const [isLoading, setIsLoading] = useState(true);

  // ESC tuşu ile kapatma
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  // Lightbox açıldığında body scroll'u engelle
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-lg bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-besiktas-red border-t-transparent"></div>
              </div>
            )}
            <img
              src={imageUrl}
              alt={alt}
              className="max-h-[90vh] w-auto object-contain"
              onLoad={() => setIsLoading(false)}
            />
            <button
              onClick={onClose}
              className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70 transition-colors"
              aria-label="Kapat"
            >
              <X size={24} />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Lightbox;
