import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://ai-codepeak.com/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

interface IntegrationDetail {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

const IntegrationsAdvancedFeaturesDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [integration, setIntegration] = useState<IntegrationDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIntegrationDetail = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/integrations/${id}`);
        setIntegration(response.data);
      } catch (err) {
        setError('Failed to load integration details.');
      } finally {
        setLoading(false);
      }
    };

    fetchIntegrationDetail();
  }, [id]);

  const handleToggleActive = async () => {
    if (!integration) return;
    try {
      setLoading(true);
      await api.put(`/integrations/${integration.id}`, { isActive: !integration.isActive });
      setIntegration({ ...integration, isActive: !integration.isActive });
    } catch (err) {
      setError('Failed to update integration status.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!integration) return;
    try {
      setLoading(true);
      await api.delete(`/integrations/${integration.id}`);
      navigate('/integrations');
    } catch (err) {
      setError('Failed to delete integration.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{integration?.name}</h1>
      <p className="mb-4">{integration?.description}</p>
      <div className="flex items-center mb-4">
        <span className={`mr-2 ${integration?.isActive ? 'text-green-500' : 'text-red-500'}`}>
          {integration?.isActive ? 'Active' : 'Inactive'}
        </span>
        <button
          onClick={handleToggleActive}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Toggle Active
        </button>
      </div>
      <button
        onClick={handleDelete}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
      >
        Delete Integration
      </button>
    </div>
  );
};

export default IntegrationsAdvancedFeaturesDetail;