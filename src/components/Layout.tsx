import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface LayoutProps {
  children: React.ReactNode;
}

interface User {
  id: number;
  name: string;
  email: string;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('/api/auth/user');
        setUser(response.data);
      } catch (err) {
        setError('Failed to load user data.');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
      setUser(null);
      navigate('/login');
    } catch (err) {
      setError('Logout failed. Please try again.');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold">Restaurant App</h1>
        </div>
        <nav className="p-4">
          <ul>
            <li>
              <Link to="/dashboard" className="block py-2 px-4 hover:bg-gray-200">Dashboard</Link>
            </li>
            <li>
              <Link to="/inventory" className="block py-2 px-4 hover:bg-gray-200">Inventory</Link>
            </li>
            <li>
              <Link to="/reservations" className="block py-2 px-4 hover:bg-gray-200">Reservations</Link>
            </li>
            <li>
              <button onClick={handleLogout} className="w-full text-left py-2 px-4 hover:bg-gray-200">Logout</button>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-6 overflow-y-auto">
        <header className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Welcome, {user?.name}</h2>
          <div>
            <span className="text-gray-600">{user?.email}</span>
          </div>
        </header>
        <div>{children}</div>
      </main>
    </div>
  );
};

export default Layout;