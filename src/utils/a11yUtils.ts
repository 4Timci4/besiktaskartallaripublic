import { A11yPreferences } from '../types/a11y';

// Varsayılan erişilebilirlik tercihleri
export const defaultPreferences: A11yPreferences = {
  fontSize: 'normal',
  highContrast: false,
  reducedMotion: false
};

// Yerel depolamadan tercihleri al
export function getStoredPreferences(): A11yPreferences {
  try {
    const storedPrefs = localStorage.getItem('a11y-preferences');
    if (storedPrefs) {
      return JSON.parse(storedPrefs) as A11yPreferences;
    }
  } catch (error) {
    console.error('Erişilebilirlik tercihleri alınamadı:', error);
  }
  return defaultPreferences;
} 