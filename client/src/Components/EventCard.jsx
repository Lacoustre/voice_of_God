import React, { useState } from "react";
import { motion } from "framer-motion";

const EventCard = ({ event }) => {
  const [imageError, setImageError] = useState(false);
  
  const getImageUrl = () => {
    if (imageError) {
      return "https://placehold.co/300x200?text=No+Image";
    }
    return event?.images?.[0] || "https://placehold.co/300x200?text=No+Image";
  };

  return (
    <motion.div
      className="cursor-pointer border border-gray-200 bg-black hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col h-96 relative group rounded-lg"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      viewport={{ once: true }}
    >
      {/* Background Image with proper cropping */}
      <div
        className="absolute inset-0 transition-all duration-500 group-hover:scale-110"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(${getImageUrl()})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      
      {/* Hidden img tag for error handling */}
      <img 
        src={event?.images?.[0]} 
        alt="" 
        className="hidden" 
        onError={() => setImageError(true)}
      />
      
      {/* Content overlay */}
      <div className="relative p-6 text-left flex flex-col justify-end h-full">
        <h3 className="text-xl font-bold text-white drop-shadow-lg transition-all duration-300 group-hover:-translate-y-2 mb-2">
          {event?.title || "Untitled Event"}
        </h3>
        {event?.verse && (
          <p className="text-sm text-white/90 mt-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 line-clamp-2">
            {event.verse}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default EventCard;