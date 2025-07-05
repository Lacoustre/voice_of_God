import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaClock, FaChurch, FaBible, FaPrayingHands } from "react-icons/fa";

const getServiceIcon = (title) => {
  if (title.toLowerCase().includes('sunday')) return <FaChurch />;
  if (title.toLowerCase().includes('bible')) return <FaBible />;
  return <FaPrayingHands />;
};

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('https://voice-of-god.onrender.com/api/services');
        const data = await response.json();
        if (data.success) {
          setServices(data.services);
        }
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <section className="py-20 px-6" id="services">
        <div className="flex items-center justify-center h-64">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-200 rounded-full animate-spin border-t-purple-600"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-ping border-t-purple-400"></div>
          </div>
        </div>
      </section>
    );
  }

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
                    {React.cloneElement(getServiceIcon(service.title), {
                      className: "text-purple-400",
                    })}
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    {service.title}
                  </h3>
                </div>

                <p className="text-sm text-gray-200 leading-relaxed font-bold mb-3">
                  {service.description}
                </p>

                {service.verse && (
                  <div className="mb-3">
                    <p className="text-sm text-purple-300 italic font-bold">
                      {service.verse}
                    </p>
                  </div>
                )}

                {service.schedule && service.schedule.length > 0 && (
                  <div className="mb-3">
                    <h4 className="text-sm font-bold text-purple-400 mb-1">Schedule:</h4>
                    <div className="flex flex-wrap gap-2">
                      {service.schedule.map((scheduleItem, idx) => (
                        <span key={idx} className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full">
                          {scheduleItem}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default ServicesPage;
