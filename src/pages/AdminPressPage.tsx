import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { pressApi, storageApi } from '../utils/supabase';
import QuillEditor, { QuillEditorRef } from '../components/QuillEditor';
import { Press } from '../utils/supabase';
import { Edit, Trash2, Plus, Eye, EyeOff, ArrowLeft, FileText, Link as LinkIcon } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import AdminLayout from '../components/AdminLayout';

function AdminPressPage() {
  const quillRef = useRef<QuillEditorRef>(null);
  const [pressItems, setPressItems] = useState<Press[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Press | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    source: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    image: '',
    summary: '',
    link: '',
    is_active: true,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedSourceFile, setSelectedSourceFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Quill editör modülleri
  const modules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }],
        ['link', 'image'],
        ['clean']
      ],
      handlers: {
        image: handleImageUpload
      }
    }
  };
  
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'color', 'background',
    'align',
    'link', 'image'
  ];
  
  // Quill editöründen resim yükleme işlevi
  async function handleImageUpload() {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    
    input.click();
    
    input.onchange = async () => {
      if (input.files && input.files.length > 0) {
        const file = input.files[0];
        await uploadImageToEditor(file);
      }
    };
  }
  
  // Dosyayı yükleyip editöre ekleyen yardımcı fonksiyon
  const uploadImageToEditor = async (file: File) => {
    setUploading(true);
    
    try {
      const uploadResult = await storageApi.upload({
        file: file,
        bucket: 'bjk-storage',
        folderPath: 'press/images',
      });
      
      if (!uploadResult) throw new Error('Dosya yükleme hatası');
      const imageUrl = uploadResult.publicUrl;
      
      // Quill editörüne resmi ekle
      const quill = quillRef.current?.getEditor();
      if (quill) {
        const range = quill.getSelection();
        if (range) {
          quill.insertEmbed(range.index, 'image', imageUrl);
          quill.setSelection({ index: range.index + 1, length: 0 });
        } else {
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
    
    if (clipboard && clipboard.items) {
      for (let i = 0; i < clipboard.items.length; i++) {
        const item = clipboard.items[i];
        
        if (item.type.indexOf('image') !== -1) {
          e.preventDefault();
          
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
    setFormData({ ...formData, summary: content });
  };

  // Basın öğelerini getir
  const fetchPressItems = async () => {
    setLoading(true);
    try {
      const data = await pressApi.getAllForAdmin();
      setPressItems(data || []);
    } catch (error: Error | unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Basın öğeleri getirilirken hata oluştu:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPressItems();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setError('Dosya boyutu 5MB\'den büyük olamaz');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSourceFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        setError('Dosya boyutu 10MB\'den büyük olamaz');
        return;
      }
      
      // PDF ve resim dosyalarını kabul et
      const isPdf = file.type === 'application/pdf';
      const isImage = file.type.startsWith('image/');
      
      if (!isPdf && !isImage) {
        setError('Lütfen sadece PDF veya resim dosyası yükleyin');
        return;
      }
      
      setSelectedSourceFile(file);
    }
  };

  const isPdfUrl = (url: string): boolean => {
    return url.toLowerCase().endsWith('.pdf') || 
           url.includes('storage.googleapis.com') || 
           url.includes('supabase.co');
  };

  const handleEditItem = (item: Press) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      source: item.source,
      date: item.date.substring(0, 10),
      image: item.image,
      summary: item.summary,
      link: item.link || '',
      is_active: item.is_active,
    });
    
    // PDF dosyası kontrolü - sadece bilgi amaçlı, bir işlem yapılmıyor
    isPdfUrl(item.source);
    
    setSelectedFile(null);
    setSelectedSourceFile(null);
    setShowModal(true);
  };

  const handleAddItem = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      source: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      image: '',
      summary: '',
      link: '',
      is_active: true,
    });
    setSelectedFile(null);
    setSelectedSourceFile(null);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      setUploading(true);
      let imageUrl = formData.image;
      let sourceUrl = formData.source;

      // Resim dosyası yükleme işlemi
      if (selectedFile) {
        const uploadResult = await storageApi.upload({
          file: selectedFile,
          bucket: 'bjk-storage',
          folderPath: 'press/images',
        });

        if (!uploadResult) throw new Error('Resim yükleme hatası');
        imageUrl = uploadResult.publicUrl;
      }

      // PDF dosyası yükleme işlemi
      if (selectedSourceFile) {
        const uploadResult = await storageApi.upload({
          file: selectedSourceFile,
          bucket: 'bjk-storage',
          folderPath: 'press/documents',
        });

        if (!uploadResult) throw new Error('PDF yükleme hatası');
        sourceUrl = uploadResult.publicUrl;
      }

      const pressData = {
        title: formData.title,
        source: sourceUrl,
        date: formData.date,
        image: imageUrl,
        summary: formData.summary,
        link: formData.link || undefined,
        is_active: formData.is_active,
      };

      if (editingItem) {
        // Güncelleme işlemi
        await pressApi.update(editingItem.id, pressData);
        setSuccess('Basın haberi başarıyla güncellendi.');
      } else {
        // Yeni ekleme işlemi
        await pressApi.create(pressData);
        setSuccess('Yeni basın haberi başarıyla eklendi.');
      }

      // Listeyi güncelle
      fetchPressItems();
      setShowModal(false);
    } catch (error: Error | unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setError(`İşlem sırasında bir hata oluştu: ${errorMessage}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!window.confirm('Bu basın haberini silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      await pressApi.delete(id);
      setSuccess('Basın haberi başarıyla silindi.');
      
      // Listeyi güncelle
      setPressItems(pressItems.filter(item => item.id !== id));
    } catch (error: Error | unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setError(`Silme işlemi sırasında bir hata oluştu: ${errorMessage}`);
    }
  };

  const toggleItemVisibility = async (item: Press) => {
    try {
      await pressApi.toggleVisibility(item.id, !item.is_active);
      setSuccess(`Basın haberi ${!item.is_active ? 'görünür' : 'gizli'} duruma getirildi.`);
      
      // Listeyi güncelle
      setPressItems(
        pressItems.map((pressItem) =>
          pressItem.id === item.id
            ? { ...pressItem, is_active: !pressItem.is_active }
            : pressItem
        )
      );
    } catch (error: Error | unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setError(`Görünürlük değiştirme işlemi sırasında bir hata oluştu: ${errorMessage}`);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'd MMMM yyyy', { locale: tr });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto py-4 px-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <Link to="/admin" className="text-black hover:text-gray-900">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold">Basın Haberleri Yönetimi</h1>
          </div>
          <button
            onClick={handleAddItem}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus size={18} /> Yeni Haber Ekle
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 relative">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 relative">
            {success}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : pressItems.length === 0 ? (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-8 rounded text-center">
            Henüz eklenmiş basın haberi bulunmamaktadır.
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Başlık
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kaynak
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tarih
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pressItems.map((item) => (
                  <tr key={item.id} className={!item.is_active ? "bg-gray-50" : ""}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-md object-cover"
                            src={item.image}
                            alt={item.title}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{item.title}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {isPdfUrl(item.source) ? (
                          <a 
                            href={item.source} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center text-blue-600 hover:text-blue-800"
                          >
                            <FileText size={16} className="mr-1" />
                            PDF Dosyası
                          </a>
                        ) : (
                          item.source
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(item.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {item.is_active ? "Aktif" : "Pasif"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => toggleItemVisibility(item)}
                          className={`text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50`}
                          title={item.is_active ? "Gizle" : "Göster"}
                        >
                          {item.is_active ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        <button
                          onClick={() => handleEditItem(item)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                          title="Düzenle"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                          title="Sil"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">
                  {editingItem ? "Basın Haberi Düzenle" : "Yeni Basın Haberi Ekle"}
                </h2>

                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Başlık*
                      </label>
                      <input
                        type="text"
                        name="title"
                        required
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Kaynak*
                      </label>
                      <input
                        type="text"
                        name="source"
                        required
                        value={formData.source}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Kaynak adı veya PDF dosyası yükleyin"
                      />
                      {/* PDF dosyası yükleme */}
                      <div className="mt-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          PDF veya Resim Dosyası Ekle (İsteğe Bağlı)
                        </label>
                        <input
                          type="file"
                          accept="application/pdf,image/*"
                          onChange={handleSourceFileChange}
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tarih*
                      </label>
                      <input
                        type="date"
                        name="date"
                        required
                        value={formData.date}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Özet*
                      </label>
                      <div 
                        className="quill-container border border-gray-300 rounded-md overflow-hidden relative" 
                        style={{ minHeight: "200px", maxHeight: "600px", resize: "vertical" }}
                      >
                        <QuillEditor
                          ref={quillRef}
                          value={formData.summary}
                          onChange={handleQuillChange}
                          modules={modules}
                          formats={formats}
                          placeholder="Haber özetini giriniz..."
                          style={{ height: "100%", minHeight: "180px" }}
                          onPaste={handlePaste}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Haber Bağlantısı
                      </label>
                      <div className="flex items-center">
                        <LinkIcon size={16} className="text-gray-400 mr-2" />
                        <input
                          type="url"
                          name="link"
                          value={formData.link}
                          onChange={handleInputChange}
                          placeholder="https://..."
                          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Resim {!editingItem && "(*)"}
                      </label>
                      {formData.image && (
                        <div className="mb-2">
                          <img
                            src={formData.image}
                            alt="Preview"
                            className="h-24 w-24 object-cover rounded-md"
                          />
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required={!editingItem && !formData.image}
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="is_active"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={handleCheckboxChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
                        Aktif (görünür)
                      </label>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="bg-gray-100 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-200"
                      disabled={uploading}
                    >
                      İptal
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 px-4 py-2 rounded-md text-white hover:bg-blue-700 flex items-center"
                      disabled={uploading}
                    >
                      {uploading ? (
                        <>
                          <span className="mr-2 h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
                          İşleniyor...
                        </>
                      ) : (
                        <>{editingItem ? "Güncelle" : "Ekle"}</>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AdminPressPage;
