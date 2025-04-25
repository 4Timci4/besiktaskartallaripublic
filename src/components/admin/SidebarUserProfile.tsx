import { User, LogOut } from 'lucide-react';

interface SidebarUserProfileProps {
  userName: string | null;
  onLogout: () => void;
}

function SidebarUserProfile({ userName, onLogout }: SidebarUserProfileProps) {
  return (
    <div className="p-4 border-t border-gray-100">
      <div className="flex items-center p-2 rounded-xl hover:bg-gray-50 transition-colors">
        <div className="flex-shrink-0 bg-gray-100 rounded-full p-2">
          <User className="h-6 w-6 text-gray-600" />
        </div>
        <div className="ml-3 min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-900 truncate">
            {userName || 'Admin Kullanıcı'}
          </p>
          <button
            onClick={onLogout}
            className="text-xs font-medium text-gray-500 hover:text-gray-700 flex items-center mt-1"
          >
            <LogOut className="mr-1 h-3.5 w-3.5" /> Çıkış Yap
          </button>
        </div>
      </div>
    </div>
  );
}

export default SidebarUserProfile;
