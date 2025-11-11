import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface DeploymentDetail {
  id: number;
  name: string;
  status: string;
  lastUpdated: string;
  description: string;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://ai-codepeak.com/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

const TestingSecurityDeploymentDetail: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [deploymentDetail, setDeploymentDetail] = useState<DeploymentDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeploymentDetail = async () => {
      try {
        const response = await api.get(`/deployments/${user?.id}`);
        setDeploymentDetail(response.data);
      } catch (err) {
        setError('Failed to load deployment details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDeploymentDetail();
  }, [user?.id]);

  const handleDelete = async () => {
    if (!deploymentDetail) return;
    if (!window.confirm('Are you sure you want to delete this deployment?')) return;

    try {
      await api.delete(`/deployments/${deploymentDetail.id}`);
      alert('Deployment deleted successfully.');
      navigate('/dashboard');
    } catch (err) {
      alert('Failed to delete deployment. Please try again.');
    }
  };

  if (loading) {
    return <div className="animate-pulse">Loading deployment details...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-xl rounded-lg">
      <h1 className="text-2xl font-bold mb-4">{deploymentDetail?.name}</h1>
      <p className="text-gray-700 mb-2">Status: {deploymentDetail?.status}</p>
      <p className="text-gray-700 mb-2">Last Updated: {deploymentDetail?.lastUpdated}</p>
      <p className="text-gray-700 mb-4">{deploymentDetail?.description}</p>
      <button
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        onClick={handleDelete}
      >
        Delete Deployment
      </button>
    </div>
  );
};

export default TestingSecurityDeploymentDetail;