import React, { useState, useEffect } from 'react';
import { ChevronRight, X, Phone } from 'lucide-react';

const AnnouncementSection = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendingPhone, setSendingPhone] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await fetch('https://voice-of-god.onrender.com/api/announcements');
        const data = await response.json();
        if (data.data && Array.isArray(data.data)) {
          setAnnouncements(data.data);
        }
      } catch (error) {
        console.error('Error fetching announcements:', error);
      } finally {
        setLoading(false);
      }
    };

    // Check if user is admin (you can modify this logic based on your auth system)
    const checkAdminStatus = () => {
      const token = localStorage.getItem('token');
      const userRole = localStorage.getItem('userRole');
      setIsAdmin(token && (userRole === 'admin' || userRole === 'super_admin'));
    };

    fetchAnnouncements();
    checkAdminStatus();
  }, []);

  if (!isVisible || loading || announcements.length === 0) return null;

  const nextAnnouncement = () => {
    setCurrentIndex((prev) => (prev + 1) % announcements.length);
  };

  const currentAnnouncement = announcements[currentIndex];

  const sendPhoneMessages = async (announcementId, targetGroups) => {
    setSendingPhone(true);
    try {
      const response = await fetch(`https://voice-of-god.onrender.com/api/announcements/${announcementId}/send-phone`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ target_groups: targetGroups })
      });
      
      const result = await response.json();
      
      if (response.ok) {
        alert(`Phone messages sent successfully! ${result.result.sent} messages delivered.`);
      } else {
        alert(`Failed to send phone messages: ${result.error}`);
      }
    } catch (error) {
      console.error('Error sending phone messages:', error);
      alert('Error sending phone messages. Please try again.');
    } finally {
      setSendingPhone(false);
    }
  };



  return (
    <div className="w-full bg-gradient-to-r from-primary-900 via-primary-800 to-primary-900 relative overflow-hidden">
      {/* Subtle background animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-transparent to-white/5 animate-pulse"></div>

      <div className="relative max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left side - Announcements text and content */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-white font-bold text-sm md:text-base">
                Announcements
              </span>
            </div>

            <div className="flex-1 min-w-0 overflow-hidden">
              <div className="min-w-0">
                <div className="overflow-hidden whitespace-nowrap">
                  <p className="text-white font-medium text-sm md:text-base inline-block animate-marquee">
                    {currentAnnouncement.title}: {currentAnnouncement.content}
                  </p>
                </div>
                {currentAnnouncement.target_groups && currentAnnouncement.target_groups !== 'website' && (() => {
                  const filteredGroups = currentAnnouncement.target_groups
                    .split(',')
                    .map(group => group.trim())
                    .filter(group => group.toLowerCase() !== 'website')
                    .join(', ');
                  
                  return filteredGroups ? (
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-white/70 text-xs">For:</span>
                      <span className="inline-block bg-white/20 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                        {filteredGroups}
                      </span>
                    </div>
                  ) : null;
                })()}
              </div>
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {isAdmin && currentAnnouncement.target_groups && 
             currentAnnouncement.target_groups.toLowerCase() !== 'website' && (
              <button
                onClick={() => sendPhoneMessages(currentAnnouncement.$id, currentAnnouncement.target_groups)}
                disabled={sendingPhone}
                className="hidden sm:flex items-center gap-1 bg-blue-600/80 hover:bg-blue-600 text-white px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Phone className="w-3 h-3" />
                <span>{sendingPhone ? 'Sending...' : 'Send SMS'}</span>
              </button>
            )}
            
            <button
              onClick={nextAnnouncement}
              className="hidden sm:flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 backdrop-blur-sm"
            >
              <span>Next</span>
              <ChevronRight className="w-3 h-3" />
            </button>

            <button
              onClick={() => setIsVisible(false)}
              className="p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all duration-200 hover:scale-105 backdrop-blur-sm"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile buttons */}
        <div className="sm:hidden mt-2 flex justify-center gap-2">
          {isAdmin && currentAnnouncement.target_groups && 
           currentAnnouncement.target_groups.toLowerCase() !== 'website' && (
            <button
              onClick={() => sendPhoneMessages(currentAnnouncement.$id, currentAnnouncement.target_groups)}
              disabled={sendingPhone}
              className="flex items-center gap-1 bg-blue-600/80 hover:bg-blue-600 text-white px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Phone className="w-3 h-3" />
              <span>{sendingPhone ? 'Sending...' : 'SMS'}</span>
            </button>
          )}
          
          <button
            onClick={nextAnnouncement}
            className="flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
          >
            <span>Next</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* Pagination dots */}
        <div className="flex justify-center mt-2 gap-1">
          {announcements.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? 'bg-white scale-125'
                  : 'bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementSection;
