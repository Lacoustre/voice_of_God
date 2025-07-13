import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaClock, FaChurch, FaBible, FaPrayingHands, FaCircle } from "react-icons/fa";

const getServiceIcon = (title) => {
  if (title.toLowerCase().includes('sunday')) return <FaChurch />;
  if (title.toLowerCase().includes('bible')) return <FaBible />;
  return <FaPrayingHands />;
};

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ongoingServices, setOngoingServices] = useState({});

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
  
  // Check if any services are currently ongoing
  useEffect(() => {
    const checkOngoingServices = () => {
      const now = new Date();
      const today = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      const currentTime = now.getHours() * 60 + now.getMinutes(); // Convert to minutes
      
      const updatedOngoingServices = {};
      
      services.forEach(service => {
        if (!service.schedule || service.schedule.length === 0) return;
        
        // Check each schedule item
        service.schedule.forEach(scheduleItem => {
          // Parse schedule (format like "Sunday 10:00 AM - 12:00 PM")
          const parts = scheduleItem.toLowerCase().split(' ');
          if (parts.length < 3) return;
          
          const day = parts[0];
          if (day !== today) return;
          
          // Find time range
          let timeRangeIndex = -1;
          for (let i = 1; i < parts.length; i++) {
            if (parts[i].includes(':')) {
              timeRangeIndex = i;
              break;
            }
          }
          
          if (timeRangeIndex === -1) return;
          
          // Extract time range
          let timeRange = [];
          let rangeFound = false;
          
          // Look for common separators
          for (let i = timeRangeIndex; i < parts.length; i++) {
            if (parts[i].includes('-') || parts[i] === '-' || parts[i] === 'to') {
              rangeFound = true;
              
              // Handle case where separator is its own word
              if (parts[i] === '-' || parts[i] === 'to') {
                timeRange = [parts[i-1], parts[i+1]];
              } else {
                // Handle case where separator is in the string
                const rangeParts = parts[i].split('-');
                if (rangeParts.length === 2) {
                  // If time is in the same part
                  timeRange = [rangeParts[0], rangeParts[1]];
                } else {
                  // If only start time is in this part
                  timeRange = [rangeParts[0], parts[i+1]];
                }
              }
              break;
            }
          }
          
          // If no range separator found, look for AM/PM pattern
          if (!rangeFound) {
            for (let i = timeRangeIndex; i < parts.length; i++) {
              if (parts[i].includes('am') || parts[i].includes('pm')) {
                const startTime = parts[timeRangeIndex];
                const endTime = parts[i+1] || ''; // Might not exist
                
                if (endTime && (endTime.includes('am') || endTime.includes('pm'))) {
                  timeRange = [startTime, endTime];
                  rangeFound = true;
                  break;
                }
              }
            }
          }
          
          // If still no range found, use the first time and assume 2 hours
          if (!rangeFound && timeRangeIndex > -1) {
            const startTimeStr = parts[timeRangeIndex];
            timeRange = [startTimeStr, '']; // Empty end time will be handled later
          }
          
          if (timeRange.length < 1) return;
          
          // Parse start time
          const startTimeStr = timeRange[0].trim();
          const startTimeParts = startTimeStr.match(/([\d]{1,2})(?::([\d]{2}))?\s*(am|pm)?/i);
          if (!startTimeParts) return;
          
          let startHour = parseInt(startTimeParts[1]);
          const startMinutes = startTimeParts[2] ? parseInt(startTimeParts[2]) : 0;
          const startPeriod = startTimeParts[3] ? startTimeParts[3].toLowerCase() : null;
          
          if (startPeriod === 'pm' && startHour < 12) startHour += 12;
          if (startPeriod === 'am' && startHour === 12) startHour = 0;
          
          const startTimeMinutes = startHour * 60 + startMinutes;
          
          // Parse end time or default to 2 hours after start
          let endTimeMinutes;
          
          if (timeRange[1]) {
            const endTimeStr = timeRange[1].trim();
            const endTimeParts = endTimeStr.match(/([\d]{1,2})(?::([\d]{2}))?\s*(am|pm)?/i);
            
            if (endTimeParts) {
              let endHour = parseInt(endTimeParts[1]);
              const endMinutes = endTimeParts[2] ? parseInt(endTimeParts[2]) : 0;
              const endPeriod = endTimeParts[3] ? endTimeParts[3].toLowerCase() : startPeriod;
              
              if (endPeriod === 'pm' && endHour < 12) endHour += 12;
              if (endPeriod === 'am' && endHour === 12) endHour = 0;
              
              endTimeMinutes = endHour * 60 + endMinutes;
            } else {
              // Default to 2 hours after start
              endTimeMinutes = startTimeMinutes + 120;
            }
          } else {
            // Default to 2 hours after start
            endTimeMinutes = startTimeMinutes + 120;
          }
          
          // Check if current time is within range
          const isServiceOngoing = currentTime >= startTimeMinutes && currentTime <= endTimeMinutes;
          
          // Debug log to help troubleshoot
          console.debug(
            `Service ${service.title} - Day: ${today}, Schedule: ${scheduleItem}\n` +
            `Current time: ${now.toLocaleTimeString()} (${currentTime} minutes)\n` +
            `Service time: ${startTimeMinutes}-${endTimeMinutes} minutes\n` +
            `Is ongoing: ${isServiceOngoing}`
          );
          
          if (isServiceOngoing) {
            updatedOngoingServices[service._id] = true;
          }
        });
      });
      
      setOngoingServices(updatedOngoingServices);
    };
    
    if (services.length > 0) {
      checkOngoingServices();
      
      // Check every minute
      const interval = setInterval(checkOngoingServices, 60000);
      return () => clearInterval(interval);
    }
  }, [services]);

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
                
                {/* Live service indicator */}
                {ongoingServices[service._id] && (
                  <motion.div 
                    className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full flex items-center gap-2 z-30"
                    initial={{ scale: 0.9, opacity: 0.8 }}
                    animate={{ 
                      scale: [0.9, 1.05, 0.9],
                      opacity: [0.8, 1, 0.8],
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      duration: 1.5,
                      ease: "easeInOut"
                    }}
                  >
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    >
                      <FaCircle className="text-xs" />
                    </motion.div>
                    <span className="font-bold text-sm">{service.ongoingText || "LIVE NOW"}</span>
                  </motion.div>
                )}
              </div>

              {/* Text Content Card */}
              <div className="lg:w-[60%] w-full border border-white p-6 rounded-xl shadow-xl transition-transform duration-300 transform group-hover:scale-105 cursor-pointer z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl text-purple-400">
                      {React.cloneElement(getServiceIcon(service.title), {
                        className: "text-purple-400",
                      })}
                    </div>
                    <h3 className="text-2xl font-bold text-white">
                      {service.title}
                    </h3>
                  </div>
                  
                  {/* Live indicator in title section */}
                  {ongoingServices[service._id] && (
                    <motion.div 
                      className="bg-red-600 text-white px-3 py-1 rounded-full flex items-center gap-2"
                      initial={{ scale: 0.9, opacity: 0.8 }}
                      animate={{ 
                        scale: [0.9, 1.05, 0.9],
                        opacity: [0.8, 1, 0.8],
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 1.5,
                        ease: "easeInOut"
                      }}
                    >
                      <motion.div
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                      >
                        <FaCircle className="text-xs" />
                      </motion.div>
                      <span className="font-bold text-sm">{service.ongoingText || "LIVE NOW"}</span>
                    </motion.div>
                  )}
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
