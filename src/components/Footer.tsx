import { Link } from 'react-router-dom';
import siteConfig from '../config/site';

const Footer = () => {
  const { footer, brand } = siteConfig;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo ve Sosyal Medya */}
          <div className="flex flex-col items-center md:items-start">
            <img 
              src={brand.logo}
              alt={brand.logoAlt}
              className="h-20 w-20 object-contain"
            />
            <div className="flex space-x-4 mt-3 justify-center md:justify-start">
              {footer.social.map((item, index) => {
                const Icon = item.icon;
                return (
                  <a 
                    key={index}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <Icon className="h-6 w-6" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Menu Bölümleri */}
          {footer.sections.map((section, index) => (
            <div key={index} className="mt-4 md:mt-0">
              <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link 
                      to={link.path}
                      className="text-gray-400 hover:text-white transition-colors text-sm flex items-center"
                    >
                      <span className="mr-1">›</span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* İletişim Bilgileri */}
          <div className="mt-4 md:mt-0">
            <h3 className="text-lg font-semibold mb-4">İletişim</h3>
            <ul className="space-y-2">
              <li>
                <p className="text-gray-400 text-sm">
                  {footer.contact.address.street} No: {footer.contact.address.no}, {footer.contact.address.district} / {footer.contact.address.city}, {footer.contact.address.country}
                </p>
              </li>
              <li>
                <a 
                  href={`tel:${footer.contact.phone.raw}`}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  {footer.contact.phone.display}
                </a>
              </li>
              <li>
                <a 
                  href={`mailto:${footer.contact.email.raw}`}
                  className="text-gray-400 hover:text-white transition-colors text-sm"
                >
                  {footer.contact.email.display}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Telif Hakkı */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <p className="text-center text-gray-400 text-sm">
            {footer.copyright.replaceYear 
              ? footer.copyright.text.replace('{year}', currentYear.toString())
              : footer.copyright.text
            }
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;