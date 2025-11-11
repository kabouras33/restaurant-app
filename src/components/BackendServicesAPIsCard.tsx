import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface BackendService {
  id: number;
  name: string;
  description: string;
  status: 'active' | 'inactive';
}

interface BackendServicesAPIsCardProps {
  apiEndpoint: string;
}

const BackendServicesAPIsCard: React.FC<BackendServicesAPIsCardProps> = ({ apiEndpoint }) => {
  const [services, setServices] = useState<BackendService[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await axios.get<BackendService[]>(apiEndpoint);
        setServices(response.data);
      } catch (err) {
        setError('Failed to load services. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [apiEndpoint]);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="loader">Loading...</div></div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {services.map(service => (
        <div key={service.id} className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold">{service.name}</h3>
          <p className="text-gray-600">{service.description}</p>
          <span className={`inline-block mt-2 px-2 py-1 text-sm rounded-full ${service.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {service.status}
          </span>
        </div>
      ))}
    </div>
  );
};

export default BackendServicesAPIsCard;