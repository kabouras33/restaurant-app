import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface IntegrationData {
  id: string;
  name: string;
  status: string;
}

interface UseIntegrationsAdvancedFeaturesReturn {
  integrations: IntegrationData[];
  loading: boolean;
  error: string | null;
  fetchIntegrations: () => void;
  updateIntegrationStatus: (id: string, status: string) => Promise<void>;
}

const useIntegrationsAdvancedFeatures = (): UseIntegrationsAdvancedFeaturesReturn => {
  const [integrations, setIntegrations] = useState<IntegrationData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchIntegrations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<IntegrationData[]>('/api/integrations');
      setIntegrations(response.data);
    } catch (err) {
      setError('Failed to fetch integrations. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateIntegrationStatus = useCallback(async (id: string, status: string) => {
    setLoading(true);
    setError(null);
    try {
      await axios.patch(`/api/integrations/${id}`, { status });
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
  }, []);

  useEffect(() => {
    fetchIntegrations();
  }, [fetchIntegrations]);

  return {
    integrations,
    loading,
    error,
    fetchIntegrations,
    updateIntegrationStatus,
  };
};

export default useIntegrationsAdvancedFeatures;