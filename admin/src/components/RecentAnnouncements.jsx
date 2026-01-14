import { useEffect, useState } from "react";
import { Megaphone } from "lucide-react";
import { useApp } from "../context/AppContext";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://voice-of-god.onrender.com";

const RecentAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setActiveSection } = useApp();

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      const res = await fetch(`${API_BASE_URL}/announcements`);
      const data = await res.json();
      if (data.success) {
        setAnnouncements(data.data.slice(0, 3));
      }
    } catch (err) {
      console.error("Error fetching announcements:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnnouncementClick = () => {
    setActiveSection('annoucement');
    localStorage.setItem('activeSection', 'annoucement');
  };

  return (
    <div className="bg-white rounded-xl p-4 flex flex-col h-full" style={{borderColor: 'rgb(217, 143, 53)', borderWidth: '1px', borderStyle: 'solid'}}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Megaphone className="w-5 h-5" style={{color: 'rgb(217, 143, 53)'}} />
        Recent Announcements
      </h3>
      <div className="space-y-3 flex-1 overflow-y-auto" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-lg p-3 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))
        ) : announcements.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-2">No announcements yet</p>
        ) : (
          announcements.map((announcement) => (
            <div 
              key={announcement.$id} 
              onClick={handleAnnouncementClick}
              className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition cursor-pointer"
            >
              <p className="font-medium text-sm text-gray-800 mb-1">{announcement.title}</p>
              <p className="text-xs text-gray-600 line-clamp-2">{announcement.content}</p>
              <p className="text-xs text-gray-500 mt-1">
                Target: {announcement.target_groups || 'General'}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentAnnouncements;
