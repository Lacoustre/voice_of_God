import React, { useState } from "react";
import { Users, DollarSign, Calendar, Heart, Home, Image, FileText, Settings } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import DashboardView from "../components/DashboardView";
import event_1 from "../assets/event_1.JPG"
import event_2 from "../assets/event_2.JPG";
import event_3 from "../assets/event_3.JPG";

const ChurchAdminPanel = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const stats = [
    {
      title: "Total Members",
      value: "850",
      icon: Users,
      color: "bg-blue-500",
      change: "+15%",
    },
    {
      title: "Monthly Donations",
      value: "$8,750",
      icon: DollarSign,
      color: "bg-green-500",
      change: "+12%",
    },
    {
      title: "Upcoming Events",
      value: "3",
      icon: Calendar,
      color: "bg-purple-500",
      change: "Convention 2025",
    },
    {
      title: "Prayer Requests",
      value: "47",
      icon: Heart,
      color: "bg-red-500",
      change: "+8",
    },
  ];

 const events = [
  {
    id: 4,
    title: "Sight & Sound Theater Trip – NOAH: 30th Anniversary Show",
    date: "August 22, 2025",
    time: "Departure: 7:00 AM",
    verse: "By faith Noah, when warned about things not yet seen, in holy fear built an ark to save his family. – Hebrews 11:7",
    location: "Pick-up: 52 Connecticut Ave, South Windsor, CT 06074",
    images: [event_3],
    status: "Pending",
    additionalInfo: `🌊 Step into the pages of Scripture as Voice of God Charity Foundation takes you on an extraordinary journey to the Sight & Sound Theatres for their spectacular 30th Anniversary Production of NOAH!

This unforgettable one-day trip brings the Bible to life with stunning visuals, live animals, and an ark-sized stage that immerses you in the dramatic story of Noah's obedience, faith, and deliverance...

💵 Cost: $200 per person  
🚌 Departure Time: 7:00 AM sharp  
📍 Pick-up Point: 52 Connecticut Ave, South Windsor, CT 06074

📢 Seats are limited! Kindly reach out to any member of the VOG Charity team to reserve your seat today or for more information.`,
  },
  {
    id: 2,
    title: "2025 Annual Convention & 6th Anniversary",
    date: "June 26–29, 2025",
    time: "Daily at 6:00 PM | Sunday at 10:00 AM & 6:00 PM",
    verse: "Taste and see that the LORD is good; blessed is the one who takes refuge in him. – Psalm 34:8",
    location: "52 Connecticut Ave, South Windsor, CT 06074",
    images: [event_1],
    status: "Publish",
    additionalInfo:
      "Join us for four powerful days of worship, prophecy, and celebration. Featuring Major Prophet Isaac Anto, Apostle Oheneba Poku, Minister Isaac Ackah, and the Adonai Worshippers. Don't miss the Love Feast Gala on Saturday at Sky High Events!",
  },
  {
    id: 1,
    title: "Love Feast Gala – 2025 Annual Convention",
    date: "June 28, 2025",
    time: "6:00 PM – 10:00 PM",
    verse: "Let all that you do be done in love. – 1 Corinthians 16:14",
    location: "SkyHigh Events, 5 National Drive, Windsor Locks, CT 06096",
    ticketPrice: "60-100",
    images: [event_2],
    status: "Publish",
    additionalInfo: `Experience an unforgettable evening of elegance, joy, and divine fellowship at the Love Feast Gala...

👗 DRESS CODE: Formal wear (Suits, ties, gowns, and glam encouraged)

✨ Whether you're attending with your spouse, friends, or coming to fellowship and connect with believers, the Love Feast Gala is designed to fill your evening with purpose, laughter, and God's love in action.`,
  },
];


  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "events", label: "Events", icon: Calendar },
    { id: "members", label: "Members", icon: Users },
    { id: "services", label: "Services", icon: Heart },
    { id: "donations", label: "Donations", icon: DollarSign },
    { id: "media", label: "Media", icon: Image },
    { id: "content", label: "Content", icon: FileText },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const renderContent = () => {
    if (activeSection === "dashboard") {
      return <DashboardView stats={stats} events={events} />;
    }
    return <div>Content for {activeSection}</div>;
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar
        menuItems={menuItems}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div className="flex-1 flex flex-col">
        <Header activeSection={activeSection} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default ChurchAdminPanel;