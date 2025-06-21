import React from "react";
import { motion } from "framer-motion";
import { FaClock, FaChurch, FaBible, FaPrayingHands } from "react-icons/fa";

import bible_teaching from "../assets/bible_teaching.jpg";
import sunday_service from "../assets/sunday_service.jpg";
import prayer from "../assets/prayer.jpg";
import friday_night_prayers from "../assets/friday_night_prayers.jpeg";

const services = [
  {
    title: "Sunday Service",
    icon: <FaChurch />,
    schedule: [
      "Morning: 10 A.M. – 12:00 P.M. EST",
      "Evening: 6 P.M. – 9 P.M. EST",
    ],
    verse:
      "Psalm 98:1 - Oh, sing to the Lord a new song! For He has done marvelous things...",
    description:
      "Celebrate Yeshua with us every Sunday in joyful worship, heartfelt praise, and empowering Word. Let His Presence fill you with strength and victory as we honor the Sabbath together.",
    image: sunday_service,
  },
  {
    title: "Prayer Line",
    icon: <FaPrayingHands />,
    schedule: [
      "Morning - Thursday : 8:00 P.M. - 9:00 P.M. EST",
      "Dial +1(209)-399-9041, then (605)-475-4746",
      "Enter Code: 530963#",
    ],
    verse:
      "Engage in warfare prayers for breakthrough and divine transformation.",
    description:
      "Join us remotely in God's presence for preaching, prayer, and transformation. If access fails, text 'Call me' to (605)-475-4746 to receive an automatic callback.",
    image: prayer,
  },
  {
    title: "Bible Teaching",
    icon: <FaBible />,
    schedule: ["Wednesdays: 6 P.M. – 8 P.M. EST"],
    verse: "Psalm 18:30 - As for God, His way is perfect...",
    description:
      "Join us in-person or online as we explore the Word of God together and gain fresh insight and divine understanding. Sign up via our Contact page to receive the Teams link.",
    image: bible_teaching,
  },
  {
    title: "Friday Night Prayers",
    icon: <FaPrayingHands />,
    schedule: ["Fridays: 9 P.M. EST"],
    verse: "Jeremiah 1:19 - Nothing shall prevail against you.",
    description:
      "Encounter God through worship, teaching, and breakthrough warfare prayers. Come expectant and on time for a powerful night of transformation and victory.",
    image: friday_night_prayers,
  },
];

const ServicesPage = () => {
  return (
    <section className="py-20 px-6" id="services">
      <div className="space-y-24 max-w-6xl mx-auto">
        {services.map((service, index) => {
          const isEven = index % 2 === 0;

          return (
            <motion.div
              key={index}
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: isEven ? -100 : 100 }}
              transition={{ duration: 0.6 }}
              className={`flex flex-col lg:flex-row ${
                !isEven ? "lg:flex-row-reverse" : ""
              } items-center gap-12 relative`}
            >
              {/* Image with hover pop */}
              <div className="relative lg:w-[40%] w-full flex justify-center z-20 group cursor-pointer">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-64 h-64 object-cover rounded-lg shadow-xl transform transition duration-300 group-hover:scale-105"
                />
              </div>

              {/* Text Content Card */}
              <div className="lg:w-[60%] w-full border border-white p-6 rounded-xl shadow-xl transition-transform duration-300 transform group-hover:scale-105 cursor-pointer z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-2xl text-purple-400">
                    {React.cloneElement(service.icon, {
                      className: "text-purple-400",
                    })}
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    {service.title}
                  </h3>
                </div>

                <p className="italic text-sm text-purple-300 mb-2 font-bold">
                  {service.verse}
                </p>

                <ul className="text-sm text-gray-300 mb-3 space-y-1 font-bold">
                  {service.schedule.map((time, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <FaClock className="text-purple-400 text-xs" />
                      {time}
                    </li>
                  ))}
                </ul>

                <p className="text-sm text-gray-200 leading-relaxed font-bold">
                  {service.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default ServicesPage;
