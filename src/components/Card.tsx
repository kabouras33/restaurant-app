import React, { useState } from 'react';
import axios from 'axios';

interface CardProps {
  title: string;
  description: string;
  imageUrl: string;
  onAction: () => void;
}

const Card: React.FC<CardProps> = ({ title, description, imageUrl, onAction }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleActionClick = async () => {
    setLoading(true);
    setError(null);
    try {
      await onAction();
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto bg-white shadow-xl rounded-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
      <img className="w-full h-48 object-cover" src={imageUrl} alt={title} />
      <div className="p-4">
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <p className="text-gray-600">{description}</p>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        <button
          onClick={handleActionClick}
          disabled={loading}
          className={`mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          aria-label={`Perform action on ${title}`}
        >
          {loading ? 'Processing...' : 'Take Action'}
        </button>
      </div>
    </div>
  );
};

export default Card;