
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Heart } from 'lucide-react';
import { NAVIGATION_ITEMS, SITE_CONFIG } from '../utils/constants';

const Footer = () => {
  return (
    <footer className="bg-[#186F65] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-serif font-semibold mb-6 text-[#F9F7F1]">Quick Links</h3>
            <ul className="space-y-3">
              {NAVIGATION_ITEMS.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path}
                    className="text-white/80 hover:text-white transition-colors duration-200 hover:translate-x-1 transform inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-xl font-serif font-semibold mb-6 text-[#F9F7F1]">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin size={20} className="text-[#B2533E] mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white/80 leading-relaxed">
                    {SITE_CONFIG.subtitle}<br />
                    {SITE_CONFIG.address}<br />
                    West Bengal, India
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={20} className="text-[#B2533E] flex-shrink-0" />
                <p className="text-white/80">{SITE_CONFIG.phone}</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={20} className="text-[#B2533E] flex-shrink-0" />
                <p className="text-white/80">{SITE_CONFIG.email}</p>
              </div>
            </div>
          </div>

          {/* Social Media & Facebook Page */}
          <div>
            <h3 className="text-xl font-serif font-semibold mb-6 text-[#F9F7F1]">Connect With Us</h3>
            <div className="space-y-4">
              <div className="flex space-x-4">
                <a 
                  href="#" 
                  className="bg-[#B2533E] p-3 rounded-full hover:bg-[#B2533E]/80 transition-all duration-300 hover:scale-110"
                >
                  <Facebook size={20} />
                </a>
                <a 
                  href="#" 
                  className="bg-[#B2533E] p-3 rounded-full hover:bg-[#B2533E]/80 transition-all duration-300 hover:scale-110"
                >
                  <Twitter size={20} />
                </a>
                <a 
                  href="#" 
                  className="bg-[#B2533E] p-3 rounded-full hover:bg-[#B2533E]/80 transition-all duration-300 hover:scale-110"
                >
                  <Instagram size={20} />
                </a>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg border border-white/20">
                <h4 className="font-serif font-medium mb-2 text-[#F9F7F1]">Follow Our Alumni Network</h4>
                <p className="text-sm text-white/70 mb-3 leading-relaxed">
                  Join our growing community and stay updated with alumni activities
                </p>
                <button className="bg-[#B2533E] text-white px-4 py-2 rounded-full hover:bg-[#B2533E]/80 transition-all duration-300 text-sm font-medium">
                  Join Network
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="border-t border-white/20 mt-12 pt-8 text-center">
          <p className="text-white/70 flex items-center justify-center gap-2">
            © 2024 Powered by Al Ameen Alumni Association – Midnapore Branch. Made with 
            <Heart size={16} className="text-[#B2533E]" /> 
            for our mission family.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
