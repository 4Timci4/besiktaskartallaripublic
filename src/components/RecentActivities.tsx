import { Calendar } from 'lucide-react';
import { useData } from '../hooks/useData';
import { Link } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import { useState } from 'react';
import { truncateHtml } from '../utils/htmlUtils';

const RecentActivities = () => {
  const { activities, loading, error } = useData();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  
  // Faaliyetleri tarihe göre sıralayıp son 3 faaliyeti göster
  const recentActivities = [...activities]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);
  
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

  if (recentActivities.length === 0) {
    return (
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Son Faaliyetlerimiz</h2>
            <p className="text-black max-w-2xl mx-auto">
              Henüz listelenecek faaliyet bulunmamaktadır.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-besiktas-red to-red-700">Son Faaliyetlerimiz</h2>
          <p className="text-black max-w-2xl mx-auto">
            Derneğimizin son dönemde gerçekleştirdiği etkinlik ve projeler
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {recentActivities.map((activity) => (
            <div 
              key={activity.id} 
              className="group bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-500 ease-in-out hover:shadow-2xl hover:-translate-y-2"
              onMouseEnter={() => setHoveredId(activity.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div className="relative h-52 overflow-hidden">
                <img 
                  src={activity.image} 
                  alt={activity.title} 
                  className={`w-full h-full object-cover transition-transform duration-700 ease-in-out ${hoveredId === activity.id ? 'scale-110' : 'scale-100'}`}
                />
                <div className={`absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                <div className={`absolute bottom-0 left-0 w-full p-4 transform ${hoveredId === activity.id ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'} transition-all duration-300 ease-in-out`}>
                  <span className="inline-block bg-besiktas-red text-white text-sm px-3 py-1 rounded-full">
                    {new Date(activity.date).toLocaleDateString('tr-TR')}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3 group-hover:text-besiktas-red transition-colors duration-300">{activity.title}</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-black">
                    <Calendar className="w-4 h-4 mr-2 text-besiktas-red" />
                    <span className="text-sm">
                      {new Date(activity.date).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                </div>
                <p className="text-black line-clamp-3">{truncateHtml(activity.description, 150)}</p>
                <div className="mt-4 h-0 overflow-hidden group-hover:h-8 transition-all duration-300">
                  <Link 
                    to={`/faaliyet/${activity.id}`} 
                    className="inline-flex items-center text-besiktas-red hover:text-red-700 transition-colors"
                  >
                    Devamını Oku <span className="ml-1">→</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link
            to="/faaliyetler"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-white bg-besiktas-red shadow-lg hover:bg-red-700 hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1"
          >
            Tüm Faaliyetlerimiz
          </Link>
        </div>
      </div>
    </section>
  );
};

export default RecentActivities;
