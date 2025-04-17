import { ReactNode, useState, useEffect } from 'react';
import { A11yPreferences } from '../types/a11y';
import { A11yContext } from '../contexts/A11yContexts';

// Varsayılan erişilebilirlik tercihleri
const defaultPreferences: A11yPreferences = {
  fontSize: 'normal',
  highContrast: false,
  reducedMotion: false
};

// Yerel depolamadan tercihleri al
function getStoredPreferences(): A11yPreferences {
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

export function A11yProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<A11yPreferences>(getStoredPreferences);

  // Tercihleri sakla
  useEffect(() => {
    try {
      localStorage.setItem('a11y-preferences', JSON.stringify(preferences));
    } catch (error) {
      console.error('A11y tercihleri kaydedilemedi:', error);
    }
    
    // CSS sınıflarını uygula
    const { fontSize, highContrast, reducedMotion } = preferences;
    const htmlElement = document.documentElement;
    
    // Font size
    htmlElement.classList.remove('font-size-normal', 'font-size-large', 'font-size-larger');
    htmlElement.classList.add(`font-size-${fontSize}`);
    
    // High contrast
    if (highContrast) {
      htmlElement.classList.add('high-contrast');
    } else {
      htmlElement.classList.remove('high-contrast');
    }
    
    // Reduced motion
    if (reducedMotion) {
      htmlElement.classList.add('reduced-motion');
    } else {
      htmlElement.classList.remove('reduced-motion');
    }
    
    // Kullanıcı tercihlerinden CSS özelliklerini ayarla
    if (reducedMotion) {
      document.body.style.setProperty('--preferred-motion', 'no-preference');
    } else {
      document.body.style.setProperty('--preferred-motion', 'reduce');
    }
    
  }, [preferences]);

  // Font boyutunu ayarla
  const setFontSize = (size: 'normal' | 'large' | 'larger') => {
    setPreferences(prev => ({ ...prev, fontSize: size }));
  };

  // Yüksek kontrast modunu aç/kapa
  const toggleHighContrast = () => {
    setPreferences(prev => ({ ...prev, highContrast: !prev.highContrast }));
  };

  // Hareketi azalt/artır
  const toggleReducedMotion = () => {
    setPreferences(prev => ({ ...prev, reducedMotion: !prev.reducedMotion }));
  };

  // Tüm tercihleri sıfırla
  const resetPreferences = () => {
    setPreferences(defaultPreferences);
  };

  return (
    <A11yContext.Provider
      value={{
        preferences,
        setFontSize,
        toggleHighContrast,
        toggleReducedMotion,
        resetPreferences,
      }}
    >
      {children}
    </A11yContext.Provider>
  );
}

export default A11yProvider; 