import { useState, FormEvent, ChangeEvent, useRef } from 'react';
import { City, getCities, getDistricts } from '../data/turkey';
import siteConfig from '../config/site';
import Hero from '../components/Hero';
import { Check } from 'lucide-react';
import supabase from '../utils/supabase';

// E-posta servisi importu kaldırıldı, FormData tipi doğrudan tanımlandı
export interface FormData {
  fullName: string;
  bjkId: string;
  birthDate: string;
  bloodType: string;
  birthCity: string;
  educationLevel: string;
  graduatedSchool: string;
  occupation: string;
  workplace: string;
  title: string;
  phone: string;
  email: string;
  residenceCity: string;
  residenceDistrict: string;
  kvkkConsent: boolean;
}

type FormErrors = Partial<Record<keyof FormData, string>>;

const MembershipPage = () => {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    bjkId: '',
    birthDate: '',
    bloodType: '',
    birthCity: '',
    educationLevel: '',
    graduatedSchool: '',
    occupation: '',
    workplace: '',
    title: '',
    phone: '',
    email: '',
    residenceCity: '',
    residenceDistrict: '',
    kvkkConsent: false
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string | null;
  }>({ type: null, message: null });
  
  // Form durumu değiştiğinde sayfayı yukarı kaydırmak için referans
  const formRef = useRef<HTMLDivElement>(null);
  
  // Sayfayı yukarı kaydırmak için yardımcı fonksiyon
  const scrollToTop = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const bloodTypes = ['A Rh+', 'A Rh-', 'B Rh+', 'B Rh-', 'AB Rh+', 'AB Rh-', '0 Rh+', '0 Rh-'];
  const educationLevels = ['İlkokul', 'Ortaokul', 'Lise', 'Ön Lisans', 'Lisans', 'Yüksek Lisans', 'Doktora'];
  const cities = getCities();

  // Formu sıfırlama fonksiyonu
  const resetForm = () => {
    setFormData({
      fullName: '',
      bjkId: '',
      birthDate: '',
      bloodType: '',
      birthCity: '',
      educationLevel: '',
      graduatedSchool: '',
      occupation: '',
      workplace: '',
      title: '',
      phone: '',
      email: '',
      residenceCity: '',
      residenceDistrict: '',
      kvkkConsent: false
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Ad Soyad zorunludur';
    }

    if (!formData.bjkId.match(/^\d{5}$/)) {
      newErrors.bjkId = 'BJK Sicil No 5 haneli bir sayı olmalıdır';
    }

    if (!formData.birthDate) {
      newErrors.birthDate = 'Doğum tarihi zorunludur';
    } else if (!formData.birthDate.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
      newErrors.birthDate = 'Doğum tarihi GG/AA/YYYY formatında olmalıdır';
    } else {
      // Doğum tarihinin bugünden büyük olup olmadığını kontrol et
      const [day, month, year] = formData.birthDate.split('/').map(Number);
      const birthDate = new Date(year, month - 1, day); // JavaScript'te aylar 0-11 arası
      const today = new Date();
      
      // Tarih geçerli değilse veya bugünden büyükse hata göster
      if (isNaN(birthDate.getTime()) || birthDate > today) {
        newErrors.birthDate = 'Geçerli bir doğum tarihi giriniz. Bugünden ileri bir tarih olamaz';
      }
    }

    if (!formData.bloodType) {
      newErrors.bloodType = 'Kan grubu seçiniz';
    }

    if (!formData.birthCity) {
      newErrors.birthCity = 'Doğum ili seçiniz';
    }

    if (!formData.educationLevel) {
      newErrors.educationLevel = 'Eğitim seviyesi seçiniz';
    }
    
    if (!formData.graduatedSchool.trim()) {
      newErrors.graduatedSchool = 'Mezun olunan okul zorunludur';
    }

    if (!formData.occupation.trim()) {
      newErrors.occupation = 'Meslek zorunludur';
    }

    if (!formData.workplace.trim()) {
      newErrors.workplace = 'Çalıştığınız kurum zorunludur';
    }
    
    if (!formData.title.trim()) {
      newErrors.title = 'Ünvan zorunludur';
    }

    if (!formData.phone.match(/^\d{11}$/)) {
      newErrors.phone = 'Telefon 11 haneli olmalıdır';
    }

    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Geçerli bir email adresi giriniz';
    }

    if (!formData.residenceCity) {
      newErrors.residenceCity = 'İkamet ili seçiniz';
    }

    if (!formData.residenceDistrict) {
      newErrors.residenceDistrict = 'İkamet ilçesi seçiniz';
    }

    if (!formData.kvkkConsent) {
      newErrors.kvkkConsent = 'KVKK Aydınlatma Metni\'ni onaylamanız gerekmektedir';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (validateForm()) {
      try {
        // Supabase bağlantısını test et
        const { error: testError } = await supabase
          .from('membership_applications')
          .select('count')
          .limit(1);
          
        if (testError) {
          console.error('Supabase bağlantı hatası:', testError);
          throw new Error('Veritabanı bağlantısı kurulamadı');
        }

        // Tarihi YYYY-MM-DD formatına dönüştür
        const [day, month, year] = formData.birthDate.split('/');
        const formattedBirthDate = `${year}-${month}-${day}`;

        // Form verilerini Supabase'e kaydet
        const { error } = await supabase
          .from('membership_applications')
          .insert([
            {
              full_name: formData.fullName,
              bjk_id: formData.bjkId,
              birth_date: formattedBirthDate,
              blood_type: formData.bloodType,
              birth_city: formData.birthCity,
              education_level: formData.educationLevel,
              graduated_school: formData.graduatedSchool,
              occupation: formData.occupation,
              workplace: formData.workplace,
              title: formData.title,
              phone: formData.phone,
              email: formData.email,
              residence_city: formData.residenceCity,
              residence_district: formData.residenceDistrict,
              kvkk_consent: formData.kvkkConsent,
              status: 'pending'
            }
          ])
          .select();

        if (error) {
          console.error('Supabase hatası:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          });
          throw error;
        }
        
        // E-posta gönderimi kaldırıldı
        
        // Form başarıyla gönderildi, durumu güncelle
        setFormStatus({
          type: 'success',
          message: 'Üyelik başvurunuz başarıyla alındı. En kısa sürede sizinle iletişime geçeceğiz.'
        });

        // Formu sıfırla
        resetForm();
        
        // Sayfayı yukarı kaydır
        scrollToTop();
      } catch (error) {
        console.error('Form gönderme hatası:', error);
        setFormStatus({
          type: 'error',
          message: 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
        });
        
        // Hata durumunda da sayfayı yukarı kaydır
        scrollToTop();
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(false);
      setFormStatus({
        type: 'error',
        message: 'Lütfen formda belirtilen hataları düzeltin.'
      });
      
      // Form doğrulama hatası durumunda da sayfayı yukarı kaydır
      scrollToTop();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (name === 'bjkId') {
      // Sadece rakam girişine izin ver
      const onlyNumbers = value.replace(/\D/g, '');
      setFormData(prev => ({
        ...prev,
        [name]: onlyNumbers
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        ...(name === 'residenceCity' && { residenceDistrict: '' })
      }));
    }
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      setFormData(prev => ({ ...prev, phone: numbers }));
    }
  };

  const formatBirthDate = (value: string) => {
    // Sadece rakamlar ve / karakterine izin ver
    const cleanedValue = value.replace(/[^\d/]/g, '');
    
    // GG/AA/YYYY formatında tarihi otomatik olarak formatlama
    let formattedValue = '';
    
    if (cleanedValue.length <= 10) {
      const numbersOnly = cleanedValue.replace(/\//g, '');
      
      // İlk iki karakter (gün)
      if (numbersOnly.length > 0) {
        const day = numbersOnly.slice(0, 2);
        // Gün için geçerli aralık (01-31)
        if (day.length === 2) {
          const dayNum = parseInt(day);
          if (dayNum < 1) formattedValue += '01';
          else if (dayNum > 31) formattedValue += '31';
          else formattedValue += day;
        } else {
          formattedValue += day;
        }
      }
      
      // Üçüncü ve dördüncü karakterler (ay)
      if (numbersOnly.length > 2) {
        const month = numbersOnly.slice(2, 4);
        // Ay için geçerli aralık (01-12)
        if (month.length === 2) {
          const monthNum = parseInt(month);
          if (monthNum < 1) formattedValue += '/01';
          else if (monthNum > 12) formattedValue += '/12';
          else formattedValue += '/' + month;
        } else {
          formattedValue += '/' + month;
        }
      }
      
      // Kalan karakterler (yıl)
      if (numbersOnly.length > 4) {
        const year = numbersOnly.slice(4, 8);
        // Geçerli yıldan büyük olmamasını sağla
        if (year.length === 4) {
          const currentYear = new Date().getFullYear();
          const yearNum = parseInt(year);
          if (yearNum > currentYear) {
            formattedValue += '/' + currentYear;
          } else {
            formattedValue += '/' + year;
          }
        } else {
          formattedValue += '/' + year;
        }
      }
      
      setFormData(prev => ({ ...prev, birthDate: formattedValue }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Hero 
        title="Üyelik Başvurusu" 
      />
      
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div ref={formRef} className="bg-white shadow-xl rounded-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Kişisel Bilgiler</h2>
          
          {/* Form durum mesajları */}
          {formStatus.type && (
            <div 
              className={`mb-6 p-4 rounded-md ${
                formStatus.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
              }`}
            >
              {formStatus.message}
            </div>
          )}
          
          {/* Başvuru formu */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Kişisel Bilgiler */}
            <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <span className="inline-block w-1 h-6 bg-gradient-to-b from-besiktas-red to-transparent rounded-full"></span>
                Kişisel Bilgiler
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                    Ad Soyad
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Adınız ve Soyadınız"
                    className={`mt-1 block w-full rounded-md shadow-sm ${
                      errors.fullName ? 'border-red-300' : 'border-gray-300'
                    } focus:border-besiktas-red focus:ring focus:ring-besiktas-red focus:ring-opacity-50`}
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="bjkId" className="block text-sm font-medium text-gray-700">
                    BJK Sicil No
                  </label>
                  <input
                    type="text"
                    id="bjkId"
                    name="bjkId"
                    value={formData.bjkId}
                    onChange={handleChange}
                    placeholder="12345"
                    maxLength={5}
                    pattern="\d*"
                    inputMode="numeric"
                    className={`mt-1 block w-full rounded-md shadow-sm ${
                      errors.bjkId ? 'border-red-300' : 'border-gray-300'
                    } focus:border-besiktas-red focus:ring focus:ring-besiktas-red focus:ring-opacity-50`}
                  />
                  {errors.bjkId && (
                    <p className="mt-1 text-sm text-red-600">{errors.bjkId}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="birthCity" className="block text-sm font-medium text-gray-700">
                    Doğum Yeri
                  </label>
                  <select
                    id="birthCity"
                    name="birthCity"
                    value={formData.birthCity}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md shadow-sm ${
                      errors.birthCity ? 'border-red-300' : 'border-gray-300'
                    } focus:border-besiktas-red focus:ring focus:ring-besiktas-red focus:ring-opacity-50`}
                  >
                    <option value="">Seçiniz</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  {errors.birthCity && (
                    <p className="mt-1 text-sm text-red-600">{errors.birthCity}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
                    Doğum Tarihi
                  </label>
                  <input
                    type="text"
                    id="birthDate"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={(e) => formatBirthDate(e.target.value)}
                    placeholder="GG/AA/YYYY"
                    pattern="\d{2}/\d{2}/\d{4}"
                    className={`mt-1 block w-full rounded-md shadow-sm ${
                      errors.birthDate ? 'border-red-300' : 'border-gray-300'
                    } focus:border-besiktas-red focus:ring focus:ring-besiktas-red focus:ring-opacity-50`}
                  />
                  {errors.birthDate && (
                    <p className="mt-1 text-sm text-red-600">{errors.birthDate}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700">
                    Kan Grubu
                  </label>
                  <select
                    id="bloodType"
                    name="bloodType"
                    value={formData.bloodType}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md shadow-sm ${
                      errors.bloodType ? 'border-red-300' : 'border-gray-300'
                    } focus:border-besiktas-red focus:ring focus:ring-besiktas-red focus:ring-opacity-50`}
                  >
                    <option value="">Seçiniz</option>
                    {bloodTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.bloodType && (
                    <p className="mt-1 text-sm text-red-600">{errors.bloodType}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Eğitim ve Meslek Bilgileri */}
            <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <span className="inline-block w-1 h-6 bg-gradient-to-b from-besiktas-red to-transparent rounded-full"></span>
                Eğitim ve Meslek Bilgileri
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="educationLevel" className="block text-sm font-medium text-gray-700">
                    Eğitim Seviyesi
                  </label>
                  <select
                    id="educationLevel"
                    name="educationLevel"
                    value={formData.educationLevel}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md shadow-sm ${
                      errors.educationLevel ? 'border-red-300' : 'border-gray-300'
                    } focus:border-besiktas-red focus:ring focus:ring-besiktas-red focus:ring-opacity-50`}
                  >
                    <option value="">Seçiniz</option>
                    {educationLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                  {errors.educationLevel && (
                    <p className="mt-1 text-sm text-red-600">{errors.educationLevel}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="graduatedSchool" className="block text-sm font-medium text-gray-700">
                    Mezun Olunan Okul
                  </label>
                  <input
                    type="text"
                    id="graduatedSchool"
                    name="graduatedSchool"
                    value={formData.graduatedSchool}
                    onChange={handleChange}
                    placeholder="Mezun olduğunuz okul"
                    className={`mt-1 block w-full rounded-md shadow-sm ${
                      errors.graduatedSchool ? 'border-red-300' : 'border-gray-300'
                    } focus:border-besiktas-red focus:ring focus:ring-besiktas-red focus:ring-opacity-50`}
                  />
                  {errors.graduatedSchool && (
                    <p className="mt-1 text-sm text-red-600">{errors.graduatedSchool}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="occupation" className="block text-sm font-medium text-gray-700">
                    Meslek
                  </label>
                  <input
                    type="text"
                    id="occupation"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                    placeholder="Mesleğiniz"
                    className={`mt-1 block w-full rounded-md shadow-sm ${
                      errors.occupation ? 'border-red-300' : 'border-gray-300'
                    } focus:border-besiktas-red focus:ring focus:ring-besiktas-red focus:ring-opacity-50`}
                  />
                  {errors.occupation && (
                    <p className="mt-1 text-sm text-red-600">{errors.occupation}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="workplace" className="block text-sm font-medium text-gray-700">
                    Çalıştığı Kurum
                  </label>
                  <input
                    type="text"
                    id="workplace"
                    name="workplace"
                    value={formData.workplace}
                    onChange={handleChange}
                    placeholder="Çalıştığınız Kurumun Adı"
                    className={`mt-1 block w-full rounded-md shadow-sm ${
                      errors.workplace ? 'border-red-300' : 'border-gray-300'
                    } focus:border-besiktas-red focus:ring focus:ring-besiktas-red focus:ring-opacity-50`}
                  />
                  {errors.workplace && (
                    <p className="mt-1 text-sm text-red-600">{errors.workplace}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Ünvan
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Ünvanınız"
                    className={`mt-1 block w-full rounded-md shadow-sm ${
                      errors.title ? 'border-red-300' : 'border-gray-300'
                    } focus:border-besiktas-red focus:ring focus:ring-besiktas-red focus:ring-opacity-50`}
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                  )}
                </div>
              </div>
            </div>

            {/* İletişim Bilgileri */}
            <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <span className="inline-block w-1 h-6 bg-gradient-to-b from-besiktas-red to-transparent rounded-full"></span>
                İletişim Bilgileri
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    E-Posta
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="ornek@email.com"
                    className={`mt-1 block w-full rounded-md shadow-sm ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    } focus:border-besiktas-red focus:ring focus:ring-besiktas-red focus:ring-opacity-50`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => formatPhone(e.target.value)}
                    placeholder="05XX XXX XX XX"
                    className={`mt-1 block w-full rounded-md shadow-sm ${
                      errors.phone ? 'border-red-300' : 'border-gray-300'
                    } focus:border-besiktas-red focus:ring focus:ring-besiktas-red focus:ring-opacity-50`}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="residenceCity" className="block text-sm font-medium text-gray-700">
                    İkamet İli
                  </label>
                  <select
                    id="residenceCity"
                    name="residenceCity"
                    value={formData.residenceCity}
                    onChange={handleChange}
                    className={`mt-1 block w-full rounded-md shadow-sm ${
                      errors.residenceCity ? 'border-red-300' : 'border-gray-300'
                    } focus:border-besiktas-red focus:ring focus:ring-besiktas-red focus:ring-opacity-50`}
                  >
                    <option value="">Seçiniz</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  {errors.residenceCity && (
                    <p className="mt-1 text-sm text-red-600">{errors.residenceCity}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="residenceDistrict" className="block text-sm font-medium text-gray-700">
                    İkamet İlçesi
                  </label>
                  <select
                    id="residenceDistrict"
                    name="residenceDistrict"
                    value={formData.residenceDistrict}
                    onChange={handleChange}
                    disabled={!formData.residenceCity}
                    className={`mt-1 block w-full rounded-md shadow-sm ${
                      errors.residenceDistrict ? 'border-red-300' : 'border-gray-300'
                    } focus:border-besiktas-red focus:ring focus:ring-besiktas-red focus:ring-opacity-50`}
                  >
                    <option value="">Seçiniz</option>
                    {formData.residenceCity && getDistricts(formData.residenceCity as City).map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                  {errors.residenceDistrict && (
                    <p className="mt-1 text-sm text-red-600">{errors.residenceDistrict}</p>
                  )}
                </div>
              </div>
            </div>

            {/* KVKK Aydınlatma Metni */}
            <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <span className="inline-block w-1 h-6 bg-gradient-to-b from-besiktas-red to-transparent rounded-full"></span>
                {siteConfig.kvkk.title}
              </h2>
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-700 max-h-80 overflow-y-auto">
                  {siteConfig.kvkk.sections.map((section, sectionIndex) => (
                    <div key={sectionIndex} className={`${sectionIndex > 0 ? "mt-4" : ""}`}>
                      {section.title && (
                        <h3 className="font-semibold mb-2">{section.title}</h3>
                      )}
                      {typeof section.content === 'string' ? (
                        <p className="mb-2">{section.content}</p>
                      ) : (
                        section.content.map((paragraph, pIndex) => (
                          <p key={pIndex} className="mb-2">{paragraph}</p>
                        ))
                      )}
                      {section.items && (
                        <ul className="list-none pl-4 space-y-1 mb-2">
                          {section.items.map((item, itemIndex) => (
                            <li key={itemIndex} className="flex">
                              <span className="font-semibold mr-2 min-w-[20px]">{item.key}.</span>
                              <span>{item.text}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="kvkkConsent"
                      name="kvkkConsent"
                      type="checkbox"
                      checked={formData.kvkkConsent}
                      onChange={handleChange}
                      className="h-4 w-4 text-besiktas-red focus:ring-besiktas-red border-gray-300 rounded"
                    />
                  </div>
                  <label htmlFor="kvkkConsent" className="ml-3 text-sm font-medium text-gray-700">
                    {siteConfig.kvkk.consentText}
                  </label>
                </div>
                {errors.kvkkConsent && (
                  <p className="text-sm text-red-600">{errors.kvkkConsent}</p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`
                  inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm
                  text-white bg-besiktas-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
                  focus:ring-besiktas-red transition-colors duration-200 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}
                `}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Gönderiliyor...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Başvuruyu Gönder
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MembershipPage;
