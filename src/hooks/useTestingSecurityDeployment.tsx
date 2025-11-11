import { useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface FetchOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  data?: any;
}

interface FetchResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
  execute: (options: FetchOptions) => Promise<void>;
}

function useTestingSecurityDeployment<T>(): FetchResponse<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useAuth();

  const execute = useCallback(async (options: FetchOptions) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios({
        method: options.method,
        url: options.url,
        data: options.data,
        headers: {
          Authorization: `Bearer ${user?.token}`,
          'Content-Type': 'application/json',
        },
      });

      setData(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }, [user]);

  return { data, error, loading, execute };
}

export default useTestingSecurityDeployment;