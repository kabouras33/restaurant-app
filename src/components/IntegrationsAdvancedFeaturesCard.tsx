import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface IntegrationFeature {
  id: number;
  name: string;
  description: string;
  enabled: boolean;
}

interface IntegrationsAdvancedFeaturesCardProps {
  restaurantId: string;
}

const IntegrationsAdvancedFeaturesCard: React.FC<IntegrationsAdvancedFeaturesCardProps> = ({ restaurantId }) => {
  const [features, setFeatures] = useState<IntegrationFeature[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const response = await axios.get(`/api/restaurants/${restaurantId}/features`);
        setFeatures(response.data);
      } catch (err) {
        setError('Failed to load features. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeatures();
  }, [restaurantId]);

  const handleToggleFeature = async (featureId: number, enabled: boolean) => {
    try {
      await axios.patch(`/api/features/${featureId}`, { enabled: !enabled });
      setFeatures((prevFeatures) =>
        prevFeatures.map((feature) =>
          feature.id === featureId ? { ...feature, enabled: !enabled } : feature
        )
      );
    } catch (err) {
      setError('Failed to update feature. Please try again.');
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Integrations & Advanced Features</h2>
      <ul>
        {features.map((feature) => (
          <li key={feature.id} className="flex justify-between items-center mb-2">
            <div>
              <h3 className="text-lg font-semibold">{feature.name}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
            <button
              onClick={() => handleToggleFeature(feature.id, feature.enabled)}
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
      <button
        onClick={() => navigate('/dashboard')}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default IntegrationsAdvancedFeaturesCard;