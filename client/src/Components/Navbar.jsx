import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import logo from "../assets/modified_logo.png";
import CarouselComponent from "./CarouselComponent";
import { Heart } from "lucide-react";
import { scrollToSection } from "./ScrollToSection";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [showMinistriesDropdown, setShowMinistriesDropdown] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'leadership', 'services', 'ministries', 'events', 'contact'];
      
      // Find the section that is currently in view
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // If the section is in the viewport (with some offset for navbar)
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on initial load
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div>
      <div id="home" className="relative">
        <CarouselComponent />
        <nav className="fixed md:top-8 top-0 left-1/2 transform -translate-x-1/2 z-50 bg-slate-900 text-white shadow-md md:rounded-2xl px-4 py-3 max-w-7xl w-full md:w-[calc(100%-2rem)] mx-auto md:mx-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-1">
            <img
              src={logo}
              alt="Logo"
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-lg font-semibold tracking-wide sm:inline hidden">
              Voice of God Ministies
            </span>
            <span className="text-lg font-semibold tracking-wide sm:hidden inline">
              VOG
            </span>
          </Link>

          <ul className="hidden md:flex space-x-4 items-center font-semibold">
            <motion.li
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`cursor-pointer transition ${activeSection === 'home' ? 'text-white font-bold scale-110' : 'text-white/80'}`}
            >
              <a href="#home" onClick={(e) => {e.preventDefault(); if(window.location.pathname === '/') { scrollToSection('home'); } else { window.location.href = '/#home'; }}} className="cursor-pointer">HOME</a>
            </motion.li>
            <motion.li
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`cursor-pointer transition ${activeSection === 'leadership' ? 'text-white font-bold scale-110' : 'text-white/80'}`}
            >
              <a href="#leadership" onClick={(e) => {e.preventDefault(); if(window.location.pathname === '/') { scrollToSection('leadership'); } else { window.location.href = '/#leadership'; }}} className="cursor-pointer">LEADERSHIP</a>
            </motion.li>
            <motion.li
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`cursor-pointer transition ${activeSection === 'services' ? 'text-white font-bold scale-110' : 'text-white/80'}`}
            >
              <a href="#services" onClick={(e) => {e.preventDefault(); if(window.location.pathname === '/') { scrollToSection('services'); } else { window.location.href = '/#services'; }}} className="cursor-pointer">SERVICES</a>
            </motion.li>
            <motion.li
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`cursor-pointer transition relative ${activeSection === 'ministries' ? 'text-white font-bold scale-110' : 'text-white/80'}`}
            >
              <button onClick={() => setShowMinistriesDropdown(!showMinistriesDropdown)} className="cursor-pointer flex items-center gap-1">
                MINISTRIES
                <svg className={`w-4 h-4 transition-transform ${showMinistriesDropdown ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <AnimatePresence>
                {showMinistriesDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 mt-2 bg-white text-slate-800 rounded-lg shadow-xl border border-gray-200 min-w-48 z-50"
                  >
                    <div className="py-2">
                      <Link to="/youth-ministry" onClick={() => setShowMinistriesDropdown(false)} className="block px-4 py-2 hover:bg-slate-50 transition-colors text-sm font-medium">Youth Ministry</Link>
                      <Link to="/chosen-generation" onClick={() => setShowMinistriesDropdown(false)} className="block px-4 py-2 hover:bg-slate-50 transition-colors text-sm font-medium">Chosen Generation</Link>
                      <Link to="/womens-ministry" onClick={() => setShowMinistriesDropdown(false)} className="block px-4 py-2 hover:bg-slate-50 transition-colors text-sm font-medium">Women's Ministry</Link>
                      <Link to="/mens-ministry" onClick={() => setShowMinistriesDropdown(false)} className="block px-4 py-2 hover:bg-slate-50 transition-colors text-sm font-medium">Men's Ministry</Link>
                      <Link to="/charity-foundation" onClick={() => setShowMinistriesDropdown(false)} className="block px-4 py-2 hover:bg-slate-50 transition-colors text-sm font-medium">Charity Foundation</Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.li>
            <motion.li
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`cursor-pointer transition ${activeSection === 'events' ? 'text-white font-bold scale-110' : 'text-white/80'}`}
            >
              <a href="#events" onClick={(e) => {e.preventDefault(); if(window.location.pathname === '/') { scrollToSection('events'); } else { window.location.href = '/#events'; }}} className="cursor-pointer">EVENTS</a>
            </motion.li>

            <motion.li
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`cursor-pointer transition ${activeSection === 'contact' ? 'text-white font-bold scale-110' : 'text-white/80'}`}
            >
              <a href="#contact" onClick={(e) => {e.preventDefault(); if(window.location.pathname === '/') { scrollToSection('contact'); } else { window.location.href = '/#contact'; }}} className="cursor-pointer">CONTACT</a>
            </motion.li>
            <li>
              <Link
                to="/join"
                className="inline-flex items-center gap-1 px-4 py-2 bg-slate-700 text-white font-semibold rounded-xl hover:bg-slate-600 hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                <Heart size={16} />
                Join Us
              </Link>
            </li>
          </ul>

          <div className="md:hidden flex items-center ml-auto">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="focus:outline-none flex items-center justify-center"
              aria-label="Toggle menu"
            >
              <motion.div className="w-6 h-5 flex flex-col justify-between">
                <motion.span
                  className={`h-0.5 w-full bg-white block rounded-sm transition-all duration-300 ${
                    isMenuOpen ? "rotate-45 translate-y-2" : ""
                  }`}
                ></motion.span>
                <motion.span
                  className={`h-0.5 w-full bg-white block rounded-sm transition-all duration-300 ${
                    isMenuOpen ? "opacity-0" : "opacity-100"
                  }`}
                ></motion.span>
                <motion.span
                  className={`h-0.5 w-full bg-white block rounded-sm transition-all duration-300 ${
                    isMenuOpen ? "-rotate-45 -translate-y-2" : ""
                  }`}
                ></motion.span>
              </motion.div>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-slate-800 px-4 py-3 text-white font-semibold rounded-b-2xl space-y-2 [&>div]:border-b [&>div]:border-white/20 [&>div]:pb-1 absolute right-0 w-48 top-full mt-2 text-sm"
            >
              <motion.div
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
                className="border-b border-gray-700 pb-2"
              >
                <a
                  href="#home"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = '/#home';
                    setTimeout(() => scrollToSection('home'), 100);
                    setIsMenuOpen(false);
                  }}
                  className={`cursor-pointer flex justify-end w-full ${activeSection === 'home' ? 'text-white font-bold' : 'text-white/80'}`}
                >
                  HOME
                </a>
              </motion.div>
              <motion.div
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
                className="border-b border-gray-700 pb-2"
              >
                <a
                  href="#leadership"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('leadership');
                    setIsMenuOpen(false);
                  }}
                  className={`cursor-pointer flex justify-end w-full ${activeSection === 'leadership' ? 'text-white font-bold' : 'text-white/80'}`}
                >
                  LEADERSHIP
                </a>
              </motion.div>
              <motion.div
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
                className="border-b border-gray-700 pb-2"
              >
                <a
                  href="#services"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('services');
                    setIsMenuOpen(false);
                  }}
                  className={`cursor-pointer flex justify-end w-full ${activeSection === 'services' ? 'text-white font-bold' : 'text-white/80'}`}
                >
                  SERVICES
                </a>
              </motion.div>
              <motion.div
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
                className="border-b border-gray-700 pb-2"
              >
                <div className="space-y-1">
                  <button
                    onClick={() => setShowMinistriesDropdown(!showMinistriesDropdown)}
                    className={`cursor-pointer flex justify-end w-full items-center gap-1 ${activeSection === 'ministries' ? 'text-white font-bold' : 'text-white/80'}`}
                  >
                    MINISTRIES
                    <svg className={`w-3 h-3 transition-transform ${showMinistriesDropdown ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {showMinistriesDropdown && (
                    <div className="text-xs text-white/60 space-y-1 pl-4">
                      <Link to="/youth-ministry" className="block cursor-pointer hover:text-white" onClick={() => {setIsMenuOpen(false); setShowMinistriesDropdown(false);}}>Youth Ministry</Link>
                      <Link to="/chosen-generation" className="block cursor-pointer hover:text-white" onClick={() => {setIsMenuOpen(false); setShowMinistriesDropdown(false);}}>Chosen Generation</Link>
                      <Link to="/womens-ministry" className="block cursor-pointer hover:text-white" onClick={() => {setIsMenuOpen(false); setShowMinistriesDropdown(false);}}>Women's Ministry</Link>
                      <Link to="/mens-ministry" className="block cursor-pointer hover:text-white" onClick={() => {setIsMenuOpen(false); setShowMinistriesDropdown(false);}}>Men's Ministry</Link>
                      <Link to="/charity-foundation" className="block cursor-pointer hover:text-white" onClick={() => {setIsMenuOpen(false); setShowMinistriesDropdown(false);}}>Charity Foundation</Link>
                    </div>
                  )}
                </div>
              </motion.div>
              <motion.div
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
                className="border-b border-gray-700 pb-2"
              >
                <a
                  href="#events"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('events');
                    setIsMenuOpen(false);
                  }}
                  className={`cursor-pointer flex justify-end w-full ${activeSection === 'events' ? 'text-white font-bold' : 'text-white/80'}`}
                >
                  EVENTS
                </a>
              </motion.div>

              <motion.div
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.95 }}
                className="border-b border-gray-700 pb-2"
              >
                <a
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('contact');
                    setIsMenuOpen(false);
                  }}
                  className={`cursor-pointer flex justify-end w-full ${activeSection === 'contact' ? 'text-white font-bold' : 'text-white/80'}`}
                >
                  CONTACT
                </a>
              </motion.div>
              <div className="pt-1 flex justify-end">
                <Link
                  to="/join"
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 hover:shadow-lg hover:scale-105 transition-all duration-200 text-xs"
                >
                  <Heart size={12} />
                  Join Us
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      </div>
    </div>
  );
}