import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface FetchOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  data?: any;
}

interface FetchResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://ai-codepeak.com/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

function useTestingSecurityDeployment<T>(options: FetchOptions): FetchResponse<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.request<T>({
        method: options.method,
        url: options.url,
        data: options.data
      });
      setData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, [options.method, options.url, options.data]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, error, loading };
}

export default useTestingSecurityDeployment;