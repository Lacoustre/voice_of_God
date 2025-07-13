import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaMapMarkerAlt, FaTimes, FaCalendarAlt, FaClock, FaCalendarPlus } from "react-icons/fa";

const EventCard = ({ event }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [showModal, setShowModal] = useState(false);
    
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prevSlide) => 
                (prevSlide + 1) % (event.images?.length || 1)
            );
        }, 3000);
        
        return () => clearInterval(interval);
    }, [event.images]);
    
    useEffect(() => {
        if (showModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [showModal]);
    
    const getGoogleMapsUrl = (location) => {
        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
    };
    
    // Format date from ISO string to readable format
    const formatDate = (dateString) => {
        if (!dateString) return "";
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
        } catch (error) {
            return dateString; // Return original if parsing fails
        }
    };
    
    const createCalendarEvent = (event) => {
        // Format date for calendar
        const eventDate = event.date.replace('–', ' to ');
        const title = encodeURIComponent(event.title);
        const details = encodeURIComponent(`${event.additionalInfo}\n\nLocation: ${event.location}\nTime: ${event.time}`);
        const location = encodeURIComponent(event.location);
        
        // Google Calendar link
        const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=20250626/20250630`;
        
        window.open(googleUrl, '_blank');
    };

    return (
        <>
            <motion.div 
                className="bg-transparent rounded-2xl shadow-2xl overflow-hidden w-full h-full cursor-pointer"
                whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 25px 50px -12px rgba(124, 58, 237, 0.25)"
                }}
                transition={{ duration: 0.3 }}
                onClick={() => setShowModal(true)}
            >
                <div className="rounded-t-2xl overflow-hidden relative h-64">
                    {event.images && event.images.length > 0 ? (
                        event.images.map((img, index) => (
                            <div
                                key={index}
                                className="absolute inset-0"
                            >
                                <img
                                    src={img}
                                    alt={`${event.title} - image ${index + 1}`}
                                    className="object-fill h-full w-full"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                            </div>
                        ))
                    ) : (
                        <div className="absolute inset-0">
                            <img
                                src="https://via.placeholder.com/400x200?text=Event"
                                alt="Event placeholder"
                                className="object-fill h-full w-full"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                        </div>
                    )}

                    <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1 z-10">
                        {event.images && event.images.map((_, index) => (
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

                <motion.div 
                    className="p-6 text-white"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="mb-4">
                        <motion.h3 
                            className="text-2xl font-bold mb-1"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            {event.title}
                        </motion.h3>
                        <p className="text-sm opacity-80 italic mb-2 font-bold">{formatDate(event.date)} | {event.time}</p>
                        <p className="text-sm opacity-90 italic font-bold">"{event.verse}"</p>
                    </div>

                    <div className="mb-4 flex items-center gap-2 opacity-90">
                        <FaMapMarkerAlt className="text-white" />
                        <a 
                            href={getGoogleMapsUrl(event.location)} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="font-bold hover:text-purple-300 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {event.location}
                        </a>
                    </div>

                    {event.ticketPrice && (
                        <p className="mb-4 text-sm font-bold">
                            Ticket: ${event.ticketPrice}
                        </p>
                    )}

                    <p className="text-sm leading-relaxed opacity-90 font-bold line-clamp-3">
                        {event.additionalInfo}
                    </p>
                </motion.div>
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
                                    {event.images && event.images.length > 0 ? (
                                        event.images.map((img, index) => (
                                            <div
                                                key={index}
                                                className="absolute inset-0"
                                                style={{
                                                    opacity: currentSlide === index ? 1 : 0,
                                                    transition: "opacity 1.2s ease-in-out"
                                                }}
                                            >
                                                <img
                                                    src={img}
                                                    alt={`${event.title} - image ${index + 1}`}
                                                    className="object-fill h-full w-full"
                                                />
                                                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="absolute inset-0">
                                            <img
                                                src="https://via.placeholder.com/400x200?text=Event"
                                                alt="Event placeholder"
                                                className="object-fill h-full w-full"
                                            />
                                            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                                        </div>
                                    )}
                                </div>
                                
                                <button 
                                    className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                                    onClick={() => setShowModal(false)}
                                >
                                    <FaTimes />
                                </button>
                            </div>
                            
                            <div className="p-6 text-white">
                                <h2 className="text-3xl font-bold mb-4 text-purple-300">{event.title}</h2>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <div className="flex items-center gap-3">
                                        <FaCalendarAlt className="text-purple-400" />
                                        <span>{formatDate(event.date)}</span>
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                createCalendarEvent(event);
                                            }}
                                            className="ml-2 text-purple-300 hover:text-purple-100 transition-colors"
                                            title="Add to Calendar"
                                        >
                                            <FaCalendarPlus />
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <FaClock className="text-purple-400" />
                                        <span>{event.time}</span>
                                    </div>
                                    <div className="flex items-start gap-3 md:col-span-2">
                                        <FaMapMarkerAlt className="text-purple-400 mt-1" />
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