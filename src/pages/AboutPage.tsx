import Hero from '../components/Hero'

export default function AboutPage() {
  return (
    <div className="page-container">
      <Hero 
        title="Hakkımızda"
        description="2024 yılında İstanbul'da kurulan derneğimiz, Beşiktaş sevgisini ve değerlerini yaşatmak için çalışmaktadır."
      />

      <div className="content-section bg-gradient-to-b from-gray-50 to-white py-8 sm:py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-6">
          {/* Misyon & Vizyon */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mb-12">
            <div className="relative overflow-hidden bg-white/90 backdrop-blur-xl p-4 sm:p-8 shadow-xl rounded-[1.5rem] border border-white/20">
              <div className="absolute inset-0 bg-gradient-to-tr from-white/40 via-white/60 to-white/40 pointer-events-none"></div>
              <div className="relative">
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-gray-900 mb-4 flex items-center gap-2">
                  <span className="inline-block w-1 h-6 bg-gradient-to-b from-besiktas-red to-transparent rounded-full"></span>
                  Misyonumuz
                </h2>
                <ul className="text-sm sm:text-base text-black leading-relaxed space-y-4">
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-besiktas-red rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    <p>Beşiktaş değerlerine bağlı, kulübüne gönülden destek veren taraftarları bir araya getirerek, kulübün gelişimine katkıda bulunmak, sporun ve taraftarlığın etik değerlerini yaymak.</p>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-besiktas-red rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    <p>Beşiktaş camiasına yeni yöneticiler kazandırmak, genç nesilleri spora teşvik etmek ve sosyal sorumluluk projeleriyle topluma fayda sağlamak.</p>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-besiktas-red rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    <p>Beşiktaş taraftarlığı ruhunu yaşatmak, birlik ve beraberliği güçlendirmek, kulübümüzün ve taraftarımızın sesi olmak.</p>
                  </li>
                </ul>
              </div>
            </div>

            <div className="relative overflow-hidden bg-white/90 backdrop-blur-xl p-4 sm:p-8 shadow-xl rounded-[1.5rem] border border-white/20">
              <div className="absolute inset-0 bg-gradient-to-tr from-white/40 via-white/60 to-white/40 pointer-events-none"></div>
              <div className="relative">
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-gray-900 mb-4 flex items-center gap-2">
                  <span className="inline-block w-1 h-6 bg-gradient-to-b from-besiktas-red to-transparent rounded-full"></span>
                  Vizyonumuz
                </h2>
                <ul className="text-sm sm:text-base text-black leading-relaxed space-y-4">
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-besiktas-red rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    <p>Beşiktaş camiasında saygın ve etkin bir konuma sahip, örnek gösterilen bir taraftar derneği olmak.</p>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-besiktas-red rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    <p>Kulübümüzün her alanda gelişimine katkı sağlayan, yenilikçi ve öncü projeler üreten bir dernek olmak.</p>
                  </li>
                  <li className="flex items-start">
                    <span className="inline-block w-2 h-2 bg-besiktas-red rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    <p>Beşiktaş taraftarlığı kültürünü gelecek nesillere aktaran, sporun birleştirici gücünü en iyi şekilde temsil eden bir dernek olmak.</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Değerlerimiz */}
          <div className="relative overflow-hidden bg-white/90 backdrop-blur-xl p-4 sm:p-8 shadow-xl rounded-[1.5rem] border border-white/20">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/40 via-white/60 to-white/40 pointer-events-none"></div>
            <div className="relative">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-gray-900 mb-6 flex items-center gap-2">
                <span className="inline-block w-1 h-6 bg-gradient-to-b from-besiktas-red to-transparent rounded-full"></span>
                Değerlerimiz
              </h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-lg bg-white/50 p-4 shadow-sm ring-1 ring-gray-200/50">
                  <h3 className="text-base font-semibold text-gray-900 mb-2">Beşiktaş Sevgisi</h3>
                  <p className="text-sm text-black">Beşiktaş sevgisini ve değerlerini yaşatır, gelecek nesillere aktarırız.</p>
                </div>
                <div className="rounded-lg bg-white/50 p-4 shadow-sm ring-1 ring-gray-200/50">
                  <h3 className="text-base font-semibold text-gray-900 mb-2">Dayanışma</h3>
                  <p className="text-sm text-black">Üyelerimiz arasında güçlü bir dayanışma ruhu oluştururuz.</p>
                </div>
                <div className="rounded-lg bg-white/50 p-4 shadow-sm ring-1 ring-gray-200/50">
                  <h3 className="text-base font-semibold text-gray-900 mb-2">Şeffaflık</h3>
                  <p className="text-sm text-black">Tüm faaliyetlerimizde şeffaflık ve hesap verebilirlik esastır.</p>
                </div>
                <div className="rounded-lg bg-white/50 p-4 shadow-sm ring-1 ring-gray-200/50">
                  <h3 className="text-base font-semibold text-gray-900 mb-2">Sosyal Sorumluluk</h3>
                  <p className="text-sm text-black">Topluma değer katan sosyal sorumluluk projeleri geliştiririz.</p>
                </div>
                <div className="rounded-lg bg-white/50 p-4 shadow-sm ring-1 ring-gray-200/50">
                  <h3 className="text-base font-semibold text-gray-900 mb-2">Eğitim ve Spor</h3>
                  <p className="text-sm text-black">Gençlerimize eğitim ve spor alanında destek oluruz.</p>
                </div>
                <div className="rounded-lg bg-white/50 p-4 shadow-sm ring-1 ring-gray-200/50">
                  <h3 className="text-base font-semibold text-gray-900 mb-2">Kültürel Değerler</h3>
                  <p className="text-sm text-black">Beşiktaş'ın kültürel değerlerini korur ve yaşatırız.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}