import { X, Shield } from 'lucide-react';
import SidebarNavigation, { NavigationItem } from './SidebarNavigation';
// import SidebarSearch from './SidebarSearch'; // Removed import
import SidebarUserProfile from './SidebarUserProfile';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  navigation: NavigationItem[];
  userName: string | null;
  onLogout: () => void;
}

function MobileSidebar({ isOpen, onClose, navigation, userName, onLogout }: MobileSidebarProps) {
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-80 z-50 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="h-20 flex items-center justify-between px-6 border-b border-gray-100 flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="bg-black p-2 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-black">BJK Admin</span>
            </div>
            <button
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              onClick={onClose}
              aria-label="Menüyü kapat"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col overflow-y-auto pt-4"> {/* Added pt-4 for spacing */}
            {/* <SidebarSearch /> */} {/* Removed usage */}
            <SidebarNavigation navigation={navigation} onLinkClick={onClose} />
          </div>

          {/* Footer */}
          <SidebarUserProfile userName={userName} onLogout={onLogout} />
        </div>
      </div>
    </>
  );
}

export default MobileSidebar;
