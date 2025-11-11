import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User, LogOut, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { SITE_CONFIG } from "@/utils/constants";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Events", path: "/events" },
  { name: "Notice", path: "/notice" },
  { name: "Featured Donors", path: "/featured-donors" },
  // { name: "Alumni", path: "/alumni" },
  { name: "Core Team", path: "/core-team" },
  { name: "Details", path: "/details" },
  { name: "Gallery", path: "/gallery" },
  // { name: "Donate", path: "/donate" },
  { name: "Services", path: "/services" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { currentUser, logout } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-full px-4 sm:px-6 lg:px-12 py-1.5 fixed z-20 bg-secondary">
      <div className="flex justify-between items-center h-16">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-teal-700 rounded-full flex items-center justify-center shadow-lg">
            <img src="/logo.jpg" alt="AAM Logo" className="h-full w-full rounded-full" />
          </div>
          <div className=" text-xl">
            <h1 className="text-lg sm:text-2xl font-serif font-bold text-[#1F1F1F] leading-tight">
              {SITE_CONFIG.title}
            </h1>
            {/* <p className="text-sm text-[#186F65] font-medium">
                {SITE_CONFIG.subtitle}
              </p> */}
            <p className="text-xs sm:text-sm text-[#666666]">
              {SITE_CONFIG.address}
            </p>
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
          
          {/* Admin Panel Link (Desktop) */}
          {currentUser?.admin && (
            <Link
              to="/admin"
              aria-label="Navigate to Admin Panel"
              className={`px-3 py-2 text-sm font-medium transition-all duration-300 relative ${
                isActive("/admin")
                  ? "text-indigo-600 bg-indigo-50 rounded-t-md"
                  : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-md"
              }`}
            >
              Admin Panel
              {isActive("/admin") && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Link>
          )}

          {/* Auth Section */}
          {currentUser ? (
            <div className="flex items-center space-x-2 ml-4 pl-4 border-l">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center focus:outline-none">
                    <User className="h-4 w-4 text-indigo-600" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <div className="px-3 py-2 text-xs text-gray-500 border-b mb-1">
                    {currentUser.name?.split(" ")[0] || "User"}
                    <br />
                    <span className="text-[10px] text-gray-400">
                      {currentUser.email}
                    </span>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="w-full text-left">
                      User Dashboard
                    </Link>
                  </DropdownMenuItem>
                  {currentUser.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="w-full text-left">
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-red-600 cursor-pointer"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Link to="/login" className="ml-4 pl-4 border-l">
              <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                Login
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="lg:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="default"
                size="icon"
                aria-label="Open mobile menu"
              >
                <Menu className="h-16 w-16" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 sm:w-[400px]">
              <SheetTitle className="sr-only">
                Mobile Navigation Menu
              </SheetTitle>
              <SheetDescription className="sr-only">
                Navigation menu for mobile devices
              </SheetDescription>
              <div className="flex flex-col space-y-2.5 mt-5">
                <div className="text-center mb-4">
                  <h2 className="text-base font-bold text-gray-900">
                    {SITE_CONFIG.title}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {SITE_CONFIG.address}
                  </p>
                </div>

                {/* Mobile Auth Section */}
                {currentUser ? (
                  <div className="bg-indigo-50 rounded-lg p-3 mb-3">
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="font-normal text-gray-900 text-xs">
                          {currentUser.name}
                        </p>
                        <p className="text-xs text-gray-600">
                          {currentUser.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex w-full gap-1">
                      <Link
                        to={"/dashboard"}
                        className="w-full flex flex-row items-center bg-gray-50 justify-center h-9 rounded-md px-3"
                      >
                        <User className="h-4 w-4 mr-2" />
                        User Dashboard
                      </Link>
                      {currentUser.role === "admin" && (
                        <Link
                          to={"/admin"}
                          className="w-full flex flex-row items-center bg-gray-50 justify-center h-9 rounded-md px-3"
                        >
                          <Shield className="h-4 w-4 mr-2" />
                          Admin Panel
                        </Link>
                      )}
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
                
                {/* Admin Panel Link (Mobile) */}
                {currentUser?.admin && (
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    aria-label="Navigate to Admin Panel"
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                      isActive("/admin")
                        ? "text-indigo-600 bg-indigo-50 border border-indigo-200"
                        : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                    }`}
                  >
                    Admin Panel
                  </Link>
                )}
                {currentUser && !currentUser.admin && (
                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    aria-label="Navigate to User Dashboard"
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                      isActive("/dashboard")
                        ? "text-indigo-600 bg-indigo-50 border border-indigo-200"
                        : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                    }`}
                  >
                    User Dashboard
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
