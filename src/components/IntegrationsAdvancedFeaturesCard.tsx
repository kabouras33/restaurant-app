import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface IntegrationFeature {
  id: number;
  name: string;
  description: string;
  enabled: boolean;
}

const IntegrationsAdvancedFeaturesCard: React.FC = () => {
  const { user } = useAuth();
  const [features, setFeatures] = useState<IntegrationFeature[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const response = await axios.get('/api/integrations/features', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
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

  const toggleFeature = async (featureId: number) => {
    try {
      const feature = features.find(f => f.id === featureId);
      if (!feature) return;

      const updatedFeature = { ...feature, enabled: !feature.enabled };
      await axios.patch(`/api/integrations/features/${featureId}`, updatedFeature, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      setFeatures(features.map(f => (f.id === featureId ? updatedFeature : f)));
    } catch (err) {
      setError('Failed to update feature. Please try again.');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Integrations & Advanced Features</h2>
      <ul role="list" className="divide-y divide-gray-200">
        {features.map(feature => (
          <li key={feature.id} className="py-4 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">{feature.name}</h3>
              <p className="text-gray-500">{feature.description}</p>
            </div>
            <button
              onClick={() => toggleFeature(feature.id)}
              className={`px-4 py-2 rounded-md text-white ${
                feature.enabled ? 'bg-green-500' : 'bg-gray-500'
              }`}
              aria-pressed={feature.enabled}
            >
              {feature.enabled ? 'Disable' : 'Enable'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IntegrationsAdvancedFeaturesCard;