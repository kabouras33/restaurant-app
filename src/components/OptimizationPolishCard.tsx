import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface OptimizationPolishCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://ai-codepeak.com/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

const OptimizationPolishCard: React.FC<OptimizationPolishCardProps> = ({ id, title, description, imageUrl, onEdit, onDelete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/items/${id}`);
        setData(response.data);
      } catch (err) {
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await api.delete(`/items/${id}`);
        onDelete(id);
      } catch (err) {
        setError('Failed to delete item. Please try again.');
      }
    }
  };

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      {loading ? (
        <div className="animate-pulse p-4">
          <div className="h-48 bg-gray-300 rounded"></div>
          <div className="mt-4 h-6 bg-gray-300 rounded"></div>
          <div className="mt-2 h-4 bg-gray-300 rounded"></div>
        </div>
      ) : error ? (
        <div className="p-4 text-red-500">{error}</div>
      ) : (
        <div>
          <img className="w-full h-48 object-cover" src={imageUrl} alt={title} />
          <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2">{title}</div>
            <p className="text-gray-700 text-base">{description}</p>
          </div>
          <div className="px-6 pt-4 pb-2 flex justify-between">
            <button
              onClick={() => onEdit(id)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
              aria-label={`Edit ${title}`}
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-red-600"
              aria-label={`Delete ${title}`}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OptimizationPolishCard;