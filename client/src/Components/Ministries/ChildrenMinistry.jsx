import React from "react";
import { motion } from "framer-motion";
import MinistryCarousel from "./MinistryCarousel";

export default function ChildrenMinistry() {
  return (
    <div className="grid md:grid-cols-2 gap-8 items-center">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="order-2 md:order-1"
      >
        <h2 className="text-3xl font-bold text-white mb-4">Children's Ministry</h2>
        <p className="text-gray-300 mb-6">
          Our Children's Ministry creates a fun, safe environment where children can learn about God's 
          love and develop a strong foundation of faith. Through age-appropriate lessons, activities, 
          and worship, we help children discover their unique gifts and grow in their relationship with Jesus.
        </p>
        <ul className="space-y-4 list-disc pl-5">
          <li>
            <h3 className="text-xl font-semibold text-blue-400">Sunday School</h3>
            <p className="text-gray-300">Age-appropriate Bible lessons and activities</p>
          </li>
          <li>
            <h3 className="text-xl font-semibold text-blue-400">Vacation Bible School</h3>
            <p className="text-gray-300">Summer program filled with fun, learning, and adventure</p>
          </li>
          <li>
            <h3 className="text-xl font-semibold text-blue-400">Children's Choir</h3>
            <p className="text-gray-300">Teaching children to worship through music</p>
          </li>
        </ul>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="order-1 md:order-2"
      >
        <div className="bg-gradient-to-br from-green-500 to-teal-500 p-1 rounded-xl">
          <MinistryCarousel 
            images={[
              "https://images.unsplash.com/photo-1602052577122-f73b9710adba?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
              "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2072&q=80",
              "https://images.unsplash.com/photo-1577896851231-70ef18881754?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
            ]}
            title="Children's Ministry"
          />
        </div>
      </motion.div>
    </div>
  );
}