import React from 'react';
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
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

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
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold">Restaurant App</h1>
      </div>
      <nav className="flex-1">
        <ul className="space-y-2 p-4">
          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className="flex items-center p-2 rounded hover:bg-gray-700 focus:outline-none focus:bg-gray-700"
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
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <button
          onClick={handleLogout}
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        >
          {loading ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;