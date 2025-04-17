import { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { membershipApplicationsApi, MembershipApplication } from '../utils/supabase';
import { Users, Trash2, Search, Filter, X, AlertCircle, Clock, CheckCircle, XCircle, Printer, FileSpreadsheet } from 'lucide-react';
import PrintableMembershipApplication from '../components/PrintableMembershipApplication';
import { exportMembershipApplicationsToExcel } from '../utils/excelService';

function AdminMembershipApplicationsPage() {
  const [applications, setApplications] = useState<MembershipApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState<MembershipApplication | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const applicationsData = await membershipApplicationsApi.getAllApplications();
      setApplications(applicationsData);
    } catch (error) {
      console.error('Başvuruları getirirken hata oluştu:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: 'pending' | 'approved' | 'rejected') => {
    setStatusUpdateLoading(true);
    try {
      const updatedApplication = await membershipApplicationsApi.updateStatus(id, status);
      setApplications(applications.map(app => 
        app.id === id ? updatedApplication : app
      ));
      
      if (selectedApplication?.id === id) {
        setSelectedApplication(updatedApplication);
      }
    } catch (error) {
      console.error('Başvuru durumu güncellenirken hata oluştu:', error);
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  const handleDeleteApplication = async (id: string) => {
    try {
      await membershipApplicationsApi.deleteApplication(id);
      setApplications(applications.filter(app => app.id !== id));
      if (selectedApplication?.id === id) {
        setSelectedApplication(null);
        setShowModal(false);
      }
      setDeleteConfirmation(null);
    } catch (error) {
      console.error('Başvuru silinirken hata oluştu:', error);
    }
  };

  const openApplicationDetail = (application: MembershipApplication) => {
    setSelectedApplication(application);
    setShowModal(true);
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
  const filteredApplications = applications
    .filter(application => {
      // Arama filtresi
      const searchMatch = 
        application.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        application.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        application.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        application.bjk_id.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Durum filtresi
      const statusMatch = 
        filterStatus === 'all' || 
        application.status === filterStatus;
      
      return searchMatch && statusMatch;
    })
    .sort((a, b) => {
      // Sıralama
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

  const pendingCount = applications.filter(app => app.status === 'pending').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="mr-1 h-3 w-3" />
            Beklemede
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="mr-1 h-3 w-3" />
            Onaylandı
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="mr-1 h-3 w-3" />
            Reddedildi
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Users className="mr-2 h-6 w-6 text-gray-700" />
              Üyelik Başvuruları
              {pendingCount > 0 && (
                <span className="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                  {pendingCount} bekleyen
                </span>
              )}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Üyelik formundan gönderilen başvuruları görüntüleyin ve yönetin
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <button
              onClick={() => exportMembershipApplicationsToExcel(applications)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              disabled={loading || applications.length === 0}
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
                placeholder="Başvurularda ara..."
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
                  onChange={(e) => setFilterStatus(e.target.value as 'all' | 'pending' | 'approved' | 'rejected')}
                >
                  <option value="all">Tüm Başvurular</option>
                  <option value="pending">Bekleyen</option>
                  <option value="approved">Onaylanan</option>
                  <option value="rejected">Reddedilen</option>
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

        {/* Başvuru Listesi */}
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
          ) : filteredApplications.length === 0 ? (
            <div className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">Başvuru Bulunamadı</h3>
              <p className="text-gray-500">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Arama kriterlerinize uygun başvuru bulunamadı. Filtreleri değiştirmeyi deneyin.' 
                  : 'Henüz hiç üyelik başvurusu alınmamış.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Başvuran
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      BJK Sicil No
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İletişim
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Durum
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tarih
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      İşlemler
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredApplications.map((application) => (
                    <tr 
                      key={application.id} 
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => openApplicationDetail(application)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                            <Users className="h-5 w-5 text-gray-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {application.full_name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {application.birth_city}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{application.bjk_id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{application.email}</div>
                        <div className="text-xs text-gray-500">{application.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(application.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(application.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setDeleteConfirmation(application.id)}
                            className="p-1 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-100"
                            title="Başvuruyu sil"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Başvuru Detay Modalı */}
      {showModal && selectedApplication && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => setShowModal(false)}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4 flex items-center justify-between">
                      <span>Üyelik Başvurusu - {selectedApplication.full_name}</span>
                      {getStatusBadge(selectedApplication.status)}
                    </h3>
                    
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Kişisel Bilgiler</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Ad Soyad</p>
                          <p className="font-medium">{selectedApplication.full_name}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">BJK Sicil No</p>
                          <p className="font-medium">{selectedApplication.bjk_id}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Doğum Tarihi</p>
                          <p className="font-medium">{selectedApplication.birth_date}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Kan Grubu</p>
                          <p className="font-medium">{selectedApplication.blood_type}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Doğum Yeri</p>
                          <p className="font-medium">{selectedApplication.birth_city}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Eğitim ve Meslek Bilgileri</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Eğitim Seviyesi</p>
                          <p className="font-medium">{selectedApplication.education_level}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Mezun Olunan Okul</p>
                          <p className="font-medium">{selectedApplication.graduated_school || '-'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Meslek</p>
                          <p className="font-medium">{selectedApplication.occupation}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Çalıştığı Kurum</p>
                          <p className="font-medium">{selectedApplication.workplace}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Ünvan</p>
                          <p className="font-medium">{selectedApplication.title || '-'}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">İletişim Bilgileri</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">E-posta</p>
                          <p className="font-medium">{selectedApplication.email}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Telefon</p>
                          <p className="font-medium">{selectedApplication.phone}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">İkamet Bilgileri</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">İkamet İli</p>
                          <p className="font-medium">{selectedApplication.residence_city}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">İkamet İlçesi</p>
                          <p className="font-medium">{selectedApplication.residence_district}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Başvuru Bilgileri</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Başvuru Tarihi</p>
                          <p className="font-medium">{formatDate(selectedApplication.created_at)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Son Güncelleme</p>
                          <p className="font-medium">{formatDate(selectedApplication.updated_at)}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">KVKK Onayı</p>
                          <p className="font-medium">{selectedApplication.kvkk_consent ? 'Evet' : 'Hayır'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                {selectedApplication.status !== 'approved' && (
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => handleUpdateStatus(selectedApplication.id, 'approved')}
                    disabled={statusUpdateLoading}
                  >
                    {statusUpdateLoading ? (
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <CheckCircle className="mr-2 h-4 w-4" />
                    )}
                    Onayla
                  </button>
                )}
                
                {selectedApplication.status !== 'rejected' && (
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => handleUpdateStatus(selectedApplication.id, 'rejected')}
                    disabled={statusUpdateLoading}
                  >
                    {statusUpdateLoading ? (
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <XCircle className="mr-2 h-4 w-4" />
                    )}
                    Reddet
                  </button>
                )}
                
                {selectedApplication.status !== 'pending' && (
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-yellow-600 text-base font-medium text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => handleUpdateStatus(selectedApplication.id, 'pending')}
                    disabled={statusUpdateLoading}
                  >
                    {statusUpdateLoading ? (
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <Clock className="mr-2 h-4 w-4" />
                    )}
                    Beklemede
                  </button>
                )}
                
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowModal(false)}
                >
                  Kapat
                </button>
                
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowPrintModal(true)}
                >
                  <Printer className="mr-2 h-4 w-4" />
                  Yazdır
                </button>
                
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setDeleteConfirmation(selectedApplication.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Sil
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Yazdırılabilir Görünüm Modalı */}
      {showPrintModal && selectedApplication && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" onClick={() => setShowPrintModal(false)}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <PrintableMembershipApplication application={selectedApplication} />
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => window.print()}
                >
                  <Printer className="mr-2 h-4 w-4" />
                  Yazdır
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowPrintModal(false)}
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
                      Başvuruyu Sil
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Bu başvuruyu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => handleDeleteApplication(deleteConfirmation)}
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

export default AdminMembershipApplicationsPage;
