import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { SITE_CONFIG } from "@/utils/constants";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Content", path: "/content" },
  { name: "Notice", path: "/notice" },
  { name: "Alumni", path: "/alumni" },
  { name: "Details", path: "/details" },
  { name: "Gallery", path: "/gallery" },
  { name: "Donate", path: "/donate" },
  { name: "Services", path: "/services" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { currentUser, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="w-full px-4 sm:px-6 lg:px-12 py-1.5">
        <div className="flex justify-between items-center h-16">
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
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                aria-label={`Navigate to ${item.name}`}
                className={`px-3 py-2 text-sm font-medium transition-all duration-300 relative ${
                  isActive(item.path)
                    ? "text-indigo-600 bg-indigo-50 rounded-t-md"
                    : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-md" 
                }`}
              >
                {item.name}
                {isActive(item.path) && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            ))}
            
            {/* Auth Section */}
            {currentUser ? (
              <div className="flex items-center space-x-2 ml-4 pl-4 border-l">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-indigo-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {currentUser.displayName?.split(' ')[0] || 'User'}
                  </span>
                </div>
                <Button
                  onClick={logout}
                  variant="ghost"
                  size="sm"
                  className="text-gray-600 hover:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Link to="/login" className="ml-4 pl-4 border-l">
                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open mobile menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-8">
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">
                      Alumni Association Midnapur
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Alumni Mission Academy
                    </p>
                  </div>
                  
                  {/* Mobile Auth Section */}
                  {currentUser ? (
                    <div className="bg-indigo-50 rounded-lg p-4 mb-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{currentUser.displayName}</p>
                          <p className="text-sm text-gray-600">{currentUser.email}</p>
                        </div>
                      </div>
                      <Button
                        onClick={logout}
                        variant="outline"
                        size="sm"
                        className="w-full"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      <Button className="w-full mb-4 bg-indigo-600 hover:bg-indigo-700">
                        Login
                      </Button>
                    </Link>
                  )}

                  {navItems.map((item) => (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      aria-label={`Navigate to ${item.name}`}
                      className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                        isActive(item.path)
                          ? "text-indigo-600 bg-indigo-50 border border-indigo-200"
                          : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
