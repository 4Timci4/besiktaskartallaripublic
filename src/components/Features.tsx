const Features = () => {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Misyon & Vizyon Bölümü */}
        <div>
          <h2 className="text-center text-2xl font-bold text-black mb-8">
            Misyon ve Vizyonumuz
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mb-12">
            <div className="relative overflow-hidden bg-white/90 backdrop-blur-xl p-4 sm:p-8 shadow-xl rounded-[1.5rem] border border-white/20">
              <div className="absolute inset-0 bg-gradient-to-tr from-white/40 via-white/60 to-white/40 pointer-events-none"></div>
              <div className="relative">
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-black mb-4 flex items-center gap-2">
                  <span className="inline-block w-1 h-6 bg-gradient-to-b from-besiktas-red to-transparent rounded-full"></span>
                  Misyonumuz
                </h2>
                <ul className="text-sm sm:text-base text-black leading-relaxed space-y-4">
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-besiktas-red rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    <p className="text-black">Beşiktaş değerlerine bağlı, kulübüne gönülden destek veren taraftarları bir araya getirerek, kulübün gelişimine katkıda bulunmak, sporun ve taraftarlığın etik değerlerini yaymak.</p>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-besiktas-red rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    <p className="text-black">Beşiktaş camiasına yeni yöneticiler kazandırmak, genç nesilleri spora teşvik etmek ve sosyal sorumluluk projeleriyle topluma fayda sağlamak.</p>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-besiktas-red rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    <p className="text-black">Beşiktaş taraftarlığı ruhunu yaşatmak, birlik ve beraberliği güçlendirmek, kulübümüzün ve taraftarımızın sesi olmak.</p>
                  </li>
                </ul>
              </div>
            </div>

            <div className="relative overflow-hidden bg-white/90 backdrop-blur-xl p-4 sm:p-8 shadow-xl rounded-[1.5rem] border border-white/20">
              <div className="absolute inset-0 bg-gradient-to-tr from-white/40 via-white/60 to-white/40 pointer-events-none"></div>
              <div className="relative">
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-black mb-4 flex items-center gap-2">
                  <span className="inline-block w-1 h-6 bg-gradient-to-b from-besiktas-red to-transparent rounded-full"></span>
                  Vizyonumuz
                </h2>
                <ul className="text-sm sm:text-base text-black leading-relaxed space-y-4">
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-besiktas-red rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    <p className="text-black">Türkiye'nin ve dünyanın her yerindeki Beşiktaşlıları bir çatı altında toplamak.</p>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-besiktas-red rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    <p className="text-black">Spor kültürünün gelişimine ve yaygınlaşmasına katkıda bulunmak.</p>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-besiktas-red rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    <p className="text-black">Beşiktaş'ın tarihini ve değerlerini gelecek nesillere aktarmak.</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <a 
              href="/uyelik" 
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-besiktas-red hover:bg-besiktas-red/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-besiktas-red"
            >
              Sende Aramıza Katılmak İster Misin?
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
