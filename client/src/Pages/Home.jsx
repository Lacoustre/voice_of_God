import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import EventCard from "../Components/EventCard";
import ServicesPage from "../Components/Services";
import SectionTitle from "../Components/SectionTitle";
import LeadershipPage from "../Components/Leadership";
import CoreBeliefSection from "../Components/Core_Beliefs";

import AnnouncementSection from "../Components/Announcement";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

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
    <div className="min-h-screen overflow-x-hidden bg-church-gradient">
      <div className="-mt-10 z-50 relative">
        <Navbar />
      </div>

      <AnnouncementSection />

    <CoreBeliefSection/>

      <section
        id="leadership"
        className="container mx-auto px-4 py-0"
      >
        <div className="text-center mb-12">
          <SectionTitle title="Our Leadership" />
          <LeadershipPage />
        </div>
      </section>

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
            <div className="flex items-center justify-center h-64">
              <div className="w-16 h-16 border-4 border-purple-200 rounded-full animate-spin border-t-purple-600"></div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full justify-items-center">
                {[...events.filter(event => new Date(event.date) >= new Date()), ...events.filter(event => new Date(event.date) < new Date())].map((event, index) => {
                  const isUpcoming = new Date(event.date) >= new Date();
                  return (
                    <div
                      key={event.id || event.$id}
                      className="w-full h-full max-w-sm relative"
                      style={{ aspectRatio: "1/1.2" }}
                    >
                      <div className="absolute top-2 left-2 z-10">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold text-white ${
                          isUpcoming ? 'bg-blue-600' : 'bg-red-600'
                        }`}>
                          {isUpcoming ? 'UPCOMING' : 'PAST'}
                        </span>
                      </div>
                      <EventCard event={event} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>



      <section
        id="contact"
        className="w-full"
      >
        <Footer />
      </section>
    </div>
  );
}