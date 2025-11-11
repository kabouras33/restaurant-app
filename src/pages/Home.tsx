import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface Feature {
  id: number;
  title: string;
  description: string;
}

const Home: React.FC = () => {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const response = await axios.get('/api/features');
        setFeatures(response.data);
      } catch (err) {
        setError('Failed to load features. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchFeatures();
  }, []);

  const handleLogin = async () => {
    try {
      await login('demo@example.com', 'password');
      navigate('/dashboard');
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Restaurant App</h1>
          {user ? (
            <button
              onClick={logout}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={handleLogin}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              Login
            </button>
          )}
        </div>
      </header>

      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96">
              <div className="text-center py-10">
                <h2 className="text-4xl font-bold text-gray-800">Welcome to Our Restaurant</h2>
                <p className="mt-4 text-lg text-gray-600">
                  Discover our features and enjoy the best dining experience.
                </p>
              </div>
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-indigo-600" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : error ? (
                <div className="text-red-500 text-center">{error}</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {features.map((feature) => (
                    <div key={feature.id} className="bg-white shadow-md rounded-lg p-6">
                      <h3 className="text-xl font-semibold text-gray-800">{feature.title}</h3>
                      <p className="mt-2 text-gray-600">{feature.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white shadow mt-10">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            &copy; 2023 Restaurant App. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;