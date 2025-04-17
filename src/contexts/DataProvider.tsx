import React, { ReactNode, useState, useEffect } from 'react';
import { Activity, GalleryItem, activitiesApi, galleryApi } from '../utils/supabase';
import { DataContext, DataContextType } from './DataContext';

// DataProvider bileşenini oluştur
interface DataProviderProps {
  children: ReactNode;
}

export function DataProvider({ children }: DataProviderProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState({
    activities: false,
    gallery: false
  });
  const [error, setError] = useState({
    activities: null as Error | null,
    gallery: null as Error | null
  });

  // Aktiviteleri yenile
  const refreshActivities = async () => {
    setLoading(prev => ({ ...prev, activities: true }));
    setError(prev => ({ ...prev, activities: null }));
    
    try {
      const data = await activitiesApi.getAll();
      setActivities(data);
    } catch (err) {
      setError(prev => ({ ...prev, activities: err as Error }));
    } finally {
      setLoading(prev => ({ ...prev, activities: false }));
    }
  };

  // Galeri öğelerini yenile
  const refreshGallery = async () => {
    setLoading(prev => ({ ...prev, gallery: true }));
    setError(prev => ({ ...prev, gallery: null }));
    
    try {
      const data = await galleryApi.getAll();
      setGalleryItems(data);
    } catch (err) {
      setError(prev => ({ ...prev, gallery: err as Error }));
    } finally {
      setLoading(prev => ({ ...prev, gallery: false }));
    }
  };

  // İlk yükleme
  useEffect(() => {
    refreshActivities();
    refreshGallery();
  }, []);

  const value: DataContextType = {
    activities,
    galleryItems,
    loading,
    error,
    refreshActivities,
    refreshGallery
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
} 