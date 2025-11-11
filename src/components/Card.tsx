import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface CardProps {
  title: string;
  description: string;
  imageUrl: string;
  itemId: string;
}

const Card: React.FC<CardProps> = ({ title, description, imageUrl, itemId }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleAction = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await axios.post('/api/items/action', { itemId, userId: user?.id });
      if (response.status === 200) {
        setSuccess('Action completed successfully!');
      } else {
        setError('Failed to complete action.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white m-4">
      <img className="w-full h-48 object-cover" src={imageUrl} alt={title} />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{title}</div>
        <p className="text-gray-700 text-base">{description}</p>
      </div>
      <div className="px-6 pt-4 pb-2">
        <button
          onClick={handleAction}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          aria-label={`Perform action on ${title}`}
        >
          {loading ? 'Processing...' : 'Perform Action'}
        </button>
        {error && <p className="text-red-500 text-xs italic mt-2">{error}</p>}
        {success && <p className="text-green-500 text-xs italic mt-2">{success}</p>}
      </div>
    </div>
  );
};

export default Card;