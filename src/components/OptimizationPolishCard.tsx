import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface OptimizationPolishCardProps {
  itemId: string;
}

interface ItemData {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

const OptimizationPolishCard: React.FC<OptimizationPolishCardProps> = ({ itemId }) => {
  const { user } = useAuth();
  const [item, setItem] = useState<ItemData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchItemData = async () => {
      try {
        setLoading(true);
        const response = await axios.get<ItemData>(`/api/items/${itemId}`);
        setItem(response.data);
      } catch (err) {
        setError('Failed to load item data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchItemData();
  }, [itemId]);

  if (loading) {
    return <div className="flex justify-center items-center h-48">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  if (!item) {
    return <div className="text-center">No item found.</div>;
  }

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white">
      <img className="w-full" src={item.imageUrl} alt={item.name} />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{item.name}</div>
        <p className="text-gray-700 text-base">{item.description}</p>
      </div>
      <div className="px-6 pt-4 pb-2">
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
          ${item.price.toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export default OptimizationPolishCard;