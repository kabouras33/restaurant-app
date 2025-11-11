import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface BackendService {
  id: string;
  name: string;
  status: string;
  description: string;
}

const BackendServicesAPIsCard: React.FC = () => {
  const { user } = useAuth();
  const [services, setServices] = useState<BackendService[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('/api/backend-services', {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        setServices(response.data);
      } catch (err) {
        setError('Failed to load services. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [user]);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {services.map((service) => (
        <div key={service.id} className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-xl font-bold mb-2">{service.name}</h2>
          <p className="text-gray-700 mb-4">{service.description}</p>
          <span
            className={`inline-block px-3 py-1 text-sm font-semibold ${
              service.status === 'active' ? 'text-green-800 bg-green-200' : 'text-red-800 bg-red-200'
            } rounded-full`}
          >
            {service.status}
          </span>
        </div>
      ))}
    </div>
  );
};

export default BackendServicesAPIsCard;