import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://ai-codepeak.com/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

interface MenuItem {
  name: string;
  path: string;
  icon: JSX.Element;
}

const menuItems: MenuItem[] = [
  { name: 'Dashboard', path: '/dashboard', icon: <i className="fas fa-tachometer-alt"></i> },
  { name: 'Inventory', path: '/inventory', icon: <i className="fas fa-boxes"></i> },
  { name: 'Reservations', path: '/reservations', icon: <i className="fas fa-calendar-check"></i> },
  { name: 'Reports', path: '/reports', icon: <i className="fas fa-chart-line"></i> },
  { name: 'Settings', path: '/settings', icon: <i className="fas fa-cog"></i> }
];

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    setLoading(true);
    setError(null);
    try {
      await api.post('/auth/logout');
      logout();
      navigate('/login');
    } catch (err) {
      setError('Failed to logout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 text-white h-full shadow-xl">
      <div className="p-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Restaurant App</h1>
        {loading ? (
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
        ) : (
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded"
            aria-label="Logout"
          >
            Logout
          </button>
        )}
      </div>
      {error && <div className="bg-red-500 text-white p-2">{error}</div>}
      <nav className="mt-4">
        <ul>
          {menuItems.map((item) => (
            <li key={item.name} className="hover:bg-gray-700">
              <Link
                to={item.path}
                className="flex items-center p-3 space-x-3"
                aria-label={item.name}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;