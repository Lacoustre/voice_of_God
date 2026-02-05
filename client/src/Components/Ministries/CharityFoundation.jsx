import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaHeart, FaTimes } from "react-icons/fa";
import MinistryCarousel from "./MinistryCarousel";
import donation_1 from "../../assets/donation_1.JPG";
import donation_2 from "../../assets/donation_2.JPG";

import Toast from "../Toast";

const fallbackDonationImages = [donation_1, donation_2];

export default function CharityFoundation() {
  const [donationImages, setDonationImages] = useState(fallbackDonationImages);

  const [showModal, setShowModal] = useState(false);
  const [, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  useEffect(() => {
    document.body.style.overflow = showModal ? 'hidden' : 'unset';
    return () => (document.body.style.overflow = 'unset');
  }, [showModal]);

  useEffect(() => {
    const fetchDonationImages = async () => {
      try {
        const response = await fetch('https://voice-of-god.onrender.com/api/media/media');
        if (response.ok) {
          const data = await response.json();
          if (data.donation && data.donation.length > 0) {
            const publishedImages = data.donation.filter(item => item.published).map(item => item.image_url);
            if (publishedImages.length > 0) {
              setDonationImages(publishedImages);
            }
          }
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchDonationImages();
  }, []);





  const handleCopyZelle = () => {
    navigator.clipboard.writeText("+1 (860) 967-5647");
    showToast("Zelle phone number copied!");
  };

  return (
    <div className="space-y-12">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-1 rounded-xl">
            <MinistryCarousel 
              images={donationImages}
              title="Charity Foundation"
            />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 80 }}
          viewport={{ once: true, margin: "-50px" }}
        >
          <h2 className="text-3xl font-bold text-amber-700 mb-4">Charity Foundation</h2>
          <p className="text-gray-700 mb-6">
            The VOG Charity Foundation is a <span className="font-bold">501(c)(3) nonprofit organization</span> that assists people who are experiencing circumstances that have deprived them of meeting basic needs. Our mission relies on the Christian values of hope, compassion and service, while offering support and resources that enhances the wellbeing of members in the community.
          </p>
          <p className="italic text-amber-600 text-sm mb-6 font-bold">
            Galatians 6:2 NIV - "Carry each other's burden, and in this way you will fulfill the law of Christ."
          </p>
          <ul className="space-y-4 list-disc pl-5">
            <li>
              <h3 className="text-xl font-semibold text-amber-600">Food Bank</h3>
              <p className="text-gray-700">Providing nutritious meals to families in need</p>
            </li>
            <li>
              <h3 className="text-xl font-semibold text-amber-600">Clothing Drive</h3>
              <p className="text-gray-700">Collecting and distributing clothing to those in need</p>
            </li>
            <li>
              <h3 className="text-xl font-semibold text-amber-600">Community Support</h3>
              <p className="text-gray-700">Offering assistance to families during difficult times</p>
            </li>
          </ul>
          
          <motion.div 
            className="mt-6" 
            initial={{ opacity: 0, scale: 0.8 }} 
            whileInView={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.6, delay: 0.4, type: "spring", stiffness: 120 }}
            viewport={{ once: true }}
          >
            <motion.button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-3 bg-amber-600 text-white text-lg font-semibold px-6 py-3 rounded-full hover:bg-amber-700 transition-all duration-300 shadow-lg"
              whileHover={{ scale: 1.05, y: -2, boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <FaHeart className="text-white animate-pulse" /> Donate Now
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center px-4">
          <motion.div
            className="bg-gray-900 text-white max-w-sm w-full p-6 shadow-xl relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white transition">
              <FaTimes size={20} />
            </button>

            <h3 className="text-xl font-bold mb-4 text-amber-300 text-center">Donate via Zelle</h3>
            <p className="text-center text-sm mb-3">Please use the Zelle number below to send your donation:</p>
            <div className="bg-gray-800 text-center p-3 mb-4 font-semibold tracking-wide text-amber-200 text-lg">
              +1 (860) 967 5647
            </div>
            <p className="text-xs text-gray-400 text-center mb-4 italic">Include "Charity Donation" in the memo if possible.</p>

            <button
              onClick={handleCopyZelle}
              className="w-full py-2 bg-amber-600 hover:bg-amber-700 font-bold transition"
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
    </div>
  );
}