import React, { useContext, useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading, setLoading, setAuthError } = useContext(AuthContext);
  const location = useLocation();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/auth/check', { withCredentials: true });
        if (response.data.isAuthenticated) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
        }
      } catch (error) {
        setAuthError('Failed to verify authentication. Please try again.');
        setIsAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    if (!isAuthenticated) {
      checkAuth();
    } else {
      setIsAuthorized(true);
    }
  }, [isAuthenticated, setLoading, setAuthError]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (isAuthorized === false) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;