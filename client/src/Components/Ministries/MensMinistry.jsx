import React from "react";
import { motion } from "framer-motion";
import MinistryCarousel from "./MinistryCarousel";

export default function MensMinistry() {
  return (
    <div className="grid md:grid-cols-2 gap-8 items-center">
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-1 rounded-xl">
          <MinistryCarousel 
            images={[
              "https://images.unsplash.com/photo-1511988617509-a57c8a288659?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2071&q=80",
              "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
              "https://images.unsplash.com/photo-1517486808906-6ca8b3f8e1c1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2049&q=80"
            ]}
            title="Men's Ministry"
          />
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl font-bold text-blue-800 mb-4">Men's Ministry</h2>
        <p className="text-gray-700 mb-6">
          Our Men's Ministry is dedicated to helping men grow in their relationship with God and 
          become spiritual leaders in their homes, church, and community. Through fellowship, 
          accountability, and service opportunities, we encourage men to live out their faith 
          with integrity and purpose.
        </p>
        <ul className="space-y-4 list-disc pl-5">
          <li>
            <h3 className="text-xl font-semibold text-blue-600">Brotherhood Meetings</h3>
            <p className="text-gray-700">Monthly gatherings for fellowship and spiritual growth</p>
          </li>
          <li>
            <h3 className="text-xl font-semibold text-blue-600">Mentorship Program</h3>
            <p className="text-gray-700">Pairing experienced men with younger men for guidance</p>
          </li>
          <li>
            <h3 className="text-xl font-semibold text-blue-600">Service Projects</h3>
            <p className="text-gray-700">Using skills and strength to serve the church and community</p>
          </li>
        </ul>
      </motion.div>
    </div>
  );
}