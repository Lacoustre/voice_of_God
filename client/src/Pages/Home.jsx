import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import EventCard from "../Components/EventCard";
import ServicesPage from "../Components/Services";
import SectionTitle from "../Components/SectionTitle";
import LeadershipPage from "../Components/Leadership";

import AnnouncementSection from "../Components/Announcement";
import Ministries from "../Pages/Ministries";

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
    <div className="min-h-screen overflow-x-hidden bg-white">
      <div className="-mt-10 z-50 relative">
        <Navbar />
      </div>

      <AnnouncementSection />

      <section
        id="leadership"
        className="container mx-auto px-4 py-12 pt-20"
      >
        <div className="text-center mb-12">
          <SectionTitle title="Our Leadership" />
          <LeadershipPage />
        </div>
      </section>

      <section
        id="services"
        className="container mx-auto px-4 py-8 pt-16"
      >
        <div className="text-center mb-8">
          <SectionTitle title="Our Services" />
          <ServicesPage />
        </div>
      </section>
      
      <section
        id="ministries"
        className="container mx-auto px-4 py-8 mt-0"
      >
        <Ministries />
      </section>

      <section
        id="events"
        className="container mx-auto px-4 py-12 pt-20 mt-4"
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
              {events.map((event, index) => (
                <div
                  key={event.id || event.$id}
                  className="w-full h-full"
                  style={{ aspectRatio: "1/1.2" }}
                >
                  <EventCard event={event} />
                </div>
              ))}
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