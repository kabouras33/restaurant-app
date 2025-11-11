import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface ApiService {
  id: number;
  name: string;
  endpoint: string;
  status: string;
}

const BackendServicesAPIsTable: React.FC = () => {
  const { user } = useAuth();
  const [services, setServices] = useState<ApiService[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof ApiService; direction: 'ascending' | 'descending' } | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('/api/services', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setServices(response.data);
      } catch (err) {
        setError('Failed to load services');
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, [user.token]);

  const sortServices = (key: keyof ApiService) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    setServices((prevServices) =>
      [...prevServices].sort((a, b) => {
        if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
        if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
        return 0;
      })
    );
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status"></div></div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b" onClick={() => sortServices('name')}>Name</th>
            <th className="py-2 px-4 border-b" onClick={() => sortServices('endpoint')}>Endpoint</th>
            <th className="py-2 px-4 border-b" onClick={() => sortServices('status')}>Status</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service.id} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b">{service.name}</td>
              <td className="py-2 px-4 border-b">{service.endpoint}</td>
              <td className="py-2 px-4 border-b">{service.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BackendServicesAPIsTable;