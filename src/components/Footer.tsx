import { Link, useHref } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";

const Footer = () => {
  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Content", path: "/content" },
    { name: "Notice", path: "/notice" },
    { name: "Alumni", path: "/alumni" },
    { name: "Details", path: "/details" },
    { name: "Gallery", path: "/gallery" },
    { name: "Pay Us", path: "/donate" },
    { name: "Login", path: "/login" },
    { name: "Services", path: "/services" },
  ];

  const socialLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      href: "#",
      color: "text-[#1877F2]",
      bgColor: "bg-[#1877F2]/10",
    },
    {
      name: "Twitter",
      icon: Twitter,
      href: "#",
      color: "text-[#1DA1F2]",
      bgColor: "bg-[#1DA1F2]/10",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: "#",
      color: "text-[#0A66C2]",
      bgColor: "bg-[#0A66C2]/10",
    },
    {
      name: "Instagram",
      icon: Instagram,
      href: "#",
      color: "text-[#E4405F]",
      bgColor: "bg-[#E4405F]/10",
    },
  ];

  return (
    <footer className="bg-gray-900 text-white" role="contentinfo">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-semibold mb-6">Quick Links</h3>
            <div className="grid grid-cols-2 gap-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-gray-300 hover:text-white hover:underline transition-colors duration-200 text-sm py-1"
                  aria-label={`Navigate to ${link.name}`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Contact Us */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-semibold mb-6">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin
                  className="h-5 w-5 text-indigo-400 mt-0.5 flex-shrink-0"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-gray-300 font-medium">
                    Alumni Association Midnapur
                  </p>
                  <p className="text-gray-300">
                    Midnapur Post Street, Midnapur
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail
                  className="h-5 w-5 text-indigo-400 flex-shrink-0"
                  aria-hidden="true"
                />
                <a
                  href="mailto:ask@alumniassociationmidnapore.org"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                  aria-label="Send email to Alumni Association"
                >
                  ask@alumniassociationmidnapore.org
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone
                  className="h-5 w-5 text-indigo-400 flex-shrink-0"
                  aria-hidden="true"
                />
                <a
                  href="tel:+919876543210"
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                  aria-label="Call Alumni Association"
                >
                  +91 98765 43210
                </a>
              </div>
            </div>
          </motion.div>

          {/* Social & Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-semibold mb-6">Connect With Us</h3>
            <div className="space-y-6">
              <div>
                <p className="text-gray-300 text-sm mb-4">
                  Stay connected with our alumni community through social media
                </p>
                <div className="flex gap-3">
                  {socialLinks.map((social) => {
                    const IconComponent = social.icon;
                    return (
                      <Button
                        key={social.name}
                        variant="outline"
                        size="icon"
                        asChild
                        className={` border-white border-2 transition-all duration-200 ${social.color} hover:${social.bgColor} hover:${social.color} hover:scale-105 `}
                      >
                        <a
                          href={social.href}
                          aria-label={`Follow us on ${social.name}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <IconComponent className="h-10 w-10" />
                        </a>
                      </Button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold mb-3">Newsletter</h4>
                <p className="text-xs text-gray-400 mb-3">
                  Subscribe to get updates about events and news
                </p>
                <form
                  className="flex gap-2"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    aria-label="Email address for newsletter"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    className="bg-indigo-600 hover:bg-indigo-700"
                  >
                    Subscribe
                  </Button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Separator className="bg-gray-700" />

      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="text-left">
            <p className="text-xs text-gray-400">
              © 2025 Alumni Association Midnapur. All rights reserved.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Powered by Alumni Association – Midnapur Branch
            </p>
          </div>
          <div className="text-xs text-gray-400 text-right mt-2 sm:mt-0">
            Design and developed by{" "}
            <a
              href="/core-team#developer"
              // target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-indigo-300 hover:underline cursor-pointer"
            >
              Core Team AAM 
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
