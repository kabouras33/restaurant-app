import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://ai-codepeak.com/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

interface Statistics {
  totalReservations: number;
  totalRevenue: number;
  totalInventoryItems: number;
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await api.get('/dashboard/statistics');
        setStatistics(response.data);
      } catch (err) {
        setError('Failed to load statistics. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchStatistics();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-600">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600 transition"
        >
          Logout
        </button>
      </header>
      <main>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-lg font-semibold text-gray-700">Total Reservations</h2>
            <p className="text-3xl font-bold text-blue-600">{statistics?.totalReservations}</p>
          </div>
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-lg font-semibold text-gray-700">Total Revenue</h2>
            <p className="text-3xl font-bold text-green-500">${statistics?.totalRevenue.toFixed(2)}</p>
          </div>
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-lg font-semibold text-gray-700">Total Inventory Items</h2>
            <p className="text-3xl font-bold text-red-500">{statistics?.totalInventoryItems}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;