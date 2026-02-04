import React from "react";
import { motion } from "framer-motion";

const EventCard = ({ event }) => {
  const getImageUrl = () => {
    return event?.images?.[0] || "https://placehold.co/300x200?text=No+Image";
  };

  return (
    <motion.div
      className="cursor-pointer border bg-black hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden flex flex-col h-96 relative group"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      viewport={{ once: true }}
    >
      <div
        className="absolute inset-0 transition-all duration-500 group-hover:scale-50 group-hover:translate-x-full group-hover:translate-y-full group-hover:opacity-0"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.2)), url(${getImageUrl()})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      <div className="relative p-4 text-left">
        <h3 className="text-lg font-bold text-white drop-shadow-lg transition-all duration-300 group-hover:-translate-y-2">
          {event?.title || "Untitled Event"}
        </h3>
        <p className="text-sm text-white mt-2 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
          {event?.verse || "No verse available"}
        </p>
      </div>
    </motion.div>
  );
};

export default EventCard;