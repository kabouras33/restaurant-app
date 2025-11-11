import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://ai-codepeak.com/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

interface UserMenuProps {
  isOpen: boolean;
  onLogout: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ isOpen, onLogout }) => (
  <div className={`absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md ${isOpen ? 'block' : 'hidden'}`}>
    <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">Profile</Link>
    <button onClick={onLogout} className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100">Logout</button>
  </div>
);

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
      alert('Failed to logout. Please try again.');
    }
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-500 shadow-xl">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold hover:scale-105 transition-transform">RestaurantApp</Link>
        <nav className="flex items-center space-x-4">
          <Link to="/reservations" className="text-white hover:text-blue-200 transition-colors">Reservations</Link>
          <Link to="/inventory" className="text-white hover:text-blue-200 transition-colors">Inventory</Link>
          <Link to="/reports" className="text-white hover:text-blue-200 transition-colors">Reports</Link>
          <div className="relative">
            <button onClick={() => setMenuOpen(!menuOpen)} className="text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400">
              {user?.name || 'User'}
            </button>
            <UserMenu isOpen={menuOpen} onLogout={handleLogout} />
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;