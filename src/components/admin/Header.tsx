import { Menu } from 'lucide-react';
import UserMenu from './UserMenu';
import NotificationsDropdown from './NotificationsDropdown';

// Bildirim tipi (örnek)
interface Notification {
  id: number;
  title: string;
  time: string;
  read: boolean;
}

interface HeaderProps {
  pageTitle: string;
  userName: string | null;
  notifications: Notification[];
  onLogout: () => void;
  onOpenMobileSidebar: () => void;
}

function Header({ pageTitle, userName, notifications, onLogout, onOpenMobileSidebar }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 bg-white shadow-sm border-b border-gray-100"> {/* z-index ayarlandı */}
      {/* Mobil Menü Butonu */}
      <button
        type="button"
        className="lg:hidden px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
        onClick={onOpenMobileSidebar}
        aria-label="Kenar çubuğunu aç"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Başlık ve Sağ Alan */}
      <div className="flex-1 flex items-center justify-between px-4">
        {/* Sayfa Başlığı */}
        <h1 className="text-lg font-medium text-gray-900">
          {pageTitle}
        </h1>

        {/* Sağdaki İkonlar ve Menüler */}
        <div className="flex items-center space-x-4">
          <NotificationsDropdown notifications={notifications} />
          <UserMenu userName={userName} onLogout={onLogout} />
        </div>
      </div>
    </header>
  );
}

export default Header;
