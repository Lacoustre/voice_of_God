import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import EventCard from "./EventCard";
import Toast from "../components/common/Toast";
import AddEventModal from "./AddEventModal";
import { useApp } from "../context/AppContext";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "https://voice-of-god.onrender.com";

const EventsList = ({ events: propEvents }) => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { setActiveSection } = useApp();

  // Modal state is now managed by the AddEventModal component

  useEffect(() => {
    // If events are provided as props, use them; otherwise fetch from API
    if (propEvents && propEvents.length > 0) {
      setEvents(propEvents);
    } else {
      fetchEvents();
    }
  }, [propEvents]);

  const fetchEvents = async (retryCount = 0) => {
    try {
      console.log(`Fetching events from: ${API_BASE_URL}/events`);
      const res = await fetch(`${API_BASE_URL}/events`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const contentType = res.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        // Retry once for Render cold starts
        if (retryCount === 0) {
          console.log('Non-JSON response received, retrying after delay...');
          await new Promise(resolve => setTimeout(resolve, 3000));
          return fetchEvents(1);
        }
        const text = await res.text();
        console.error('Non-JSON response:', text.substring(0, 100) + '...');
        throw new Error('Server did not return JSON.');
      }

      const data = await res.json();
      if (!data.success || !Array.isArray(data.events)) {
        throw new Error(data.error || "Invalid events response");
      }

      const now = new Date();

      const upcoming = data.events
        .filter((e) => new Date(e.date) >= now)
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      let topThree = [...upcoming.slice(0, 5)];

      if (topThree.length < 5) {
        const past = data.events
          .filter((e) => new Date(e.date) < now)
          .sort((a, b) => new Date(b.date) - new Date(a.date));

        topThree = [...topThree, ...past.slice(0, 5 - topThree.length)];
      }

      setEvents(topThree);
    } catch (error) {
      console.error("Error fetching events:", error);
      setToast({ message: "Error fetching events", type: "error" });
    }
  };

  const handleEventClick = () => {
    setActiveSection('events');
    localStorage.setItem('activeSection', 'events');
  };

  // Form handling is now managed by the AddEventModal component

  return (
    <div className="bg-white rounded-xl p-6 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Events</h3>
        <button
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
          onClick={() => setShowModal(true)}
        >
          <Plus className="w-4 h-4" /> Add Event
        </button>
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto pr-1 scrollbar-hide" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
        {events.length === 0 ? (
          // Loading skeleton
          Array(5).fill(0).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))
        ) : (
          events.map((event) => (
            <div key={event.$id} onClick={handleEventClick} className="cursor-pointer">
              <EventCard
                event={event}
                onDelete={(deletedId) =>
                  setEvents((prev) => prev.filter((e) => e.$id !== deletedId))
                }
                setToast={setToast}
              />
            </div>
          ))
        )}
      </div>

      <AddEventModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        onEventAdded={fetchEvents} 
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default EventsList;
