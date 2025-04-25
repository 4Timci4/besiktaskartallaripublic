import React from 'react';
import { useState, useEffect, useRef } from 'react';
import supabase, { activitiesApi, storageApi } from '../utils/supabase';
import AdminLayout from '../components/AdminLayout';
import { Activity } from '../utils/supabase';
import { Edit, Trash2, Plus, Eye, EyeOff } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function AdminActivitiesPage() {
  const quillRef = useRef<ReactQuill>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    description: '',
    image: '',
    is_active: true,
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Quill editor helper functions
  
  // Dosyayı yükleyip editöre ekleyen yardımcı fonksiyon
  const uploadImageToEditor = async (file: File) => {
    setUploading(true);
    
    try {
      const uploadResult = await storageApi.uploadFile(file, 'activities');
      const imageUrl = uploadResult.url;
      
      // Quill editörüne resmi ekle
      const quill = quillRef.current?.getEditor();
      if (quill) {
        const range = quill.getSelection();
        if (range) {
          quill.insertEmbed(range.index, 'image', imageUrl);
          // Resim ekledikten sonra imleci bir sonraki pozisyona taşı
          quill.setSelection({ index: range.index + 1, length: 0 });
        } else {
          // Eğer seçim yoksa, en sona ekle
          const length = quill.getLength();
          quill.insertEmbed(length - 1, 'image', imageUrl);
          quill.setSelection({ index: length, length: 0 });
        }
      }
    } catch (error: Error | unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setError(`Resim yükleme hatası: ${errorMessage}`);
    } finally {
      setUploading(false);
    }
  };
  
  // Panoya yapıştırılan resimleri işleme fonksiyonu
  const handlePaste = (e: React.ClipboardEvent) => {
    const clipboard = e.clipboardData;
    
    // Panoda resim var mı kontrol et
    if (clipboard && clipboard.items) {
      for (let i = 0; i < clipboard.items.length; i++) {
        const item = clipboard.items[i];
        
        // Resim tipinde mi kontrol et
        if (item.type.indexOf('image') !== -1) {
          e.preventDefault(); // Varsayılan yapıştırma davranışını engelle
          
          const file = item.getAsFile();
          if (file) {
            uploadImageToEditor(file);
          }
          break;
        }
      }
    }
  };
  
  // Quill içeriğini güncelle
  const handleQuillChange = (content: string) => {
    setFormData({ ...formData, description: content });
  };

  // Faaliyetleri getir
  const fetchActivities = async () => {
    setLoading(true);
    try {
      const data = await activitiesApi.getAllForAdmin();
      setActivities(data || []);
    } catch (error: Error | unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Faaliyetler getirilirken hata oluştu:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  // Form verilerini güncelle
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Checkbox değişikliklerini işle
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
  };

  // Dosya seçimini işle
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  // Faaliyet düzenleme
  const handleEditActivity = (activity: Activity) => {
    setEditingActivity(activity);
    setFormData({
      title: activity.title,
      date: activity.date.split('T')[0], // Sadece tarih kısmını al
      description: activity.description,
      image: activity.image,
      is_active: activity.is_active,
    });
    setSelectedFile(null); // Düzenleme sırasında dosya seçimini sıfırla
    setShowModal(true);
  };

  // Yeni faaliyet ekleme
  const handleAddActivity = () => {
    setEditingActivity(null);
    setFormData({
      title: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
      image: '',
      is_active: true,
    });
    setSelectedFile(null);
    setShowModal(true);
  };

  // Form kaydetme
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setUploading(true);

    try {
      // Form doğrulaması
      if (!formData.title || !formData.date || !formData.description) {
        setError('Lütfen başlık, tarih ve açıklama alanlarını doldurun');
        setUploading(false);
        return;
      }

      // Yeni bir faaliyet eklerken veya dosya seçilmişse dosya yükleme işlemi yap
      let imageUrl = formData.image;
      
      if (selectedFile) {
        try {
          const uploadResult = await storageApi.uploadFile(selectedFile, 'activities');
          imageUrl = uploadResult.url;
        } catch (uploadError: Error | unknown) {
          const errorMessage = uploadError instanceof Error ? uploadError.message : String(uploadError);
          setError(`Dosya yükleme hatası: ${errorMessage}`);
          setUploading(false);
          return;
        }
      } else if (!editingActivity && !formData.image) {
        // Yeni öğe ekliyorsa ve dosya seçilmemişse hata ver
        setError('Lütfen bir görsel dosyası seçin');
        setUploading(false);
        return;
      }

      if (editingActivity) {
        // Mevcut faaliyeti güncelle
        const { error } = await supabase
          .from('activities')
          .update({
            title: formData.title,
            date: formData.date,
            description: formData.description,
            image: imageUrl,
            is_active: formData.is_active,
          })
          .eq('id', editingActivity.id);

        if (error) throw error;
        setSuccess('Faaliyet başarıyla güncellendi');
      } else {
        // Yeni faaliyet ekle
        const { error } = await supabase
          .from('activities')
          .insert([
            {
              title: formData.title,
              date: formData.date,
              description: formData.description,
              image: imageUrl,
              is_active: formData.is_active,
            },
          ]);

        if (error) throw error;
        setSuccess('Faaliyet başarıyla eklendi');
      }

      // Faaliyetleri yeniden yükle ve modalı kapat
      fetchActivities();
      setShowModal(false);
    } catch (error: Error | unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setError(`İşlem sırasında hata oluştu: ${errorMessage}`);
      console.error('Form gönderilirken hata oluştu:', error);
    } finally {
      setUploading(false);
    }
  };

  // Faaliyet silme
  const handleDeleteActivity = async (id: string) => {
    if (window.confirm('Bu faaliyeti silmek istediğinizden emin misiniz?')) {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      try {
        console.log(`Silinecek faaliyet ID: ${id}`);
        
        // Önce kaydın var olduğunu doğrulayalım
        const { data: existingRecord, error: checkError } = await supabase
          .from('activities')
          .select('id, image')
          .eq('id', id)
          .single();
          
        if (checkError) {
          console.error('Kayıt kontrol edilirken hata:', checkError);
          throw new Error(`Kayıt bulunamadı veya erişilemiyor: ${checkError.message}`);
        }
        
        if (!existingRecord) {
          throw new Error(`ID: ${id} ile kayıt bulunamadı.`);
        }
        
        console.log('Silme öncesi kayıt bulundu:', existingRecord);
        
        // Önce resmi sil
        if (existingRecord.image) {
          try {
            await storageApi.deleteFile(existingRecord.image);
            console.log('İlişkili resim silindi:', existingRecord.image);
          } catch (imageError) {
            console.error('Resim silinirken hata oluştu, kayıt silmeye devam ediliyor:', imageError);
          }
        }
        
        // Silme işlemini gerçekleştir
        const { error: deleteError, data } = await supabase
          .from('activities')
          .delete()
          .match({ id: id });  // .eq yerine .match kullanarak denemek

        if (deleteError) {
          console.error('Supabase silme hatası:', deleteError);
          throw deleteError;
        }
        
        console.log('Silme işlemi yanıtı:', data);
        
        // Silme işleminin gerçekten gerçekleşip gerçekleşmediğini kontrol et
        const { data: checkAfterDelete, error: verifyError } = await supabase
          .from('activities')
          .select('id')
          .eq('id', id)
          .single();
          
        if (verifyError && verifyError.code === 'PGRST116') {
          // PGRST116: kayıt bulunamadı hatası - bu iyi bir şey, silme işlemi başarılı olmuş demektir
          console.log('Silme doğrulandı: Kayıt artık mevcut değil');
          setSuccess('Faaliyet başarıyla silindi');
          
          // Listeden kaldır (UI güncellemesi)
          setActivities(activities.filter(activity => activity.id !== id));
          
          // Veritabanından güncel verileri al
          await fetchActivities();
        } else if (!verifyError && checkAfterDelete) {
          // Kayıt hala duruyor, silme işlemi başarısız
          throw new Error('Silme işlemi gerçekleştirildi ancak kayıt hala veritabanında mevcut.');
        } else if (verifyError) {
          // Başka bir hata
          console.error('Silme doğrulama hatası:', verifyError);
          throw new Error(`Silme doğrulanamadı: ${verifyError.message}`);
        }
      } catch (error: Error | unknown) {
        console.error('Detaylı silme hatası:', error);
        const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen hata';
        setError(`Silme işlemi sırasında hata oluştu: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    }
  };

  // Faaliyet görünürlüğünü değiştir
  const toggleActivityVisibility = async (activity: Activity) => {
    try {
      const { error } = await supabase
        .from('activities')
        .update({ is_active: !activity.is_active })
        .eq('id', activity.id);

      if (error) throw error;
      fetchActivities();
    } catch (error: Error | unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setError(`Görünürlük değiştirilirken hata oluştu: ${errorMessage}`);
      console.error('Görünürlük değiştirilirken hata oluştu:', error);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Faaliyetler</h1>
          <button
            onClick={handleAddActivity}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="-ml-1 mr-2 h-5 w-5" /> Yeni Faaliyet Ekle
          </button>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="rounded-md bg-green-50 p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">{success}</h3>
              </div>
            </div>
          </div>
        )}

        {/* Faaliyetler Listesi */}
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {activities.length === 0 ? (
                <li className="px-6 py-4 text-center text-gray-500">Henüz hiç faaliyet bulunmuyor</li>
              ) : (
                activities.map((activity) => (
                  <li key={activity.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-16 w-16">
                          <img
                            className="h-16 w-16 rounded object-cover"
                            src={activity.image}
                            alt={activity.title}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150';
                            }}
                          />
                        </div>
                        <div className="ml-4">
                          <h4 className="text-lg font-medium text-gray-900">{activity.title}</h4>
                          <p className="text-sm text-gray-500">{new Date(activity.date).toLocaleDateString('tr-TR')}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleActivityVisibility(activity)}
                          className={`text-sm px-2 py-1 rounded-md ${activity.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                        >
                          {activity.is_active ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleEditActivity(activity)}
                          className="bg-gray-100 rounded-md p-2 text-black hover:bg-gray-200"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteActivity(activity.id)}
                          className="bg-red-100 rounded-md p-2 text-red-600 hover:bg-red-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}

        {/* Faaliyet Ekleme/Düzenleme Modalı - Yeniden Tasarlanmış */}
        {showModal && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Overlay */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" 
              onClick={() => setShowModal(false)}
              aria-hidden="true"
            ></div>
            
            {/* Modal Container */}
            <div className="flex items-center justify-center min-h-screen p-4">
              <div 
                className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl mx-auto overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {editingActivity ? 'Faaliyeti Düzenle' : 'Yeni Faaliyet Ekle'}
                  </h2>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="sr-only">Kapat</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                {/* Modal Body */}
                <div className="px-6 py-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Başlık */}
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                        Başlık
                      </label>
                      <input
                        type="text"
                        name="title"
                        id="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    {/* Tarih */}
                    <div>
                      <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                        Tarih
                      </label>
                      <input
                        type="date"
                        name="date"
                        id="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    {/* Açıklama - Quill Editör */}
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Açıklama
                      </label>
                      <div 
                        className="quill-container border border-gray-300 rounded-md overflow-hidden relative" 
                        style={{ 
                          minHeight: '200px', 
                          maxHeight: '600px',
                          resize: 'vertical'
                        }}
                      >
                        <div onPaste={handlePaste}>
                          <ReactQuill
                            ref={quillRef}
                            value={formData.description}
                            onChange={handleQuillChange}
                            modules={{
                              toolbar: [
                                ['bold', 'italic', 'underline'],
                                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                                ['link', 'image']
                              ]
                            }}
                            formats={['bold', 'italic', 'underline', 'list', 'bullet', 'link', 'image']}
                            placeholder="Faaliyet açıklamasını giriniz... (Resim eklemek için Ctrl+V ile yapıştırabilirsiniz)"
                            style={{ height: '100%', minHeight: '180px' }}
                          />
                        </div>
                        {/* Boyutlandırma tutamacı */}
                        <div 
                          className="absolute bottom-0 right-0 w-4 h-4 cursor-ns-resize opacity-50 hover:opacity-100"
                          title="Boyutlandırmak için sürükleyin"
                        >
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="16" 
                            height="16" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                          >
                            <polyline points="7 8 3 12 7 16"></polyline>
                            <polyline points="17 8 21 12 17 16"></polyline>
                            <line x1="3" y1="12" x2="21" y2="12"></line>
                          </svg>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1 flex items-center">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="12" 
                          height="12" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                          className="mr-1"
                        >
                          <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"></path>
                          <path d="M7 10L12 15L17 10"></path>
                          <path d="M12 15V3"></path>
                        </svg>
                        Editörü boyutlandırmak için alt kenarı sürükleyin
                      </div>
                    </div>

                    {/* Görsel */}
                    <div>
                      <label htmlFor="imageUpload" className="block text-sm font-medium text-gray-700 mb-1">
                        Görsel
                      </label>
                      <div className="flex items-center">
                        <input
                          type="file"
                          id="imageUpload"
                          onChange={handleFileChange}
                          accept="image/*"
                          className="sr-only"
                        />
                        <label
                          htmlFor="imageUpload"
                          className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                        >
                          <span>Dosya Seç</span>
                        </label>
                        <span className="ml-2 text-sm text-gray-500">
                          {selectedFile ? selectedFile.name : editingActivity?.image ? 'Mevcut görsel kullanılacak' : 'Dosya seçilmedi'}
                        </span>
                      </div>
                      
                      {/* Görsel Önizleme */}
                      {(formData.image || selectedFile) && (
                        <div className="mt-3">
                          <p className="text-xs text-gray-500 mb-1">Görsel Önizleme:</p>
                          <div className="h-40 w-40 relative border rounded overflow-hidden">
                            <img
                              src={selectedFile ? URL.createObjectURL(selectedFile) : formData.image}
                              alt="Önizleme"
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150';
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Aktif/Pasif */}
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        name="is_active"
                        id="is_active"
                        checked={formData.is_active}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                        Aktif (Görünür)
                      </label>
                    </div>
                  </form>
                </div>
                
                {/* Modal Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    İptal
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={uploading}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {uploading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Yükleniyor...
                      </>
                    ) : (
                      'Kaydet'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminActivitiesPage;
