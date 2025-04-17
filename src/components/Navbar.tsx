import { useState, useEffect, useTransition, useRef, useCallback } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import siteConfig from '../config/site';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [, startTransition] = useTransition();
  const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const dropdownRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const { nav, brand } = siteConfig;

  const isActive = (path: string) => {
    if (path === '/kurumsal') {
      return location.pathname.startsWith('/kurumsal');
    }
    return location.pathname === path;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeDropdown && 
          dropdownRefs.current[activeDropdown] && 
          !dropdownRefs.current[activeDropdown]?.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, [activeDropdown]);

  const handleNavigation = useCallback((path: string) => {
    startTransition(() => {
      navigate(path);
      setIsOpen(false);
      setActiveDropdown(null);
    });
  }, [navigate]);

  const handleDropdownEnter = useCallback((path: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(path);
  }, []);

  const handleDropdownLeave = useCallback(() => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  }, []);

  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-50 bg-black shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <button
              onClick={() => handleNavigation('/')}
              className="flex items-center space-x-2"
            >
              <img 
                src={brand.logo}
                alt={brand.logoAlt}
                className="h-24 w-24 object-contain"
              />
              <span className="text-white font-semibold text-lg hidden sm:block">
                {brand.name}
              </span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {nav.links.map((link) => (
              <div key={link.path} className="relative">
                {link.dropdown ? (
                  <div
                    onMouseEnter={() => handleDropdownEnter(link.path)}
                    onMouseLeave={handleDropdownLeave}
                    ref={(el) => dropdownRefs.current[link.path] = el}
                  >
                    <button
                      className={`px-3 py-2 rounded-md text-base font-medium transition-colors ${
                        isActive(link.path) ? 'text-besiktas-red' : 'text-white hover:text-gray-300'
                      } flex items-center`}
                    >
                      {link.label}
                      <ChevronDown className={`ml-1 w-4 h-4 transition-transform duration-300 ${
                        activeDropdown === link.path ? 'rotate-180' : ''
                      }`} />
                    </button>
                    
                    {activeDropdown === link.path && (
                      <div className="absolute left-0 mt-2 w-56 rounded-md shadow-xl bg-black border border-gray-800 ring-1 ring-black ring-opacity-5 z-[60] overflow-hidden transform origin-top scale-100 transition-all duration-200 ease-in-out">
                        <div className="py-1 relative">
                          {/* Beşiktaş kırmızı şerit */}
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-besiktas-red"></div>
                          
                          {link.dropdown.map((item) => (
                            <button
                              key={item.path}
                              onClick={() => handleNavigation(item.path)}
                              className={`block w-full text-left pl-6 pr-4 py-3 text-base group transition-all duration-200 ${
                                isActive(item.path)
                                  ? 'text-besiktas-red bg-gray-900 font-medium'
                                  : 'text-gray-300 hover:bg-gray-900 hover:text-white'
                              }`}
                            >
                              <div className="flex items-center">
                                {isActive(item.path) && 
                                  <span className="absolute left-0 top-0 bottom-0 w-1 bg-besiktas-red"></span>
                                }
                                <span className="relative">{item.label}</span>
                                <span className={`absolute left-2 bottom-1 w-0 h-[1px] bg-besiktas-red group-hover:w-4/5 transition-all duration-300 ${isActive(item.path) ? 'w-4/5' : ''}`}></span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => handleNavigation(link.path)}
                    className={`px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive(link.path) ? 'text-besiktas-red' : 'text-white hover:text-gray-300'
                    }`}
                  >
                    {link.label}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-gray-300 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {nav.links.map((link) => (
              <div key={link.path}>
                {link.dropdown ? (
                  <>
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === link.path ? null : link.path)}
                      className={`w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center justify-between ${
                        isActive(link.path) ? 'text-besiktas-red' : 'text-white hover:text-gray-300'
                      }`}
                    >
                      <span>{link.label}</span>
                      <ChevronDown className={`ml-1 w-4 h-4 transform transition-transform duration-300 ${
                        activeDropdown === link.path ? 'rotate-180' : ''
                      }`} />
                    </button>
                    
                    <div
                      className={`pl-4 space-y-1 transition-all duration-300 ${
                        activeDropdown === link.path ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
                      }`}
                    >
                      <div className="border-l-2 border-besiktas-red pl-4 my-2 bg-gray-900 rounded-r-md">
                        {link.dropdown.map((item) => (
                          <button
                            key={item.path}
                            onClick={() => handleNavigation(item.path)}
                            className={`block w-full text-left px-3 py-2 rounded-md text-base transition-all duration-200 ${
                              isActive(item.path)
                                ? 'text-besiktas-red font-medium'
                                : 'text-gray-300 hover:text-white'
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <button
                    onClick={() => handleNavigation(link.path)}
                    className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                      isActive(link.path) ? 'text-besiktas-red' : 'text-white hover:text-gray-300'
                    }`}
                  >
                    {link.label}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Kırmızı gradient alt çizgi */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-black via-besiktas-red to-black shadow-md"></div>
    </nav>
  );
};

export default Navbar;
