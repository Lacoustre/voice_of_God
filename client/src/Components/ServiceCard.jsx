import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaMapMarkerAlt, FaTimes, FaClock, FaCircle } from "react-icons/fa";

const ServiceCard = ({ service, isOngoing }) => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "unset";
    return () => (document.body.style.overflow = "unset");
  }, [showModal]);

  return (
    <>
      <motion.div
        className="cursor-pointer border bg-black hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col h-[28rem] relative group"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        viewport={{ once: true }}
        onClick={() => setShowModal(true)}
      >
        <div
          className="absolute inset-0 transition-all duration-500 group-hover:scale-50 group-hover:translate-x-full group-hover:translate-y-full group-hover:opacity-0"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.2)), url(${service.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        {isOngoing && (
          <motion.div 
            className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-full flex items-center gap-2 z-10"
            initial={{ scale: 0.9, opacity: 0.8 }}
            animate={{ 
              scale: [0.9, 1.05, 0.9],
              opacity: [0.8, 1, 0.8],
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 1.5,
              ease: "easeInOut"
            }}
          >
            <FaCircle className="text-xs" />
            <span className="font-bold text-xs">LIVE NOW</span>
          </motion.div>
        )}
        
        <div className="relative p-4 text-left">
          <h3 className="text-lg font-bold text-white drop-shadow-lg transition-all duration-300 group-hover:-translate-y-2">
            {service.title}
          </h3>
          <p className="text-sm text-white mt-2 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
            {service.verse || service.description}
          </p>
        </div>
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="bg-white max-w-5xl w-full max-h-[95vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <div className="h-96 w-full relative">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-contain bg-gray-100"
                  />
                </div>

                <button
                  className="absolute top-4 right-4 p-2 hover:bg-white/90 rounded-lg transition-colors"
                  onClick={() => setShowModal(false)}
                >
                  <FaTimes />
                </button>
              </div>

              <div className="p-6 bg-white text-left">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-3xl font-bold text-gray-900">
                    {service.title}
                  </h2>
                  {isOngoing && (
                    <motion.div 
                      className="bg-red-600 text-white px-3 py-1 rounded-full flex items-center gap-2"
                      initial={{ scale: 0.9, opacity: 0.8 }}
                      animate={{ 
                        scale: [0.9, 1.05, 0.9],
                        opacity: [0.8, 1, 0.8],
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 1.5,
                        ease: "easeInOut"
                      }}
                    >
                      <motion.div
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                      >
                        <FaCircle className="text-xs" />
                      </motion.div>
                      <span className="font-bold text-sm">{service.ongoingText || "LIVE NOW"}</span>
                    </motion.div>
                  )}
                </div>

                {service.schedule && service.schedule.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                      <FaClock className="text-orange-500" />
                      <h3 className="font-bold text-xl">Schedule</h3>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {service.schedule.map((scheduleItem, idx) => (
                        <span key={idx} className="text-sm bg-orange-100 px-4 py-2 rounded-full">
                          {scheduleItem}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {service.verse && (
                  <div className="mb-6 p-4 bg-orange-50 rounded-lg">
                    <p className="italic text-gray-700">"{service.verse}"</p>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="font-bold mb-3 text-xl">Service Details</h3>
                  <p className="text-gray-700">{service.description}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ServiceCard;
