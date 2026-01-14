import { useContext } from 'react';
import { useApp } from '../context/AppContext';

const StatCard = ({ title, value, icon: Icon, color, change, loading }) => {
  const { setActiveSection } = useApp();
  
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
      className="bg-white rounded-xl shadow-sm p-6 cursor-pointer"
      style={{borderColor: 'rgb(217, 143, 53)', borderWidth: '1px', borderStyle: 'solid'}}
      onClick={handleClick}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 mt-1">
          <Icon className="w-8 h-8 text-gray-700" style={{color: 'rgb(217, 143, 53)'}} />
        </div>
        <div className="flex-1 text-right">
          <p className="text-lg font-bold text-gray-700 mb-2">{title}</p>
          <div className="text-3xl font-bold text-gray-900 flex justify-end">
            {loading ? (
              <div className="h-9 w-20 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              <span>{value}</span>
            )}
          </div>
          {change && <p className="text-sm text-green-600 mt-2">{change}</p>}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
