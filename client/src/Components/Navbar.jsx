import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import logo from "../assets/modified_logo.png";
import CarouselComponent from "./CarouselComponent";
import { Heart } from "lucide-react";

const navLinks = [
  { name: "HOME", to: "#home" },
  { name: "LEADERSHIP", to: "#leadership" },
  { name: "SERVICES", to: "#services" },
  { name: "EVENTS", to: "#events" },
  { name: "DONATE", to: "#donation" },
  { name: "CONTACT", to: "#contact" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      const sections = navLinks.map((link) => link.to.substring(1));
      const current = sections.reduce((current, section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 200) {
            return section;
          }
        }
        return current;
      }, "home");
      setActiveSection(current);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      <div id="home" className="relative">
        <CarouselComponent />
        <nav className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-black via-gray-900 to-black text-white shadow-md rounded-2xl px-6 py-3 max-w-6xl w-full mx-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <img
              src={logo}
              alt="Logo"
              className="w-9 h-9 rounded-full object-cover"
            />
            <span className="text-xl font-semibold tracking-wide">
              Voice of God Ministies
            </span>
          </Link>

          <ul className="hidden md:flex space-x-8 items-center font-semibold">
            {navLinks.map((link, index) => {
              const isActive = activeSection === link.to.substring(1);
              return (
                <motion.li
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`cursor-pointer transition ${
                    isActive ? "text-blue-400" : "text-white"
                  }`}
                >
                  <a href={link.to}>{link.name}</a>
                </motion.li>
              );
            })}
            <li>
              <Link
                to="/join"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                <Heart size={20} />
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
              {navLinks.map((link, index) => {
                const isActive = activeSection === link.to.substring(1);
                return (
                  <motion.div
                    key={index}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    className="border-b border-gray-700 pb-2"
                  >
                    <a
                      href={link.to}
                      onClick={() => setIsMenuOpen(false)}
                      className={`${
                        isActive ? "text-blue-400 font-bold" : "text-white"
                      }`}
                    >
                      {link.name}
                    </a>
                  </motion.div>
                );
              })}
              <div className="pt-2">
                <Link
                  to="/join"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200"
                >
                  <Heart size={20} />
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
