import React, { useState, useEffect, useRef } from 'react';
import { pressApi, storageApi } from '../utils/supabase';
import QuillEditor, { QuillEditorRef } from '../components/QuillEditor';
import { Press } from '../utils/supabase';
import { Menu, X, LogOut, Activity, Image, User, Home, Newspaper, Edit, Trash2, Plus, Eye, EyeOff, ArrowLeft, FileText, Link as LinkIcon,} from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { logout, getCurrentUser, isAuthenticated } from '../utils/auth';
import PageTransition from '../components/PageTransition';
import ScrollToTop from '../components/ScrollToTop';
import A11yControls from '../components/A11yControls';

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
  const [sourceFileUrl, setSourceFileUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  
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
    setFormData({ ...formData, summary: content });
  };

  // Admin layout fonksiyonları
  useEffect(() => {
    async function fetchUserData() {
      const user = await getCurrentUser();
      if (user?.email) {
        setUserName(user.email);
      }
    }
    
    fetchUserData();
  }, []);

  useEffect(() => {
    async function checkSessionValidity() {
      const isValid = await isAuthenticated();
      if (!isValid) {
        navigate('/admin/login');
      }
    }
    
    checkSessionValidity();
    
    const intervalId = setInterval(() => {
      checkSessionValidity();
    }, 5 * 60 * 1000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [navigate]);

  const handleLogout = async () => {
    const { success } = await logout();
    if (success) {
      navigate('/admin/login');
    }
  };

  const navigation = [
    { name: 'Kontrol Paneli', href: '/admin', icon: Home },
    { name: 'Faaliyetler', href: '/admin/faaliyetler', icon: Activity },
    { name: 'Galeri', href: '/admin/galeri', icon: Image },
    { name: 'Basında Biz', href: '/admin/basin', icon: Newspaper },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
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
    
    // Eğer kaynak bir PDF dosyası ise, URL'i ayarla
    if (item.source && isPdfUrl(item.source)) {
      setSourceFileUrl(item.source);
    } else {
      setSourceFileUrl('');
    }
    
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
    setSourceFileUrl('');
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
    <div className="min-h-screen bg-gray-50 flex">
      <ScrollToTop />
      {/* Mobil menü arkafonu */}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-30 transition-opacity duration-300 lg:hidden ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Mobil menü */}
      <div
        className={`fixed inset-y-0 left-0 w-72 z-50 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="h-16 flex items-center justify-between px-4 border-b">
            <div className="text-xl font-bold text-indigo-600">BJK Admin</div>
            <button
              className="p-1 rounded-full hover:bg-gray-100"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <nav className="p-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 ${
                      isActive(item.href) ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="p-4 border-t">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-100 rounded-full p-2">
                <User className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-3 min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {userName || 'Admin Kullanıcı'}
                </p>
                <button
                  onClick={handleLogout}
                  className="text-xs font-medium text-gray-500 hover:text-gray-700 flex items-center mt-1"
                >
                  <LogOut className="mr-1 h-3.5 w-3.5" /> Çıkış Yap
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Masaüstü yan menü */}
      <div className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-200 lg:bg-white">
        <div className="h-16 flex items-center justify-center border-b border-gray-200">
          <div className="text-xl font-bold text-indigo-600">BJK Admin</div>
        </div>
        <div className="flex-1 flex flex-col overflow-y-auto">
          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive(item.href)
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 ${
                    isActive(item.href) ? 'text-indigo-500' : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-indigo-100 rounded-full p-2">
              <User className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-3 min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">
                {userName || 'Admin Kullanıcı'}
              </p>
              <button
                onClick={handleLogout}
                className="text-xs font-medium text-gray-500 hover:text-gray-700 flex items-center mt-1"
              >
                <LogOut className="mr-1 h-3.5 w-3.5" /> Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Ana içerik */}
      <div className="flex-1 flex flex-col lg:pl-72">
        {/* Üst bar */}
        <header className="sticky top-0 z-10 flex h-16 bg-white shadow-sm">
          <button
            type="button"
            className="lg:hidden px-4 text-gray-500 focus:outline-none"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1 flex items-center justify-between px-4">
            <h1 className="text-lg font-medium text-gray-900">Admin Paneli</h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="p-1 text-gray-400 rounded-full hover:text-gray-500 hover:bg-gray-100">
                  <span className="sr-only">Bildirimler</span>
                  <div className="h-6 w-6 flex items-center justify-center">
                    <div className="h-2 w-2 absolute top-1 right-1 bg-red-500 rounded-full"></div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Ana içerik alanı */}
        <main className="flex-1 overflow-auto bg-gray-50 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <PageTransition key={location.pathname}>
              <div className="container mx-auto py-8 px-4">
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
                              <div className="space-y-2">
                                {/* Metin girişi */}
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
                                  <div className="flex items-center space-x-2">
                                    <input
                                      type="file"
                                      accept="application/pdf,image/*"
                                      onChange={handleSourceFileChange}
                                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                  </div>
                                  
                                  {/* Mevcut dosya varsa göster */}
                                  {sourceFileUrl && (
                                    <div className="mt-2 flex items-center text-sm text-blue-600">
                                      {isPdfUrl(sourceFileUrl) ? (
                                        <>
                                          <FileText size={16} className="mr-1" />
                                          <a 
                                            href={sourceFileUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="hover:underline"
                                          >
                                            Mevcut PDF Dosyasını Görüntüle
                                          </a>
                                        </>
                                      ) : (
                                        <>
                                          <Image size={16} className="mr-1" />
                                          <a 
                                            href={sourceFileUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="hover:underline"
                                          >
                                            Mevcut Resim Dosyasını Görüntüle
                                          </a>
                                        </>
                                      )}
                                    </div>
                                  )}
                                  
                                  {/* Seçilen dosya adını göster */}
                                  {selectedSourceFile && (
                                    <div className="mt-2 text-sm text-gray-600">
                                      Seçilen dosya: {selectedSourceFile.name}
                                    </div>
                                  )}
                                  
                                  <div className="mt-1 text-xs text-gray-500">
                                    PDF veya resim dosyası yüklerseniz, kaynak alanı olarak bu dosya kullanılacaktır. Maksimum dosya boyutu: 10MB
                                  </div>
                                </div>
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
                                style={{ 
                                  minHeight: "200px", 
                                  maxHeight: "600px",
                                  resize: "vertical"
                                }}
                              >
                                <QuillEditor
                                  ref={quillRef}
                                  value={formData.summary}
                                  onChange={handleQuillChange}
                                  modules={modules}
                                  formats={formats}
                                  placeholder="Haber özetini giriniz... (Resim eklemek için Ctrl+V ile yapıştırabilirsiniz)"
                                  style={{ height: "100%", minHeight: "180px" }}
                                  onPaste={handlePaste}
                                />
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
            </PageTransition>
          </div>
        </main>
      </div>
      <A11yControls />
    </div>
  );
}

export default AdminPressPage;
