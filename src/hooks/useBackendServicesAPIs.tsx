import { useState, useCallback } from 'react';
import axios, { AxiosError } from 'axios';

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

interface FetchOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  data?: any;
  headers?: Record<string, string>;
}

const useBackendServicesAPIs = () => {
  const [response, setResponse] = useState<ApiResponse<any>>({
    data: null,
    error: null,
    loading: false,
  });

  const fetchData = useCallback(async (options: FetchOptions) => {
    setResponse({ data: null, error: null, loading: true });
    try {
      const res = await axios({
        method: options.method,
        url: options.url,
        data: options.data,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
      setResponse({ data: res.data, error: null, loading: false });
    } catch (error) {
      const err = error as AxiosError;
      setResponse({
        data: null,
        error: err.response?.data?.message || err.message,
        loading: false,
      });
    }
  }, []);

  return { response, fetchData };
};

export default useBackendServicesAPIs;