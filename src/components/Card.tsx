import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface CardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  onAction: (id: string) => void;
}

const Card: React.FC<CardProps> = ({ id, title, description, imageUrl, onAction }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleActionClick = async () => {
    setLoading(true);
    setError(null);
    try {
      await axios.post('/api/action', { id });
      onAction(id);
    } catch (err) {
      setError('Failed to perform action. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white">
      <img className="w-full" src={imageUrl} alt={title} />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{title}</div>
        <p className="text-gray-700 text-base">{description}</p>
      </div>
      <div className="px-6 pt-4 pb-2">
        {loading ? (
          <button
            className="bg-blue-500 text-white font-bold py-2 px-4 rounded opacity-50 cursor-not-allowed"
            disabled
          >
            Loading...
          </button>
        ) : (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleActionClick}
            aria-label={`Perform action on ${title}`}
          >
            Action
          </button>
        )}
        {error && <p className="text-red-500 text-xs italic mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default Card;