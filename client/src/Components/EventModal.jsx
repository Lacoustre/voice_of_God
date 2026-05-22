import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, MapPin, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { formatDate } from "../utils/dateUtils";

const EventModal = ({ isOpen, onClose, event }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [isImageFullscreen, setIsImageFullscreen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setCurrentImageIndex(0);
      setImageError(false);
      setIsImageFullscreen(false);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !event) return null;

  const images = event.images || [];
  const hasMultipleImages = images.length > 1;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
    setImageError(false);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    setImageError(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white max-w-5xl w-full max-h-[95vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative bg-gray-100">
            {images.length > 0 ? (
              <div className="relative w-full min-h-[400px] max-h-[600px] flex items-center justify-center bg-gray-900">
                <img
                  src={images[currentImageIndex]}
                  alt={`${event.title} - Image ${currentImageIndex + 1}`}
                  className="w-full h-full max-h-[600px] object-contain cursor-zoom-in"
                  onClick={() => setIsImageFullscreen(true)}
                  onError={() => setImageError(true)}
                  title="Click to view fullscreen"
                />
                
                {hasMultipleImages && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 hover:bg-white shadow-lg text-gray-800 rounded-full transition-all duration-300 hover:scale-110 z-10"
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 hover:bg-white shadow-lg text-gray-800 rounded-full transition-all duration-300 hover:scale-110 z-10"
                      aria-label="Next image"
                    >
                      <ChevronRight size={24} />
                    </button>
                    
                    {/* Image counter */}
                    <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                      {currentImageIndex + 1} / {images.length}
                    </div>
                    
                    {/* Dot indicators */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                      {images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setCurrentImageIndex(idx);
                            setImageError(false);
                          }}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            idx === currentImageIndex 
                              ? 'bg-white w-8 shadow-lg' 
                              : 'bg-white/50 w-2 hover:bg-white/75'
                          }`}
                          aria-label={`Go to image ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
                
                {imageError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                    <p className="text-white text-lg">Failed to load image</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-[400px] flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                <div className="text-center text-white">
                  <Calendar size={64} className="mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No images available</p>
                </div>
              </div>
            )}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white rounded-full transition-all duration-300 hover:scale-110 shadow-lg z-20"
              aria-label="Close modal"
            >
              <X size={24} className="text-gray-800" />
            </button>
          </div>

          <div className="p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h2>

            <div className="space-y-3 mb-6">
              {event.date && (
                <div className="flex items-center gap-3 text-gray-700">
                  <Calendar size={20} className="text-orange-500" />
                  <span>{formatDate(event.date)}</span>
                </div>
              )}

              {event.time && (
                <div className="flex items-center gap-3 text-gray-700">
                  <Clock size={20} className="text-orange-500" />
                  <span>{event.time}</span>
                </div>
              )}

              {event.location && (
                <div className="flex items-center gap-3 text-gray-700">
                  <MapPin size={20} className="text-orange-500" />
                  <span>{event.location}</span>
                </div>
              )}
            </div>

            {event.description && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">{event.description}</p>
              </div>
            )}

            {event.verse && (
              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-6">
                <p className="text-gray-800 italic">"{event.verse}"</p>
              </div>
            )}

            {event.speaker && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Speaker</h3>
                <p className="text-gray-700">{event.speaker}</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Fullscreen Image Viewer */}
        {isImageFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-[60] flex items-center justify-center p-4"
            onClick={() => setIsImageFullscreen(false)}
          >
            <button
              onClick={() => setIsImageFullscreen(false)}
              className="absolute top-4 right-4 p-3 bg-white/90 hover:bg-white rounded-full transition-all duration-300 hover:scale-110 shadow-lg z-20"
              aria-label="Close fullscreen"
            >
              <X size={28} className="text-gray-800" />
            </button>
            
            {hasMultipleImages && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    prevImage();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 hover:bg-white shadow-lg text-gray-800 rounded-full transition-all duration-300 hover:scale-110 z-10"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={28} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextImage();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 hover:bg-white shadow-lg text-gray-800 rounded-full transition-all duration-300 hover:scale-110 z-10"
                  aria-label="Next image"
                >
                  <ChevronRight size={28} />
                </button>
              </>
            )}
            
            <img
              src={images[currentImageIndex]}
              alt={`${event.title} - Image ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
              {currentImageIndex + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default EventModal;
