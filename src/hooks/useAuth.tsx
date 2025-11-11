import { useState, useCallback } from 'react';
import axios from 'axios';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null,
  });

  const login = useCallback(async (email: string, password: string) => {
    setAuthState((prevState) => ({ ...prevState, loading: true, error: null }));
    try {
      const response = await axios.post<AuthResponse>('/api/auth/login', { email, password });
      setAuthState({
        isAuthenticated: true,
        user: response.data.user,
        loading: false,
        error: null,
      });
      localStorage.setItem('token', response.data.token);
    } catch (error) {
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: 'Login failed. Please check your credentials.',
      });
    }
  }, []);

  const logout = useCallback(() => {
    setAuthState({
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null,
    });
    localStorage.removeItem('token');
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    setAuthState((prevState) => ({ ...prevState, loading: true, error: null }));
    try {
      const response = await axios.post<AuthResponse>('/api/auth/register', { name, email, password });
      setAuthState({
        isAuthenticated: true,
        user: response.data.user,
        loading: false,
        error: null,
      });
      localStorage.setItem('token', response.data.token);
    } catch (error) {
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: 'Registration failed. Please try again.',
      });
    }
  }, []);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null,
      });
      return;
    }

    setAuthState((prevState) => ({ ...prevState, loading: true, error: null }));
    try {
      const response = await axios.get<User>('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAuthState({
        isAuthenticated: true,
        user: response.data,
        loading: false,
        error: null,
      });
    } catch (error) {
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: 'Session expired. Please log in again.',
      });
      localStorage.removeItem('token');
    }
  }, []);

  return {
    authState,
    login,
    logout,
    register,
    checkAuth,
  };
};

export default useAuth;