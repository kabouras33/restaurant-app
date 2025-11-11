import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface BackendService {
  id: string;
  name: string;
  description: string;
  status: string;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://ai-codepeak.com/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

const BackendServicesAPIsCard: React.FC = () => {
  const { user } = useAuth();
  const [services, setServices] = useState<BackendService[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get('/backend-services');
        setServices(response.data);
      } catch (err) {
        setError('Failed to load services. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (loading) {
    return <div className="animate-pulse p-4">Loading services...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {services.map(service => (
        <div key={service.id} className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow">
          <h2 className="text-xl font-semibold mb-2">{service.name}</h2>
          <p className="text-gray-700 mb-4">{service.description}</p>
          <span className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${service.status === 'active' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
            {service.status}
          </span>
        </div>
      ))}
    </div>
  );
};

export default BackendServicesAPIsCard;