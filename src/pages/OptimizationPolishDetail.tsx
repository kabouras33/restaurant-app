import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://ai-codepeak.com/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

interface OptimizationDetail {
  id: number;
  name: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const OptimizationPolishDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [detail, setDetail] = useState<OptimizationDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await api.get(`/optimizations/${id}`);
        setDetail(response.data);
      } catch (err) {
        setError('Failed to load details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await api.delete(`/optimizations/${id}`);
      alert('Item successfully deleted.');
      navigate('/dashboard');
    } catch (err) {
      alert('Failed to delete item. Please try again.');
    }
  };

  if (loading) return <div className="animate-pulse">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{detail?.name}</h1>
      <p className="mb-2">{detail?.description}</p>
      <div className="flex justify-between items-center">
        <span className={`px-2 py-1 rounded ${detail?.status === 'active' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
          {detail?.status}
        </span>
        <button
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition"
        >
          Delete
        </button>
      </div>
      <div className="mt-4">
        <p>Created At: {new Date(detail?.createdAt || '').toLocaleString()}</p>
        <p>Updated At: {new Date(detail?.updatedAt || '').toLocaleString()}</p>
      </div>
    </div>
  );
};

export default OptimizationPolishDetail;