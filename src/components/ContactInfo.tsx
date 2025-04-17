import { Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import siteConfig from '../config/site';

const ContactInfo = () => {
  const { contact, social } = siteConfig.footer;
  const { street, no, district, city, country } = contact.address;

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-6 text-xl font-bold text-gray-900">İletişim Bilgileri</h2>
        <div className="space-y-6">
          <div className="flex items-start">
            <MapPin className="mr-3 h-5 w-5 text-besiktas-red flex-shrink-0" />
            <div>
              <h3 className="text-base font-semibold text-gray-900">Adres</h3>
              <p className="mt-1 text-sm text-black">
                {street} No: {no}<br />
                {district} / {city}<br />
                {country}
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <Phone className="mr-3 h-5 w-5 text-besiktas-red flex-shrink-0" />
            <div>
              <h3 className="text-base font-semibold text-gray-900">Telefon</h3>
              <div className="mt-1 space-y-1">
                <a
                  href={`tel:${contact.phone.raw}`}
                  className="block text-sm text-black hover:text-besiktas-red"
                >
                  {contact.phone.display}
                </a>
                {contact.phone.whatsapp && (
                  <a
                    href={`https://wa.me/${contact.phone.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm text-black hover:text-besiktas-red"
                  >
                    WhatsApp: {contact.phone.whatsapp}
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-start">
            <Mail className="mr-3 h-5 w-5 text-besiktas-red flex-shrink-0" />
            <div>
              <h3 className="text-base font-semibold text-gray-900">E-posta</h3>
              <a
                href={`mailto:${contact.email.raw}`}
                className="mt-1 block text-sm text-black hover:text-besiktas-red"
              >
                {contact.email.display}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-lg">
        <h2 className="mb-6 text-xl font-bold text-gray-900">Sosyal Medya</h2>
        <div className="flex space-x-4">
          {social.map((account, index) => {
            const Icon = account.icon;
            return (
              <a
                key={index}
                href={account.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-black transition-colors hover:bg-besiktas-red hover:text-white"
              >
                <Icon className="h-5 w-5" />
                <ExternalLink className="ml-1 h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;