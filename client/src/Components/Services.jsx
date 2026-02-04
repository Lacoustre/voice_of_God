import React, { useState, useEffect } from "react";
import ServiceCard from "./ServiceCard";

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
      <section className="py-24 px-6" id="services">
        <div className="flex justify-center px-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full justify-items-center">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-full h-full max-w-sm border bg-black overflow-hidden animate-pulse" style={{ aspectRatio: "1/1.2" }}>
                <div className="h-full bg-gray-800" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 px-6" id="services">
      <div className="flex justify-center px-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full justify-items-center">
          {services.filter(service => !service.title.toLowerCase().includes('bible')).map((service, index) => (
            <div
              key={service._id || index}
              className="w-full h-full max-w-sm relative"
              style={{ aspectRatio: "1/1.2" }}
            >
              <ServiceCard service={service} isOngoing={ongoingServices[service._id]} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesPage;
