import { useState, useCallback } from 'react';
import axios from 'axios';

interface ApplicationData {
  id: string;
  name: string;
  description: string;
  status: string;
}

interface UseFrontendApplicationsReturn {
  applications: ApplicationData[];
  loading: boolean;
  error: string | null;
  fetchApplications: () => void;
  createApplication: (data: Omit<ApplicationData, 'id'>) => Promise<void>;
  updateApplication: (id: string, data: Partial<ApplicationData>) => Promise<void>;
  deleteApplication: (id: string) => Promise<void>;
}

const useFrontendApplications = (): UseFrontendApplicationsReturn => {
  const [applications, setApplications] = useState<ApplicationData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<ApplicationData[]>('/api/applications');
      setApplications(response.data);
    } catch (err) {
      setError('Failed to fetch applications. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  const createApplication = useCallback(async (data: Omit<ApplicationData, 'id'>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post<ApplicationData>('/api/applications', data);
      setApplications((prev) => [...prev, response.data]);
    } catch (err) {
      setError('Failed to create application. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateApplication = useCallback(async (id: string, data: Partial<ApplicationData>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put<ApplicationData>(`/api/applications/${id}`, data);
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? response.data : app))
      );
    } catch (err) {
      setError('Failed to update application. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteApplication = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`/api/applications/${id}`);
      setApplications((prev) => prev.filter((app) => app.id !== id));
    } catch (err) {
      setError('Failed to delete application. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    applications,
    loading,
    error,
    fetchApplications,
    createApplication,
    updateApplication,
    deleteApplication,
  };
};

export default useFrontendApplications;