import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import supabase from '../utils/supabase';
import { Activity, Image, ArrowRight, Plus, Newspaper, Users, TrendingUp, Calendar, EyeOff, Clock, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

function AdminPage() {
  const [stats, setStats] = useState({
    activities: 0,
    gallery: 0,
    press: 0,
    boardMembers: 0,
    contactMessages: 0,
    membershipApplications: 0,
  });

  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      try {
        // Faaliyet sayılarını al
        const { count: activitiesCount, error: activitiesError } = await supabase
          .from('activities')
          .select('*', { count: 'exact', head: true });

        // Galeri öğe sayılarını al
        const { count: galleryCount, error: galleryError } = await supabase
          .from('gallery')
          .select('*', { count: 'exact', head: true });
          
        // Basın haber sayılarını al
        const { count: pressCount, error: pressError } = await supabase
          .from('press')
          .select('*', { count: 'exact', head: true });
          
        // Yönetim kurulu üye sayılarını al
        const { count: boardMembersCount } = await supabase
          .from('board_members')
          .select('*', { count: 'exact', head: true });
          
        // İletişim mesajları sayısını al
        const { count: contactMessagesCount } = await supabase
          .from('contact_messages')
          .select('*', { count: 'exact', head: true });
          
        // Üyelik başvuruları sayısını al
        const { count: membershipApplicationsCount } = await supabase
          .from('membership_applications')
          .select('*', { count: 'exact', head: true });

        // Son eklenen faaliyetleri al
        const { data: recentActivitiesData, error: recentActivitiesError } = await supabase
          .from('activities')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        if (activitiesError) throw activitiesError;
        if (galleryError) throw galleryError;
        if (pressError) throw pressError;
        if (recentActivitiesError) throw recentActivitiesError;
        // Tablo henüz oluşturulmamış olabilir, bu yüzden hata fırlatmıyoruz
        
        setStats({
          activities: activitiesCount || 0,
          gallery: galleryCount || 0,
          press: pressCount || 0,
          boardMembers: boardMembersCount || 0,
          contactMessages: contactMessagesCount || 0,
          membershipApplications: membershipApplicationsCount || 0,
        });

        setRecentActivities(recentActivitiesData || []);
      } catch (error) {
        console.error('İstatistikleri getirirken hata oluştu:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  // Tarih formatı
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('tr-TR', options);
  };

  // Kart renkleri
  const cardStyles = {
    activities: {
      icon: <Activity className="h-6 w-6 text-white" />,
      bg: "from-blue-500 to-blue-600",
      hover: "hover:from-blue-600 hover:to-blue-700",
      text: "text-blue-600",
      lightBg: "bg-blue-50",
      border: "border-blue-100"
    },
    gallery: {
      icon: <Image className="h-6 w-6 text-white" />,
      bg: "from-emerald-500 to-emerald-600",
      hover: "hover:from-emerald-600 hover:to-emerald-700",
      text: "text-emerald-600",
      lightBg: "bg-emerald-50",
      border: "border-emerald-100"
    },
    press: {
      icon: <Newspaper className="h-6 w-6 text-white" />,
      bg: "from-purple-500 to-purple-600",
      hover: "hover:from-purple-600 hover:to-purple-700",
      text: "text-purple-600",
      lightBg: "bg-purple-50",
      border: "border-purple-100"
    },
    boardMembers: {
      icon: <Users className="h-6 w-6 text-white" />,
      bg: "from-amber-500 to-amber-600",
      hover: "hover:from-amber-600 hover:to-amber-700",
      text: "text-amber-600",
      lightBg: "bg-amber-50",
      border: "border-amber-100"
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Kontrol Paneli</h1>
            <p className="mt-1 text-sm text-gray-500">Beşiktaş Kartalları Derneği yönetim paneline hoş geldiniz</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <span className="text-sm text-gray-500 flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {new Date().toLocaleDateString('tr-TR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
        </div>
        
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Faaliyetler Kartı */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-lg">
            <div className={`bg-gradient-to-r ${cardStyles.activities.bg} ${cardStyles.activities.hover} p-4 transition-all duration-300`}>
              <div className="flex justify-between items-center">
                <div className="bg-white/20 rounded-lg p-2 backdrop-blur-sm">
                  {cardStyles.activities.icon}
                </div>
                <div className="text-white text-opacity-80 text-sm font-medium">
                  Toplam Faaliyet
                </div>
              </div>
              <div className="mt-4 text-white">
                {loading ? (
                  <div className="h-8 w-16 bg-white/20 animate-pulse rounded"></div>
                ) : (
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold">{stats.activities}</span>
                    <span className="ml-2 text-sm opacity-80">kayıt</span>
                  </div>
                )}
              </div>
            </div>
            <div className="p-4">
              <Link 
                to="/admin/faaliyetler" 
                className={`flex items-center justify-between ${cardStyles.activities.text} text-sm font-medium`}
              >
                <span>Faaliyetleri Yönet</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
          
          {/* Galeri Kartı */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-lg">
            <div className={`bg-gradient-to-r ${cardStyles.gallery.bg} ${cardStyles.gallery.hover} p-4 transition-all duration-300`}>
              <div className="flex justify-between items-center">
                <div className="bg-white/20 rounded-lg p-2 backdrop-blur-sm">
                  {cardStyles.gallery.icon}
                </div>
                <div className="text-white text-opacity-80 text-sm font-medium">
                  Galeri Öğeleri
                </div>
              </div>
              <div className="mt-4 text-white">
                {loading ? (
                  <div className="h-8 w-16 bg-white/20 animate-pulse rounded"></div>
                ) : (
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold">{stats.gallery}</span>
                    <span className="ml-2 text-sm opacity-80">görsel</span>
                  </div>
                )}
              </div>
            </div>
            <div className="p-4">
              <Link 
                to="/admin/galeri" 
                className={`flex items-center justify-between ${cardStyles.gallery.text} text-sm font-medium`}
              >
                <span>Galeriyi Yönet</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>

          {/* Basın Kartı */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-lg">
            <div className={`bg-gradient-to-r ${cardStyles.press.bg} ${cardStyles.press.hover} p-4 transition-all duration-300`}>
              <div className="flex justify-between items-center">
                <div className="bg-white/20 rounded-lg p-2 backdrop-blur-sm">
                  {cardStyles.press.icon}
                </div>
                <div className="text-white text-opacity-80 text-sm font-medium">
                  Basın Haberleri
                </div>
              </div>
              <div className="mt-4 text-white">
                {loading ? (
                  <div className="h-8 w-16 bg-white/20 animate-pulse rounded"></div>
                ) : (
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold">{stats.press}</span>
                    <span className="ml-2 text-sm opacity-80">haber</span>
                  </div>
                )}
              </div>
            </div>
            <div className="p-4">
              <Link 
                to="/admin/basin" 
                className={`flex items-center justify-between ${cardStyles.press.text} text-sm font-medium`}
              >
                <span>Basın Haberlerini Yönet</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
          
          {/* Yönetim Kurulu Kartı */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-lg">
            <div className={`bg-gradient-to-r ${cardStyles.boardMembers.bg} ${cardStyles.boardMembers.hover} p-4 transition-all duration-300`}>
              <div className="flex justify-between items-center">
                <div className="bg-white/20 rounded-lg p-2 backdrop-blur-sm">
                  {cardStyles.boardMembers.icon}
                </div>
                <div className="text-white text-opacity-80 text-sm font-medium">
                  Yönetim Kurulu
                </div>
              </div>
              <div className="mt-4 text-white">
                {loading ? (
                  <div className="h-8 w-16 bg-white/20 animate-pulse rounded"></div>
                ) : (
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold">{stats.boardMembers}</span>
                    <span className="ml-2 text-sm opacity-80">üye</span>
                  </div>
                )}
              </div>
            </div>
            <div className="p-4">
              <Link 
                to="/admin/yonetim-kurulu" 
                className={`flex items-center justify-between ${cardStyles.boardMembers.text} text-sm font-medium`}
              >
                <span>Yönetim Kurulunu Yönet</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
          
          {/* İletişim Mesajları Kartı */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-lg">
            <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 p-4 transition-all duration-300">
              <div className="flex justify-between items-center">
                <div className="bg-white/20 rounded-lg p-2 backdrop-blur-sm">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <div className="text-white text-opacity-80 text-sm font-medium">
                  İletişim Mesajları
                </div>
              </div>
              <div className="mt-4 text-white">
                {loading ? (
                  <div className="h-8 w-16 bg-white/20 animate-pulse rounded"></div>
                ) : (
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold">{stats.contactMessages}</span>
                    <span className="ml-2 text-sm opacity-80">mesaj</span>
                  </div>
                )}
              </div>
            </div>
            <div className="p-4">
              <Link 
                to="/admin/iletisim-mesajlari" 
                className="flex items-center justify-between text-cyan-600 text-sm font-medium"
              >
                <span>Mesajları Yönet</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
          
          {/* Üyelik Başvuruları Kartı */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-lg">
            <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 p-4 transition-all duration-300">
              <div className="flex justify-between items-center">
                <div className="bg-white/20 rounded-lg p-2 backdrop-blur-sm">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="text-white text-opacity-80 text-sm font-medium">
                  Üyelik Başvuruları
                </div>
              </div>
              <div className="mt-4 text-white">
                {loading ? (
                  <div className="h-8 w-16 bg-white/20 animate-pulse rounded"></div>
                ) : (
                  <div className="flex items-baseline">
                    <span className="text-3xl font-bold">{stats.membershipApplications}</span>
                    <span className="ml-2 text-sm opacity-80">başvuru</span>
                  </div>
                )}
              </div>
            </div>
            <div className="p-4">
              <Link 
                to="/admin/uyelik-basvurulari" 
                className="flex items-center justify-between text-indigo-600 text-sm font-medium"
              >
                <span>Başvuruları Yönet</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Son Faaliyetler */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-gray-500" />
                Son Faaliyetler
              </h2>
              <Link 
                to="/admin/faaliyetler" 
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Tümünü Gör
              </Link>
            </div>
            <div className="divide-y divide-gray-100">
              {loading ? (
                Array(5).fill(0).map((_, index) => (
                  <div key={index} className="p-4 animate-pulse">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 bg-gray-200 rounded"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : recentActivities.length > 0 ? (
                recentActivities.map((activity) => (
                  <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <img 
                          src={activity.image} 
                          alt={activity.title} 
                          className="h-12 w-12 rounded-lg object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48';
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {activity.title}
                        </p>
                        <div className="flex items-center mt-1">
                          <Calendar className="h-3 w-3 text-gray-400 mr-1" />
                          <p className="text-xs text-gray-500">
                            {formatDate(activity.date)}
                          </p>
                          {activity.is_active === false && (
                            <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              <EyeOff className="h-3 w-3 mr-1" /> Gizli
                            </span>
                          )}
                        </div>
                      </div>
                      <Link
                        to={`/admin/faaliyetler?edit=${activity.id}`}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <span className="sr-only">Düzenle</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-500">
                  Henüz faaliyet bulunmuyor
                </div>
              )}
            </div>
          </div>
          
          {/* Hızlı Erişim */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Hızlı Erişim</h2>
            </div>
            <div className="p-4 space-y-3">
              <Link 
                to="/admin/faaliyetler" 
                className={`flex items-center p-3 ${cardStyles.activities.lightBg} ${cardStyles.activities.text} hover:bg-blue-100 rounded-xl transition-colors border ${cardStyles.activities.border}`}
              >
                <div className="rounded-lg bg-white p-2 mr-3 shadow-sm">
                  <Plus className={`h-5 w-5 ${cardStyles.activities.text}`} />
                </div>
                <span className="font-medium">Yeni Faaliyet</span>
              </Link>
              
              <Link 
                to="/admin/galeri" 
                className={`flex items-center p-3 ${cardStyles.gallery.lightBg} ${cardStyles.gallery.text} hover:bg-emerald-100 rounded-xl transition-colors border ${cardStyles.gallery.border}`}
              >
                <div className="rounded-lg bg-white p-2 mr-3 shadow-sm">
                  <Plus className={`h-5 w-5 ${cardStyles.gallery.text}`} />
                </div>
                <span className="font-medium">Yeni Galeri Öğesi</span>
              </Link>

              <Link 
                to="/admin/basin" 
                className={`flex items-center p-3 ${cardStyles.press.lightBg} ${cardStyles.press.text} hover:bg-purple-100 rounded-xl transition-colors border ${cardStyles.press.border}`}
              >
                <div className="rounded-lg bg-white p-2 mr-3 shadow-sm">
                  <Plus className={`h-5 w-5 ${cardStyles.press.text}`} />
                </div>
                <span className="font-medium">Yeni Basın Haberi</span>
              </Link>
              
              <Link 
                to="/admin/yonetim-kurulu" 
                className={`flex items-center p-3 ${cardStyles.boardMembers.lightBg} ${cardStyles.boardMembers.text} hover:bg-amber-100 rounded-xl transition-colors border ${cardStyles.boardMembers.border}`}
              >
                <div className="rounded-lg bg-white p-2 mr-3 shadow-sm">
                  <Plus className={`h-5 w-5 ${cardStyles.boardMembers.text}`} />
                </div>
                <span className="font-medium">Yeni Yönetim Kurulu Üyesi</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminPage;
