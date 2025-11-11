import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await axios.post('/api/logout');
      logout();
      navigate('/login');
    } catch (err) {
      setError('Failed to logout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <aside
        className={`fixed inset-y-0 left-0 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out bg-white shadow-lg z-30 w-64`}
        aria-label="Sidebar"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Restaurant App</h2>
          <button
            onClick={toggleSidebar}
            className="text-gray-600 hover:text-gray-900 focus:outline-none"
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>
        <nav className="mt-4">
          <ul>
            <li>
              <Link
                to="/dashboard"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/inventory"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
              >
                Inventory
              </Link>
            </li>
            <li>
              <Link
                to="/reservations"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
              >
                Reservations
              </Link>
            </li>
            <li>
              <Link
                to="/reports"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-200"
              >
                Reports
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="flex items-center justify-between p-4 bg-white shadow-md">
          <button
            onClick={toggleSidebar}
            className="text-gray-600 hover:text-gray-900 focus:outline-none md:hidden"
            aria-label="Open sidebar"
          >
            ☰
          </button>
          <h1 className="text-xl font-bold">Welcome, {user?.name || 'Guest'}</h1>
          <div>
            {loading ? (
              <span className="text-gray-500">Logging out...</span>
            ) : (
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 focus:outline-none"
              >
                Logout
              </button>
            )}
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>
      {error && (
        <div className="fixed bottom-0 left-0 right-0 bg-red-500 text-white text-center py-2">
          {error}
        </div>
      )}
    </div>
  );
};

export default Layout;