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
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
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

  const sortedServices = React.useMemo(() => {
    if (sortConfig !== null) {
      return [...services].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return services;
  }, [services, sortConfig]);

  const requestSort = (key: keyof ApiService) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="loader"></div></div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('name')}>
              Name
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('endpoint')}>
              Endpoint
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('status')}>
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedServices.map((service) => (
            <tr key={service.id} className="hover:bg-gray-100">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{service.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{service.endpoint}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{service.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BackendServicesAPIsTable;