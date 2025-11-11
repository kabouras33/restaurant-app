import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface OptimizationPolishCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const OptimizationPolishCard: React.FC<OptimizationPolishCardProps> = ({ id, title, description, imageUrl, onEdit, onDelete }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const handleDelete = async () => {
    if (!user) {
      setError('You must be logged in to perform this action.');
      return;
    }
    setIsDeleting(true);
    try {
      await axios.delete(`/api/items/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      onDelete(id);
    } catch (err) {
      setError('Failed to delete the item. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white m-4">
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
        </div>
      ) : (
        <>
          <img className="w-full h-48 object-cover" src={imageUrl} alt={title} />
          <div className="px-6 py-4">
            <div className="font-bold text-xl mb-2">{title}</div>
            <p className="text-gray-700 text-base">{description}</p>
          </div>
          <div className="px-6 pt-4 pb-2 flex justify-between">
            <button
              onClick={() => onEdit(id)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              aria-label={`Edit ${title}`}
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className={`bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
              aria-label={`Delete ${title}`}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
          {error && <div className="text-red-500 text-center mt-2">{error}</div>}
        </>
      )}
    </div>
  );
};

export default OptimizationPolishCard;