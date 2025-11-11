import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface IntegrationFeature {
  id: string;
  name: string;
  description: string;
  isEnabled: boolean;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://ai-codepeak.com/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

const IntegrationsAdvancedFeaturesCard: React.FC = () => {
  const { user } = useAuth();
  const [features, setFeatures] = useState<IntegrationFeature[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const response = await api.get('/integrations/features', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setFeatures(response.data);
      } catch (err) {
        setError('Failed to load features. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchFeatures();
  }, [user.token]);

  const toggleFeature = async (featureId: string) => {
    try {
      setLoading(true);
      await api.patch(`/integrations/features/${featureId}/toggle`, {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setFeatures(prevFeatures =>
        prevFeatures.map(feature =>
          feature.id === featureId ? { ...feature, isEnabled: !feature.isEnabled } : feature
        )
      );
    } catch (err) {
      setError('Failed to update feature. Please try again later.');
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
    <div className="p-4 bg-white shadow-xl rounded-lg">
      <h2 className="text-xl font-bold mb-4">Integrations & Advanced Features</h2>
      <ul className="space-y-4">
        {features.map(feature => (
          <li key={feature.id} className="flex justify-between items-center p-4 border rounded-lg hover:shadow-lg transition-shadow">
            <div>
              <h3 className="text-lg font-semibold">{feature.name}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
            <button
              onClick={() => toggleFeature(feature.id)}
              className={`px-4 py-2 rounded-lg text-white ${feature.isEnabled ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}`}
              aria-label={`Toggle ${feature.name}`}
            >
              {feature.isEnabled ? 'Disable' : 'Enable'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IntegrationsAdvancedFeaturesCard;