// Erişilebilirlik tercihleri
export interface A11yPreferences {
  fontSize: 'normal' | 'large' | 'larger'; // Font boyutu
  highContrast: boolean; // Yüksek kontrast modu
  reducedMotion: boolean; // Azaltılmış hareket
}

// Erişilebilirlik context değeri
export interface A11yContextValue {
  preferences: A11yPreferences;
  setFontSize: (size: 'normal' | 'large' | 'larger') => void;
  toggleHighContrast: () => void;
  toggleReducedMotion: () => void;
  resetPreferences: () => void;
} 