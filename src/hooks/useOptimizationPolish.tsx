import { useState, useCallback } from 'react';
import axios from 'axios';

interface FetchOptions {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: any;
  headers?: Record<string, string>;
}

interface FetchResult<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
  execute: (options?: Partial<FetchOptions>) => Promise<void>;
}

function useOptimizationPolish<T>(initialOptions: FetchOptions): FetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const execute = useCallback(async (options?: Partial<FetchOptions>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios({
        url: options?.url || initialOptions.url,
        method: options?.method || initialOptions.method || 'GET',
        data: options?.data || initialOptions.data,
        headers: options?.headers || initialOptions.headers,
      });
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [initialOptions]);

  return { data, error, loading, execute };
}

export default useOptimizationPolish;