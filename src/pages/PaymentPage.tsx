import Hero from '../components/Hero';
import { Check, Users, Award, BookOpen, Zap } from 'lucide-react';

const PaymentPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Hero title="Üyelik" />

      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Giriş Bölümü */}
        <div className="bg-white shadow-xl rounded-lg overflow-hidden mb-8">
          <div className="p-6 md:p-8">
            <div className="border-l-4 border-besiktas-red pl-4 italic text-lg text-gray-700 mb-6">
              <p className="font-medium">
                Değerli Beşiktaşlılar,
              </p>
              <p className="mt-2">
                Beşiktaş Kartalları Derneği olarak, sizlerin desteğiyle büyümeye ve gelişmeye devam ediyoruz. Siyah-beyaz sevdamızla, kartal yuvasında daha güçlü bir topluluk oluşturmak, ortak hedeflerimize ulaşmak ve güzel işlere imza atmak için sizleri de aramızda görmekten mutluluk duyarız.
              </p>
            </div>
          </div>
        </div>

        {/* Ödeme Bilgileri Bölümü */}
        <div className="bg-white shadow-xl rounded-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-black via-gray-800 to-black text-white py-3 px-6">
            <h2 className="text-xl font-bold flex items-center">
              <Zap className="mr-2 h-5 w-5 text-besiktas-red" />
              Üyelik Bedeli ve Yıllık Aidat Bilgileri
            </h2>
          </div>

          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-besiktas-red shadow-md">
                <h3 className="text-lg font-bold mb-2 text-gray-800">Standart Üyelik</h3>
                <div className="text-3xl font-bold text-besiktas-red mb-2">1.000,00 TL</div>
                <p className="text-gray-600 mb-2">Üyelik Bedeli</p>
                <div className="text-2xl font-bold text-besiktas-red mb-2">500,00 TL</div>
                <p className="text-gray-600">Yıllık Aidat</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 border-l-4 border-besiktas-red shadow-md">
                <h3 className="text-lg font-bold mb-2 text-gray-800">İndirimli Üyelik</h3>
                <div className="text-3xl font-bold text-besiktas-red mb-2">500,00 TL</div>
                <p className="text-gray-600 mb-2">Üyelik Bedeli <span className="bg-besiktas-red text-white text-xs px-2 py-1 rounded-full ml-2">%50 İndirim</span></p>
                <div className="text-2xl font-bold text-besiktas-red mb-2">500,00 TL</div>
                <p className="text-gray-600">Yıllık Aidat</p>
                <p className="text-sm text-gray-500 mt-4 italic">* Kadın üyelerimiz ve 25 yaş altı öğrenci kardeşlerimiz için geçerlidir.</p>
              </div>
            </div>
            
            {/* Ödeme Bilgileri */}
            <div className="mt-8 bg-white p-6 rounded-lg border-2 border-besiktas-red shadow-md">
              <h3 className="text-xl font-bold mb-4 text-gray-800 border-b-2 border-gray-200 pb-2">Ödeme Bilgileri</h3>
              <div className="space-y-3">
                <div className="flex flex-col">
                  <span className="text-sm text-black font-bold">IBAN</span>
                  <div className="flex items-center">
                    <span className="font-mono font-bold text-besiktas-red">TR61 0006 4000 0011 2830 4956 74</span>
                    <button 
                      className="ml-2 text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded transition-colors"
                      onClick={() => {
                        navigator.clipboard.writeText('TR61 0006 4000 0011 2830 4956 74');
                        alert('IBAN kopyalandı!');
                      }}
                    >
                      Kopyala
                    </button>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-black font-bold">Hesap Adı</span>
                  <span className="font-bold text-gray-800">Beşiktaş Kartalları Derneği</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Neden Üye Olmalısınız Bölümü */}
        <div className="bg-white shadow-xl rounded-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-black via-gray-800 to-black text-white py-3 px-6">
            <h2 className="text-xl font-bold flex items-center">
              <Award className="mr-2 h-5 w-5 text-besiktas-red" />
              Neden Beşiktaş Kartalları Derneği'ne Üye Olmalısınız?
            </h2>
          </div>

          <div className="p-6 md:p-8">
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-besiktas-red flex items-center justify-center mt-0.5">
                  <Users className="h-3 w-3 text-white" />
                </div>
                <p className="ml-3 text-gray-700">Siyah-beyaz sevdamızı paylaşan, kartal yürekli dostlarla tanışma ve kaynaşma fırsatı.</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-besiktas-red flex items-center justify-center mt-0.5">
                  <Check className="h-3 w-3 text-white" />
                </div>
                <p className="ml-3 text-gray-700">Beşiktaşımıza ve topluma katkı sağlayacak sosyal sorumluluk projelerinde yer alma imkanı.</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-besiktas-red flex items-center justify-center mt-0.5">
                  <BookOpen className="h-3 w-3 text-white" />
                </div>
                <p className="ml-3 text-gray-700">Eğitim, seminer ve etkinliklere katılarak kişisel ve mesleki gelişimine katkı sağlama.</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 h-6 w-6 rounded-full bg-besiktas-red flex items-center justify-center mt-0.5">
                  <Check className="h-3 w-3 text-white" />
                </div>
                <p className="ml-3 text-gray-700">Birlikte üretme, paylaşma ve dayanışma kültürü oluşturma.</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Nasıl Üye Olabilirsiniz Bölümü */}
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-black via-gray-800 to-black text-white py-3 px-6">
            <h2 className="text-xl font-bold flex items-center">
              <Users className="mr-2 h-5 w-5 text-besiktas-red" />
              Nasıl Üye Olabilirsiniz?
            </h2>
          </div>

          <div className="p-6 md:p-8">
            <div className="space-y-4">
              <div className="flex items-center p-4 bg-gray-50 rounded-lg shadow-sm border-l-4 border-besiktas-red">
                <div className="flex-shrink-0 mr-4">
                  <div className="h-10 w-10 rounded-full bg-besiktas-red flex items-center justify-center">
                    <span className="text-white font-bold">1</span>
                  </div>
                </div>
                <div>
                  <p className="text-gray-700">
                    Derneğimizin web sitesi üzerinden <a href="/uyelik/basvuru" className="text-besiktas-red font-bold hover:underline">buraya tıklayarak</a> üyelik başvurusunda bulunabilirsiniz.
                  </p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-gray-50 rounded-lg shadow-sm border-l-4 border-besiktas-red">
                <div className="flex-shrink-0 mr-4">
                  <div className="h-10 w-10 rounded-full bg-besiktas-red flex items-center justify-center">
                    <span className="text-white font-bold">2</span>
                  </div>
                </div>
                <div>
                  <p className="text-gray-700">
                    Dernek merkezimize şahsen gelerek üyelik formunu doldurabilirsiniz.
                  </p>
                </div>
              </div>

              <div className="flex items-center p-4 bg-gray-50 rounded-lg shadow-sm border-l-4 border-besiktas-red">
                <div className="flex-shrink-0 mr-4">
                  <div className="h-10 w-10 rounded-full bg-besiktas-red flex items-center justify-center">
                    <span className="text-white font-bold">3</span>
                  </div>
                </div>
                <div>
                  <p className="text-gray-700">
                    Sosyal medya hesaplarımız üzerinden bizimle iletişime geçerek üyelik hakkında detaylı bilgi alabilirsiniz.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
