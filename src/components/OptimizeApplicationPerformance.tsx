import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface OptimizeApplicationPerformanceProps {
  onPerformanceOptimized: () => void;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://ai-codepeak.com/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

const OptimizeApplicationPerformance: React.FC<OptimizeApplicationPerformanceProps> = ({ onPerformanceOptimized }) => {
  const { user } = useAuth();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/performance-data', {
          headers: { Authorization: `Bearer ${user?.token}` }
        });
        setData(response.data);
        onPerformanceOptimized();
      } catch (err) {
        setError('Failed to load performance data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, onPerformanceOptimized]);

  if (loading) {
    return <div className="animate-pulse p-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Performance Data</h2>
      <ul className="space-y-2">
        {data.map((item, index) => (
          <li key={index} className="p-4 bg-white shadow-md rounded-lg">
            <div className="flex justify-between">
              <span className="font-medium">{item.name}</span>
              <span className="text-gray-500">{item.value}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OptimizeApplicationPerformance;