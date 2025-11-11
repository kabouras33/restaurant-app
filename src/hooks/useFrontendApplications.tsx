import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface Application {
  id: string;
  name: string;
  status: string;
}

interface UseFrontendApplicationsReturn {
  applications: Application[];
  loading: boolean;
  error: string | null;
  fetchApplications: () => void;
  createApplication: (name: string) => Promise<void>;
  updateApplication: (id: string, status: string) => Promise<void>;
  deleteApplication: (id: string) => Promise<void>;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://ai-codepeak.com/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

export const useFrontendApplications = (): UseFrontendApplicationsReturn => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<Application[]>('/applications');
      setApplications(response.data);
    } catch (err) {
      setError('Failed to fetch applications. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  const createApplication = useCallback(async (name: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post<Application>('/applications', { name });
      setApplications((prev) => [...prev, response.data]);
    } catch (err) {
      setError('Failed to create application. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateApplication = useCallback(async (id: string, status: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.put(`/applications/${id}`, { status });
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status } : app))
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
      await api.delete(`/applications/${id}`);
      setApplications((prev) => prev.filter((app) => app.id !== id));
    } catch (err) {
      setError('Failed to delete application. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  return {
    applications,
    loading,
    error,
    fetchApplications,
    createApplication,
    updateApplication,
    deleteApplication
  };
};