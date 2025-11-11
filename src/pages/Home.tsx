import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://ai-codepeak.com/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

interface Feature {
  id: number;
  title: string;
  description: string;
}

const Home: React.FC = () => {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const response = await api.get('/features');
        setFeatures(response.data);
      } catch (err) {
        setError('Failed to load features. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchFeatures();
  }, []);

  const handleFeatureClick = (featureId: number) => {
    navigate(`/features/${featureId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-green-500 text-white">
      <header className="p-4 shadow-md bg-white text-black">
        <h1 className="text-2xl font-bold">Welcome to Our Restaurant App</h1>
        {user ? (
          <p className="mt-2">Hello, {user.name}!</p>
        ) : (
          <button
            className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
            onClick={() => navigate('/login')}
          >
            Login
          </button>
        )}
      </header>
      <main className="p-6">
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Features</h2>
          {loading ? (
            <div className="animate-pulse">
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
            </div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <ul className="space-y-4">
              {features.map((feature) => (
                <li
                  key={feature.id}
                  className="p-4 bg-white text-black rounded shadow hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleFeatureClick(feature.id)}
                >
                  <h3 className="text-lg font-bold">{feature.title}</h3>
                  <p>{feature.description}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
      <footer className="p-4 bg-white text-black text-center">
        <p>&copy; 2023 Restaurant App. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;