import React from "react";
import { motion } from "framer-motion";
import MinistryCarousel from "./MinistryCarousel";

export default function CharityFoundation() {
  return (
    <div className="grid md:grid-cols-2 gap-8 items-center">
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-1 rounded-xl">
          <MinistryCarousel 
            images={[
              "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
              "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
              "https://images.unsplash.com/photo-1593113598332-cd59a93f9dd4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
            ]}
            title="Charity Foundation"
          />
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold text-white mb-4">Charity Foundation</h2>
        <p className="text-gray-300 mb-6">
          Our Charity Foundation extends the love of Christ by meeting the physical, emotional, and 
          spiritual needs of those in our community and beyond. Through various outreach programs, 
          we provide food, clothing, shelter, and support to individuals and families facing hardship, 
          demonstrating God's compassion in practical ways.
        </p>
        <ul className="space-y-4 list-disc pl-5">
          <li>
            <h3 className="text-xl font-semibold text-blue-400">Food Bank</h3>
            <p className="text-gray-300">Providing nutritious meals to families in need</p>
          </li>
          <li>
            <h3 className="text-xl font-semibold text-blue-400">Clothing Drive</h3>
            <p className="text-gray-300">Collecting and distributing clothing to those in need</p>
          </li>
          <li>
            <h3 className="text-xl font-semibold text-blue-400">Community Support</h3>
            <p className="text-gray-300">Offering assistance to families during difficult times</p>
          </li>
        </ul>
      </motion.div>
    </div>
  );
}