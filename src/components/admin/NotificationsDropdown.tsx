import { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';

// Bildirim tipi (örnek)
interface Notification {
  id: number;
  title: string;
  time: string;
  read: boolean;
}

interface NotificationsDropdownProps {
  notifications: Notification[];
  // onMarkAllRead?: () => void; // Opsiyonel callback
  // onViewAll?: () => void; // Opsiyonel callback
}

function NotificationsDropdown({ notifications }: NotificationsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const hasUnread = notifications.some(n => !n.read);

  // Dışarı tıklamayı algıla
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="relative notifications-container" ref={dropdownRef}>
      <button
        className="p-2 text-gray-500 rounded-full hover:text-gray-700 hover:bg-gray-100 transition-colors relative"
        onClick={toggleDropdown}
        aria-label="Bildirimler"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Bell className="h-5 w-5" />
        {hasUnread && (
          <div className="h-2 w-2 absolute top-2 right-2 bg-red-500 rounded-full animate-pulse"></div>
        )}
      </button>

      {/* Dropdown İçeriği */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-1 z-20 border border-gray-100 overflow-hidden" // z-index artırıldı
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="notifications-button"
        >
          <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-sm font-semibold text-gray-900">Bildirimler</h3>
            {/* Opsiyonel: Tümünü okundu işaretle butonu */}
            {/* <button className="text-xs text-gray-500 hover:text-gray-700">Tümünü Okundu İşaretle</button> */}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {notifications.map(notification => (
                  <div
                    key={notification.id}
                    className={`px-4 py-3 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50' : ''}`} // Okunmamışlar için farklı arka plan
                    role="menuitem"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className={`text-sm ${!notification.read ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">{notification.time}</p>
                      </div>
                      {!notification.read && (
                        <div className="h-2 w-2 bg-blue-500 rounded-full mt-1.5 ml-2 flex-shrink-0"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-4 py-6 text-center text-gray-500 text-sm">
                Bildirim bulunmuyor
              </div>
            )}
          </div>
          {/* Opsiyonel: Tüm bildirimleri gör butonu */}
          {/* <div className="px-4 py-2 border-t border-gray-100">
            <button className="text-xs text-center w-full text-gray-500 hover:text-gray-700">
              Tüm Bildirimleri Gör
            </button>
          </div> */}
        </div>
      )}
    </div>
  );
}

export default NotificationsDropdown;
