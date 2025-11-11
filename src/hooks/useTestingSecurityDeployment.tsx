import { useState, useCallback } from 'react';
import axios from 'axios';

interface FetchDataResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

interface MutationResponse<T> {
  mutate: (data: T) => Promise<void>;
  error: string | null;
  loading: boolean;
}

function useTestingSecurityDeployment<T>(url: string): [FetchDataResponse<T>, MutationResponse<T>] {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<T>(url);
      setData(response.data);
    } catch (err) {
      setError('Failed to fetch data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [url]);

  const mutate = useCallback(async (newData: T) => {
    setLoading(true);
    setError(null);
    try {
      await axios.post(url, newData);
      setData(newData);
    } catch (err) {
      setError('Failed to update data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [url]);

  return [
    { data, error, loading },
    { mutate, error, loading }
  ];
}

export default useTestingSecurityDeployment;