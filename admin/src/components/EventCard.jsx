import { useEffect, useRef, useState } from "react";
import { Trash2 } from "lucide-react";

const EventCard = ({ event, onStatusChange, onDelete }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [status, setStatus] = useState(event.status);
  const dropdownRef = useRef(null);

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
      case "Publish":
        return "bg-green-100 text-green-800";
      case "Unpublish":
        return "bg-red-100 text-red-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const statusOptions = ["Publish", "Unpublish", "Pending"];

  const handleStatusSelect = (newStatus) => {
    setStatus(newStatus);
    setIsDropdownOpen(false);
    if (onStatusChange) onStatusChange(event.id, newStatus);
  };

  const handleDelete = () => {
    const confirm = window.confirm("Are you sure you want to delete this event?");
    if (confirm && onDelete) onDelete(event.id);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all relative">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div className="text-left">
          <h4 className="text-base font-semibold text-gray-900">{event.title}</h4>
          <p className="text-sm text-gray-600">
            {event.date} at {event.time}
          </p>
        </div>

        <div className="flex items-center gap-3 relative" ref={dropdownRef}>
          {/* Status badge */}
          <button
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status)} focus:outline-none`}
          >
            {status}
          </button>

          {/* Dropdown menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 top-9 w-36 bg-white border border-gray-200 rounded-xl shadow-xl z-50 animate-fadeIn">
              {statusOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => handleStatusSelect(option)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {/* Delete button */}
          <button
            onClick={handleDelete}
            className="p-2 text-red-500 hover:bg-red-100 rounded-full transition"
            title="Delete Event"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
