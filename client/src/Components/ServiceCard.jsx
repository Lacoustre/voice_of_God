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
        className="bg-gradient-to-br from-indigo-50/90 via-white/90 to-purple-50/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden w-full h-full cursor-pointer border border-white/60 group relative"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        whileHover={{
          y: -15,
          scale: 1.02,
          boxShadow: "0 30px 60px rgba(0, 0, 0, 0.2)",
          borderColor: "rgba(71, 85, 105, 0.2)"
        }}
        viewport={{ once: true }}
        onClick={() => setShowModal(true)}
      >
        <div className="rounded-t-3xl overflow-hidden relative h-72 group-hover:h-80 transition-all duration-500">
          <div className="absolute inset-0">
            <img
              src={service.image}
              alt={service.title}
              className="object-cover h-full w-full"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          </div>
          
          {isOngoing && (
            <motion.div 
              className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full flex items-center gap-2 z-20"
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

        <div className="p-8 text-gray-800 bg-gradient-to-b from-indigo-50/80 via-white/80 to-purple-50/80 relative">
          <div className="mb-4">
            <h3 className="text-2xl font-bold mb-1 text-slate-800">
              {service.title}
            </h3>
          </div>
          
          {service.schedule && service.schedule.length > 0 && (
            <div className="mb-4">
              <p className="text-xs text-slate-600 uppercase font-bold">Schedule</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {service.schedule.slice(0, 2).map((scheduleItem, idx) => (
                  <p key={idx} className="text-sm text-gray-700 font-medium">
                    {scheduleItem}
                  </p>
                ))}
              </div>
            </div>
          )}
          
          {service.verse && (
            <div className="mb-4">
              <p className="text-xs text-slate-600 uppercase font-bold mb-1">Scripture</p>
              <p className="text-sm text-gray-700 italic line-clamp-2">"{service.verse}"</p>
            </div>
          )}
          
          <div>
            <p className="text-xs text-slate-600 uppercase font-bold mb-1">Details</p>
            <p className="text-sm leading-relaxed text-gray-700 line-clamp-2">
              {service.description}
            </p>
            <p className="text-xs text-slate-700 mt-1 font-medium">Click for more info</p>
          </div>
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
              className="bg-gray-900 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <div className="h-64 md:h-80 relative">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="object-cover h-full w-full"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                </div>

                <button
                  className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                  onClick={() => setShowModal(false)}
                >
                  <FaTimes />
                </button>
              </div>

              <div className="p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-3xl font-bold text-purple-300">
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
                      <FaClock className="text-purple-400" />
                      <h3 className="font-bold text-xl">Schedule</h3>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {service.schedule.map((scheduleItem, idx) => (
                        <span key={idx} className="text-sm bg-purple-900 bg-opacity-30 px-4 py-2 rounded-full">
                          {scheduleItem}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {service.verse && (
                  <div className="mb-6 p-4 bg-purple-900 bg-opacity-30 rounded-lg">
                    <p className="italic text-purple-300">"{service.verse}"</p>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="font-bold mb-3 text-xl">Service Details</h3>
                  <p className="whitespace-pre-line">{service.description}</p>
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
