/**
 * Site Configuration
 * This file contains all the configuration for the site's navigation and footer
 */

import { X, Instagram } from 'lucide-react';

// Statik görselleri import et
import logo from '../assets/images/logo.png';

export interface NavLink {
  label: string;
  path: string;
  dropdown?: NavLink[];
}

export interface SocialLink {
  platform: string;
  icon: typeof X | typeof Instagram;
  url: string;
}

export interface ContactInfo {
  address: {
    street: string;
    no: string;
    district: string;
    city: string;
    country: string;
  };
  phone: {
    raw: string;
    display: string;
    whatsapp?: string;
  };
  email: {
    raw: string;
    display: string;
  };
}

export interface FooterSection {
  title: string;
  links: Array<{
    label: string;
    path: string;
  }>;
}

export interface KVKKSection {
  title: string;
  content: string | string[];
  items?: Array<{
    key: string;
    text: string;
  }>;
}

export interface KVKKConfig {
  title: string;
  consentText: string;
  sections: KVKKSection[];
}

const siteConfig = {
  // Brand Configuration
  brand: {
    name: "Beşiktaş Kartalları Derneği",
    logo: logo, // Direkt import edilen logoyu kullan
    logoAlt: "Beşiktaş Kartalları Derneği Logo"
  },

  // Navigation Configuration
  nav: {
    links: [
      { path: '/', label: 'Ana Sayfa' },
      {
        path: '/kurumsal',
        label: 'Kurumsal',
        dropdown: [
          { path: '/kurumsal/hakkimizda', label: 'Hakkımızda' },
          { path: '/kurumsal/yonetim-kurulu', label: 'Yönetim Kurulumuz' },
          { path: '/kurumsal/basinda-biz', label: 'Basında Biz' },
        ],
      },
      { path: '/faaliyetler', label: 'Faaliyetlerimiz' },
      { path: '/galeri', label: 'Galeri' },
      { path: '/uyelik/odeme', label: 'Üyelik' },
      { path: '/iletisim', label: 'İletişim' },
    ] as NavLink[],
    
    // Navbar styling preferences
    styles: {
      height: 'h-24',
      background: 'bg-black',
      textColor: 'text-white',
      activeTextColor: 'text-[#FF0000]',
      hoverBackground: 'hover:bg-gray-800',
    }
  },

  // KVKK Configuration
  kvkk: {
    title: "KVKK Aydınlatma Metni",
    consentText: "Kişisel verilerimin, yukarıdaki aydınlatma metni kapsamında işlenmesini kabul ediyorum.",
    sections: [
      {
        title: "Beşiktaş Kartalları Derneği Üyelik Formu - Aydınlatma Metni",
        content: ""
      },
      {
        title: "1. Kişisel Verilerin Toplanma Amacı ve Hukuki Sebep",
        content: "Beşiktaş Kartalları Derneği olarak, üyelik başvurusu sırasında tarafınızdan alınan kişisel veriler, aşağıdaki amaçlarla toplanacaktır:",
        items: [
          { key: "A", text: "Üyelik işlemlerinin yürütülmesi ve üyelik kaydının oluşturulması," },
          { key: "B", text: "Dernek faaliyetleri ve içerikleri hakkında bilgilendirme yapılması," },
          { key: "C", text: "Derneğin iç hizmetlerini düzenlemek ve geliştirmek," },
          { key: "D", text: "Üyelik, davetiye, etkinliklerden yararlanma gibi olanakların sağlanması ve kişisel veri sahibinin kullanımına sunulabilmesi için gerekli her türlü işlemin yerine getirilmesi," },
          { key: "E", text: "Talep edeceği bilgi, etkinlik ve faaliyetlerle ilgili kişisel veri sahibine bilgilendirme yapılması," },
          { key: "F", text: "Kişisel veri sahibinin yapabileceği şikâyet ve başvuruların değerlendirilebilmesi," },
          { key: "G", text: "Kişisel veri sahibinin tercihlerine göre ilgilerini çekebilecek yeni etkinlik ve faaliyetlerin önerilebilmesi," },
          { key: "H", text: "Kişisel veri sahibinin üstleneceği görevlerin düzenlenmesi ve görevlere ilişkin bilgilendirme yapılması," },
          { key: "I", text: "Verilerin saklanmak üzere aktarılması," },
          { key: "J", text: "Veri kayıplarının önlenebilmesi için kopyalanma / yedeklenmesi," },
          { key: "K", text: "Yasal düzenlemelerin gerektirdiği veya zorunlu kıldığı şekilde, yasal yükümlülüklerin yerine getirilmesini sağlamak üzere," }
        ]
      },
      {
        title: "",
        content: "Ve toplanan kişisel veriler, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) çerçevesinde, hukuki sebepler ve veri işleme şartları dahilinde işlenecektir."
      },
      {
        title: "2. Toplanan Kişisel Veriler",
        content: "Üyelik formunda, aşağıdaki kişisel verileriniz toplanacaktır:",
        items: [
          { key: "A", text: "Ad Soyad," },
          { key: "B", text: "E-posta Adresi," },
          { key: "C", text: "Telefon Numarası," },
          { key: "D", text: "Doğum Tarihi," },
          { key: "E", text: "İkamet Bilgileri," },
          { key: "F", text: "Adres," },
          { key: "G", text: "Eğitim ve Meslek Bilgileri (Öğrenim Durumu, Meslek, Çalıştığı Kurum)," },
          { key: "H", text: "BJK Sicil No," },
          { key: "I", text: "Doğum Yeri," },
          { key: "J", text: "Kan Grubu," },
          { key: "K", text: "Cinsiyet ve Medeni Durum," },
          { key: "L", text: "Yasal düzenlemelerin olanak tanıdığı kapsamda genel toplantı ve etkinlik görsellerini oluşturan fotoğraflar." }
        ]
      },
      {
        title: "3. Kişisel Verilerin Toplanma Yöntemi",
        content: "Kişisel verileriniz, Beşiktaş Kartalları Derneği ile yaptığınız işlemlerle bağlantılı olarak ve otomatik veya otomatik olmayan yollarla, sözlü, yazılı veya elektronik şekilde ve aşağıdaki yöntemler vasıtasıyla toplanmaktadır.",
        items: [
          { key: "A", text: "Beşiktaş Kartalları Derneği'nin internet sitesi üzerinden online olarak yapmış olduğunuz başvurular," },
          { key: "B", text: "İnternet sitesi ziyaretleriniz, sizi tanımak için kullanılan çerezler," },
          { key: "C", text: "Sosyal medya kanalları ve Google vb. arama motorlarının kullanımı." }
        ]
      },
      {
        title: "4. Kişisel Verilerin İşlenme Yöntemi ve Süresi",
        content: "Kişisel verileriniz, derneğimizin web sitesi aracılığıyla online olarak toplanacak ve güvenli bir ortamda saklanacaktır. Veriler, üyelik süresi boyunca ve yasal yükümlülükler gereği saklanacaktır. Verilerinizi yalnızca belirtilen amaçlar doğrultusunda işlemekteyiz."
      },
      {
        title: "5. Kişisel Verilerin Paylaşılması",
        content: "Toplanan kişisel verileriniz, yalnızca yasal yükümlülükler çerçevesinde ve gerekli olduğunda yetkili kamu kurumları ve özel kişilerle paylaşılabilir. Bunun dışında, üçüncü şahıslarla kişisel verileriniz paylaşılmayacaktır."
      },
      {
        title: "6. Kişisel Verilere Erişim ve Düzeltme Hakkı",
        content: "KVKK çerçevesinde, kişisel verilerinize ilişkin olarak; verilerinize erişim sağlama, yanlışlıklarını düzeltme veya silinmesini talep etme hakkınız bulunmaktadır. Bu haklarınızı kullanmak için, derneğimize yazılı olarak başvurabilirsiniz."
      },
      {
        title: "7. Veri Sorumlusu",
        content: "Kişisel verilerinizin işlenmesinden ve korunmasından Beşiktaş Kartalları Derneği sorumludur. İletişim için [dernek iletişim bilgileri eklenebilir]."
      },
      {
        title: "8. Kişisel Veri Sahibinin KVKK Madde 11 Kapsamındaki Hakları",
        content: "Kişisel veri sahibi olarak dilediğiniz zaman, 6698 sayılı Kişisel Verilerin Korunması Kanunu'nun 11. Maddesi uyarınca aşağıda belirtilen haklarınızı veri sorumlusu olan Beşiktaş Kartalları Derneği'nden talep edebilirsiniz. Bu kapsamda sahip olduğunuz haklar aşağıdaki şekildedir:",
        items: [
          { key: "A", text: "Kişisel verilerinizin işlenip işlenmediğini öğrenme," },
          { key: "B", text: "Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme," },
          { key: "C", text: "Kişisel verilerinizin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme," },
          { key: "D", text: "Yurt içinde veya yurt dışında kişisel verilerinizin aktarıldığı üçüncü kişileri bilme," },
          { key: "E", text: "Kişisel verilerinizin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme ve bu kapsamda yapılan işlemin kişisel verilerinizin aktarıldığı üçüncü kişilere bildirilmesini isteme," },
          { key: "F", text: "Kanun'a ve ilgili diğer kanun hükümlerine uygun olarak işlenmiş olmasına rağmen, işlenmesini gerektiren sebeplerin ortadan kalkması hâlinde kişisel verilerin silinmesini veya yok edilmesini isteme ve bu kapsamda yapılan işlemin kişisel verilerinizin aktarıldığı üçüncü kişilere bildirilmesini isteme," },
          { key: "G", text: "İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkması durumunda buna itiraz etme," },
          { key: "H", text: "Kişisel verilerinizin kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme." }
        ]
      },
      {
        title: "",
        content: "Yukarıda belirtilen haklarınızı kullanmak istediğiniz takdirde Beşiktaş Kartalları Derneği'ne yazılı başvuruda veya e posta yoluyla başvuruda bulunmanızı rica ederiz. İletişim için: info@besiktaskartallari.com"
      },
      {
        title: "9. Aydınlatma Metni İle İlgili Onay",
        content: "Bu metni okuduğunuzu ve kişisel verilerinizin yukarıda belirtilen amaçlarla işlenmesine onay verdiğinizi beyan edersiniz. Kişisel verilerinizin toplanması, işlenmesi ve saklanması için verilen onayınız, yasal düzenlemelere uygun olarak alınacaktır."
      }
    ]
  } as KVKKConfig,

  // Footer Configuration
  footer: {
    // Social Media Links
    social: [
      { platform: 'X', icon: X, url: 'https://x.com/1903bekader' },
      { platform: 'Instagram', icon: Instagram, url: 'https://instagram.com/besiktaskartallari2024' },
    ] as SocialLink[],

    // Contact Information
    contact: {
      address: {
        street: 'İkitelli Organize Sanayi Bölgesi İsteks Sanayi Sitesi',
        no: '25',
        district: 'Başakşehir',
        city: 'İstanbul',
        country: 'Türkiye'
      },
      phone: {
        raw: '+905533961903',
        display: '+90 553 396 19 03',
        whatsapp: '905533961903'
      },
      email: {
        raw: 'info@besiktaskartallari.com',
        display: 'info@besiktaskartallari.com'
      }
    } as ContactInfo,

    // Footer Sections
    sections: [
      {
        title: 'Hızlı Erişim',
        links: [
          { label: 'Ana Sayfa', path: '/' },
          { label: 'Faaliyetlerimiz', path: '/faaliyetler' },
          { label: 'Galeri', path: '/galeri' },
          { label: 'Üyelik', path: '/uyelik/odeme' },
          { label: 'İletişim', path: '/iletisim' }
        ]
      },
      {
        title: 'Kurumsal',
        links: [
          { label: 'Hakkımızda', path: '/kurumsal/hakkimizda' },
          { label: 'Yönetim Kurulumuz', path: '/kurumsal/yonetim-kurulu' },
          { label: 'Basında Biz', path: '/kurumsal/basinda-biz' }
        ]
      }
    ] as FooterSection[],

    // Footer styling preferences
    styles: {
      background: 'bg-black',
      textColor: 'text-white',
      linkColor: 'text-gray-400',
      linkHoverColor: 'hover:text-white',
      height: 'h-[220px]',
      borderColor: 'border-gray-800'
    },

    // Copyright text
    copyright: {
      text: '© {year} Beşiktaş Kartalları Derneği. Tüm hakları saklıdır.',
      replaceYear: true
    }
  }
};

export default siteConfig;
