import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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

const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: false,
    error: null,
  });
  const navigate = useNavigate();

  const login = useCallback(async (email: string, password: string) => {
    setAuthState({ ...authState, loading: true, error: null });
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      setAuthState({ user: response.data.user, loading: false, error: null });
      navigate('/dashboard');
    } catch (error: any) {
      setAuthState({
        user: null,
        loading: false,
        error: error.response?.data?.message || 'Login failed',
      });
    }
  }, [authState, navigate]);

  const logout = useCallback(async () => {
    setAuthState({ ...authState, loading: true, error: null });
    try {
      await axios.post('/api/auth/logout');
      setAuthState({ user: null, loading: false, error: null });
      navigate('/login');
    } catch (error: any) {
      setAuthState({
        ...authState,
        loading: false,
        error: error.response?.data?.message || 'Logout failed',
      });
    }
  }, [authState, navigate]);

  const checkAuthStatus = useCallback(async () => {
    setAuthState({ ...authState, loading: true, error: null });
    try {
      const response = await axios.get('/api/auth/status');
      setAuthState({ user: response.data.user, loading: false, error: null });
    } catch (error: any) {
      setAuthState({
        user: null,
        loading: false,
        error: error.response?.data?.message || 'Failed to verify authentication status',
      });
    }
  }, [authState]);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  return {
    user: authState.user,
    loading: authState.loading,
    error: authState.error,
    login,
    logout,
  };
};

export default useAuth;