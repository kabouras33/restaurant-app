import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface ApplicationData {
  id: number;
  name: string;
  status: string;
  createdAt: string;
}

interface UseFrontendApplicationsReturn {
  applications: ApplicationData[];
  loading: boolean;
  error: string | null;
  fetchApplications: () => void;
  createApplication: (name: string) => Promise<void>;
  updateApplicationStatus: (id: number, status: string) => Promise<void>;
}

const useFrontendApplications = (): UseFrontendApplicationsReturn => {
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/applications', {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setApplications(response.data);
    } catch (err) {
      setError('Failed to fetch applications. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createApplication = useCallback(
    async (name: string) => {
      if (!name) {
        setError('Application name is required.');
        return;
      }
      setLoading(true);
      setError(null);
      try {
        await axios.post(
          '/api/applications',
          { name },
          {
            headers: { Authorization: `Bearer ${user?.token}` },
          }
        );
        fetchApplications();
      } catch (err) {
        setError('Failed to create application. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [user, fetchApplications]
  );

  const updateApplicationStatus = useCallback(
    async (id: number, status: string) => {
      if (!id || !status) {
        setError('Invalid application ID or status.');
        return;
      }
      setLoading(true);
      setError(null);
      try {
        await axios.patch(
          `/api/applications/${id}`,
          { status },
          {
            headers: { Authorization: `Bearer ${user?.token}` },
          }
        );
        fetchApplications();
      } catch (err) {
        setError('Failed to update application status. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [user, fetchApplications]
  );

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  return {
    applications,
    loading,
    error,
    fetchApplications,
    createApplication,
    updateApplicationStatus,
  };
};

export default useFrontendApplications;