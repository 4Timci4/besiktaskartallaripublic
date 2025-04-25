import { Link, useLocation } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

// NavigationItem arayüzünü dışa aktararak AdminLayout'ta kullanabiliriz
export interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

interface SidebarNavigationProps {
  navigation: NavigationItem[];
  onLinkClick?: () => void; // Mobil kenar çubuğunu kapatmak için opsiyonel callback
}

function SidebarNavigation({ navigation, onLinkClick }: SidebarNavigationProps) {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="flex-1 px-4 space-y-1 pb-4">
      {navigation.map((item) => (
        <Link
          key={item.name}
          to={item.href}
          className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
            isActive(item.href)
              ? 'bg-black text-white shadow-md' // Aktif link stili
              : 'text-gray-700 hover:bg-gray-100 hover:text-black' // Varsayılan ve hover stili
          }`}
          onClick={onLinkClick} // Mobil menüde linke tıklanınca menüyü kapat
        >
          <item.icon
            className={`mr-3 h-5 w-5 ${
              isActive(item.href) ? 'text-white' : 'text-gray-500' // İkon rengi aktif duruma göre değişir
            }`}
            aria-hidden="true"
          />
          {item.name}
        </Link>
      ))}
    </nav>
  );
}

export default SidebarNavigation;
