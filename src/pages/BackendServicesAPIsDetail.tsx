import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://ai-codepeak.com/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

interface ServiceDetail {
  id: string;
  name: string;
  description: string;
  endpoint: string;
  status: string;
}

const BackendServicesAPIsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [serviceDetail, setServiceDetail] = useState<ServiceDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServiceDetail = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/services/${id}`);
        setServiceDetail(response.data);
      } catch (err) {
        setError('Failed to load service details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchServiceDetail();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await api.delete(`/services/${id}`);
      alert('Service deleted successfully.');
      navigate('/services');
    } catch {
      alert('Failed to delete service. Please try again.');
    }
  };

  if (loading) return <div className="animate-pulse">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{serviceDetail?.name}</h1>
      <p className="mb-2"><strong>Description:</strong> {serviceDetail?.description}</p>
      <p className="mb-2"><strong>Endpoint:</strong> {serviceDetail?.endpoint}</p>
      <p className="mb-4"><strong>Status:</strong> {serviceDetail?.status}</p>
      <div className="flex space-x-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => navigate(`/services/edit/${id}`)}
        >
          Edit
        </button>
        <button
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          onClick={handleDelete}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default BackendServicesAPIsDetail;