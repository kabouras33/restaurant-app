import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface BackendService {
  id: number;
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
        const response = await axios.get('/api/services', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setServices(response.data);
      } catch (err) {
        setError('Failed to load services. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [user.token]);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Backend Services & APIs</h2>
      <ul className="space-y-4">
        {services.map((service) => (
          <li key={service.id} className="border p-4 rounded-lg hover:bg-gray-50">
            <h3 className="text-lg font-semibold">{service.name}</h3>
            <p className="text-sm text-gray-600">{service.description}</p>
            <span
              className={`inline-block mt-2 px-2 py-1 text-xs font-medium rounded-full ${
                service.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {service.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BackendServicesAPIsCard;