import { X, User } from "lucide-react";
import logo from "../assets/modified_logo.png";

const Sidebar = ({
  menuItems,
  activeSection,
  setActiveSection,
  sidebarOpen,
  setSidebarOpen,
  setShowAccountModal,
}) => {
  const SidebarContent = ({ isMobile = false }) => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <img
            src={logo}
            alt="Church Logo"
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="text-xl font-bold text-gray-900">Voice of God</span>
        </div>
        {isMobile && (
          <button onClick={() => setSidebarOpen(false)}>
            <X className="w-6 h-6 text-gray-400" />
          </button>
        )}
      </div>

      {/* Main nav */}
      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveSection(item.id);
              if (isMobile) setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition ${
              activeSection === item.id
                ? "bg-indigo-100 text-indigo-700"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <item.icon className="w-5 h-5" /> {item.label}
          </button>
        ))}
      </div>

      {/* Account button (always pinned bottom) */}
      <div className="border-t px-4 py-4">
        <button
          onClick={() => setShowAccountModal(true)}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        >
          <User className="w-5 h-5" /> Account
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 bg-white shadow-lg border-r border-gray-200">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="w-48 bg-white shadow-lg flex flex-col">
            <SidebarContent isMobile />
          </div>
          <div className="flex-1" onClick={() => setSidebarOpen(false)} />
        </div>
      )}
    </>
  );
};

export default Sidebar;
