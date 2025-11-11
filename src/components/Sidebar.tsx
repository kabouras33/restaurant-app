import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

interface MenuItem {
  name: string;
  path: string;
  icon: JSX.Element;
}

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const menuItems: MenuItem[] = [
    { name: 'Dashboard', path: '/dashboard', icon: <i className="fas fa-tachometer-alt"></i> },
    { name: 'Reservations', path: '/reservations', icon: <i className="fas fa-calendar-check"></i> },
    { name: 'Inventory', path: '/inventory', icon: <i className="fas fa-boxes"></i> },
    { name: 'Reports', path: '/reports', icon: <i className="fas fa-chart-line"></i> },
    { name: 'Settings', path: '/settings', icon: <i className="fas fa-cog"></i> },
  ];

  const handleLogout = async () => {
    setLoading(true);
    setError(null);
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

  return (
    <div className="h-full bg-gray-800 text-white flex flex-col">
      <div className="flex items-center justify-center h-16 border-b border-gray-700">
        <h1 className="text-xl font-bold">Restaurant App</h1>
      </div>
      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-2 p-4">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className="flex items-center p-2 text-base font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
                aria-label={item.name}
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-700">
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center p-2 text-base font-medium rounded-md bg-red-600 hover:bg-red-700 focus:outline-none focus:bg-red-700"
          disabled={loading}
          aria-label="Logout"
        >
          {loading ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;