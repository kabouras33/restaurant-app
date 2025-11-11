import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface ApplicationData {
  id: string;
  name: string;
  status: string;
  createdAt: string;
}

interface UseFrontendApplicationsReturn {
  applications: ApplicationData[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  createApplication: (name: string) => Promise<void>;
  updateApplication: (id: string, status: string) => Promise<void>;
  deleteApplication: (id: string) => Promise<void>;
}

const useFrontendApplications = (): UseFrontendApplicationsReturn => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/applications', {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setApplications(response.data);
    } catch (err) {
      setError('Failed to fetch applications.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createApplication = async (name: string) => {
    setLoading(true);
    setError(null);
    try {
      await axios.post(
        '/api/applications',
        { name },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      await fetchApplications();
    } catch (err) {
      setError('Failed to create application.');
    } finally {
      setLoading(false);
    }
  };

  const updateApplication = async (id: string, status: string) => {
    setLoading(true);
    setError(null);
    try {
      await axios.put(
        `/api/applications/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      await fetchApplications();
    } catch (err) {
      setError('Failed to update application.');
    } finally {
      setLoading(false);
    }
  };

  const deleteApplication = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`/api/applications/${id}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      await fetchApplications();
    } catch (err) {
      setError('Failed to delete application.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  return {
    applications,
    loading,
    error,
    refetch: fetchApplications,
    createApplication,
    updateApplication,
    deleteApplication,
  };
};

export default useFrontendApplications;