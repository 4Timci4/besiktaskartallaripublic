import { createContext } from 'react';
import { Activity, GalleryItem } from '../utils/supabase';

export interface DataContextType {
  activities: Activity[];
  galleryItems: GalleryItem[];
  loading: {
    activities: boolean;
    gallery: boolean;
  };
  error: {
    activities: Error | null;
    gallery: Error | null;
  };
  refreshActivities: () => Promise<void>;
  refreshGallery: () => Promise<void>;
}

// Context'i oluştur ve dışa aktar
export const DataContext = createContext<DataContextType | undefined>(undefined);