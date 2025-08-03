import React from "react";
import { motion } from "framer-motion";
import MinistryCarousel from "./MinistryCarousel";
import church_5 from "../../assets/church_photo_5.JPG";
import church_6 from "../../assets/church_photo_6.JPG";
import event_1 from "../../assets/event_1.JPG";

export default function YouthMinistry() {
  return (
    <div className="grid md:grid-cols-2 gap-8 items-center">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="order-2 md:order-1"
      >
        <h2 className="text-3xl font-bold text-cyan-700 mb-4">Young Adults and Youth Ministry</h2>
        <p className="text-gray-700 mb-6">
          Our Young Adults and Youth Ministry creates a vibrant, engaging environment where teens and 
          young adults can explore their faith, build lasting friendships, and develop leadership skills. 
          Through dynamic worship, relevant teaching, and fun activities, we help young people navigate 
          life's challenges while growing in their relationship with Christ.
        </p>
        <ul className="space-y-4 list-disc pl-5">
          <li>
            <h3 className="text-xl font-semibold text-cyan-600">Weekly Youth Gatherings</h3>
            <p className="text-gray-700">Fun, interactive sessions focused on relevant faith topics</p>
          </li>
          <li>
            <h3 className="text-xl font-semibold text-cyan-600">Leadership Development</h3>
            <p className="text-gray-700">Training young people to become future church leaders</p>
          </li>
          <li>
            <h3 className="text-xl font-semibold text-cyan-600">Mission Trips & Outreach</h3>
            <p className="text-gray-700">Opportunities to serve and share faith locally and globally</p>
          </li>
        </ul>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="order-1 md:order-2"
      >
        <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-1 rounded-xl">
          <MinistryCarousel 
            images={[church_5, church_6, event_1]}
            title="Youth Ministry"
          />
        </div>
      </motion.div>
    </div>
  );
}