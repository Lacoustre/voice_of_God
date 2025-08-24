import React from "react";
import { motion } from "framer-motion";

const SectionTitle = ({ title }) => {
  return (
    <motion.h2
      className="text-4xl font-bold text-primary-800 mb-8"
      initial={{ opacity: 0, y: -30, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.8, 
        type: "spring", 
        stiffness: 120,
        damping: 15
      }}
      viewport={{ once: true }}
    >
      {title}
    </motion.h2>
  );
};

export default SectionTitle;