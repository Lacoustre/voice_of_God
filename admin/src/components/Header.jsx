import { useState, useRef, useEffect } from "react";
import { Menu, Bell, LogOut, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context";

const Header = ({ activeSection, setSidebarOpen }) => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [expanded, setExpanded] = useState(null);

  const dropdownRef = useRef(null);

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title:
        "A new member has registered and joined your community! Please welcome them and assign a team lead.",
      time: "2 mins ago",
      read: false,
    },
    {
      id: 2,
      title:
        "Reminder: Mid-week service is tomorrow at 6:00 PM. Ensure all departments are informed.",
      time: "1 hour ago",
      read: false,
    },
    {
      id: 3,
      title:
        "Admin panel was updated with the latest patch. Review the changes to stay updated.",
      time: "Yesterday",
      read: true,
    },
    {
      id: 4,
      title:
        "New prayer request submitted: Urgent healing needed for a member. Visit the prayer board.",
      time: "2 days ago",
      read: true,
    },
    {
      id: 5,
      title:
        "Donation milestone reached 🎉. Consider thanking your congregation in the next newsletter.",
      time: "3 days ago",
      read: false,
    },
    {
      id: 6,
      title:
        "Youth ministry photos uploaded to gallery. Check the media page for updates.",
      time: "Last week",
      read: true,
    },
    {
      id: 7,
      title:
        "Service attendance trend reports are now available. View them under analytics section.",
      time: "2 weeks ago",
      read: false,
    },
  ]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowNotifications(false);
        setExpanded(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleReadStatus = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setLogoutLoading(false);
      setShowLogoutModal(false);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 relative z-50">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Left */}
        <div className="flex items-center gap-4">
          <button
            className="lg:hidden text-gray-500 hover:text-gray-700 transition"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900 capitalize tracking-tight">
            {activeSection}
          </h1>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4 relative">
          {/* Notifications */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => {
                setShowNotifications((prev) => {
                  if (prev) setExpanded(null);
                  return !prev;
                });
              }}
              className="relative p-2 text-gray-500 hover:text-gray-700 transition"
            >
              <Bell className="w-6 h-6" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-96 bg-white border border-gray-200 rounded-xl shadow-lg z-50 animate-fade-in">
                <div className="px-4 py-3 border-b text-sm font-semibold text-gray-700">
                  Notifications
                </div>
                <ul className="max-h-96 overflow-y-auto divide-y divide-gray-100">
                  {notifications.map((n) => (
                    <li
                      key={n.id}
                      className={`px-4 py-4 ${
                        n.read ? "bg-white" : "bg-gray-50"
                      } hover:bg-gray-100 transition`}
                    >
                      <div className="flex justify-between items-start">
                        <p className="text-sm text-gray-800 font-medium truncate w-11/12">
                          {n.title}
                        </p>
                        <button
                          onClick={() => toggleReadStatus(n.id)}
                          className={`${
                            n.read
                              ? "text-gray-300 hover:text-indigo-400"
                              : "text-green-500 hover:text-green-600"
                          } transition mt-0.5`}
                          title={n.read ? "Mark as unread" : "Mark as read"}
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-xs text-gray-500">{n.time}</span>
                        {n.title.length > 80 && expanded !== n.id && (
                          <button
                            onClick={() => setExpanded(n.id)}
                            className="text-xs text-indigo-600 font-medium bg-indigo-50 px-2 py-1 rounded-md hover:bg-indigo-100 transition"
                          >
                            See more
                          </button>
                        )}
                      </div>

                      {expanded === n.id && (
                        <p className="text-sm text-gray-600 mt-2 text-justify leading-snug">
                          {n.title}{" "}
                          <button
                            onClick={() => setExpanded(null)}
                            className="ml-2 text-xs text-indigo-600 font-medium bg-indigo-50 px-2 py-1 rounded-md hover:bg-indigo-100 transition"
                          >
                            See less
                          </button>
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Logout */}
          <button
            className="p-2 text-gray-500 hover:text-red-600 transition"
            onClick={() => setShowLogoutModal(true)}
            title="Logout"
          >
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-sm mx-auto rounded-xl shadow-2xl p-6 space-y-5">
            <h2 className="text-xl font-bold text-gray-900">Confirm Logout</h2>
            <p className="text-sm text-gray-600">
              Are you sure you want to log out from the admin dashboard?
            </p>
            <div className="flex justify-end gap-3 pt-1">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                disabled={logoutLoading}
                className="px-4 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-700 flex items-center justify-center gap-2 min-w-[120px]"
              >
                {logoutLoading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Logging out...
                  </>
                ) : (
                  "Yes, Logout"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
