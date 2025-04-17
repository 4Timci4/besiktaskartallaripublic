import React from 'react';

const Introduction = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="heading-2 mb-6">Beşiktaş Kartalları Derneği'ne Hoş Geldiniz</h2>
            <p className="body-text mb-8">
              1903'ten beri süregelen Beşiktaş sevgisini ve kültürünü yaşatmak için bir araya gelen taraftarların oluşturduğu resmi derneğimiz, 
              Beşiktaş'ın değerlerini ve geleneklerini gelecek nesillere aktarmak için çalışmaktadır.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-h1 font-bold text-besiktas-red mb-2">5000+</div>
                <div className="small-text">Aktif Üye</div>
              </div>
              <div className="text-center">
                <div className="text-h1 font-bold text-besiktas-red mb-2">100+</div>
                <div className="small-text">Yıllık Etkinlik</div>
              </div>
              <div className="text-center">
                <div className="text-h1 font-bold text-besiktas-red mb-2">20+</div>
                <div className="small-text">Yıllık Proje</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://cdn.discordapp.com/attachments/949040291606847539/1336603279257292810/bjk-fans.jpg?ex=67a4684e&is=67a316ce&hm=c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0c0&"
              alt="Beşiktaş Taraftarları" 
              className="rounded-lg shadow-xl w-full h-[400px] object-cover"
            />
            <div className="absolute -bottom-6 -right-6 bg-black text-white p-6 rounded-lg shadow-lg max-w-xs">
              <p className="text-h2 font-semibold mb-2">"En büyük Beşiktaş taraftarıdır!"</p>
              <p className="small-text text-gray-300">- Süleyman Seba</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Introduction;