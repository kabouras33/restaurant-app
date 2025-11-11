import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

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

  const handleFeatureClick = (id: number) => {
    navigate(`/features/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome to Our Restaurant App</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96">
              <section className="text-center py-12">
                <h2 className="text-4xl font-extrabold text-gray-900">Our Features</h2>
                <p className="mt-4 text-lg text-gray-600">
                  Explore the features that make our app the best choice for managing your restaurant.
                </p>
              </section>
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
                </div>
              ) : error ? (
                <div className="text-red-500 text-center">{error}</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {features.map((feature) => (
                    <div
                      key={feature.id}
                      className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                      onClick={() => handleFeatureClick(feature.id)}
                    >
                      <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
                      <p className="mt-2 text-gray-600">{feature.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-white shadow mt-6">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500">
            &copy; 2023 Restaurant App. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;