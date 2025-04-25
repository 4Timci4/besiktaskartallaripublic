import { ReactNode, useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Activity, Image, Home, Newspaper, Users, Mail } from 'lucide-react'; // İkonları buradan alalım
import { logout, getCurrentUser, isAuthenticated } from '../utils/auth';
import PageTransition from './PageTransition';
import ScrollToTop from './ScrollToTop';
import A11yControls from './A11yControls';
import MobileSidebar from './admin/MobileSidebar';
import DesktopSidebar from './admin/DesktopSidebar';
import Header from './admin/Header';
import { NavigationItem } from './admin/SidebarNavigation'; // NavigationItem tipini import et

// --- Constants ---
const NAVIGATION_ITEMS: NavigationItem[] = [
  { name: 'Kontrol Paneli', href: '/admin', icon: Home },
  { name: 'Faaliyetler', href: '/admin/faaliyetler', icon: Activity },
  { name: 'Galeri', href: '/admin/galeri', icon: Image },
  { name: 'Basında Biz', href: '/admin/basin', icon: Newspaper },
  { name: 'Yönetim Kurulu', href: '/admin/yonetim-kurulu', icon: Users },
  { name: 'İletişim Mesajları', href: '/admin/iletisim-mesajlari', icon: Mail },
  { name: 'Üyelik Başvuruları', href: '/admin/uyelik-basvurulari', icon: Users },
];

// Örnek bildirim verisi (gerçek uygulamada API'den gelmeli)
const EXAMPLE_NOTIFICATIONS = [
  { id: 1, title: 'Yeni üyelik başvurusu', time: '5 dakika önce', read: false },
  { id: 2, title: 'Sistem güncellemesi tamamlandı', time: '1 saat önce', read: true },
  { id: 3, title: 'Yeni yorum onay bekliyor', time: '3 saat önce', read: false },
];

// --- Custom Hooks (Opsiyonel ama önerilir) ---

// Kullanıcı verisini ve oturum durumunu yöneten hook
function useAdminAuth() {
  const [userName, setUserName] = useState<string | null>(null);
  const navigate = useNavigate();

  // Kullanıcı bilgilerini çek
  useEffect(() => {
    async function fetchUserData() {
      try {
        const user = await getCurrentUser();
        setUserName(user?.email || null);
      } catch (error) {
        console.error("Kullanıcı verisi alınamadı:", error);
        // Hata durumunda login'e yönlendirilebilir
        // navigate('/admin/login');
      }
    }
    fetchUserData();
  }, []);

  // Oturum geçerliliğini periyodik olarak kontrol et
  useEffect(() => {
    const checkSession = async () => {
      try {
        const isValid = await isAuthenticated();
        if (!isValid) {
          console.log("Oturum geçersiz, yönlendiriliyor...");
          navigate('/admin/login');
        }
      } catch (error) {
        console.error("Oturum kontrol hatası:", error);
        navigate('/admin/login');
      }
    };

    checkSession(); // İlk kontrol
    const intervalId = setInterval(checkSession, 5 * 60 * 1000); // 5 dakikada bir kontrol

    return () => clearInterval(intervalId);
  }, [navigate]);

  return { userName };
}

// --- AdminLayout Bileşeni ---

interface AdminLayoutProps {
  children: ReactNode;
}

function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { userName } = useAdminAuth(); // Kullanıcı ve oturum yönetimi için hook kullanımı
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = useCallback(async () => {
    const { success } = await logout();
    if (success) {
      navigate('/admin/login');
    } else {
      console.error("Çıkış yapılamadı.");
      // Kullanıcıya hata mesajı gösterilebilir
    }
  }, [navigate]);

  const currentPageTitle = NAVIGATION_ITEMS.find(item => item.href === location.pathname)?.name || 'Admin Paneli';

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      <ScrollToTop />

      {/* Kenar Çubukları */}
      <MobileSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        navigation={NAVIGATION_ITEMS}
        userName={userName}
        onLogout={handleLogout}
      />
      <DesktopSidebar
        navigation={NAVIGATION_ITEMS}
        userName={userName}
        onLogout={handleLogout}
      />

      {/* Ana İçerik Alanı */}
      <div className="flex-1 flex flex-col lg:pl-72">
        <Header
          pageTitle={currentPageTitle}
          userName={userName}
          notifications={EXAMPLE_NOTIFICATIONS} // Gerçek bildirimler buraya gelmeli
          onLogout={handleLogout}
          onOpenMobileSidebar={() => setSidebarOpen(true)}
        />

        <main className="flex-1 overflow-auto bg-gray-50 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Sayfa geçiş animasyonu */}
            <PageTransition key={location.pathname}>
              {children}
            </PageTransition>
          </div>
        </main>
      </div>

      {/* Erişilebilirlik Kontrolleri */}
      <A11yControls />
    </div>
  );
}

export default AdminLayout;
