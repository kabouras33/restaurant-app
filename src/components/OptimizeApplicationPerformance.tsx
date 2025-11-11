import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface CacheData {
  [key: string]: any;
}

const OptimizeApplicationPerformance: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cache, setCache] = useState<CacheData>({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const cacheKey = 'restaurantData';
        if (cache[cacheKey]) {
          setData(cache[cacheKey]);
          setLoading(false);
          return;
        }
        const response = await axios.get('/api/restaurant/data', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setData(response.data);
        setCache((prevCache) => ({ ...prevCache, [cacheKey]: response.data }));
      } catch (err) {
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user.token, cache]);

  if (loading) {
    return <div className="flex justify-center items-center h-full">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Restaurant Data</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Location</th>
            <th className="py-2 px-4 border-b">Cuisine</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b">{item.name}</td>
              <td className="py-2 px-4 border-b">{item.location}</td>
              <td className="py-2 px-4 border-b">{item.cuisine}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OptimizeApplicationPerformance;