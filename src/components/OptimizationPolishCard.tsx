import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface OptimizationPolishCardProps {
  restaurantId: string;
}

interface RestaurantData {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  isSubscribed: boolean;
}

const OptimizationPolishCard: React.FC<OptimizationPolishCardProps> = ({ restaurantId }) => {
  const [restaurant, setRestaurant] = useState<RestaurantData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const response = await axios.get<RestaurantData>(`/api/restaurants/${restaurantId}`);
        setRestaurant(response.data);
      } catch (err) {
        setError('Failed to load restaurant data.');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantData();
  }, [restaurantId]);

  const handleSubscribe = async () => {
    try {
      await axios.post(`/api/restaurants/${restaurantId}/subscribe`);
      setRestaurant((prev) => prev ? { ...prev, isSubscribed: true } : null);
      alert('Subscription successful!');
    } catch {
      alert('Subscription failed. Please try again.');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!restaurant) {
    return <div className="text-red-500">Restaurant not found.</div>;
  }

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white">
      <img className="w-full" src={restaurant.imageUrl} alt={restaurant.name} />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{restaurant.name}</div>
        <p className="text-gray-700 text-base">{restaurant.description}</p>
      </div>
      <div className="px-6 pt-4 pb-2">
        {restaurant.isSubscribed ? (
          <span className="inline-block bg-green-200 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
            Subscribed
          </span>
        ) : (
          <button
            onClick={handleSubscribe}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            aria-label="Subscribe to restaurant"
          >
            Subscribe
          </button>
        )}
        <button
          onClick={() => navigate(`/restaurants/${restaurant.id}`)}
          className="ml-2 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          aria-label="View restaurant details"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default OptimizationPolishCard;