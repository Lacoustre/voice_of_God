import React from "react";
import { motion } from "framer-motion";
import Apostle_PK from "../assets/Apostle_PK.jpg";
import Pastor_Geina from "../assets/Pastor_Geina.jpg";
import Pastor_Alfred from "../assets/Pastor_Alfred.jpg";
import Pastor_David from "../assets/Pastor_David.jpg";
import Pastor_Giuseppina from "../assets/Pastor_Giuseppina.jpg";

const leaders = [
  {
    name: "Apostle Oheneba Poku (PK)",
    title: "Founder & Lead Pastor",
    image: Apostle_PK,
    bio: "Leading with vision and passion to transform lives through the power of God's Word."
  },
  {
    name: "Pastor Geina",
    title: "Resident Pastor",
    image: Pastor_Geina,
    bio: "Dedicated to nurturing spiritual growth and providing pastoral care to the congregation."
  },
  {
    name: "Pastor Alfred",
    title: "Head of Charity & Outreach Foundation",
    image: Pastor_Alfred,
    bio: "Committed to extending God's love through community service and charitable initiatives."
  },
  {
    name: "Pastor David",
    title: "Head of Youth Ministry",
    image: Pastor_David,
    bio: "Inspiring the next generation to develop a personal relationship with Christ."
  },
  {
    name: "Pastor Giuseppina Wetteyson",
    title: "Head of Chosen Generation",
    image: Pastor_Giuseppina,
    bio: "Leading and mentoring young adults in their spiritual journey and purpose."
  }
];

const LeadershipPage = () => {
  return (
    <section className="py-0 bg-church-gradient">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <motion.p 
          className="text-xl text-primary-600 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          Meet the dedicated leaders guiding our ministry with faith and vision.
        </motion.p>
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 w-full px-0">
        {leaders.map((leader, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true, margin: "-50px" }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl text-center p-8 cursor-pointer group relative overflow-hidden"
            whileHover={{ 
              y: -12, 
              scale: 1.03, 
              boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
              borderColor: "rgba(71, 85, 105, 0.3)"
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary-100/20 to-primary-200/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <motion.div 
              className="w-36 h-36 mx-auto mb-6 overflow-hidden rounded-full relative z-10"
              whileHover={{ scale: 1.1, rotate: 2 }}
              transition={{ type: "spring", stiffness: 250, damping: 20 }}
            >
              <img
                src={leader.image}
                alt={leader.name}
                className="w-full h-full object-cover object-top transition-colors duration-300"
              />
            </motion.div>
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-primary-800 mb-2 group-hover:text-primary-900 transition-colors">{leader.name}</h3>
              <p className="text-sm text-primary-600 italic mb-4 font-semibold">{leader.title}</p>
              <p className="text-sm text-primary-700 leading-relaxed">{leader.bio}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default LeadershipPage;