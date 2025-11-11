import { useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface FetchOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  data?: any;
  headers?: Record<string, string>;
}

interface UseOptimizationPolishReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (options: FetchOptions) => Promise<void>;
}

function useOptimizationPolish<T>(): UseOptimizationPolishReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const execute = useCallback(async (options: FetchOptions) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios({
        method: options.method,
        url: options.url,
        data: options.data,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
          ...options.headers,
        },
      });

      setData(response.data);
    } catch (err: any) {
      if (err.response && err.response.status === 401) {
        navigate('/login');
      } else {
        setError(err.message || 'An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  }, [user, navigate]);

  return { data, loading, error, execute };
}

export default useOptimizationPolish;