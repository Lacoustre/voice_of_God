import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronDown, Heart, Menu, X } from "lucide-react";
import logo from "../assets/modified_logo.png";
import CarouselComponent from "./CarouselComponent";
import { scrollToSection } from "./ScrollToSection";
import JoinModal from "./JoinModal";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [showMinistriesDropdown, setShowMinistriesDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      setShowMinistriesDropdown(false);
      
      const sections = ['home', 'leadership', 'services', 'ministries', 'events', 'contact'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('keydown', handleEscape);
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const navItems = [
    { name: 'HOME', id: 'home' },
    { name: 'LEADERSHIP', id: 'leadership' },
    { name: 'SERVICES', id: 'services' },
    { name: 'EVENTS', id: 'events' },
    { name: 'CONTACT', id: 'contact' }
  ];

  const ministryItems = [
    { name: "Children's Ministry", path: "/childrens-ministry" },
    { name: "Youth Ministry", path: "/youth-ministry" },
    { name: "Chosen Generation", path: "/chosen-generation" },
    { name: "Women's Ministry", path: "/womens-ministry" },
    { name: "Men's Ministry", path: "/mens-ministry" },
    { name: "Charity Foundation", path: "/charity-foundation" }
  ];

  return (
    <div className="relative -mt-20">
      <div id="home" className="relative">
        <CarouselComponent />
        
        <nav className={`absolute lg:fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'lg:bg-white/95 lg:backdrop-blur-md lg:shadow-lg lg:border-b lg:border-gray-200/20' 
            : 'lg:bg-white/10 lg:backdrop-blur-sm'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20 lg:h-20 h-24">
              
              {/* Logo */}
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <img
                    src={logo}
                    alt="Voice of God Ministries"
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-white/40 group-hover:ring-white/60 transition-all"
                  />
                </div>
                <div className="hidden sm:block">
                  <h1 className={`text-xl font-bold tracking-tight ${scrolled ? 'text-gray-900' : 'text-white'}`}>
                    Voice of God Ministries
                  </h1>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-1">
                {navItems.map((item) => (
                  <motion.a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      if(window.location.pathname === '/') {
                        scrollToSection(item.id);
                      } else {
                        window.location.href = `/#${item.id}`;
                      }
                    }}
                    className={`px-4 py-2 text-sm font-medium transition-all duration-200 relative ${
                      activeSection === item.id
                        ? scrolled 
                          ? 'text-gray-900' 
                          : 'text-white'
                        : scrolled
                          ? 'text-gray-700 hover:text-gray-900'
                          : 'text-white/90 hover:text-white'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {item.name}
                    {activeSection === item.id && (
                      <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                        scrolled ? 'bg-gray-900' : 'bg-white'
                      }`} />
                    )}
                  </motion.a>
                ))}

                {/* Ministries Dropdown */}
                <div className="relative">
                  <motion.button
                    onClick={() => setShowMinistriesDropdown(!showMinistriesDropdown)}
                    className={`flex items-center space-x-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      scrolled
                        ? 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        : 'text-white/90 hover:bg-white/10 hover:text-white'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span>MINISTRIES</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showMinistriesDropdown ? 'rotate-180' : ''}`} />
                  </motion.button>
                </div>
              </div>

              {/* CTA Button */}
              <div className="hidden lg:flex items-center space-x-4">
                <button
                  onClick={() => setShowJoinModal(true)}
                  className={`inline-flex items-center space-x-2 px-6 py-2.5 font-semibold transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl relative overflow-hidden group hover:text-white ${
                    scrolled ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
                  }`}
                >
                  <div className="absolute inset-0 bg-orange-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
                  <span className="relative z-10">Join Us</span>
                </button>
              </div>

              {/* Mobile Menu Button */}
              <motion.button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-lg transition-colors text-white"
                whileTap={{ scale: 0.95 }}
              >
                <Menu className="w-6 h-6" />
              </motion.button>
            </div>

            {/* Ministries Dropdown - Expands navbar height */}
            <AnimatePresence>
              {showMinistriesDropdown && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="lg:block hidden overflow-hidden border-t border-gray-200/20 mt-4"
                >
                  <div className="py-4">
                    <div className={`flex items-center space-x-2 px-4 py-2 mb-3 text-base font-bold ${
                      scrolled ? 'text-gray-900' : 'text-white'
                    }`}>
                      <span className="cursor-pointer group">Ministries
                        <span className="bg-orange-500 text-white px-2 py-1 text-sm transform group-hover:translate-x-1 transition-transform inline-block ml-2">&gt;</span>
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {ministryItems.map((ministry) => (
                        <Link
                          key={ministry.path}
                          to={ministry.path}
                          onClick={() => setShowMinistriesDropdown(false)}
                          className={`block px-4 py-3 text-sm font-medium rounded-lg ${
                            scrolled
                              ? 'text-gray-700'
                              : 'text-white/90'
                          }`}
                        >
                          {ministry.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <>
                {/* Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setMobileMenuOpen(false)}
                  className="lg:hidden fixed inset-0 bg-black/50 z-50"
                />
                
                {/* Sidebar */}
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'tween', duration: 0.5, ease: 'easeInOut' }}
                  className="lg:hidden fixed right-0 top-0 h-full w-full bg-white z-50 overflow-y-auto"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between p-6 border-b">
                    <img src={logo} alt="Logo" className="w-10 h-10 rounded-full" />
                    <button
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-2 rounded-lg"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  
                  {/* Navigation */}
                  <div className="py-4">
                    {!mobileDropdownOpen ? (
                      <>
                        {navItems.map((item) => (
                          <a
                            key={item.id}
                            href={`#${item.id}`}
                            onClick={(e) => {
                              e.preventDefault();
                              if(window.location.pathname === '/') {
                                scrollToSection(item.id);
                              } else {
                                window.location.href = `/#${item.id}`;
                              }
                              setMobileMenuOpen(false);
                            }}
                            className="block w-full px-6 py-4 text-left border-b border-gray-100 hover:bg-gray-50"
                          >
                            {item.name}
                          </a>
                        ))}
                        
                        {/* Ministries Dropdown */}
                        <button
                          onClick={() => setMobileDropdownOpen(true)}
                          className="flex items-center justify-between w-full px-6 py-4 text-left border-b border-gray-100 hover:bg-gray-50"
                        >
                          <span>MINISTRIES</span>
                          <ChevronDown className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => {
                            setMobileMenuOpen(false);
                            setShowJoinModal(true);
                          }}
                          className="block w-full px-6 py-4 text-left border-b border-gray-100 font-semibold text-white bg-gray-900 relative overflow-hidden group"
                        >
                          <div className="absolute inset-0 bg-orange-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>
                          <span className="relative z-10">Join Us</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => setMobileDropdownOpen(false)}
                          className="flex items-center w-full px-6 py-4 text-left border-b border-gray-100 hover:bg-gray-50"
                        >
                          <span>&larr; Back</span>
                        </button>
                        {ministryItems.map((ministry) => (
                          <Link
                            key={ministry.path}
                            to={ministry.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-6 py-4 text-left border-b border-gray-100 hover:bg-gray-50"
                          >
                            {ministry.name}
                          </Link>
                        ))}
                      </>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </nav>
      </div>
      
      <JoinModal isOpen={showJoinModal} onClose={() => setShowJoinModal(false)} />
    </div>
  );
}