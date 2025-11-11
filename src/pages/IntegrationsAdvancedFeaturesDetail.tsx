import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

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
        const response = await axios.get(`/api/integrations/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setIntegration(response.data);
      } catch (err) {
        setError('Failed to load integration details.');
      } finally {
        setLoading(false);
      }
    };

    fetchIntegrationDetail();
  }, [id, user.token]);

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/integrations/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      navigate('/integrations');
    } catch (err) {
      setError('Failed to delete integration.');
    }
  };

  const handleToggleActive = async () => {
    if (!integration) return;
    try {
      const updatedIntegration = { ...integration, isActive: !integration.isActive };
      await axios.put(`/api/integrations/${id}`, updatedIntegration, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setIntegration(updatedIntegration);
    } catch (err) {
      setError('Failed to update integration status.');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><div className="loader"></div></div>;

  if (error) return <div className="text-red-500 text-center mt-4">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{integration?.name}</h1>
      <p className="mb-4">{integration?.description}</p>
      <div className="flex items-center mb-4">
        <span className="mr-2">Status:</span>
        <span className={`font-semibold ${integration?.isActive ? 'text-green-500' : 'text-red-500'}`}>
          {integration?.isActive ? 'Active' : 'Inactive'}
        </span>
      </div>
      <div className="flex space-x-4">
        <button
          onClick={handleToggleActive}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {integration?.isActive ? 'Deactivate' : 'Activate'}
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default IntegrationsAdvancedFeaturesDetail;