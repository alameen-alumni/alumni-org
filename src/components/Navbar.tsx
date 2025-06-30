
import { Link, useLocation } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { Menu, X } from 'lucide-react';
import { mobileMenuState } from '../state/atoms';
import { NAVIGATION_ITEMS, SITE_CONFIG } from '../utils/constants';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useRecoilState(mobileMenuState);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 border-b border-[#186F65]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gradient-to-br from-[#186F65] to-[#B2533E] rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">AA</span>
            </div>
            <div className="hidden md:block">
              <h1 className="text-xl font-serif font-bold text-[#1F1F1F] leading-tight">
                {SITE_CONFIG.title}
              </h1>
              <p className="text-sm text-[#186F65] font-medium">
                {SITE_CONFIG.subtitle}
              </p>
              <p className="text-xs text-[#666666]">{SITE_CONFIG.address}</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex space-x-1">
            {NAVIGATION_ITEMS.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`px-4 py-2 text-sm font-medium transition-all duration-200 rounded-md ${
                  isActive(item.path)
                    ? 'text-white bg-[#186F65] shadow-md'
                    : 'text-[#1F1F1F] hover:text-[#186F65] hover:bg-[#186F65]/10'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-[#1F1F1F] hover:text-[#186F65] focus:outline-none p-2"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-[#186F65]/20">
            <div className="px-2 pt-4 pb-6 space-y-2 bg-[#F9F7F1]">
              {NAVIGATION_ITEMS.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`block px-4 py-3 text-base font-medium transition-colors duration-200 rounded-lg ${
                    isActive(item.path)
                      ? 'text-white bg-[#186F65]'
                      : 'text-[#1F1F1F] hover:text-[#186F65] hover:bg-white'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
