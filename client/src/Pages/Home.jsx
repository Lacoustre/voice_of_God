import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import EventCard from "../Components/EventCard";
import EventModal from "../Components/EventModal";
import ServicesPage from "../Components/Services";
import SectionTitle from "../Components/SectionTitle";
import LeadershipPage from "../Components/Leadership";
import CoreBeliefSection from "../Components/Core_Beliefs";

import AnnouncementSection from "../Components/Announcement";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

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
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

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
        <div className="text-center mb-12">
          <SectionTitle title="Events" />
        </div>

        <div className="flex justify-center px-2">
          {loading ? (
            <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full max-w-7xl">
              {Array(8).fill(0).map((_, i) => (
                <div key={i} className="border bg-black h-96 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 w-full max-w-7xl">
              {[...events.filter(event => new Date(event.date) >= new Date()), ...events.filter(event => new Date(event.date) < new Date())].map((event, index) => {
                const isUpcoming = new Date(event.date) >= new Date();
                return (
                  <div key={event.id || event.$id} className="relative cursor-pointer" onClick={() => {
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