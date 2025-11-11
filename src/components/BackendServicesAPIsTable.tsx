import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface ApiService {
  id: number;
  name: string;
  endpoint: string;
  status: string;
  lastUpdated: string;
}

const BackendServicesAPIsTable: React.FC = () => {
  const [services, setServices] = useState<ApiService[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof ApiService; direction: 'ascending' | 'descending' } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get<ApiService[]>('/api/services');
        setServices(response.data);
      } catch (err) {
        setError('Failed to load services. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

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

  const handleRowClick = (id: number) => {
    navigate(`/services/${id}`);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-2 cursor-pointer" onClick={() => requestSort('name')}>Name</th>
            <th className="px-4 py-2 cursor-pointer" onClick={() => requestSort('endpoint')}>Endpoint</th>
            <th className="px-4 py-2 cursor-pointer" onClick={() => requestSort('status')}>Status</th>
            <th className="px-4 py-2 cursor-pointer" onClick={() => requestSort('lastUpdated')}>Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {sortedServices.map((service) => (
            <tr key={service.id} className="hover:bg-gray-100 cursor-pointer" onClick={() => handleRowClick(service.id)}>
              <td className="border px-4 py-2">{service.name}</td>
              <td className="border px-4 py-2">{service.endpoint}</td>
              <td className="border px-4 py-2">{service.status}</td>
              <td className="border px-4 py-2">{service.lastUpdated}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BackendServicesAPIsTable;