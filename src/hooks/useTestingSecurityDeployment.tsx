import { useState, useCallback } from 'react';
import axios from 'axios';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseTestingSecurityDeploymentProps<T> {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: Record<string, any>;
  headers?: Record<string, string>;
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
}

function useTestingSecurityDeployment<T>({
  endpoint,
  method,
  body,
  headers,
  onSuccess,
  onError,
}: UseTestingSecurityDeploymentProps<T>): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const response = await axios({
        url: endpoint,
        method,
        data: body,
        headers,
      });
      setState({ data: response.data, loading: false, error: null });
      if (onSuccess) onSuccess(response.data);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
      setState({ data: null, loading: false, error: errorMessage });
      if (onError) onError(errorMessage);
    }
  }, [endpoint, method, body, headers, onSuccess, onError]);

  return { ...state, fetchData };
}

export default useTestingSecurityDeployment;