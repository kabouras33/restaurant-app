import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface ApiService {
  id: number;
  name: string;
  status: string;
  endpoint: string;
}

const BackendServicesAPIsTable: React.FC = () => {
  const [services, setServices] = useState<ApiService[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof ApiService; direction: 'ascending' | 'descending' } | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('/services');
        setServices(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load services');
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

  const getClassNamesFor = (name: keyof ApiService) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === name ? (sortConfig.direction === 'ascending' ? 'sort-asc' : 'sort-desc') : undefined;
  };

  if (loading) {
    return <div className="animate-pulse text-center py-4">Loading services...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b" onClick={() => requestSort('name')}>
              <button className={`w-full text-left ${getClassNamesFor('name')}`}>Name</button>
            </th>
            <th className="py-2 px-4 border-b" onClick={() => requestSort('status')}>
              <button className={`w-full text-left ${getClassNamesFor('status')}`}>Status</button>
            </th>
            <th className="py-2 px-4 border-b" onClick={() => requestSort('endpoint')}>
              <button className={`w-full text-left ${getClassNamesFor('endpoint')}`}>Endpoint</button>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedServices.map((service) => (
            <tr key={service.id} className="hover:bg-gray-100 transition-colors">
              <td className="py-2 px-4 border-b">{service.name}</td>
              <td className="py-2 px-4 border-b">{service.status}</td>
              <td className="py-2 px-4 border-b">{service.endpoint}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BackendServicesAPIsTable;