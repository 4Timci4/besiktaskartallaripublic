import { Shield } from 'lucide-react';
import SidebarNavigation, { NavigationItem } from './SidebarNavigation';
// import SidebarSearch from './SidebarSearch'; // Removed import
import SidebarUserProfile from './SidebarUserProfile';

interface DesktopSidebarProps {
  navigation: NavigationItem[];
  userName: string | null;
  onLogout: () => void;
}

function DesktopSidebar({ navigation, userName, onLogout }: DesktopSidebarProps) {
  return (
    <div className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-100 lg:bg-white lg:shadow-sm">
      {/* Header */}
      <div className="h-20 flex items-center justify-center border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="bg-black p-2 rounded-lg">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-black">BJK Admin</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-y-auto pt-4"> {/* Added pt-4 for spacing */}
        {/* <SidebarSearch /> */} {/* Removed usage */}
        <SidebarNavigation navigation={navigation} />
      </div>

      {/* Footer */}
      <SidebarUserProfile userName={userName} onLogout={onLogout} />
    </div>
  );
}

export default DesktopSidebar;
