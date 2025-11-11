import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface IntegrationFeature {
  id: number;
  name: string;
  description: string;
  status: string;
}

const IntegrationsAdvancedFeaturesTable: React.FC = () => {
  const { user } = useAuth();
  const [features, setFeatures] = useState<IntegrationFeature[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof IntegrationFeature; direction: 'ascending' | 'descending' } | null>(null);

  useEffect(() => {
    const fetchFeatures = async () => {
      try {
        const response = await axios.get('/api/integrations', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setFeatures(response.data);
      } catch (err) {
        setError('Failed to load features');
      } finally {
        setLoading(false);
      }
    };
    fetchFeatures();
  }, [user.token]);

  const handleSort = (key: keyof IntegrationFeature) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedFeatures = React.useMemo(() => {
    if (!sortConfig) return features;
    return [...features].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }, [features, sortConfig]);

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b" onClick={() => handleSort('name')}>
              Name
            </th>
            <th className="py-2 px-4 border-b" onClick={() => handleSort('description')}>
              Description
            </th>
            <th className="py-2 px-4 border-b" onClick={() => handleSort('status')}>
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedFeatures.map((feature) => (
            <tr key={feature.id} className="hover:bg-gray-100">
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