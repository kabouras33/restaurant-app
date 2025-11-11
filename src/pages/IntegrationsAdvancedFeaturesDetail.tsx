import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface IntegrationDetail {
  id: string;
  name: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const IntegrationsAdvancedFeaturesDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [integration, setIntegration] = useState<IntegrationDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    const fetchIntegrationDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/integrations/${id}`);
        setIntegration(response.data);
      } catch (err) {
        setError('Failed to load integration details.');
      } finally {
        setLoading(false);
      }
    };

    fetchIntegrationDetail();
  }, [id, navigate, user]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this integration?')) return;
    try {
      await axios.delete(`/api/integrations/${id}`);
      navigate('/integrations');
    } catch (err) {
      setError('Failed to delete the integration.');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{integration?.name}</h1>
      <p className="mb-2"><strong>Description:</strong> {integration?.description}</p>
      <p className="mb-2"><strong>Status:</strong> {integration?.status}</p>
      <p className="mb-2"><strong>Created At:</strong> {new Date(integration?.createdAt || '').toLocaleString()}</p>
      <p className="mb-2"><strong>Updated At:</strong> {new Date(integration?.updatedAt || '').toLocaleString()}</p>
      <div className="flex space-x-4 mt-4">
        <button
          onClick={() => navigate(`/integrations/edit/${id}`)}
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
          onClick={() => navigate('/integrations')}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Back to List
        </button>
      </div>
    </div>
  );
};

export default IntegrationsAdvancedFeaturesDetail;