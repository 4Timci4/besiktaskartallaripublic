import Hero from '../components/Hero';
import { Mail } from 'lucide-react';
import { motion, Variant } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Member } from '../types/board';
import { boardService } from '../utils/boardService';
import LoadingSpinner from '../components/LoadingSpinner';

// MemberCard için prop tipi tanımı
interface MemberCardProps {
  member: Member;
  variants: {
    hidden: Variant;
    visible: Variant;
    hover: Variant;
  };
}

// Card variants for animation
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  },
  hover: { 
    y: -10,
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 15 
    }
  }
};

// Kart bileşeni
const MemberCard = ({ member, variants }: MemberCardProps) => {
  const navigate = useNavigate();
  const isPresident = member.is_president;
  
  // Karta tıklandığında, detay sayfasına yönlendiren işlev
  const handleCardClick = () => {
    navigate(`/yonetim-kurulu/${member.id}`);
  };
  
  return (
    <motion.div 
      className="relative bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:shadow-xl"
      variants={variants}
      whileHover="hover"
      onClick={handleCardClick}
    >
      {/* Kart üst kısmı - gradient arka plan ile */}
      <div className="bg-gradient-to-r from-gray-900 to-black h-28 flex items-center justify-center relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-[radial-gradient(circle,_rgba(227,6,19,0.15)_0%,_rgba(0,0,0,0)_70%)]"
        ></div>
        <div 
          className="absolute top-0 right-0 w-24 h-24 bg-besiktas-red rounded-full transform translate-x-1/3 -translate-y-1/3 opacity-20"
        ></div>
        
        {/* Başkan rozeti */}
        {isPresident && (
          <div className="absolute top-2 right-2 bg-besiktas-red text-white text-xs font-bold px-2 py-1 rounded-full z-10">
            Başkan
          </div>
        )}
      </div>
      
      {/* Profil resmi */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
        <div className="w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden">
          <img 
            src={member.image} 
            alt={member.name} 
            className="w-full h-full object-cover object-top"
          />
        </div>
      </div>
      
      {/* Kart içeriği */}
      <div className="pt-20 p-4 text-center">
        <h3 className="text-lg font-bold text-gray-900 mb-1">{member.name}</h3>
        <p className="text-besiktas-red font-semibold mb-3 inline-block px-3 py-0.5 bg-red-50 rounded-full text-xs">
          {member.position}
        </p>
        
        <div className="mt-4">
          <a 
            href={`mailto:${member.email}`}
            className="flex items-center justify-center mx-auto text-xs text-black hover:text-besiktas-red transition-colors group"
            onClick={(e) => e.stopPropagation()} // Ana kart tıklamasını durdur
          >
            <Mail className="w-3 h-3 mr-1.5 text-gray-400 group-hover:text-besiktas-red" />
            <span className="truncate">{member.email}</span>
          </a>
        </div>
        
        <div className="mt-3 mb-2">
          <span className="inline-block px-4 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium hover:bg-besiktas-red hover:text-white transition-colors">
            Özgeçmişi Görüntüle
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const BoardPage = () => {
  const [president, setPresident] = useState<Member | null>(null);
  const [boardMembers, setBoardMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Veri yükleme
  useEffect(() => {
    const loadBoardMembers = async () => {
      try {
        setLoading(true);
        const data = await boardService.getAll();
        setPresident(data.president);
        setBoardMembers(data.boardMembers);
      } catch (err) {
        console.error('Yönetim kurulu verisi yüklenirken hata oluştu:', err);
        setError(err instanceof Error ? err : new Error('Veri yüklenirken bir hata oluştu'));
      } finally {
        setLoading(false);
      }
    };

    loadBoardMembers();
  }, []);


  // Yükleme durumu
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <LoadingSpinner />
      </div>
    );
  }

  // Hata durumu
  if (error) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-xl mx-auto my-12 text-center">
        <h2 className="text-xl font-bold text-red-600 mb-4">Hata Oluştu</h2>
        <p className="text-gray-700 mb-6">Yönetim kurulu bilgileri yüklenirken bir hata oluştu.</p>
        <button 
          onClick={() => window.location.reload()}
          className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-besiktas-red hover:bg-red-700"
        >
          Sayfayı Yenile
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      <Hero 
        title="Yönetim Kurulumuz"
        description="Beşiktaş Kartalları Derneği'ni yöneten değerli üyelerimiz"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="relative mb-16">
          {/* Dekoratif çizgi */}
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          {/* Başlık */}
          <div className="relative flex justify-center">
            <span className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 text-lg font-medium text-gray-900">Yönetim Kadromuz</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Başkan - 4 sütun genişliğinde, ortada */}
          {president && (
            <motion.div 
              className="md:col-span-4 md:col-start-5"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <MemberCard member={president} variants={cardVariants} />
            </motion.div>
          )}
          
          {/* Diğer Yönetim Kurulu Üyeleri - 3 sütunlu grid */}
          <motion.div 
            className="md:col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {boardMembers.map(member => (
              <MemberCard key={member.id} member={member} variants={cardVariants} />
            ))}
          </motion.div>
        </div>
        
        <div className="mt-16 text-center">
          <p className="text-black text-sm">
            Yönetim kurulumuz, derneğimizin amaçları doğrultusunda çalışmalarını sürdürmektedir.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BoardPage;
