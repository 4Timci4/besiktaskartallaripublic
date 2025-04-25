import { useState, useEffect, useRef } from 'react';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';

interface UserMenuProps {
  userName: string | null;
  userEmail?: string; // Opsiyonel olarak e-posta gösterilebilir
  onLogout: () => void;
}

function UserMenu({ userName, userEmail = 'admin@bjk.com.tr', onLogout }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Dışarı tıklamayı algıla
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuRef]);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="relative user-menu-container" ref={menuRef}>
      <button
        className="flex items-center text-sm rounded-full focus:outline-none"
        onClick={toggleMenu}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="flex items-center space-x-2 bg-gray-50 hover:bg-gray-100 transition-colors px-3 py-2 rounded-lg">
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
            <User className="h-5 w-5 text-gray-600" />
          </div>
          <span className="hidden md:block text-sm font-medium text-gray-700 truncate max-w-[100px]">
            {userName || 'Admin'}
          </span>
          <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Dropdown Menüsü */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-20 border border-gray-100" // z-index artırıldı
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="user-menu-button"
        >
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900 truncate" role="none">
              {userName || 'Admin Kullanıcı'}
            </p>
            <p className="text-xs text-gray-500 truncate" role="none">{userEmail}</p>
          </div>
          <div className="py-1" role="none">
            <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left" role="menuitem">
              <User className="mr-3 h-4 w-4 text-gray-500" />
              Profil
            </button>
            <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left" role="menuitem">
              <Settings className="mr-3 h-4 w-4 text-gray-500" />
              Ayarlar
            </button>
          </div>
          <div className="py-1 border-t border-gray-100" role="none">
            <button
              onClick={onLogout}
              className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
              role="menuitem"
            >
              <LogOut className="mr-3 h-4 w-4 text-red-500" />
              Çıkış Yap
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserMenu;
