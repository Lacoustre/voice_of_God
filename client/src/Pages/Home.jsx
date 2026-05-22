import React, { useEffect, useState, useRef } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import EventCard from "../Components/EventCard";
import EventModal from "../Components/EventModal";
import ServicesPage from "../Components/Services";
import SectionTitle from "../Components/SectionTitle";
import LeadershipPage from "../Components/Leadership";
import CoreBeliefSection from "../Components/Core_Beliefs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { isUpcomingDate } from "../utils/dateUtils";

import AnnouncementSection from "../Components/Announcement";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        setTimeout(() => {
          const element = document.querySelector(hash);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("https://voice-of-god.onrender.com/api/events");
        const data = await response.json();
        setEvents(data.events);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      <Navbar />

      <AnnouncementSection />

      <section
        id="leadership"
        className="container mx-auto px-4 py-0"
      >
        <LeadershipPage />
      </section>

    <CoreBeliefSection/>

      <section
        id="services"
        className="container mx-auto px-4 py-0"
      >
        <div className="text-center mb-8">
          <SectionTitle title="Our Services" />
          <ServicesPage />
        </div>
      </section>
      
      <section
        id="events"
        className="container mx-auto px-4 py-0"
      >
        <div className="text-center mb-8">
          <SectionTitle title="Events" />
          <p className="text-gray-700 text-base font-medium mt-3 flex items-center justify-center gap-2">
            <ChevronLeft size={20} className="animate-pulse" />
            Scroll horizontally to view all events
            <ChevronRight size={20} className="animate-pulse" />
          </p>
        </div>

        <div className="relative flex justify-center px-2">
          {showLeftArrow && !loading && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-300"
              aria-label="Scroll left"
            >
              <ChevronLeft size={24} className="text-gray-800" />
            </button>
          )}

          {showRightArrow && !loading && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white shadow-lg rounded-full p-3 transition-all duration-300"
              aria-label="Scroll right"
            >
              <ChevronRight size={24} className="text-gray-800" />
            </button>
          )}

          {loading ? (
            <div className="flex gap-6 overflow-x-auto w-full max-w-7xl pb-4 scrollbar-hide">
              {Array(8).fill(0).map((_, i) => (
                <div key={i} className="border bg-black h-96 min-w-[250px] animate-pulse" />
              ))}
            </div>
          ) : (
            <div 
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="flex gap-6 overflow-x-auto w-full max-w-7xl pb-4 scroll-smooth"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#cbd5e0 #f7fafc'
              }}
            >
              {[...events.filter(event => isUpcomingDate(event.date)), ...events.filter(event => !isUpcomingDate(event.date))].map((event, index) => {
                const isUpcoming = isUpcomingDate(event.date);
                return (
                  <div key={event.id || event.$id} className="relative cursor-pointer min-w-[250px]" onClick={() => {
                    setSelectedEvent(event);
                    setIsEventModalOpen(true);
                  }}>
                    <EventCard event={event} />
                    <div className="absolute top-2 right-2 z-10">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold text-white ${
                        isUpcoming ? 'bg-blue-600' : 'bg-red-600'
                      }`}>
                        {isUpcoming ? 'UPCOMING' : 'PAST'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <EventModal 
        isOpen={isEventModalOpen} 
        onClose={() => setIsEventModalOpen(false)} 
        event={selectedEvent} 
      />

      <section
        id="contact"
        className="w-full"
      >
        <Footer />
      </section>
    </div>
  );
}