import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { contactMessagesApi, ContactMessage } from '../utils/supabase';
import { Mail, Trash2, Eye, EyeOff, Search, Filter, X, AlertCircle, FileSpreadsheet } from 'lucide-react';
import { exportContactMessagesToExcel } from '../utils/excelService';

function AdminContactMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'read' | 'unread'>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const messagesData = await contactMessagesApi.getAllMessages();
      setMessages(messagesData);
    } catch (error) {
      console.error('Mesajları getirirken hata oluştu:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string, isRead: boolean) => {
    try {
      await contactMessagesApi.markAsRead(id, isRead);
      setMessages(messages.map(message => 
        message.id === id ? { ...message, is_read: isRead } : message
      ));
      
      if (selectedMessage?.id === id) {
        setSelectedMessage({ ...selectedMessage, is_read: isRead });
      }
    } catch (error) {
      console.error('Mesaj durumu güncellenirken hata oluştu:', error);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    try {
      await contactMessagesApi.deleteMessage(id);
      setMessages(messages.filter(message => message.id !== id));
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
        setShowModal(false);
      }
      setDeleteConfirmation(null);
    } catch (error) {
      console.error('Mesaj silinirken hata oluştu:', error);
    }
  };

  const openMessageDetail = (message: ContactMessage) => {
    setSelectedMessage(message);
    setShowModal(true);
    
    // Mesaj okunmadıysa, okundu olarak işaretle
    if (!message.is_read) {
      handleMarkAsRead(message.id, true);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('tr-TR', options);
  };

  // Filtreleme ve sıralama
  const filteredMessages = messages
    .filter(message => {
      // Arama filtresi
      const searchMatch = 
        message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.message.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Durum filtresi
      const statusMatch = 
        filterStatus === 'all' || 
        (filterStatus === 'read' && message.is_read) || 
        (filterStatus === 'unread' && !message.is_read);
      
      return searchMatch && statusMatch;
    })
    .sort((a, b) => {
      // Sıralama
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

  const unreadCount = messages.filter(message => !message.is_read).length;

  return (
    <AdminLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Mail className="mr-2 h-6 w-6 text-gray-700" />
              İletişim Mesajları
              {unreadCount > 0 && (
                <span className="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                  {unreadCount} okunmamış
                </span>
              )}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              İletişim formundan gönderilen mesajları görüntüleyin ve yönetin
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <button
              onClick={() => exportContactMessagesToExcel(messages)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              disabled={loading || messages.length === 0}
            >
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Excel'e Aktar
            </button>
          </div>
        </div>

        {/* Filtreler ve Arama */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Mesajlarda ara..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setSearchTerm('')}
                >
                  <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
            
            <div className="flex gap-2">
              <div className="relative">
                <select
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as 'all' | 'read' | 'unread')}
                >
                  <option value="all">Tüm Mesajlar</option>
                  <option value="read">Okunmuş</option>
                  <option value="unread">Okunmamış</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <Filter className="h-4 w-4" />
                </div>
              </div>
              
              <div className="relative">
                <select
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
                >
                  <option value="newest">En Yeni</option>
                  <option value="oldest">En Eski</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <Filter className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mesaj Listesi */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {loading ? (
            <div className="p-6">
              <div className="animate-pulse space-y-4">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <Mail className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Mesaj Bulunamadı</h3>
              <p className="text-gray-500">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Arama kriterlerinize uygun mesaj bulunamadı. Filtreleri değiştirmeyi deneyin.' 
                  : 'Henüz hiç iletişim mesajı alınmamış.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredMessages.map((message) => (
                <div 
                  key={message.id} 
                  className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer flex items-start ${!message.is_read ? 'bg-blue-50' : ''}`}
                  onClick={() => openMessageDetail(message)}
                >
                  <div className="flex-shrink-0 mr-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${!message.is_read ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                      <Mail className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`text-sm font-medium ${!message.is_read ? 'text-blue-900' : 'text-gray-900'}`}>
                        {message.name}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {formatDate(message.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 font-medium truncate mb-1">
                      {message.subject}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {message.message}
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsRead(message.id, !message.is_read);
                      }}
                      className={`p-1 rounded-full ${message.is_read ? 'text-gray-400 hover:text-gray-600 hover:bg-gray-100' : 'text-blue-400 hover:text-blue-600 hover:bg-blue-100'}`}
                      title={message.is_read ? 'Okunmadı olarak işaretle' : 'Okundu olarak işaretle'}
                    >
                      {message.is_read ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteConfirmation(message.id);
                      }}
                      className="p-1 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-100"
                      title="Mesajı sil"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mesaj Detay Modalı */}
      {showModal && selectedMessage && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => setShowModal(false)}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      {selectedMessage.subject}
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Gönderen</p>
                          <p className="font-medium">{selectedMessage.name}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Tarih</p>
                          <p className="font-medium">{formatDate(selectedMessage.created_at)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">E-posta</p>
                          <p className="font-medium">{selectedMessage.email}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Telefon</p>
                          <p className="font-medium">{selectedMessage.phone}</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-700 whitespace-pre-line">
                        {selectedMessage.message}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setDeleteConfirmation(selectedMessage.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Sil
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => handleMarkAsRead(selectedMessage.id, !selectedMessage.is_read)}
                >
                  {selectedMessage.is_read ? (
                    <>
                      <EyeOff className="mr-2 h-4 w-4" />
                      Okunmadı Olarak İşaretle
                    </>
                  ) : (
                    <>
                      <Eye className="mr-2 h-4 w-4" />
                      Okundu Olarak İşaretle
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowModal(false)}
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Silme Onay Modalı */}
      {deleteConfirmation && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Mesajı Sil
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Bu mesajı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => handleDeleteMessage(deleteConfirmation)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Sil
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setDeleteConfirmation(null)}
                >
                  İptal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminContactMessagesPage;
