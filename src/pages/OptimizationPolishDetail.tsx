import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface PolishDetail {
  id: number;
  name: string;
  description: string;
  price: number;
  available: boolean;
}

const OptimizationPolishDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [polishDetail, setPolishDetail] = useState<PolishDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPolishDetail = async () => {
      try {
        const response = await axios.get(`/api/polishes/${id}`, {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        setPolishDetail(response.data);
      } catch (err) {
        setError('Failed to load polish details.');
      } finally {
        setLoading(false);
      }
    };

    fetchPolishDetail();
  }, [id, user]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await axios.delete(`/api/polishes/${id}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to delete the item.');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center mt-4">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{polishDetail?.name}</h1>
      <p className="mb-2">{polishDetail?.description}</p>
      <p className="mb-2">Price: ${polishDetail?.price.toFixed(2)}</p>
      <p className="mb-4">Available: {polishDetail?.available ? 'Yes' : 'No'}</p>
      <div className="flex space-x-4">
        <button
          onClick={() => navigate(`/edit/${id}`)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Delete
        </button>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default OptimizationPolishDetail;