import { useEffect, useState, useCallback } from 'react';
import AdminLayout from '../components/AdminLayout';
import { boardService } from '../utils/boardService';
import { Member } from '../types/board';
import { Plus, Edit, Trash2, User, Users } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

function AdminBoardPage() {
  // Veri durumları
  const [boardData, setBoardData] = useState<{
    president: Member | null;
    boardMembers: Member[];
  }>({
    president: null,
    boardMembers: []
  });
  const [loading, setLoading] = useState(true);
  
  // Modal durumları
  const [modalState, setModalState] = useState({
    isModalOpen: false,
    isDeleteModalOpen: false,
    currentMember: null as Member | null,
    memberToDelete: null as Member | null,
  });
  
  // Form durumları
  const [formData, setFormData] = useState<Member>({
    id: '',
    name: '',
    position: '',
    email: '',
    image: '',
    bio: '',
    is_president: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Bildirim durumları
  const [notification, setNotification] = useState<{
    error: string | null;
    success: string | null;
  }>({
    error: null,
    success: null
  });

  // Veri yükleme işlevi
  const fetchBoardMembers = useCallback(async () => {
    setLoading(true);
    setNotification(prev => ({ ...prev, error: null }));
    try {
      const data = await boardService.getAll();
      setBoardData({
        president: data.president,
        boardMembers: data.boardMembers || []
      });
      
      // Eğer veri yoksa kullanıcıya bilgi ver
      if (!data.president && (!data.boardMembers || data.boardMembers.length === 0)) {
        setNotification({
          error: 'Veritabanında yönetim kurulu verisi bulunamadı. "JSON Verilerini Aktar" butonunu kullanarak verileri aktarabilirsiniz.',
          success: null
        });
      }
    } catch (error) {
      console.error('Yönetim kurulu verilerini getirirken hata oluştu:', error);
      setNotification({
        error: 'Veritabanından yönetim kurulu verilerini getirirken hata oluştu. Lütfen daha sonra tekrar deneyin.',
        success: null
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBoardMembers();
  }, [fetchBoardMembers]);

  // Modal işlevleri
  const handleAddMember = useCallback(() => {
    setModalState(prev => ({
      ...prev,
      currentMember: null,
      isModalOpen: true
    }));
    setFormData({
      id: '',
      name: '',
      position: '',
      email: '',
      image: '',
      bio: '',
      is_president: false
    });
  }, []);

  const handleEditMember = useCallback((member: Member) => {
    setModalState(prev => ({
      ...prev,
      currentMember: member,
      isModalOpen: true
    }));
    setFormData({ ...member });
  }, []);

  const handleDeleteMember = useCallback((member: Member) => {
    setModalState(prev => ({
      ...prev,
      memberToDelete: member,
      isDeleteModalOpen: true
    }));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setNotification({ error: null, success: null });
    
    try {
      let result;
      
      if (modalState.currentMember) {
        // Mevcut üyeyi güncelle
        result = await boardService.updateMember(formData);
        if (result.success) {
          setNotification({
            error: null,
            success: 'Üye başarıyla güncellendi.'
          });
          fetchBoardMembers();
          setModalState(prev => ({ ...prev, isModalOpen: false }));
        } else {
          setNotification({
            error: 'Üye güncellenirken bir hata oluştu.',
            success: null
          });
        }
      } else {
        // Yeni üye ekle
        result = await boardService.addMember(formData);
        if (result.success) {
          setNotification({
            error: null,
            success: 'Üye başarıyla eklendi.'
          });
          fetchBoardMembers();
          setModalState(prev => ({ ...prev, isModalOpen: false }));
        } else {
          setNotification({
            error: 'Üye eklenirken bir hata oluştu.',
            success: null
          });
        }
      }
    } catch (error) {
      console.error('Form gönderilirken hata oluştu:', error);
      setNotification({
        error: 'Form gönderilirken bir hata oluştu.',
        success: null
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [fetchBoardMembers, formData, modalState.currentMember]);

  const handleConfirmDelete = useCallback(async () => {
    if (!modalState.memberToDelete) return;
    
    try {
      const result = await boardService.deleteMember(modalState.memberToDelete.id);
      if (result.success) {
        setNotification({
          error: null,
          success: 'Üye başarıyla silindi.'
        });
        fetchBoardMembers();
        setModalState(prev => ({ ...prev, isDeleteModalOpen: false }));
      } else {
        setNotification({
          error: 'Üye silinirken bir hata oluştu.',
          success: null
        });
      }
    } catch (error) {
      console.error('Üye silinirken hata oluştu:', error);
      setNotification({
        error: 'Üye silinirken bir hata oluştu.',
        success: null
      });
    }
  }, [fetchBoardMembers, modalState.memberToDelete]);

  const handleMigrateData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await boardService.migrateJsonToDatabase();
      if (result.success) {
        setNotification({
          error: null,
          success: 'Veriler başarıyla veritabanına aktarıldı.'
        });
        fetchBoardMembers();
      } else {
        setNotification({
          error: 'Veriler aktarılırken bir hata oluştu.',
          success: null
        });
      }
    } catch (error) {
      console.error('Veri migrasyonu sırasında hata oluştu:', error);
      setNotification({
        error: 'Veri migrasyonu sırasında bir hata oluştu.',
        success: null
      });
    } finally {
      setLoading(false);
    }
  }, [fetchBoardMembers]);

  return (
    <AdminLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Yönetim Kurulu</h1>
          <div className="flex space-x-2">
            <button
              onClick={handleAddMember}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center"
            >
              <Plus className="h-5 w-5 mr-1" /> Yeni Üye Ekle
            </button>
            <button
              onClick={handleMigrateData}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
              disabled={loading}
            >
              {loading ? <LoadingSpinner size="sm" /> : <Users className="h-5 w-5 mr-1" />} JSON Verilerini Aktar
            </button>
          </div>
        </div>

        {notification.error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {notification.error}
          </div>
        )}

        {notification.success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {notification.success}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            {/* Başkan Bölümü */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <User className="h-6 w-6 text-indigo-600 mr-2" /> Başkan
              </h2>
            {boardData.president ? (
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                  <div className="w-32 h-32 rounded-full overflow-hidden shadow-lg flex-shrink-0 border-4 border-white">
                    <img 
                      src={boardData.president.image} 
                      alt={boardData.president.name} 
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-lg font-medium">{boardData.president.name}</h3>
                    <p className="text-black">{boardData.president.position}</p>
                    <p className="text-gray-500 text-sm">{boardData.president.email}</p>
                    <p className="text-gray-700 mt-2 line-clamp-2">{boardData.president.bio}</p>
                  </div>
                  <div className="flex space-x-2 mt-2 md:mt-0">
                    <button
                      onClick={() => handleEditMember(boardData.president!)}
                      className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-2 rounded"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-gray-500">Başkan bilgisi bulunamadı.</div>
              )}
            </div>

            {/* Yönetim Kurulu Üyeleri */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Users className="h-6 w-6 text-indigo-600 mr-2" /> Yönetim Kurulu Üyeleri
              </h2>
              
              {boardData.boardMembers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {boardData.boardMembers.map((member) => (
                    <div key={member.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3">
                      <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg flex-shrink-0 border-4 border-white">
                          <img 
                            src={member.image} 
                            alt={member.name} 
                            className="w-full h-full object-cover object-top"
                          />
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-medium">{member.name}</h3>
                          <p className="text-black text-sm">{member.position}</p>
                          <p className="text-gray-500 text-xs">{member.email}</p>
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm mt-3 line-clamp-3">{member.bio}</p>
                      <div className="flex justify-end space-x-2 mt-3">
                        <button
                          onClick={() => handleEditMember(member)}
                          className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-1.5 rounded"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteMember(member)}
                          className="bg-red-100 hover:bg-red-200 text-red-700 p-1.5 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500">Yönetim kurulu üyesi bulunamadı.</div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Üye Ekleme/Düzenleme Modal */}
      {modalState.isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                {modalState.currentMember ? 'Üye Düzenle' : 'Yeni Üye Ekle'}
              </h2>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      İsim
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pozisyon
                    </label>
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      E-posta
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Resim URL
                    </label>
                    <input
                      type="text"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Biyografi
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio || ''}
                      onChange={handleInputChange}
                      rows={5}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="is_president"
                        checked={formData.is_president || false}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-indigo-600 border-gray-300 rounded mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">Başkan olarak işaretle</span>
                    </label>
                  </div>
                </div>
                
                {notification.error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {notification.error}
                  </div>
                )}
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setModalState(prev => ({ ...prev, isModalOpen: false }))}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
                  >
                    {isSubmitting ? <LoadingSpinner size="sm" /> : null}
                    {modalState.currentMember ? 'Güncelle' : 'Ekle'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Silme Onay Modalı */}
      {modalState.isDeleteModalOpen && modalState.memberToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Üye Sil</h2>
              <p className="mb-4">
                <strong>{modalState.memberToDelete.name}</strong> isimli üyeyi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setModalState(prev => ({ ...prev, isDeleteModalOpen: false }))}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  İptal
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Sil
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminBoardPage;
