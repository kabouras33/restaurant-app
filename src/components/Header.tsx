import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  email: string;
}

const Header: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('/api/user');
        setUser(response.data);
      } catch (err) {
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('/api/logout');
      setUser(null);
      navigate('/login');
    } catch (err) {
      setError('Logout failed');
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-16 bg-gray-800 text-white">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-16 bg-red-600 text-white">{error}</div>;
  }

  return (
    <header className="bg-gray-800 text-white">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link to="/" className="text-xl font-bold">Restaurant App</Link>
        <nav className="flex items-center">
          <Link to="/dashboard" className="mx-2 hover:underline">Dashboard</Link>
          <Link to="/reservations" className="mx-2 hover:underline">Reservations</Link>
          <Link to="/inventory" className="mx-2 hover:underline">Inventory</Link>
          <div className="relative">
            <button
              onClick={toggleMenu}
              className="flex items-center focus:outline-none"
              aria-haspopup="true"
              aria-expanded={menuOpen}
            >
              <span className="mr-2">{user?.name}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20">
                <button
                  onClick={handleLogout}
                  className="block px-4 py-2 text-gray-800 hover:bg-gray-200 w-full text-left"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;