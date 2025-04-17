import { useState, FormEvent, useRef, ChangeEvent } from 'react';
import Hero from '../components/Hero';
import siteConfig from '../config/site';
import { Mail, Phone, MapPin } from 'lucide-react';
import { contactMessagesApi } from '../utils/supabase';

// Konu karakter sınırı
const SUBJECT_MAX_LENGTH = 50;

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string | null;
  }>({ type: null, message: null });
  const formRef = useRef<HTMLFormElement>(null);
  const [subjectLength, setSubjectLength] = useState(0);

  const handleSubjectChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSubjectLength(e.target.value.length);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus({ type: null, message: null });

    // Form verilerini al
    const formData = new FormData(e.currentTarget);
    
    // İletişim formu verilerini hazırla
    const subject = formData.get('subject') as string;
    
    // Konu uzunluğunu kontrol et
    if (subject.length > SUBJECT_MAX_LENGTH) {
      setFormStatus({
        type: 'error',
        message: `Konu en fazla ${SUBJECT_MAX_LENGTH} karakter olmalıdır.`
      });
      setIsSubmitting(false);
      return;
    }
    
    const contactData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      subject,
      message: formData.get('message') as string,
    };
    
    try {
      // Supabase'e kaydetme
      await contactMessagesApi.submitContactForm(contactData);
      
      setFormStatus({
        type: 'success',
        message: 'Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.'
      });
      
      // Formu sıfırla
      formRef.current?.reset();
      setSubjectLength(0);
    } catch (error) {
      console.error('Form gönderimi hatası:', error);
      setFormStatus({
        type: 'error',
        message: 'Form gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Hero title="İletişim" />
      
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* İletişim Formu */}
            <div className="bg-white p-8 border-r border-gray-100">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Bize Ulaşın</h2>
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
                    Ad Soyad
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-besiktas-red focus:ring-2 focus:ring-besiktas-red/20"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
                    E-posta
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-besiktas-red focus:ring-2 focus:ring-besiktas-red/20"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="mb-1 block text-sm font-medium text-gray-700">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-besiktas-red focus:ring-2 focus:ring-besiktas-red/20"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="mb-1 block text-sm font-medium text-gray-700">
                    Konu <span className="text-xs text-gray-500">({subjectLength}/{SUBJECT_MAX_LENGTH})</span>
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    maxLength={SUBJECT_MAX_LENGTH}
                    onChange={handleSubjectChange}
                    className={`block w-full rounded-lg border ${
                      subjectLength > SUBJECT_MAX_LENGTH ? 'border-red-300' : 'border-gray-300'
                    } bg-gray-50 p-2.5 text-gray-900 focus:border-besiktas-red focus:ring-2 focus:ring-besiktas-red/20`}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="message" className="mb-1 block text-sm font-medium text-gray-700">
                    Mesajınız
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-besiktas-red focus:ring-2 focus:ring-besiktas-red/20"
                    required
                  />
                </div>

                {formStatus.type && (
                  <div
                    className={`rounded-lg p-4 text-sm ${
                      formStatus.type === 'success'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {formStatus.message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || subjectLength > SUBJECT_MAX_LENGTH}
                  className="w-full rounded-lg bg-besiktas-red px-5 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-besiktas-red/90 focus:outline-none focus:ring-4 focus:ring-besiktas-red/50 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <svg className="mr-2 h-5 w-5 animate-spin" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Gönderiliyor...
                    </div>
                  ) : (
                    'Gönder'
                  )}
                </button>
              </form>
            </div>

            {/* İletişim Bilgileri */}
            <div className="space-y-6 p-8 bg-gray-50">
              <div className="rounded-lg bg-white p-6 shadow-lg">
                <h2 className="mb-6 text-xl font-bold text-gray-900">İletişim Bilgileri</h2>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <MapPin className="mr-3 h-5 w-5 text-besiktas-red flex-shrink-0" />
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">Adres</h3>
                      <p className="mt-1 text-sm text-black">
                        {siteConfig.footer.contact.address.street} No: {siteConfig.footer.contact.address.no}, {siteConfig.footer.contact.address.district} / {siteConfig.footer.contact.address.city}, {siteConfig.footer.contact.address.country}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="mr-3 h-5 w-5 text-besiktas-red flex-shrink-0" />
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">Telefon</h3>
                      <a
                        href={`tel:${siteConfig.footer.contact.phone.raw}`}
                        className="mt-1 block text-sm text-black hover:text-besiktas-red"
                      >
                        {siteConfig.footer.contact.phone.display}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Mail className="mr-3 h-5 w-5 text-besiktas-red flex-shrink-0" />
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">E-posta</h3>
                      <a
                        href={`mailto:${siteConfig.footer.contact.email.raw}`}
                        className="mt-1 block text-sm text-black hover:text-besiktas-red"
                      >
                        {siteConfig.footer.contact.email.display}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sosyal Medya */}
              <div className="rounded-lg bg-white p-6 shadow-lg">
                <h2 className="mb-6 text-xl font-bold text-gray-900">Sosyal Medya</h2>
                <div className="flex space-x-4">
                  {siteConfig.footer.social.map((account, index) => {
                    const Icon = account.icon;
                    return (
                      <a
                        key={index}
                        href={account.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-black transition-colors hover:bg-besiktas-red hover:text-white"
                        title={account.platform}
                      >
                        <Icon className="h-5 w-5" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}