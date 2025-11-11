import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface MenuItem {
  id: number;
  name: string;
  path: string;
  icon: JSX.Element;
}

const Sidebar: React.FC = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get('/api/menu-items');
        setMenuItems(response.data);
      } catch (err) {
        setError('Failed to load menu items');
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <nav className="bg-gray-800 text-white w-64 h-full fixed">
      <ul className="space-y-2 p-4">
        {menuItems.map((item) => (
          <li key={item.id} className="hover:bg-gray-700 rounded-md">
            <button
              onClick={() => handleNavigation(item.path)}
              className="flex items-center w-full p-2 text-left focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label={`Navigate to ${item.name}`}
            >
              {item.icon}
              <span className="ml-3">{item.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;