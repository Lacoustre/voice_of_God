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
      const sections = ['home', 'leadership', 'services', 'ministries', 'events', 'donation', 'contact'];
      
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
        <nav className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-black via-gray-900 to-black text-white shadow-md rounded-2xl px-4 py-3 max-w-7xl w-full mx-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-1">
            <img
              src={logo}
              alt="Logo"
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-lg font-semibold tracking-wide">
              Voice of God Ministies
            </span>
          </Link>

          <ul className="hidden md:flex space-x-4 items-center font-semibold">
            <motion.li
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`cursor-pointer transition ${activeSection === 'home' ? 'text-blue-400 font-bold' : 'text-white'}`}
            >
              <a href="#home" onClick={(e) => {e.preventDefault(); scrollToSection('home');}} className="cursor-pointer">HOME</a>
            </motion.li>
            <motion.li
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`cursor-pointer transition ${activeSection === 'leadership' ? 'text-blue-400 font-bold' : 'text-white'}`}
            >
              <a href="#leadership" onClick={(e) => {e.preventDefault(); scrollToSection('leadership');}} className="cursor-pointer">LEADERSHIP</a>
            </motion.li>
            <motion.li
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`cursor-pointer transition ${activeSection === 'services' ? 'text-blue-400 font-bold' : 'text-white'}`}
            >
              <a href="#services" onClick={(e) => {e.preventDefault(); scrollToSection('services');}} className="cursor-pointer">SERVICES</a>
            </motion.li>
            <motion.li
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`cursor-pointer transition ${activeSection === 'ministries' ? 'text-blue-400 font-bold' : 'text-white'}`}
            >
              <a href="#ministries" onClick={(e) => {e.preventDefault(); scrollToSection('ministries');}} className="cursor-pointer">MINISTRIES</a>
            </motion.li>
            <motion.li
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`cursor-pointer transition ${activeSection === 'events' ? 'text-blue-400 font-bold' : 'text-white'}`}
            >
              <a href="#events" onClick={(e) => {e.preventDefault(); scrollToSection('events');}} className="cursor-pointer">EVENTS</a>
            </motion.li>
            <motion.li
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`cursor-pointer transition ${activeSection === 'donation' ? 'text-blue-400 font-bold' : 'text-white'}`}
            >
              <a href="#donation" onClick={(e) => {e.preventDefault(); scrollToSection('donation');}} className="cursor-pointer">DONATE</a>
            </motion.li>
            <motion.li
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`cursor-pointer transition ${activeSection === 'contact' ? 'text-blue-400 font-bold' : 'text-white'}`}
            >
              <a href="#contact" onClick={(e) => {e.preventDefault(); scrollToSection('contact');}} className="cursor-pointer">CONTACT</a>
            </motion.li>
            <li>
              <Link
                to="/join"
                className="inline-flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                <Heart size={16} />
                Join Us
              </Link>
            </li>
          </ul>

          <div className="md:hidden flex items-center">
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
              className="md:hidden bg-gray-900 px-6 py-4 text-white font-semibold rounded-b-2xl space-y-4"
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
                  className={`cursor-pointer ${activeSection === 'home' ? 'text-blue-400 font-bold' : 'text-white'}`}
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
                  className={`cursor-pointer ${activeSection === 'leadership' ? 'text-blue-400 font-bold' : 'text-white'}`}
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
                  className={`cursor-pointer ${activeSection === 'services' ? 'text-blue-400 font-bold' : 'text-white'}`}
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
                  className={`cursor-pointer ${activeSection === 'ministries' ? 'text-blue-400 font-bold' : 'text-white'}`}
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
                  className={`cursor-pointer ${activeSection === 'events' ? 'text-blue-400 font-bold' : 'text-white'}`}
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
                  href="#donation"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection('donation');
                    setIsMenuOpen(false);
                  }}
                  className={`cursor-pointer ${activeSection === 'donation' ? 'text-blue-400 font-bold' : 'text-white'}`}
                >
                  DONATE
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
                  className={`cursor-pointer ${activeSection === 'contact' ? 'text-blue-400 font-bold' : 'text-white'}`}
                >
                  CONTACT
                </a>
              </motion.div>
              <div className="pt-2">
                <Link
                  to="/join"
                  className="inline-flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200"
                >
                  <Heart size={16} />
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