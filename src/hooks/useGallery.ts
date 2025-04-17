import { useState, useEffect } from 'react';
import { GalleryItem, galleryApi } from '../utils/supabase';

export const useGallery = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadGallery = async () => {
      try {
        const data = await galleryApi.getAll();
        setItems(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    // İlk yükleme
    loadGallery();

    // Gerçek zamanlı güncellemeler için subscription
    const subscription = galleryApi.subscribeToChanges((payload) => {
      const { eventType, new: newRecord, old: oldRecord } = payload;

      setItems(current => {
        switch (eventType) {
          case 'INSERT':
            return [...current, newRecord].sort((a, b) => 
              a.display_order - b.display_order
            );
          case 'UPDATE':
            return current.map(item => 
              item.id === newRecord.id ? newRecord : item
            );
          case 'DELETE':
            return current.filter(item => item.id !== oldRecord.id);
          default:
            return current;
        }
      });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { items, loading, error };
};