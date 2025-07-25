import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaMapMarkerAlt,
  FaTimes,
  FaClock,
  FaCalendarPlus,
  FaCircle,
} from "react-icons/fa";

const EventCard = ({ event }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [isOngoing, setIsOngoing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(
        (prevSlide) => (prevSlide + 1) % (event.images?.length || 1)
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [event.images]);

  useEffect(() => {
    document.body.style.overflow = showModal ? "hidden" : "unset";
    return () => (document.body.style.overflow = "unset");
  }, [showModal]);

  // Check if event is currently ongoing
  useEffect(() => {
    const checkIfOngoing = () => {
      if (!event.date || !event.time) return false;
      
      const now = new Date();
      const eventDate = new Date(event.date);
      
      // Reset hours to compare just the dates
      const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const eventDateOnly = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
      
      // Check if event spans multiple days (has endDate property)
      let eventEndDate = event.endDate ? new Date(event.endDate) : eventDate;
      const eventEndDateOnly = new Date(eventEndDate.getFullYear(), eventEndDate.getMonth(), eventEndDate.getDate());
      
      // Check if current date is within the event date range
      const isDateInRange = nowDate >= eventDateOnly && nowDate <= eventEndDateOnly;
      if (!isDateInRange) {
        setIsOngoing(false);
        return;
      }
      
      // Parse event time (handles various formats like "10:00 AM – 12:00 PM" or "10:00-12:00")
      // Look for common separators: en dash, hyphen, or 'to'
      let timeRange = [];
      if (event.time.includes('–')) {
        timeRange = event.time.split('–');
      } else if (event.time.includes('-')) {
        timeRange = event.time.split('-');
      } else if (event.time.toLowerCase().includes(' to ')) {
        timeRange = event.time.toLowerCase().split(' to ');
      } else {
        // If no separator found, assume it's a single time point (like a service)
        // and set duration to 2 hours
        const singleTime = event.time.trim();
        timeRange = [singleTime, ''];
      }
      
      // Extract start time
      const startTimeStr = timeRange[0].trim();
      let startTime = new Date(eventDate);
      
      // Try to parse the start time
      const startTimeParts = startTimeStr.match(/([\d]{1,2})(?::([\d]{2}))?\s*(am|pm|AM|PM)?/);
      if (!startTimeParts) {
        setIsOngoing(false);
        return;
      }
      
      // Set hours for start time
      let startHour = parseInt(startTimeParts[1]);
      const startMinutes = startTimeParts[2] ? parseInt(startTimeParts[2]) : 0;
      const startPeriod = startTimeParts[3] ? startTimeParts[3].toLowerCase() : null;
      
      if (startPeriod === 'pm' && startHour < 12) startHour += 12;
      if (startPeriod === 'am' && startHour === 12) startHour = 0;
      startTime.setHours(startHour, startMinutes, 0);
      
      // Set end time
      let endTime;
      if (timeRange[1]) {
        const endTimeStr = timeRange[1].trim();
        endTime = new Date(eventDate);
        
        // Try to parse the end time
        const endTimeParts = endTimeStr.match(/([\d]{1,2})(?::([\d]{2}))?\s*(am|pm|AM|PM)?/);
        if (endTimeParts) {
          let endHour = parseInt(endTimeParts[1]);
          const endMinutes = endTimeParts[2] ? parseInt(endTimeParts[2]) : 0;
          const endPeriod = endTimeParts[3] ? endTimeParts[3].toLowerCase() : startPeriod;
          
          if (endPeriod === 'pm' && endHour < 12) endHour += 12;
          if (endPeriod === 'am' && endHour === 12) endHour = 0;
          endTime.setHours(endHour, endMinutes, 0);
        } else {
          // If end time can't be parsed, default to 2 hours after start
          endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000);
        }
      } else {
        // Default duration of 2 hours if no end time specified
        endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000);
      }
      
      // Check if current time is between start and end
      const isOngoing = now >= startTime && now <= endTime;
      
      // Debug log to help troubleshoot
      console.debug(
        `Event ${event.title} - Date: ${formatDate(event.date)}, Time: ${event.time}\n` +
        `Current: ${now.toLocaleString()}, Event time: ${startTime.toLocaleTimeString()}-${endTime.toLocaleTimeString()}\n` +
        `Is ongoing: ${isOngoing}`
      );
      
      setIsOngoing(isOngoing);
    };
    
    // Initial check
    checkIfOngoing();
    
    // Set up interval to check every minute
    const interval = setInterval(checkIfOngoing, 60000);
    return () => clearInterval(interval);
  }, [event.date, event.time, event.endDate, event.title]);

  const getGoogleMapsUrl = (location) =>
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      location
    )}`;

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  const createCalendarEvent = (event) => {
    const start = new Date(event.date + "T" + (event.time?.split("–")[0] || "09:00"));
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000); // 2 hours duration

    const format = (date) => date.toISOString().replace(/[-:]|\.\d{3}/g, "");
    const startTime = format(start);
    const endTime = format(end);

    const title = encodeURIComponent(event.title);
    const details = encodeURIComponent(
      `${event.additionalInfo}\n\nLocation: ${event.location}\nTime: ${event.time}`
    );
    const location = encodeURIComponent(event.location);

    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${startTime}/${endTime}`;
    window.open(googleUrl, "_blank");
  };

  return (
    <>
      <motion.div
        className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden w-full h-full cursor-pointer border border-white/60 group relative"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
        whileHover={{
          y: -15,
          scale: 1.02,
          boxShadow: "0 30px 60px rgba(0, 0, 0, 0.2)",
          borderColor: "rgba(71, 85, 105, 0.2)"
        }}
        viewport={{ once: true }}
        onClick={() => setShowModal(true)}
      >
        <div className="rounded-t-3xl overflow-hidden relative h-72 group-hover:h-80 transition-all duration-500">
          {(event.images && event.images.length > 0 ? event.images : [
            "https://via.placeholder.com/400x200?text=Event",
          ]).map((img, index) => (
            <div key={index} className="absolute inset-0">
              <img
                src={img}
                alt={`${event.title} - ${index + 1}`}
                className="object-fill h-full w-full"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            </div>
          ))}
          
          {/* Live event indicator */}
          {isOngoing && (
            <motion.div 
              className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full flex items-center gap-2 z-20"
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
              <span className="font-bold text-sm">{event.ongoingText || "LIVE NOW"}</span>
            </motion.div>
          )}

          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-10">
            {event.images &&
              event.images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentSlide(index);
                  }}
                  className={`h-3 rounded-full transition-all duration-300 ${
                    currentSlide === index ? "w-8 bg-white" : "w-3 bg-white/50"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
          </div>
        </div>

        <div className="p-8 text-gray-800 bg-gradient-to-b from-white to-slate-50/50 relative">
          <div className="mb-4">
            <h3 className="text-2xl font-bold mb-1 text-slate-800">
              {event.title}
            </h3>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div>
              <p className="text-xs text-slate-600 uppercase font-bold">Date & Time</p>
              <p className="text-sm text-gray-700 font-medium">
                {formatDate(event.date)}<br/>{event.time}
              </p>
            </div>
            
            <div>
              <p className="text-xs text-slate-600 uppercase font-bold">Location</p>
              <a
                href={getGoogleMapsUrl(event.location)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-700 hover:text-slate-700 transition-colors block"
                onClick={(e) => e.stopPropagation()}
              >
                {event.location}
              </a>
            </div>
            
            {event.ticketPrice && (
              <div>
                <p className="text-xs text-slate-600 uppercase font-bold">Ticket</p>
                <p className="text-sm text-gray-700">${event.ticketPrice}</p>
              </div>
            )}
            
            {event.verse && (
              <div className="col-span-2">
                <p className="text-xs text-slate-600 uppercase font-bold">Scripture</p>
                <p className="text-sm text-gray-700 italic">"{event.verse}"</p>
              </div>
            )}
          </div>
          
          <div>
            <p className="text-xs text-slate-600 uppercase font-bold mb-1">Details</p>
            <p className="text-sm leading-relaxed text-gray-700 line-clamp-2">
              {event.additionalInfo}
            </p>
            <p className="text-xs text-slate-700 mt-1 font-medium">Click for more info</p>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="bg-gray-900 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <div className="h-64 md:h-80 relative">
                  {(event.images && event.images.length > 0 ? event.images : [
                    "https://via.placeholder.com/400x200?text=Event",
                  ]).map((img, index) => (
                    <div
                      key={index}
                      className="absolute inset-0"
                      style={{
                        opacity: currentSlide === index ? 1 : 0,
                        transition: "opacity 1.2s ease-in-out",
                      }}
                    >
                      <img
                        src={img}
                        alt={`${event.title} - ${index + 1}`}
                        className="object-fill h-full w-full"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                    </div>
                  ))}
                </div>

                <button
                  className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                  onClick={() => setShowModal(false)}
                >
                  <FaTimes />
                </button>
              </div>

              <div className="p-6 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-3xl font-bold text-purple-300">
                    {event.title}
                  </h2>
                  {isOngoing && (
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
                      <span className="font-bold text-sm">{event.ongoingText || "LIVE NOW"}</span>
                    </motion.div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <FaClock className="text-purple-400" />
                    <span>{event.time}</span>
                  </div>

                  <div className="flex items-center gap-3 md:col-span-2">
                    <FaMapMarkerAlt className="text-purple-400" />
                    <a
                      href={getGoogleMapsUrl(event.location)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-300 hover:text-purple-100 hover:underline transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {event.location}
                    </a>
                  </div>

                  <div className="flex items-center gap-3 md:col-span-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        createCalendarEvent(event);
                      }}
                      className="flex items-center gap-2 text-purple-300 hover:text-purple-100 transition-colors"
                      title="Add to Google Calendar"
                    >
                      <FaCalendarPlus className="text-purple-400" />
                      <span>Add to Google Calendar</span>
                    </button>
                  </div>
                </div>

                <div className="mb-6 p-4 bg-purple-900 bg-opacity-30 rounded-lg">
                  <p className="italic text-purple-300">"{event.verse}"</p>
                </div>

                {event.ticketPrice && (
                  <div className="mb-6 p-4 bg-gray-800 rounded-lg">
                    <h3 className="font-bold mb-2">Ticket Information</h3>
                    <p>${event.ticketPrice}</p>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="font-bold mb-3 text-xl">Event Details</h3>
                  <p className="whitespace-pre-line">{event.additionalInfo}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default EventCard;
