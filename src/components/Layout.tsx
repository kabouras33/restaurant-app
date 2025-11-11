import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

interface LayoutProps {
  children: React.ReactNode;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://ai-codepeak.com/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await api.post('/auth/logout');
      logout();
      navigate('/login');
    } catch (err) {
      setError('Failed to log out. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Restaurant App</h1>
          <nav className="flex space-x-4">
            <Link to="/" className="hover:underline">Home</Link>
            {user ? (
              <>
                <Link to="/dashboard" className="hover:underline">Dashboard</Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded"
                  disabled={loading}
                  aria-busy={loading}
                >
                  {loading ? 'Logging out...' : 'Logout'}
                </button>
              </>
            ) : (
              <Link to="/login" className="hover:underline">Login</Link>
            )}
          </nav>
        </div>
      </header>
      {error && (
        <div className="bg-red-500 text-white p-4 text-center">
          {error}
        </div>
      )}
      <div className="flex flex-1">
        <aside className="w-64 bg-white shadow-md">
          <ul className="space-y-2 p-4">
            <li>
              <Link to="/inventory" className="block p-2 hover:bg-gray-200 rounded">Inventory</Link>
            </li>
            <li>
              <Link to="/reservations" className="block p-2 hover:bg-gray-200 rounded">Reservations</Link>
            </li>
            <li>
              <Link to="/reports" className="block p-2 hover:bg-gray-200 rounded">Reports</Link>
            </li>
          </ul>
        </aside>
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
      <footer className="bg-gray-800 text-white text-center py-4">
        &copy; {new Date().getFullYear()} Restaurant App. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;