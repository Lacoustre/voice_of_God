import { useEffect, useState } from "react";
import { Church } from "lucide-react";
import { useApp } from "../context/AppContext";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://voice-of-god.onrender.com";

const UpcomingServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setActiveSection } = useApp();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      const res = await fetch(`${API_BASE_URL}/services`);
      const data = await res.json();
      if (data.success) {
        setServices(data.services.slice(0, 3));
      }
    } catch (err) {
      console.error("Error fetching services:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceClick = () => {
    setActiveSection('services');
    localStorage.setItem('activeSection', 'services');
  };

  return (
    <div className="bg-white rounded-xl p-4 flex flex-col h-full" style={{borderColor: 'rgb(217, 143, 53)', borderWidth: '1px', borderStyle: 'solid'}}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Church className="w-5 h-5" style={{color: 'rgb(217, 143, 53)'}} />
        Upcoming Services
      </h3>
      <div className="space-y-3 flex-1 overflow-y-auto" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-lg p-3 animate-pulse text-left space-y-2">
              <div className="flex gap-2">
                <div className="h-3 bg-gray-300 rounded w-12"></div>
                <div className="h-3 bg-gray-200 rounded flex-1"></div>
              </div>
              <div className="flex gap-2">
                <div className="h-3 bg-gray-300 rounded w-20"></div>
                <div className="h-3 bg-gray-200 rounded flex-1"></div>
              </div>
              <div className="flex gap-2">
                <div className="h-3 bg-gray-300 rounded w-16"></div>
                <div className="h-3 bg-gray-200 rounded flex-1"></div>
              </div>
            </div>
          ))
        ) : services.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-2">No services scheduled</p>
        ) : (
          services.map((service) => (
            <div 
              key={service.$id} 
              onClick={handleServiceClick}
              className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition text-left space-y-1 border border-gray-200 cursor-pointer"
            >
              <p className="text-xs"><span className="font-bold text-gray-700">Title:</span> <span className="text-gray-800">{service.title}</span></p>
              <p className="text-xs"><span className="font-bold text-gray-700">Description:</span> <span className="text-gray-600">{service.description}</span></p>
              {service.schedule && service.schedule.length > 0 && (
                <p className="text-xs"><span className="font-bold text-gray-700">Schedule:</span> <span className="text-gray-500">{service.schedule[0]}</span></p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UpcomingServices;
