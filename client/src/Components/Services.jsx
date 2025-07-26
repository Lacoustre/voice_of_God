import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaChurch, FaBible, FaPrayingHands, FaCircle } from "react-icons/fa";

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
          const sortedServices = data.services.sort((a, b) => {
            if (a.title.toLowerCase().includes('sunday')) return -1;
            if (b.title.toLowerCase().includes('sunday')) return 1;
            return 0;
          });
          setServices(sortedServices);
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
      
      console.debug(`Current day: ${today}, Current time: ${now.toLocaleTimeString()} (${currentTime} minutes)`)
      
      const updatedOngoingServices = {};
      
      services.forEach(service => {
        // Log service details
        console.debug(`Checking service: ${service.title}`);
        
        if (!service.schedule || service.schedule.length === 0) {
          console.debug(`Service ${service.title} has no schedule`);
          return;
        }
        
        // Special case for Sunday Evening Service
        if (service.title.toLowerCase().includes('evening') && today === 'sunday') {
          console.debug(`Special handling for Sunday Evening Service: ${service.title}`);
        }
        
        // Check each schedule item
        service.schedule.forEach(scheduleItem => {
          // Parse schedule (format like "Sunday 10:00 AM - 12:00 PM")
          const parts = scheduleItem.toLowerCase().split(' ');
          if (parts.length < 3) {
            console.debug(`Skipping schedule item with too few parts: ${scheduleItem}`);
            return;
          }
          
          const day = parts[0];
          console.debug(`Comparing day: ${day} with today: ${today}`);
          if (day !== today) {
            console.debug(`Day mismatch for service ${service.title}: ${day} vs ${today}`);
            return;
          }
          
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
          console.debug(`Parsing start time: ${startTimeStr}`);
          
          // More flexible regex to handle various time formats
          const startTimeParts = startTimeStr.match(/([\d]{1,2})(?::([\d]{2}))?\s*(am|pm|a\.m\.|p\.m\.)?/i);
          if (!startTimeParts) {
            console.debug(`Failed to parse start time: ${startTimeStr}`);
            return;
          }
          
          let startHour = parseInt(startTimeParts[1]);
          const startMinutes = startTimeParts[2] ? parseInt(startTimeParts[2]) : 0;
          let startPeriod = startTimeParts[3] ? startTimeParts[3].toLowerCase() : null;
          
          // Handle periods with dots (a.m., p.m.)
          if (startPeriod === 'a.m.') startPeriod = 'am';
          if (startPeriod === 'p.m.') startPeriod = 'pm';
          
          // If no AM/PM specified but hour is small, assume PM for evening services
          if (!startPeriod && startHour < 12 && startHour >= 5 && service.title.toLowerCase().includes('evening')) {
            console.debug(`Assuming PM for evening service with hour ${startHour}`);
            startPeriod = 'pm';
          }
          
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
      
      // Manual override for Sunday Evening Service if it's Sunday evening
      const isSundayEvening = today === 'sunday' && currentTime >= 17*60 && currentTime <= 20*60; // 5PM to 8PM
      
      services.forEach(service => {
        if (service.title.toLowerCase().includes('evening') && 
            service.title.toLowerCase().includes('sunday') && 
            isSundayEvening) {
          console.debug(`Manually setting Sunday Evening Service as active: ${service.title}`);
          updatedOngoingServices[service._id] = true;
        }
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
    <section className="py-24 px-6 bg-gradient-to-b from-white via-slate-50/30 to-white" id="services">
      <div className="space-y-20 max-w-7xl mx-auto">
        {services.map((service, index) => {
          const isEven = index % 2 === 0;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: index * 0.2, type: "spring", stiffness: 100 }}
              viewport={{ once: true, margin: "-100px" }}
              className={`flex flex-col lg:flex-row ${
                !isEven ? "lg:flex-row-reverse" : ""
              } items-center gap-12 relative`}
            >
              {/* Image with hover pop */}
              <motion.div 
                className="relative lg:w-[40%] w-full flex justify-center z-20 group cursor-pointer"
                whileHover={{ scale: 1.05, rotateY: 5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-64 h-64 object-cover rounded-lg shadow-xl"
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
              </motion.div>

              {/* Text Content Card */}
              <motion.div 
                className="lg:w-[60%] w-full border border-white/60 bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl cursor-pointer z-10 relative overflow-hidden"
                whileHover={{ y: -8, boxShadow: "0 25px 50px rgba(0,0,0,0.15)", scale: 1.02 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="flex items-center justify-between mb-6 relative z-10">
                  <div className="flex items-center gap-4">
                    <motion.div 
                      className="text-3xl text-slate-600 p-3 bg-slate-100 rounded-xl"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {React.cloneElement(getServiceIcon(service.title), {
                        className: "text-slate-600",
                      })}
                    </motion.div>
                    <h3 className="text-3xl font-bold text-slate-800 group-hover:text-slate-900 transition-colors">
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

                <div className="relative z-10">
                  <p className="text-base text-gray-700 leading-relaxed mb-4">
                    {service.description}
                  </p>

                  {service.verse && (
                    <div className="mb-4 p-4 bg-slate-50 rounded-xl border-l-4 border-slate-400">
                      <p className="text-sm text-slate-700 italic font-medium">
                        {service.verse}
                      </p>
                    </div>
                  )}
                </div>

                {service.schedule && service.schedule.length > 0 && (
                  <div className="mb-4 relative z-10">
                    <h4 className="text-base font-bold text-slate-700 mb-3">Schedule:</h4>
                    <div className="flex flex-wrap gap-3">
                      {service.schedule.map((scheduleItem, idx) => (
                        <motion.span 
                          key={idx} 
                          className="text-sm bg-gradient-to-r from-slate-100 to-slate-200 text-slate-800 px-4 py-2 rounded-full border border-slate-300 shadow-sm"
                          whileHover={{ scale: 1.05, y: -2 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          {scheduleItem}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default ServicesPage;
