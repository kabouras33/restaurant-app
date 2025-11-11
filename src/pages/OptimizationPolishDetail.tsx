import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface OptimizationDetail {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

const OptimizationPolishDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [detail, setDetail] = useState<OptimizationDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchDetail = async () => {
      try {
        const response = await axios.get(`/api/optimizations/${id}`);
        setDetail(response.data);
      } catch (err) {
        setError('Failed to load details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id, user, navigate]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      await axios.delete(`/api/optimizations/${id}`);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to delete the item. Please try again later.');
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
      <h1 className="text-2xl font-bold mb-4">{detail?.name}</h1>
      <p className="mb-2">{detail?.description}</p>
      <p className="text-sm text-gray-500">Created at: {new Date(detail?.createdAt || '').toLocaleString()}</p>
      <p className="text-sm text-gray-500">Updated at: {new Date(detail?.updatedAt || '').toLocaleString()}</p>
      <div className="flex justify-end mt-4">
        <button
          onClick={() => navigate(`/optimizations/edit/${id}`)}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default OptimizationPolishDetail;