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
        <nav className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 bg-slate-900 text-white shadow-md rounded-2xl px-4 py-3 max-w-7xl w-[calc(100%-2rem)] mx-4">
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
              <a href="#home" onClick={(e) => {e.preventDefault(); scrollToSection('home');}} className="cursor-pointer">HOME</a>
            </motion.li>
            <motion.li
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`cursor-pointer transition ${activeSection === 'leadership' ? 'text-white font-bold scale-110' : 'text-white/80'}`}
            >
              <a href="#leadership" onClick={(e) => {e.preventDefault(); scrollToSection('leadership');}} className="cursor-pointer">LEADERSHIP</a>
            </motion.li>
            <motion.li
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`cursor-pointer transition ${activeSection === 'services' ? 'text-white font-bold scale-110' : 'text-white/80'}`}
            >
              <a href="#services" onClick={(e) => {e.preventDefault(); scrollToSection('services');}} className="cursor-pointer">SERVICES</a>
            </motion.li>
            <motion.li
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`cursor-pointer transition ${activeSection === 'ministries' ? 'text-white font-bold scale-110' : 'text-white/80'}`}
            >
              <a href="#ministries" onClick={(e) => {e.preventDefault(); scrollToSection('ministries');}} className="cursor-pointer">MINISTRIES</a>
            </motion.li>
            <motion.li
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`cursor-pointer transition ${activeSection === 'events' ? 'text-white font-bold scale-110' : 'text-white/80'}`}
            >
              <a href="#events" onClick={(e) => {e.preventDefault(); scrollToSection('events');}} className="cursor-pointer">EVENTS</a>
            </motion.li>

            <motion.li
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`cursor-pointer transition ${activeSection === 'contact' ? 'text-white font-bold scale-110' : 'text-white/80'}`}
            >
              <a href="#contact" onClick={(e) => {e.preventDefault(); scrollToSection('contact');}} className="cursor-pointer">CONTACT</a>
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
                    scrollToSection('home');
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
                <a
                  href="#ministries"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('ministries');
                    setIsMenuOpen(false);
                  }}
                  className={`cursor-pointer flex justify-end w-full ${activeSection === 'ministries' ? 'text-white font-bold' : 'text-white/80'}`}
                >
                  MINISTRIES
                </a>
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