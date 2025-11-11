import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface OptimizeApplicationPerformanceProps {
  apiUrl: string;
}

interface RestaurantData {
  id: number;
  name: string;
  location: string;
  reservations: number;
}

const OptimizeApplicationPerformance: React.FC<OptimizeApplicationPerformanceProps> = ({ apiUrl }) => {
  const [data, setData] = useState<RestaurantData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get<RestaurantData[]>(`${apiUrl}/restaurants`);
        setData(response.data);
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiUrl]);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    axios.get<RestaurantData[]>(`${apiUrl}/restaurants`)
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch data. Please try again later.');
        setLoading(false);
      });
  };

  const handleNavigate = (id: number) => {
    navigate(`/restaurants/${id}`);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><div className="loader">Loading...</div></div>;
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <p className="text-red-500">{error}</p>
        <button onClick={handleRetry} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Retry</button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Restaurants</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Name</th>
            <th className="py-2">Location</th>
            <th className="py-2">Reservations</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((restaurant) => (
            <tr key={restaurant.id} className="text-center">
              <td className="py-2">{restaurant.name}</td>
              <td className="py-2">{restaurant.location}</td>
              <td className="py-2">{restaurant.reservations}</td>
              <td className="py-2">
                <button
                  onClick={() => handleNavigate(restaurant.id)}
                  className="px-4 py-2 bg-green-500 text-white rounded"
                  aria-label={`View details for ${restaurant.name}`}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OptimizeApplicationPerformance;