import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface IntegrationDetail {
  id: string;
  name: string;
  description: string;
  status: string;
}

const IntegrationsAdvancedFeaturesDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [integration, setIntegration] = useState<IntegrationDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIntegrationDetail = async () => {
      try {
        const response = await axios.get(`/api/integrations/${id}`);
        setIntegration(response.data);
      } catch (err) {
        setError('Failed to load integration details.');
      } finally {
        setLoading(false);
      }
    };

    fetchIntegrationDetail();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this integration?')) return;
    try {
      await axios.delete(`/api/integrations/${id}`);
      navigate('/integrations');
    } catch (err) {
      setError('Failed to delete integration.');
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
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{integration?.name}</h1>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Delete
        </button>
      </header>
      <main>
        <p className="mb-4">{integration?.description}</p>
        <div className="mb-4">
          <span className="font-semibold">Status: </span>
          <span>{integration?.status}</span>
        </div>
      </main>
      <footer className="mt-8">
        <button
          onClick={() => navigate('/integrations')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Back to Integrations
        </button>
      </footer>
    </div>
  );
};

export default IntegrationsAdvancedFeaturesDetail;