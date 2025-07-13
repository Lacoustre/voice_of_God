import { useContext } from 'react';
import { AppContext } from '../context/AppContext';

const StatCard = ({ title, value, icon: Icon, color, change, loading }) => {
  const { setActiveSection } = useContext(AppContext);
  
  const handleClick = () => {
    // Map stat titles to their corresponding sections
    const sectionMap = {
      'Total Members': 'members',
      'Unreplied Messages': 'messages',
      'Upcoming Events': 'events',
      'Unapproved Members': 'members'
    };
    
    const section = sectionMap[title];
    if (section) {
      setActiveSection(section);
      // Also update localStorage to persist the active section
      localStorage.setItem('activeSection', section);
    }
  };
  
  return (
    <div 
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-gray-500"
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
            )}
          </p>
          <p className="text-sm text-green-600 mt-1">{change}</p>
        </div>
        <div className={`${color} p-3 rounded-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
