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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await axios.post('/api/logout');
      logout();
      navigate('/login');
    } catch (err) {
      setError('Failed to log out. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold">Restaurant App</h1>
        </div>
        <nav className="mt-4">
          <ul>
            <li>
              <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-200">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/inventory" className="block px-4 py-2 hover:bg-gray-200">
                Inventory
              </Link>
            </li>
            <li>
              <Link to="/reservations" className="block px-4 py-2 hover:bg-gray-200">
                Reservations
              </Link>
            </li>
            <li>
              <Link to="/reports" className="block px-4 py-2 hover:bg-gray-200">
                Reports
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">Welcome, {user?.name || 'Guest'}</h2>
          </div>
          <div>
            {loading ? (
              <span className="text-gray-500">Logging out...</span>
            ) : (
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                aria-label="Logout"
              >
                Logout
              </button>
            )}
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {error && <div className="bg-red-100 text-red-700 p-4 mb-4 rounded">{error}</div>}
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;