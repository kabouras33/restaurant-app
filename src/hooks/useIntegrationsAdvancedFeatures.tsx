import { useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface IntegrationData {
  id: string;
  name: string;
  status: string;
}

interface UseIntegrationsAdvancedFeaturesReturn {
  integrations: IntegrationData[];
  loading: boolean;
  error: string | null;
  fetchIntegrations: () => Promise<void>;
  updateIntegrationStatus: (id: string, status: string) => Promise<void>;
}

const useIntegrationsAdvancedFeatures = (): UseIntegrationsAdvancedFeaturesReturn => {
  const [integrations, setIntegrations] = useState<IntegrationData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchIntegrations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/integrations', {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setIntegrations(response.data);
    } catch (err) {
      setError('Failed to fetch integrations. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updateIntegrationStatus = useCallback(
    async (id: string, status: string) => {
      setLoading(true);
      setError(null);
      try {
        await axios.patch(
          `/api/integrations/${id}`,
          { status },
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );
        setIntegrations((prevIntegrations) =>
          prevIntegrations.map((integration) =>
            integration.id === id ? { ...integration, status } : integration
          )
        );
      } catch (err) {
        setError('Failed to update integration status. Please try again later.');
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  return {
    integrations,
    loading,
    error,
    fetchIntegrations,
    updateIntegrationStatus,
  };
};

export default useIntegrationsAdvancedFeatures;