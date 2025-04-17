import supabase, { galleryApi, storageApi } from '../utils/supabase';
import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { GalleryItem } from '../utils/supabase';
import { Edit, Trash2, Plus, Eye, EyeOff } from 'lucide-react';

function AdminGalleryPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    display_order: 0,
    is_active: true, // Pasif/aktif durumu için varsayılan değer
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [bulkUploading, setBulkUploading] = useState(false);
  const [bulkFiles, setBulkFiles] = useState<File[]>([]);
  const [bulkProgress, setBulkProgress] = useState<number>(0);
  const [showBulkModal, setShowBulkModal] = useState(false);

  // Galeri öğelerini getir
  const fetchGalleryItems = async () => {
    setLoading(true);
    try {
      const data = await galleryApi.getAllForAdmin();
      setGalleryItems(data || []);
    } catch (error: Error | unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Galeri öğeleri getirilirken hata oluştu:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  // Form verilerini güncelle
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

  // Galeri öğesi düzenleme
  const handleEditItem = (item: GalleryItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      image: item.image,
      display_order: item.display_order,
      is_active: item.is_active !== undefined ? item.is_active : true, // is_active yoksa true kabul et
    });
    setSelectedFile(null); // Düzenleme sırasında dosya seçimini sıfırla
    setShowModal(true);
  };

  // Yeni galeri öğesi ekleme
  const handleAddItem = () => {
    setEditingItem(null);
    
    setFormData({
      title: '',
      image: '',
      display_order: 0,
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
      if (!formData.title) {
        setError('Lütfen başlık alanını doldurun');
        setUploading(false);
        return;
      }

      // Yeni bir öğe eklerken veya dosya seçilmişse dosya yükleme işlemi yap
      let imageUrl = formData.image;
      
      if (selectedFile) {
        try {
          const uploadResult = await storageApi.uploadFile(selectedFile, 'gallery');
          imageUrl = uploadResult.url;
        } catch (uploadError: Error | unknown) {
          const errorMessage = uploadError instanceof Error ? uploadError.message : String(uploadError);
          setError(`Dosya yükleme hatası: ${errorMessage}`);
          setUploading(false);
          return;
        }
      } else if (!editingItem && !formData.image) {
        // Yeni öğe ekliyorsa ve dosya seçilmemişse hata ver
        setError('Lütfen bir görsel dosyası seçin');
        setUploading(false);
        return;
      }

      if (editingItem) {
        // Mevcut öğeyi güncelle
        const { error } = await supabase
          .from('gallery')
          .update({
            title: formData.title,
            image: imageUrl,
            is_active: formData.is_active,
          })
          .eq('id', editingItem.id);

        if (error) throw error;
        setSuccess('Galeri öğesi başarıyla güncellendi');
      } else {
        // Yeni öğe ekle
        const timestamp = Math.floor(Date.now() / 1000); // Saniye cinsinden timestamp (daha küçük sayı)
        const { error } = await supabase
          .from('gallery')
          .insert([
            {
              title: formData.title,
              image: imageUrl,
              display_order: timestamp,
              is_active: formData.is_active,
            },
          ]);

        if (error) throw error;
        setSuccess('Galeri öğesi başarıyla eklendi');
      }

      // Galeri öğelerini yeniden yükle ve modalı kapat
      fetchGalleryItems();
      setShowModal(false);
    } catch (error: Error | unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setError(`İşlem sırasında hata oluştu: ${errorMessage}`);
      console.error('Form gönderilirken hata oluştu:', error);
    } finally {
      setUploading(false);
    }
  };

  // Öğe silme
  const handleDeleteItem = async (id: string) => {
    if (window.confirm('Bu galeri öğesini silmek istediğinizden emin misiniz?')) {
      try {
        // Önce resmi bul
        const itemToDelete = galleryItems.find(item => item.id === id);
        
        if (itemToDelete && itemToDelete.image) {
          // Eğer resim URL'si varsa, resmi de sil
          try {
            await storageApi.deleteFile(itemToDelete.image);
          } catch (imageError) {
            console.error('Resim silinirken hata oluştu, kayıt silmeye devam ediliyor:', imageError);
          }
        }
        
        const { error } = await supabase
          .from('gallery')
          .delete()
          .eq('id', id);

        if (error) throw error;
        setSuccess('Galeri öğesi başarıyla silindi');
        fetchGalleryItems();
      } catch (error: Error | unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        setError(`Silme işlemi sırasında hata oluştu: ${errorMessage}`);
        console.error('Galeri öğesi silinirken hata oluştu:', error);
      }
    }
  };

  // Galeri öğesi görünürlüğünü değiştir
  const toggleItemVisibility = async (item: GalleryItem) => {
    try {
      const { error } = await supabase
        .from('gallery')
        .update({ is_active: !item.is_active })
        .eq('id', item.id);

      if (error) throw error;
      fetchGalleryItems();
      setSuccess(`Galeri öğesi ${!item.is_active ? 'görünür' : 'gizli'} duruma getirildi`);
    } catch (error: Error | unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setError(`Görünürlük değiştirilirken hata oluştu: ${errorMessage}`);
      console.error('Görünürlük değiştirilirken hata oluştu:', error);
    }
  };

  // Toplu yükleme modalını aç
  const handleBulkUpload = () => {
    setBulkFiles([]);
    setBulkProgress(0);
    setShowBulkModal(true);
  };

  // Toplu dosya seçimi
  const handleBulkFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      
      // Sadece görsel dosyalarını kabul et
      const imageFiles = filesArray.filter(file => file.type.startsWith('image/'));
      
      setBulkFiles(imageFiles);
    }
  };

  // Toplu yükleme işlemi
  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setBulkUploading(true);
    setBulkProgress(0);

    try {
      if (bulkFiles.length === 0) {
        setError('Lütfen en az bir görsel dosyası seçin');
        setBulkUploading(false);
        return;
      }

      // Dosya sayısı kontrolü
      if (bulkFiles.length > 100) {
        setError('Bir seferde en fazla 100 dosya yükleyebilirsiniz');
        setBulkUploading(false);
        return;
      }

      // Toplam başarılı yükleme sayısı
      let successCount = 0;
      let errorCount = 0;
      
      // Timestamp temel değeri (tüm dosyalar için aynı zamanda yüklenme etkisi)
      const baseTimestamp = Math.floor(Date.now() / 1000);
      
      // Aynı anda yürütülecek yükleme işlemi sayısını sınırlayalım (5 paralel işlem)
      const BATCH_SIZE = 5;
      
      // Dosyaları gruplar halinde işleyelim
      for (let i = 0; i < bulkFiles.length; i += BATCH_SIZE) {
        const currentBatch = bulkFiles.slice(i, i + BATCH_SIZE);
        
        // Batch içindeki dosyaları paralel olarak işle
        const batchResults = await Promise.allSettled(
          currentBatch.map(async (file, batchIndex) => {
            const index = i + batchIndex;
            
            try {
              // Dosya adını işle
              let fileName = file.name.split('.')[0];
              
              // Özel karakterleri temizle
              fileName = fileName
                .replace(/[^\wıİğĞüÜşŞöÖçÇ\s]/g, '') // Sayılar, harfler ve Türkçe karakterler dışındakileri kaldır
                .replace(/\s+/g, ' ')                 // Çoklu boşlukları tek boşluğa dönüştür
                .trim();                              // Baştaki ve sondaki boşlukları kaldır
              
              // Dosya adı boşsa veya çok kısaysa otomatik isim ver
              if (!fileName || fileName.length < 3) {
                fileName = `Galeri Öğesi ${baseTimestamp + index}`;
              }
              
              // 1. Dosyayı storage'a yükle
              const uploadResult = await storageApi.uploadFile(file, 'gallery');
              
              // 2. Gallery tablosuna kayıt ekle
              const timestamp = baseTimestamp + index; // Her kayıt için sıralı timestamp
              const { error } = await supabase
                .from('gallery')
                .insert([
                  {
                    title: fileName, 
                    image: uploadResult.url,
                    display_order: timestamp,
                    is_active: true,
                  },
                ]);
                
              if (error) throw error;
              
              return { success: true };
            } catch (error) {
              console.error(`${file.name} dosyası yüklenirken hata oluştu:`, error);
              return { 
                success: false, 
                fileName: file.name,
                error 
              };
            }
          })
        );
        
        // Batch sonuçlarını değerlendir
        batchResults.forEach(result => {
          if (result.status === 'fulfilled' && result.value.success) {
            successCount++;
          } else {
            errorCount++;
          }
        });
        
        // İlerleme durumunu güncelle
        setBulkProgress(Math.floor(((i + currentBatch.length) / bulkFiles.length) * 100));
        
        // Kısa bir bekleme ile sunucuya yük binmesini önleyelim
        if (i + BATCH_SIZE < bulkFiles.length) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      
      // Tüm dosyalar işlendikten sonra
      if (successCount === 0) {
        setError('Hiçbir dosya yüklenemedi, lütfen tekrar deneyin.');
      } else if (errorCount > 0) {
        setSuccess(`${successCount} galeri öğesi başarıyla yüklendi. ${errorCount} dosya yüklenemedi.`);
      } else {
        setSuccess(`${successCount} galeri öğesi başarıyla yüklendi.`);
      }
      
      // Galeri öğelerini yeniden yükle ve modalı kapat
      fetchGalleryItems();
      setShowBulkModal(false);
    } catch (error: Error | unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setError(`Toplu yükleme sırasında hata oluştu: ${errorMessage}`);
      console.error('Toplu yükleme sırasında hata oluştu:', error);
    } finally {
      setBulkUploading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Galeri</h1>
          <div className="flex space-x-2">
            <button
              onClick={handleBulkUpload}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <Plus className="-ml-1 mr-2 h-5 w-5" /> Toplu Resim Yükle
            </button>
            <button
              onClick={handleAddItem}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="-ml-1 mr-2 h-5 w-5" /> Yeni Galeri Öğesi Ekle
            </button>
          </div>
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

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {galleryItems.length === 0 ? (
                <li className="px-6 py-4 text-center text-gray-500">Henüz hiç galeri öğesi eklenmemiş</li>
              ) : (
                galleryItems.map((item) => (
                  <li key={item.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-16 w-16">
                          <img
                            className="h-16 w-16 rounded object-cover"
                            src={item.image}
                            alt={item.title}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150';
                            }}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">
                            {item.title}
                            {item.is_active === false && (
                              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                Pasif
                              </span>
                            )}
                          </div>
                          <div className="mt-1">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Sıra: {item.display_order}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => toggleItemVisibility(item)}
                          className={`p-2 rounded-full ${
                            item.is_active !== false
                              ? 'text-green-500 hover:bg-green-50'
                              : 'text-gray-500 hover:bg-gray-50'
                          }`}
                          title={item.is_active !== false ? 'Gizle' : 'Göster'}
                        >
                          {item.is_active !== false ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                        </button>
                        <button
                          onClick={() => handleEditItem(item)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full"
                          title="Düzenle"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                          title="Sil"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}

        {/* Galeri Öğesi Ekleme/Düzenleme Modalı */}
        {showModal && (
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen px-4">
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowModal(false)}></div>
              <div className="relative bg-white rounded-lg max-w-3xl w-full p-6">
                <div className="mb-4 border-b pb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {editingItem ? 'Galeri Öğesini Düzenle' : 'Yeni Galeri Öğesi Ekle'}
                  </h2>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 gap-4">
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

                    <div>
                      <label htmlFor="imageUpload" className="block text-sm font-medium text-gray-700">
                        Görsel
                      </label>
                      <div className="mt-1 flex items-center">
                        <input
                          type="file"
                          id="imageUpload"
                          onChange={handleFileChange}
                          accept="image/*"
                          className="sr-only"
                        />
                        <label
                          htmlFor="imageUpload"
                          className="relative cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                        >
                          <span>Dosya Seç</span>
                        </label>
                        <span className="ml-2 text-sm text-gray-500">
                          {selectedFile ? selectedFile.name : editingItem?.image ? 'Mevcut görsel kullanılacak' : 'Dosya seçilmedi'}
                        </span>
                      </div>
                      
                      {/* Mevcut resim önizleme */}
                      {(formData.image || selectedFile) && (
                        <div className="mt-2">
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
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      İptal
                    </button>
                    <button
                      type="submit"
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
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Toplu Yükleme Modalı */}
      {showBulkModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => !bulkUploading && setShowBulkModal(false)}></div>
            <div className="relative bg-white rounded-lg max-w-3xl w-full p-6">
              <div className="mb-4 border-b pb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Toplu Galeri Öğesi Yükleme
                </h2>
              </div>

              <form onSubmit={handleBulkSubmit}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="bulkImageUpload" className="block text-sm font-medium text-gray-700">
                      Görseller (Birden fazla seçebilirsiniz)
                    </label>
                    <div className="mt-1 flex items-center">
                      <input
                        type="file"
                        id="bulkImageUpload"
                        onChange={handleBulkFileChange}
                        accept="image/*"
                        multiple
                        className="sr-only"
                        disabled={bulkUploading}
                      />
                      <label
                        htmlFor="bulkImageUpload"
                        className={`relative cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none ${bulkUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <span>Dosyaları Seç</span>
                      </label>
                      <span className="ml-2 text-sm text-gray-500">
                        {bulkFiles.length > 0 ? `${bulkFiles.length} dosya seçildi` : 'Dosya seçilmedi'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Seçilen dosyalar listesi */}
                  {bulkFiles.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Seçilen Dosyalar:</h3>
                      <div className="max-h-40 overflow-y-auto border rounded-md p-2">
                        <ul className="divide-y divide-gray-200">
                          {bulkFiles.map((file, index) => (
                            <li key={index} className="py-2 flex items-center justify-between">
                              <span className="text-sm text-black truncate max-w-xs">{file.name}</span>
                              <span className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                  
                  {/* İlerleme çubuğu */}
                  {bulkUploading && (
                    <div className="mt-4">
                      <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                          <div>
                            <span className="text-xs font-semibold inline-block text-blue-600">
                              Yükleniyor
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-semibold inline-block text-blue-600">
                              %{bulkProgress}
                            </span>
                          </div>
                        </div>
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                          <div 
                            style={{ width: `${bulkProgress}%` }} 
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-300"
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowBulkModal(false)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={bulkUploading}
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    disabled={bulkUploading || bulkFiles.length === 0}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {bulkUploading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Yükleniyor...
                      </>
                    ) : (
                      'Seçilen Dosyaları Yükle'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminGalleryPage; 