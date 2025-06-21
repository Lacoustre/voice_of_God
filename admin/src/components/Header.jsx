import { Menu, Bell, User } from "lucide-react";

const Header = ({ activeSection, setSidebarOpen }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6 text-gray-400" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900 capitalize">
            {activeSection}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="relative p-2 text-gray-400 hover:text-gray-600">
            <Bell className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-indigo-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">Admin User</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;