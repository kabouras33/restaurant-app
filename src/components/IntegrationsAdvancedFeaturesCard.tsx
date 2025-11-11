import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface IntegrationFeature {
  id: number;
  name: string;
  description: string;
  enabled: boolean;
}

interface IntegrationsAdvancedFeaturesCardProps {
  onFeatureToggle: (featureId: number, enabled: boolean) => void;
}

const IntegrationsAdvancedFeaturesCard: React.FC<IntegrationsAdvancedFeaturesCardProps> = ({ onFeatureToggle }) => {
  const { user } = useAuth();
  const [features, setFeatures] = useState<IntegrationFeature[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/integrations/features', {
          headers: { Authorization: `Bearer ${user.token}` },
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

  const handleToggle = async (featureId: number, enabled: boolean) => {
    try {
      await axios.patch(`/api/integrations/features/${featureId}`, { enabled }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setFeatures((prevFeatures) =>
        prevFeatures.map((feature) =>
          feature.id === featureId ? { ...feature, enabled: !enabled } : feature
        )
      );
      onFeatureToggle(featureId, !enabled);
    } catch (err) {
      setError('Failed to update feature. Please try again.');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Integrations & Advanced Features</h2>
      <ul>
        {features.map((feature) => (
          <li key={feature.id} className="flex justify-between items-center mb-3">
            <div>
              <h3 className="text-lg font-semibold">{feature.name}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
            <button
              onClick={() => handleToggle(feature.id, feature.enabled)}
              className={`px-4 py-2 rounded ${
                feature.enabled ? 'bg-green-500 text-white' : 'bg-gray-300 text-black'
              }`}
              aria-label={`Toggle ${feature.name}`}
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