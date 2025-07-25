import React from "react";
import { motion } from "framer-motion";
import MinistryCarousel from "./MinistryCarousel";

export default function WomensMinistry() {
  return (
    <div className="grid md:grid-cols-2 gap-8 items-center">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="order-2 md:order-1"
      >
        <h2 className="text-3xl font-bold text-slate-800 mb-4">Women's Ministry</h2>
        <p className="text-gray-700 mb-6">
          Our Women's Ministry provides a supportive community where women can grow in their faith, 
          develop meaningful relationships, and serve others. Through Bible studies, prayer groups, 
          and special events, we empower women to discover their God-given purpose and use their 
          unique gifts to make a difference in their families, church, and community.
        </p>
        <ul className="space-y-4 list-disc pl-5">
          <li>
            <h3 className="text-xl font-semibold text-blue-600">Bible Study Groups</h3>
            <p className="text-gray-700">Weekly gatherings for spiritual growth and fellowship</p>
          </li>
          <li>
            <h3 className="text-xl font-semibold text-blue-600">Prayer Circles</h3>
            <p className="text-gray-700">Supporting one another through prayer and encouragement</p>
          </li>
          <li>
            <h3 className="text-xl font-semibold text-blue-600">Outreach Programs</h3>
            <p className="text-gray-700">Serving the community through various initiatives</p>
          </li>
        </ul>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="order-1 md:order-2"
      >
        <div className="bg-gradient-to-br from-slate-600 to-slate-700 p-1 rounded-xl">
          <MinistryCarousel 
            images={[
              "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2232&q=80",
              "https://images.unsplash.com/photo-1591115765373-5207764f72e7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
              "https://images.unsplash.com/photo-1543269664-7eef42226a21?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
            ]}
            title="Women's Ministry"
          />
        </div>
      </motion.div>
    </div>
  );
}