import { useState, useCallback } from 'react';
import axios from 'axios';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface MutationState<T> {
  loading: boolean;
  error: string | null;
  success: boolean;
}

interface UseOptimizationPolishReturn<T, M> {
  fetchData: () => Promise<void>;
  mutateData: (data: M) => Promise<void>;
  fetchState: FetchState<T>;
  mutationState: MutationState<M>;
}

function useOptimizationPolish<T, M>(fetchUrl: string, mutationUrl: string): UseOptimizationPolishReturn<T, M> {
  const [fetchState, setFetchState] = useState<FetchState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const [mutationState, setMutationState] = useState<MutationState<M>>({
    loading: false,
    error: null,
    success: false,
  });

  const fetchData = useCallback(async () => {
    setFetchState({ data: null, loading: true, error: null });
    try {
      const response = await axios.get<T>(fetchUrl);
      setFetchState({ data: response.data, loading: false, error: null });
    } catch (error) {
      setFetchState({ data: null, loading: false, error: error.message || 'An error occurred' });
    }
  }, [fetchUrl]);

  const mutateData = useCallback(async (data: M) => {
    setMutationState({ loading: true, error: null, success: false });
    try {
      await axios.post(mutationUrl, data);
      setMutationState({ loading: false, error: null, success: true });
    } catch (error) {
      setMutationState({ loading: false, error: error.message || 'An error occurred', success: false });
    }
  }, [mutationUrl]);

  return { fetchData, mutateData, fetchState, mutationState };
}

export default useOptimizationPolish;