import { useState } from "react";
import { Menu } from "lucide-react";
import { useApp } from '../context/AppContext';

const Header = ({ setSidebarOpen }) => {
  const { activeSection } = useApp();

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
        </div>
      </div>
    </header>
  );
};

export default Header;
