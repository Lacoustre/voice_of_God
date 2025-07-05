import React from "react";
import { motion } from "framer-motion";

const SectionTitle = ({ title }) => {
  return (
    <motion.h2
      className="text-4xl font-bold text-transparent bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text mb-8"
      initial={{ opacity: 0, x: -100, scale: 0.8 }}
      whileInView={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ 
        duration: 0.8, 
        type: "spring", 
        stiffness: 100,
        bounce: 0.3
      }}
    >
      {title}
    </motion.h2>
  );
};

export default SectionTitle;