import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Share2 } from 'lucide-react';
import { useData } from '../hooks/useData';
import LoadingSpinner from '../components/LoadingSpinner';
import { Activity } from '../utils/supabase';
import 'react-quill/dist/quill.snow.css';

const ActivityDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { activities, loading, error } = useData();
  const [activity, setActivity] = useState<Activity | null>(null);

  useEffect(() => {
    if (!loading.activities && activities.length > 0 && id) {
      const foundActivity = activities.find(a => a.id === id);
      if (foundActivity) {
        setActivity(foundActivity);
      }
    }
  }, [id, activities, loading.activities]);

  // Tarih formatlaması için yardımcı fonksiyon
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('tr-TR', options);
  };

  if (loading.activities) {
    return <LoadingSpinner />;
  }

  if (error.activities) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Bir hata oluştu: {error.activities.message}</p>
      </div>
    );
  }

  if (!activity) {
    return (
      <div className="text-center py-12">
        <p className="text-black">Faaliyet bulunamadı.</p>
        <Link to="/faaliyetler" className="mt-4 inline-block px-6 py-2 bg-besiktas-red text-white rounded-md hover:bg-red-700 transition-colors">
          Faaliyetlere Dön
        </Link>
      </div>
    );
  }

  // Paylaşım fonksiyonu
  const shareActivity = () => {
    if (navigator.share) {
      navigator.share({
        title: activity.title,
        text: `${activity.title} - Beşiktaş Kartalları Derneği`,
        url: window.location.href,
      })
        .then(() => console.log('Paylaşım başarılı'))
        .catch((error) => console.log('Paylaşım hatası:', error));
    } else {
      // Tarayıcı Share API'sini desteklemiyorsa kopyalama işlemi
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Bağlantı panoya kopyalandı'))
        .catch((err) => console.log('Kopyalama hatası:', err));
    }
  };

  return (
    <div className="pt-10 pb-16 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link 
          to="/faaliyetler" 
          className="inline-flex items-center text-besiktas-red hover:text-red-700 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Tüm Faaliyetler
        </Link>
        
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="h-[500px] relative">
            <img 
              src={activity.image} 
              alt={activity.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full p-8">
              <div className="inline-flex gap-3 mb-4">
              <span className="inline-block bg-besiktas-red text-white text-sm px-3 py-1 rounded-full font-['Arial']">
              {formatDate(activity.date)}
              </span>
              </div>
              <h1 className="text-2xl font-bold text-white mb-2 drop-shadow-md font-['Arial']">{activity.title}</h1>
            </div>
          </div>
          
          <div className="p-8">
            <div className="flex flex-wrap gap-x-6 gap-y-2 mb-8 text-black border-b border-gray-100 pb-6">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-besiktas-red" />
                <span>{formatDate(activity.date)}</span>
              </div>
              <button 
                onClick={shareActivity}
                className="flex items-center text-besiktas-red hover:text-red-700 transition-colors ml-auto"
              >
                <Share2 className="w-5 h-5 mr-2" />
                <span>Paylaş</span>
              </button>
            </div>
            
            <div className="prose prose-lg max-w-none ql-content">
              <div 
                className="text-gray-700 leading-relaxed quill-content"
                dangerouslySetInnerHTML={{ __html: activity.description }}
              />
            </div>
            
            {/* Quill içeriği için global stiller */}
            <style>
              {`
                .ql-content img, .quill-content img {
                  max-width: 100%;
                  height: auto;
                  border-radius: 0.375rem;
                  margin: 1.5rem 0;
                }
                .ql-content p, .quill-content p {
                  margin-bottom: 1rem;
                }
                .ql-content ul, .ql-content ol, .quill-content ul, .quill-content ol {
                  margin-left: 1.5rem;
                  margin-bottom: 1rem;
                }
                .ql-content h1, .ql-content h2, .ql-content h3, .ql-content h4,
                .quill-content h1, .quill-content h2, .quill-content h3, .quill-content h4 {
                  margin-top: 1.5rem;
                  margin-bottom: 1rem;
                  font-weight: 600;
                }
                .ql-content a, .quill-content a {
                  color: #E30613;
                  text-decoration: underline;
                }
                .ql-content blockquote, .quill-content blockquote {
                  border-left: 4px solid #E30613;
                  padding-left: 1rem;
                  font-style: italic;
                  margin: 1.5rem 0;
                }
              `}
            </style>
          </div>
        </div>
        
        {/* Diğer faaliyetler bölümü */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Diğer Faaliyetler</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activities
              .filter(a => a.id !== id)
              .slice(0, 3)
              .map(otherActivity => (
                <Link 
                  key={otherActivity.id} 
                  to={`/faaliyet/${otherActivity.id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden transform transition hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="h-40 overflow-hidden">
                    <img 
                      src={otherActivity.image} 
                      alt={otherActivity.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{otherActivity.title}</h3>
                    <div className="flex items-center text-sm text-black">
                      <Calendar className="w-4 h-4 mr-1 text-besiktas-red" />
                      <span>{formatDate(otherActivity.date)}</span>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetailPage;
