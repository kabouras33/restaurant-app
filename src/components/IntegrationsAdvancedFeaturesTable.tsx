import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface IntegrationFeature {
  id: number;
  name: string;
  description: string;
  status: string;
}

const IntegrationsAdvancedFeaturesTable: React.FC = () => {
  const [features, setFeatures] = useState<IntegrationFeature[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof IntegrationFeature; direction: 'ascending' | 'descending' } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const response = await axios.get('/api/integrations/features');
        setFeatures(response.data);
      } catch (err) {
        setError('Failed to load features. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchFeatures();
  }, []);

  const sortedFeatures = React.useMemo(() => {
    if (sortConfig !== null) {
      return [...features].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return features;
  }, [features, sortConfig]);

  const requestSort = (key: keyof IntegrationFeature) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleRowClick = (id: number) => {
    navigate(`/integrations/${id}`);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full"><div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status"></div></div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b" onClick={() => requestSort('name')}>Name</th>
            <th className="py-2 px-4 border-b" onClick={() => requestSort('description')}>Description</th>
            <th className="py-2 px-4 border-b" onClick={() => requestSort('status')}>Status</th>
          </tr>
        </thead>
        <tbody>
          {sortedFeatures.map((feature) => (
            <tr key={feature.id} className="hover:bg-gray-100 cursor-pointer" onClick={() => handleRowClick(feature.id)}>
              <td className="py-2 px-4 border-b">{feature.name}</td>
              <td className="py-2 px-4 border-b">{feature.description}</td>
              <td className="py-2 px-4 border-b">{feature.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IntegrationsAdvancedFeaturesTable;