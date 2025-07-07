import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 right-4 z-50 p-2 bg-white rounded-lg shadow-lg"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div className={`
        fixed md:static inset-0 z-40
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        w-64 bg-white shadow-lg
      `}>
        <div className="p-4">
          <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
        </div>
        <nav className="mt-4">
          <Link
            to="/admin/players"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Players
          </Link>
          <Link
            to="/admin/matches"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Matches
          </Link>
          <Link
            to="/admin/news"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            News
          </Link>
          <Link
            to="/admin/trainings"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Trainings
          </Link>
          <Link
            to="/admin/media"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Media
          </Link>
          <Link
            to="/admin/coaches2"
            className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Тренера2
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-4 md:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}; 