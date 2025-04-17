import { useParams, Link } from 'react-router-dom';
import { Mail, ArrowLeft, Award, Briefcase } from 'lucide-react';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import LoadingSpinner from '../components/LoadingSpinner';
import { Member } from '../types/board';
import { boardService } from '../utils/boardService';

const BoardMemberDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadMemberData = async () => {
      if (!id) {
        setError(new Error('Geçersiz üye ID'));
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const data = await boardService.getById(id);
        setMember(data);
      } catch (err) {
        console.error('Üye verisi yüklenirken hata oluştu:', err);
        setError(err instanceof Error ? err : new Error('Veri yüklenirken bir hata oluştu'));
      } finally {
        setLoading(false);
      }
    };

    loadMemberData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-xl mx-auto my-12 text-center">
        <h2 className="text-xl font-bold text-red-600 mb-4">Hata Oluştu</h2>
        <p className="text-black mb-6">Üye bilgileri yüklenirken bir hata oluştu.</p>
        <Link 
          to="/kurumsal/yonetim-kurulu"
          className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-besiktas-red hover:bg-red-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Yönetim Kuruluna Dön
        </Link>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h2 className="text-2xl font-bold mb-4">Üye Bulunamadı</h2>
        <p className="text-black mb-8">Aradığınız yönetim kurulu üyesi bulunamadı.</p>
        <Link 
          to="/kurumsal/yonetim-kurulu"
          className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-besiktas-red hover:bg-red-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Yönetim Kuruluna Dön
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Üst kısım - Geri dön linki */}
        <div className="mb-6">
          <Link 
            to="/kurumsal/yonetim-kurulu"
            className="inline-flex items-center text-black hover:text-besiktas-red transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Yönetim Kuruluna Dön
          </Link>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Üst kısım - Üye bilgileri ve profil resmi */}
          <div className="bg-gradient-to-r from-black via-gray-900 to-black text-white relative p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(227,6,19,0.2)_0%,_rgba(0,0,0,0)_70%)]"></div>
            
            <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row items-center gap-8">
              {/* Profil resmi */}
              <motion.div 
                className="w-40 h-40 md:w-48 md:h-48 rounded-full border-4 border-white shadow-xl overflow-hidden flex-shrink-0"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
              >
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover object-top"
                />
              </motion.div>
              
              {/* Üye bilgileri */}
              <motion.div 
                className="flex flex-col items-center md:items-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">{member.name}</h1>
                <div className="inline-block bg-besiktas-red px-4 py-1 rounded-full text-white font-medium mb-4">
                  {member.position}
                </div>
                
                <div className="flex items-center space-x-4">
                  <a 
                    href={`mailto:${member.email}`}
                    className="flex items-center space-x-2 text-black hover:text-white transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    <span>{member.email}</span>
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
          
          {/* Özgeçmiş kısmı */}
          <div className="py-10 px-6">
            <motion.div
              className="max-w-4xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold mb-6 border-b pb-3 flex items-center text-black">
                <Award className="w-5 h-5 mr-2 text-besiktas-red" /> Özgeçmiş
              </h2>
              
              <p className="text-black leading-relaxed mb-6 whitespace-pre-line">
                {member.bio || "Özgeçmiş bilgisi bulunmamaktadır."}
              </p>
              
              {/* İletişim bilgileri */}
              <div className="bg-gray-50 p-6 rounded-lg mt-10">
                <h3 className="text-lg font-semibold mb-4 flex items-center text-black">
                  <Briefcase className="w-5 h-5 mr-2 text-besiktas-red" /> Görev ve İletişim Bilgileri
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <span className="w-24 font-medium text-black">Görev:</span>
                    <span className="text-black">{member.position}</span>
                  </div>
                  
                  <div className="flex items-start">
                    <span className="w-24 font-medium text-black">E-posta:</span>
                    <a href={`mailto:${member.email}`} className="text-besiktas-red hover:underline">
                      {member.email}
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardMemberDetailPage;
