import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://ai-codepeak.com/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

interface UseBackendServicesAPIs {
  fetchData: (endpoint: string) => Promise<any>;
  postData: (endpoint: string, data: any) => Promise<any>;
  updateData: (endpoint: string, data: any) => Promise<any>;
  deleteData: (endpoint: string) => Promise<any>;
  loading: boolean;
  error: string | null;
}

export const useBackendServicesAPIs = (): UseBackendServicesAPIs => {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (endpoint: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(endpoint, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const postData = useCallback(async (endpoint: string, data: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post(endpoint, data, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updateData = useCallback(async (endpoint: string, data: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(endpoint, data, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const deleteData = useCallback(async (endpoint: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.delete(endpoint, {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [user]);

  return { fetchData, postData, updateData, deleteData, loading, error };
};