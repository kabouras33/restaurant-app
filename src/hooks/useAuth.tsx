import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const useAuth = (): UseAuthReturn => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    const fetchUser = async () => {
      setState(prev => ({ ...prev, loading: true }));
      try {
        const response = await axios.get('/api/auth/user');
        setState({ user: response.data, loading: false, error: null });
      } catch (error) {
        setState({ user: null, loading: false, error: 'Failed to fetch user' });
      }
    };

    fetchUser();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      setState({ user: response.data, loading: false, error: null });
    } catch (error) {
      setState({ user: null, loading: false, error: 'Login failed' });
    }
  }, []);

  const logout = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      await axios.post('/api/auth/logout');
      setState({ user: null, loading: false, error: null });
    } catch (error) {
      setState(prev => ({ ...prev, loading: false, error: 'Logout failed' }));
    }
  }, []);

  return {
    user: state.user,
    loading: state.loading,
    error: state.error,
    login,
    logout,
  };
};

export default useAuth;