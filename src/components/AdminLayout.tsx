import { ReactNode, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, Activity, Image, User, Home, Newspaper, Users, Bell, Settings, ChevronDown, Search, Shield, Mail } from 'lucide-react';
import { logout, getCurrentUser, isAuthenticated } from '../utils/auth';
import PageTransition from './PageTransition';
import ScrollToTop from './ScrollToTop';
import A11yControls from './A11yControls';

interface AdminLayoutProps {
  children: ReactNode;
}

function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    async function fetchUserData() {
      const user = await getCurrentUser();
      if (user?.email) {
        setUserName(user.email);
      }
    }
    
    fetchUserData();
  }, []);

  // Oturum süresini her sayfa yüklendiğinde kontrol et
  useEffect(() => {
    async function checkSessionValidity() {
      const isValid = await isAuthenticated();
      if (!isValid) {
        // Oturum geçersizse login sayfasına yönlendir
        navigate('/admin/login');
      }
    }
    
    // Sayfa yüklendiğinde kontrol et
    checkSessionValidity();
    
    // Kullanıcı aktif olduğunda periyodik kontrol yapmak için
    // 5 dakikada bir kontrol et (isteğe bağlı)
    const intervalId = setInterval(() => {
      checkSessionValidity();
    }, 5 * 60 * 1000); // 5 dakika
    
    return () => {
      clearInterval(intervalId); // Component unmount olduğunda interval'i temizle
    };
  }, [navigate]);

  // Kullanıcı menüsünü ve bildirim menüsünü kapatmak için dışarı tıklamayı dinle
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuOpen || notificationsOpen) {
        const target = event.target as HTMLElement;
        if (!target.closest('.user-menu-container') && !target.closest('.notifications-container')) {
          setUserMenuOpen(false);
          setNotificationsOpen(false);
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuOpen, notificationsOpen]);

  const handleLogout = async () => {
    const { success } = await logout();
    if (success) {
      navigate('/admin/login');
    }
  };

  const navigation = [
    { name: 'Kontrol Paneli', href: '/admin', icon: Home },
    { name: 'Faaliyetler', href: '/admin/faaliyetler', icon: Activity },
    { name: 'Galeri', href: '/admin/galeri', icon: Image },
    { name: 'Basında Biz', href: '/admin/basin', icon: Newspaper },
    { name: 'Yönetim Kurulu', href: '/admin/yonetim-kurulu', icon: Users },
    { name: 'İletişim Mesajları', href: '/admin/iletisim-mesajlari', icon: Mail },
    { name: 'Üyelik Başvuruları', href: '/admin/uyelik-basvurulari', icon: Users },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Bildirimler (örnek veri)
  const notifications = [
    { id: 1, title: 'Yeni üyelik başvurusu', time: '5 dakika önce', read: false },
    { id: 2, title: 'Sistem güncellemesi tamamlandı', time: '1 saat önce', read: true },
    { id: 3, title: 'Yeni yorum onay bekliyor', time: '3 saat önce', read: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <ScrollToTop />
      {/* Mobil menü arkafonu */}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Mobil menü */}
      <div
        className={`fixed inset-y-0 left-0 w-80 z-50 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="h-20 flex items-center justify-between px-6 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="bg-black p-2 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div className="text-xl font-bold text-black">BJK Admin</div>
            </div>
            <button
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="px-6 py-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Ara..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-gray-50"
                />
              </div>
            </div>
            <nav className="px-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-black text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-black'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 ${
                      isActive(item.href) ? 'text-white' : 'text-gray-500'
                    }`}
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

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
                  onClick={handleLogout}
                  className="text-xs font-medium text-gray-500 hover:text-gray-700 flex items-center mt-1"
                >
                  <LogOut className="mr-1 h-3.5 w-3.5" /> Çıkış Yap
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Masaüstü yan menü */}
      <div className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-100 lg:bg-white lg:shadow-sm">
        <div className="h-20 flex items-center justify-center border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="bg-black p-2 rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div className="text-xl font-bold text-black">BJK Admin</div>
          </div>
        </div>
        <div className="flex-1 flex flex-col overflow-y-auto">
          <div className="px-6 py-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Ara..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-gray-50"
              />
            </div>
          </div>
          <nav className="flex-1 px-4 space-y-1 pb-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  isActive(item.href)
                    ? 'bg-black text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-black'
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 ${
                    isActive(item.href) ? 'text-white' : 'text-gray-500'
                  }`}
                />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
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
                onClick={handleLogout}
                className="text-xs font-medium text-gray-500 hover:text-gray-700 flex items-center mt-1"
              >
                <LogOut className="mr-1 h-3.5 w-3.5" /> Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Ana içerik */}
      <div className="flex-1 flex flex-col lg:pl-72">
        {/* Üst bar */}
        <header className="sticky top-0 z-10 flex h-16 bg-white shadow-sm border-b border-gray-100">
          <button
            type="button"
            className="lg:hidden px-4 text-gray-500 focus:outline-none"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1 flex items-center justify-between px-4">
            <h1 className="text-lg font-medium text-gray-900">
              {navigation.find(item => isActive(item.href))?.name || 'Admin Paneli'}
            </h1>
            <div className="flex items-center space-x-4">
              {/* Bildirimler Dropdown */}
              <div className="relative notifications-container">
                <button 
                  className="p-2 text-gray-500 rounded-full hover:text-gray-700 hover:bg-gray-100 transition-colors relative"
                  onClick={() => {
                    setNotificationsOpen(!notificationsOpen);
                    setUserMenuOpen(false);
                  }}
                >
                  <span className="sr-only">Bildirimler</span>
                  <Bell className="h-5 w-5" />
                  {notifications.some(n => !n.read) && (
                    <div className="h-2 w-2 absolute top-2 right-2 bg-red-500 rounded-full"></div>
                  )}
                </button>
                
                {/* Bildirimler Dropdown İçeriği */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-1 z-10 border border-gray-100 overflow-hidden">
                    <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                      <h3 className="text-sm font-semibold text-gray-900">Bildirimler</h3>
                      <button className="text-xs text-gray-500 hover:text-gray-700">Tümünü Okundu İşaretle</button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                          {notifications.map(notification => (
                            <div 
                              key={notification.id} 
                              className={`px-4 py-3 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-gray-50' : ''}`}
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <p className={`text-sm ${!notification.read ? 'font-medium' : 'text-gray-700'}`}>
                                    {notification.title}
                                  </p>
                                  <p className="text-xs text-gray-500 mt-0.5">{notification.time}</p>
                                </div>
                                {!notification.read && (
                                  <div className="h-2 w-2 bg-red-500 rounded-full mt-1.5"></div>
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
                    <div className="px-4 py-2 border-t border-gray-100">
                      <button className="text-xs text-center w-full text-gray-500 hover:text-gray-700">
                        Tüm Bildirimleri Gör
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Kullanıcı Menüsü */}
              <div className="relative user-menu-container">
                <button 
                  className="flex items-center text-sm rounded-full focus:outline-none"
                  onClick={() => {
                    setUserMenuOpen(!userMenuOpen);
                    setNotificationsOpen(false);
                  }}
                >
                  <div className="flex items-center space-x-2 bg-gray-50 hover:bg-gray-100 transition-colors px-3 py-2 rounded-lg">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-600" />
                    </div>
                    <span className="hidden md:block text-sm font-medium text-gray-700 truncate max-w-[100px]">
                      {userName || 'Admin'}
                    </span>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </div>
                </button>
                
                {/* Kullanıcı Dropdown Menüsü */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10 border border-gray-100">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {userName || 'Admin Kullanıcı'}
                      </p>
                      <p className="text-xs text-gray-500 truncate">admin@bjk.com.tr</p>
                    </div>
                    <div className="py-1">
                      <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left">
                        <User className="mr-3 h-4 w-4 text-gray-500" />
                        Profil
                      </button>
                      <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left">
                        <Settings className="mr-3 h-4 w-4 text-gray-500" />
                        Ayarlar
                      </button>
                    </div>
                    <div className="py-1 border-t border-gray-100">
                      <button 
                        onClick={handleLogout}
                        className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                      >
                        <LogOut className="mr-3 h-4 w-4 text-red-500" />
                        Çıkış Yap
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Ana içerik alanı */}
        <main className="flex-1 overflow-auto bg-gray-50 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <PageTransition key={location.pathname}>
              {children}
            </PageTransition>
          </div>
        </main>
      </div>
      <A11yControls />
    </div>
  );
}

export default AdminLayout;
