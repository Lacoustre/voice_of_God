import React, { useState, useEffect } from "react";
import { useApp } from '../context/AppContext';
import {
  Users,
  Calendar,
  Mail,
  AlertCircle,
  Home,
  Image,
  UserCog,
  Church,
  Megaphone,
} from "lucide-react";

import EventsPage from "../pages/Event";
import MembersPage from "../pages/Members";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import DashboardView from "../components/DashboardView";
import ServicesPage from "./Services";
import AnnouncementsPage from "../pages/Annoucements";
import MediaPage from "../pages/Media";
import AdminManagement from "../pages/AdminManagement";
import AccountModal from "./AccountModal";
import Messages from "../components/Messages";

const ChurchAdminPanel = () => {
  const { activeSection } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const [rawStats, setRawStats] = useState({
    totalMembers: null,
    unrepliedMessages: null,
    upcomingEvents: null,
    unapprovedMembers: null,
  });

  const [events, setEvents] = useState([]);

  // activeSection is now managed by AppContext

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("https://voice-of-god.onrender.com/dashboard/stats");
        const data = await res.json();

        const eventsRes = await fetch("https://voice-of-god.onrender.com/events");
        const eventsData = await eventsRes.json();
        
        if (eventsData.success && Array.isArray(eventsData.events)) {
          // Process events to ensure dates are valid
          const now = new Date();
          const upcoming = eventsData.events
            .filter(e => new Date(e.date) >= now)
            .sort((a, b) => new Date(a.date) - new Date(b.date));

          let topThree = [...upcoming.slice(0, 3)];

          if (topThree.length < 3) {
            const past = eventsData.events
              .filter(e => new Date(e.date) < now)
              .sort((a, b) => new Date(b.date) - new Date(a.date));

            topThree = [...topThree, ...past.slice(0, 3 - topThree.length)];
          }
          
          setEvents(topThree);
        } else {
          setEvents([]);
        }

        const randomDelay = () => Math.floor(Math.random() * 3000) + 1000;

        setTimeout(() => setRawStats((s) => ({ ...s, totalMembers: data.totalMembers })), randomDelay());
        setTimeout(() => setRawStats((s) => ({ ...s, unrepliedMessages: data.unrepliedMessages })), randomDelay());
        setTimeout(() => setRawStats((s) => ({ ...s, upcomingEvents: data.upcomingEvents })), randomDelay());
        setTimeout(() => setRawStats((s) => ({ ...s, unapprovedMembers: data.unapprovedMembers })), randomDelay());

        setTimeout(() => setLoading(false), 3500);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const getStatValue = (value) => {
    return value === null ? (
      <svg
        className="animate-spin h-10 w-10 text-violet-600 mx-auto"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8H4z"
        />
      </svg>
    ) : (
      value
    );
  };

  const stats = [
    {
      title: "Total Members",
      value: getStatValue(rawStats.totalMembers),
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Unreplied Messages",
      value: getStatValue(rawStats.unrepliedMessages),
      icon: Mail,
      color: "bg-yellow-500",
    },
    {
      title: "Upcoming Events",
      value: getStatValue(rawStats.upcomingEvents),
      icon: Calendar,
      color: "bg-purple-500",
    },
    {
      title: "Unapproved Members",
      value: getStatValue(rawStats.unapprovedMembers),
      icon: AlertCircle,
      color: "bg-red-500",
    },
  ];

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "events", label: "Events", icon: Calendar },
    { id: "members", label: "Members", icon: Users },
    { id: "services", label: "Services", icon: Church },
    { id: "annoucement", label: "Announcements", icon: Megaphone },
    { id: "media", label: "Media", icon: Image },
    { id: "admin-management", label: "Admin Management", icon: UserCog },
      { id: "messages", label: "Messages from Website", icon: Mail },
  ];

  const renderContent = () => {
    const componentMap = {
      dashboard: <DashboardView stats={stats} events={events} loading={loading} />,
      events: <EventsPage />,
      members: <MembersPage />,
      services: <ServicesPage />,
      annoucement: <AnnouncementsPage />,
      media: <MediaPage />,
      "admin-management": <AdminManagement />,
      messages: <Messages />
    };

    return componentMap[activeSection];
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar
        menuItems={menuItems}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        setShowAccountModal={setShowAccountModal}
      />
      <div className="flex-1 flex flex-col">
        <Header
          setSidebarOpen={setSidebarOpen}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto no-scrollbar">
          {renderContent()}
        </main>
      </div>
      <AccountModal
        showAccountModal={showAccountModal}
        setShowAccountModal={setShowAccountModal}
      />
    </div>
  );
};

export default ChurchAdminPanel;
