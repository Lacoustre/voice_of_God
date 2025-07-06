import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaHeart, FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";
import donation_1 from "../assets/donation_1.JPG";
import donation_2 from "../assets/donation_2.JPG";
import logo from "../assets/logo.jpg";
import Toast from "./Toast";

const fallbackDonationImages = [donation_1, donation_2];

const CharityFoundationPage = () => {
  const [donationImages, setDonationImages] = useState(fallbackDonationImages);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  useEffect(() => {
    const fetchDonationImages = async () => {
      try {
        const response = await fetch('https://voice-of-god.onrender.com/api/media/media');
        if (response.ok) {
          const data = await response.json();
          if (data.donation && data.donation.length > 0) {
            // Server now filters by published status, but we'll keep the client-side filter as a safeguard
            const imageUrls = data.donation.map(item => item.image_url);
            if (imageUrls.length > 0) {
              setDonationImages(imageUrls);
            }
          }
        }
      } catch (error) {
        console.log('Using fallback donation images');
      } finally {
        setLoading(false);
      }
    };

    fetchDonationImages();
  }, []);

  useEffect(() => {
    if (!loading) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % donationImages.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [donationImages.length, loading]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % donationImages.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + donationImages.length) % donationImages.length);

  const handleCopyZelle = () => {
    navigator.clipboard.writeText("+1 (860) 967-5647");
    showToast("Zelle phone number copied!");
  };

  return (
    <section className="py-8 relative">
      <motion.div className="text-center mb-12 max-w-4xl mx-auto" initial={{ opacity: 0, x: 100 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, type: "spring", stiffness: 80 }}>
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Voice of God Ministry Logo" className="h-24 w-auto" />
        </div>
        <h2 className="text-2xl font-bold text-purple-300 mb-4">Voice of God Ministry</h2>
        <p className="text-gray-200 text-lg leading-relaxed font-bold">
          The VOG Charity Foundation is a <span className="font-bold">501(c)(3) nonprofit organization</span> that assists people who are experiencing circumstances that have deprived them of meeting basic needs. Our mission relies on the Christian values of hope, compassion and service, while offering support and resources that enhances the wellbeing of members in the community.
        </p>
        <p className="italic text-purple-300 text-sm mt-4 font-bold">
          Galatians 6:2 NIV - "Carry each other's burden, and in this way you will fulfill the law of Christ."
        </p>
      </motion.div>

      <motion.div className="max-w-5xl mx-auto mb-12" initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, type: "spring", stiffness: 100 }}>
        <div className="rounded-2xl overflow-hidden shadow-xl relative">
          <div className="relative h-[400px] w-full">
            {loading ? (
              <div className="flex items-center justify-center h-full bg-gray-800">
                <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                {donationImages.map((img, index) => (
                  <img key={index} src={img} alt={`Donation ${index + 1}`} className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-100" : "opacity-0"}`} />
                ))}
                <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full"><FaChevronLeft /></button>
                <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full"><FaChevronRight /></button>
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                  {donationImages.map((_, index) => (
                    <button key={index} onClick={() => setCurrentSlide(index)} className={`h-2 rounded-full ${currentSlide === index ? "w-8 bg-white" : "w-2 bg-white/50"} transition-all`} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>

      <motion.div className="max-w-4xl mx-auto text-center mb-12" initial={{ opacity: 0, x: -100 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2, type: "spring" }}>
        <p className="text-gray-200 text-md leading-relaxed">
          Our goal is to serve individuals and families who are faced with hardship, oppressed and disadvantaged members of society. So far the VOG Charity Foundation has been able to provide food, clothing, toiletries and school supplies to individuals and families in need. Our vision is to expand our efforts in supporting others internationally.
        </p>
      </motion.div>

      <motion.div className="flex justify-center" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3, type: "spring", stiffness: 200 }}>
        <motion.button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-3 bg-purple-700 text-white text-lg font-semibold px-6 py-3 rounded-full hover:bg-purple-600 transition-all duration-300 shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaHeart className="text-white animate-pulse" /> Donate Now
        </motion.button>
      </motion.div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center px-4">
          <motion.div
            className="bg-gray-900 text-white max-w-sm w-full p-6 rounded-xl shadow-xl relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white transition">
              <FaTimes size={20} />
            </button>

            <h3 className="text-xl font-bold mb-4 text-purple-300 text-center">Donate via Zelle</h3>
            <p className="text-center text-sm mb-3">Please use the Zelle number below to send your donation:</p>
            <div className="bg-gray-800 text-center p-3 rounded-lg mb-4 font-semibold tracking-wide text-purple-200 text-lg">
              +1 (860) 967 5647
            </div>
            <p className="text-xs text-gray-400 text-center mb-4 italic">Include "Charity Donation" in the memo if possible.</p>

            <button
              onClick={handleCopyZelle}
              className="w-full py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold transition"
            >
              Copy Zelle Number
            </button>
          </motion.div>
        </div>
      )}
      
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </section>
  );
};

export default CharityFoundationPage;
