import { useState, useContext } from "react";
import { Menu, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context";
import { AppContext } from '../context/AppContext';

const Header = ({ setSidebarOpen }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { activeSection } = useContext(AppContext);

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);



  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
       await new Promise((resolve) => setTimeout(resolve, 3000));
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
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
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
