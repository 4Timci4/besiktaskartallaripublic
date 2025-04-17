import React from 'react';

const News = () => {
  const news = [
    {
      id: 1,
      title: "Yeni Sezon Üyelik Kampanyası",
      date: "15 Mart 2024",
      image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      summary: "2024-2025 sezonu üyelik kampanyamız başlamıştır."
    },
    {
      id: 2,
      title: "Dernek Genel Kurulu",
      date: "20 Mart 2024",
      image: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      summary: "Yıllık genel kurul toplantımız için tüm üyelerimiz davetlidir."
    },
    {
      id: 3,
      title: "Taraftar Buluşması",
      date: "25 Mart 2024",
      image: "https://images.unsplash.com/photo-1543351611-58f69d7c1781?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      summary: "Bu hafta sonu gerçekleşecek taraftar buluşmamıza tüm taraftarlarımız davetlidir."
    }
  ];

  return (
    <section id="news" className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-h2 font-bold text-center mb-12">Haberler ve Duyurular</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {news.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <p className="text-sm text-besiktas-red mb-2">{item.date}</p>
                <h3 className="text-h2 font-semibold mb-2">{item.title}</h3>
                <p className="text-base text-black">{item.summary}</p>
                <a href="#" className="mt-4 inline-block text-besiktas-red font-semibold hover:text-red-700">
                  Devamını Oku →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default News;