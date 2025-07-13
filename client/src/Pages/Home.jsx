import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import EventCard from "../Components/EventCard";
import ServicesPage from "../Components/Services";
import SectionTitle from "../Components/SectionTitle";
import LeadershipPage from "../Components/Leadership";
import CharityFoundationPage from "../Components/Donate";
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
    <div className="min-h-screen overflow-x-hidden bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px]">
      {/* Navbar moved slightly up */}
      <div className="-mt-10 z-50 relative">
        <Navbar />
      </div>

      <AnnouncementSection />

      <motion.section
        id="leadership"
        className="container mx-auto px-4 py-12 pt-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="text-center mb-12">
          <SectionTitle title="Our Leadership" />
          <LeadershipPage />
        </div>
      </motion.section>

      <motion.section
        id="services"
        className="container mx-auto px-4 py-12 pt-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="text-center mb-8">
          <SectionTitle title="Our Services" />
          <ServicesPage />
        </div>
      </motion.section>

      <motion.section
        id="events"
        className="container mx-auto px-4 py-12 pt-20 mt-4"
        initial={{ opacity: 0, x: 100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 50 }}
      >
        <div className="text-center mb-12">
          <SectionTitle title="Upcoming Events" />
        </div>

        <div className="flex justify-center px-2">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-16 h-16 border-4 border-purple-200 rounded-full animate-spin border-t-purple-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full">
              {events.map((event, index) => (
                <motion.div
                  key={event.id || event.$id}
                  className="w-full h-full"
                  style={{ aspectRatio: "1/1.2" }}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.7,
                    delay: index * 0.15,
                    type: "spring",
                    stiffness: 70,
                  }}
                >
                  <EventCard event={event} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.section>

      <motion.section
        id="donation"
        className="container mx-auto px-4 py-12 pt-20"
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 50 }}
      >
        <div className="text-center mb-12">
          <SectionTitle title="Support Our Ministry" />
          <CharityFoundationPage />
        </div>
      </motion.section>

      <Footer />
    </div>
  );
}