import React from "react";
import { motion } from "framer-motion";
import Apostle_PK from "../assets/Apostle_PK.jpg";
import Pastor_Geina from "../assets/Pastor_Geina.jpg";
import Pastor_Alfred from "../assets/Pastor_Alfred.jpg";
import Pastor_David from "../assets/Pastor_David.jpg";

const leaders = [
  {
    name: "Apostle PK Oheneba",
    title: "Founder & Lead Pastor",
    image: Apostle_PK,
    bio: "Leading with vision and passion to transform lives through the power of God's Word."
  },
  {
    name: "Pastor Geina",
    title: "Residential Pastor",
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
  }
];

const LeadershipPage = () => {
  return (
    <section className="py-8">
      <motion.p 
        className="text-lg text-gray-200 max-w-2xl mx-auto mb-8 text-center font-bold"
        whileInView={{ opacity: 1, x: 0 }}
      >
        Meet the dedicated leaders guiding our ministry with faith and vision.
      </motion.p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {leaders.map((leader, index) => (
          <motion.div
            key={index}
            whileInView={{ opacity: 1, x: 0 }}
            className="bg-transparent backdrop-blur-sm rounded-lg shadow-lg border border-gray-700 hover:border-purple-500 transform hover:scale-105 transition-all duration-300 text-center p-6 cursor-pointer"
          >
            <motion.div 
              className="w-32 h-32 mx-auto mb-4 overflow-hidden rounded-full"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={leader.image}
                alt={leader.name}
                className="w-full h-full object-cover border-4 border-purple-600/50"
              />
            </motion.div>
            <h3 className="text-xl font-semibold text-white mb-1">{leader.name}</h3>
            <p className="text-sm text-purple-300 italic mb-3 font-bold">{leader.title}</p>
            <p className="text-sm text-gray-300 leading-relaxed font-bold">{leader.bio}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default LeadershipPage;