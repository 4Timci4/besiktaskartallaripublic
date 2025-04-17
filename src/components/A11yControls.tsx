import { useState } from 'react';
import { useA11y } from '../contexts/A11yContexts';
import { Settings, X } from 'lucide-react';

const A11yControls = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { preferences, setFontSize, toggleHighContrast, toggleReducedMotion, resetPreferences } = useA11y();

  return (
    <div className="a11y-controls-container">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="a11y-toggle-button bg-black text-white p-3 rounded-full shadow-lg"
          aria-label="Erişilebilirlik ayarlarını aç"
        >
          <Settings size={24} />
        </button>
      ) : (
        <div className="a11y-controls">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">Erişilebilirlik</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Erişilebilirlik ayarlarını kapat"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium mb-2">Yazı Boyutu</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setFontSize('normal')}
                  className={`px-3 py-1 text-sm rounded-md border ${
                    preferences.fontSize === 'normal'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white border-gray-300'
                  }`}
                >
                  Normal
                </button>
                <button
                  onClick={() => setFontSize('large')}
                  className={`px-3 py-1 text-sm rounded-md border ${
                    preferences.fontSize === 'large'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white border-gray-300'
                  }`}
                >
                  Büyük
                </button>
                <button
                  onClick={() => setFontSize('larger')}
                  className={`px-3 py-1 text-sm rounded-md border ${
                    preferences.fontSize === 'larger'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white border-gray-300'
                  }`}
                >
                  Daha Büyük
                </button>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-2">Görüntü</p>
              <div className="flex gap-2">
                <button
                  onClick={toggleHighContrast}
                  className={`px-3 py-1 text-sm rounded-md border ${
                    preferences.highContrast
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white border-gray-300'
                  }`}
                >
                  Yüksek Kontrast {preferences.highContrast ? '✓' : ''}
                </button>
                <button
                  onClick={toggleReducedMotion}
                  className={`px-3 py-1 text-sm rounded-md border ${
                    preferences.reducedMotion
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white border-gray-300'
                  }`}
                >
                  Hareketi Azalt {preferences.reducedMotion ? '✓' : ''}
                </button>
              </div>
            </div>
            
            <div className="pt-2">
              <button
                onClick={resetPreferences}
                className="w-full text-sm px-3 py-2 border border-gray-300 rounded-md bg-gray-100 hover:bg-gray-200"
              >
                Varsayılanlara Sıfırla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default A11yControls; 