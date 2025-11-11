import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface FetchOptions {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
}

interface UseOptimizationPolishReturn<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
  execute: (options: FetchOptions) => Promise<void>;
}

const useOptimizationPolish = <T,>(): UseOptimizationPolishReturn<T> => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://ai-codepeak.com/api',
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
  });

  const execute = useCallback(async ({ url, method = 'GET', data }: FetchOptions) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.request<T>({
        url,
        method,
        data,
      });
      setData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, [api]);

  return { data, error, loading, execute };
};

export default useOptimizationPolish;