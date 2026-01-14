import { useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";
import { useApp } from "../context/AppContext";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://voice-of-god.onrender.com";

const MessagePreview = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setActiveSection } = useApp();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      const res = await fetch(`${API_BASE_URL}/contact`);
      const data = await res.json();
      if (data.success) {
        setMessages(data.contacts.slice(0, 3));
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMessageClick = (messageId) => {
    setActiveSection('messages');
    localStorage.setItem('activeSection', 'messages');
    localStorage.setItem('selectedMessageId', messageId);
  };

  return (
    <div className="flex-1 flex flex-col">
      <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center gap-2">
        <MessageSquare className="w-5 h-5" style={{color: 'rgb(217, 143, 53)'}} />
        Recent Messages
      </h3>
      <div className="space-y-3 flex-1 overflow-y-auto" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-lg p-4 animate-pulse text-left space-y-2">
              <div className="flex gap-2">
                <div className="h-3 bg-gray-300 rounded w-12"></div>
                <div className="h-3 bg-gray-200 rounded flex-1"></div>
              </div>
              <div className="flex gap-2">
                <div className="h-3 bg-gray-300 rounded w-16"></div>
                <div className="h-3 bg-gray-200 rounded flex-1"></div>
              </div>
            </div>
          ))
        ) : messages.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-2">No messages</p>
        ) : (
          messages.map((message) => (
            <div 
              key={message.$id} 
              onClick={() => handleMessageClick(message.$id)}
              className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition cursor-pointer border border-gray-200 text-left space-y-1"
            >
              <p className="text-xs"><span className="font-bold text-gray-700">Email:</span> <span className="text-gray-800">{message.email}</span></p>
              <p className="text-xs"><span className="font-bold text-gray-700">Message:</span> <span className="text-gray-600 line-clamp-2">{message.message}</span></p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MessagePreview;
