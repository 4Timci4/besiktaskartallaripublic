import React, { ReactNode } from 'react';
import { Check, X, Printer, Calendar, User, Briefcase, Mail, Phone, MapPin, Shield } from 'lucide-react';
import { MembershipApplication } from '../utils/supabase';
import { cn } from '../utils/cn';

interface PrintableMembershipApplicationProps {
  application: MembershipApplication;
}

const PrintableMembershipApplication = ({ application }: PrintableMembershipApplicationProps): ReactNode => {
  // Tarih formatı
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('tr-TR', options);
  };

  // Durum metni
  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Beklemede';
      case 'approved':
        return 'Onaylandı';
      case 'rejected':
        return 'Reddedildi';
      default:
        return status;
    }
  };

  // Durum renklerini belirle
  const getStatusColors = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    }
  };

  return (
    <div className="print:bg-white print:p-0 p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg print:shadow-none">
      {/* Başlık ve Yazdır Butonu */}
      <div className="print:block flex justify-between items-center mb-8 border-b border-gray-200 pb-6">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Üyelik Başvuru Formu</h1>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-1" />
            <p>Başvuru Tarihi: {formatDate(application.created_at)}</p>
          </div>
        </div>
        <div className="print:hidden">
          <button 
            onClick={() => window.print()} 
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            <Printer className="h-4 w-4" />
            Yazdır
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Başvuru Durumu - Daha belirgin kart tasarımı */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Shield className="h-5 w-5 mr-2 text-gray-700" />
              Başvuru Durumu
            </h2>
            <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColors(application.status)}`}>
              {getStatusText(application.status)}
            </div>
          </div>
          <div className="text-sm text-gray-600 flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            Son Güncelleme: {formatDate(application.updated_at)}
          </div>
        </div>

        {/* Kişisel Bilgiler - Kart tasarımı */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <User className="h-5 w-5 mr-2 text-gray-700" />
            Kişisel Bilgiler
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Ad Soyad</p>
              <p className="font-semibold text-gray-900">{application.full_name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">BJK Sicil No</p>
              <p className="font-semibold text-gray-900">{application.bjk_id}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Doğum Tarihi</p>
              <p className="font-semibold text-gray-900">{application.birth_date}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Kan Grubu</p>
              <p className="font-semibold text-gray-900">{application.blood_type}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Doğum Yeri</p>
              <p className="font-semibold text-gray-900">{application.birth_city}</p>
            </div>
          </div>
        </div>

        {/* Eğitim ve Meslek Bilgileri - Kart tasarımı */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Briefcase className="h-5 w-5 mr-2 text-gray-700" />
            Eğitim ve Meslek Bilgileri
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Eğitim Seviyesi</p>
              <p className="font-semibold text-gray-900">{application.education_level}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Mezun Olunan Okul</p>
              <p className="font-semibold text-gray-900">{application.graduated_school || '-'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Meslek</p>
              <p className="font-semibold text-gray-900">{application.occupation}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Çalıştığı Kurum</p>
              <p className="font-semibold text-gray-900">{application.workplace}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Ünvan</p>
              <p className="font-semibold text-gray-900">{application.title || '-'}</p>
            </div>
          </div>
        </div>

        {/* İletişim ve İkamet Bilgileri - Tek kartta birleştirilmiş */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* İletişim Bilgileri */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Mail className="h-5 w-5 mr-2 text-gray-700" />
                İletişim Bilgileri
              </h2>
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">E-posta</p>
                  <p className="font-semibold text-gray-900 flex items-center">
                    <Mail className="h-4 w-4 mr-1 text-gray-500" />
                    {application.email}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">Telefon</p>
                  <p className="font-semibold text-gray-900 flex items-center">
                    <Phone className="h-4 w-4 mr-1 text-gray-500" />
                    {application.phone}
                  </p>
                </div>
              </div>
            </div>

            {/* İkamet Bilgileri */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-gray-700" />
                İkamet Bilgileri
              </h2>
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">İkamet İli</p>
                  <p className="font-semibold text-gray-900">{application.residence_city}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-gray-500">İkamet İlçesi</p>
                  <p className="font-semibold text-gray-900">{application.residence_district}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* KVKK Onayı - Modern tasarım */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Shield className="h-5 w-5 mr-2 text-gray-700" />
            KVKK Onayı
          </h2>
          <div className="flex items-center p-3 rounded-lg bg-gray-50">
            <div className={cn(
              "w-6 h-6 flex items-center justify-center rounded-md border-2",
              application.kvkk_consent 
                ? "bg-green-100 border-green-500" 
                : "bg-red-100 border-red-500"
            )}>
              {application.kvkk_consent 
                ? <Check className="h-4 w-4 text-green-600" /> 
                : <X className="h-4 w-4 text-red-600" />
              }
            </div>
            <span className={cn(
              "ml-3 font-medium",
              application.kvkk_consent ? "text-green-700" : "text-red-700"
            )}>
              {application.kvkk_consent 
                ? 'KVKK Aydınlatma Metni onaylanmış' 
                : 'KVKK Aydınlatma Metni onaylanmamış'
              }
            </span>
          </div>
        </div>
      </div>

      <div className="mt-10 print:block hidden text-center text-xs text-gray-500 border-t border-gray-200 pt-4">
        <p>Bu belge Beşiktaş Kartalları Derneği tarafından {new Date().toLocaleDateString('tr-TR')} tarihinde oluşturulmuştur.</p>
      </div>
    </div>
  );
};

export default PrintableMembershipApplication;
