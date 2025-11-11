import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface Deployment {
  id: number;
  name: string;
  status: string;
  date: string;
}

interface Props {
  deployments: Deployment[];
}

const TestingSecurityDeploymentTable: React.FC<Props> = ({ deployments }) => {
  const [sortedDeployments, setSortedDeployments] = useState<Deployment[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    setSortedDeployments(deployments);
  }, [deployments]);

  const handleSort = (key: keyof Deployment) => {
    const order = sortOrder === 'asc' ? 'desc' : 'asc';
    const sorted = [...sortedDeployments].sort((a, b) => {
      if (a[key] < b[key]) return order === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return order === 'asc' ? 1 : -1;
      return 0;
    });
    setSortedDeployments(sorted);
    setSortOrder(order);
  };

  const fetchDeployments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/deployments');
      setSortedDeployments(response.data);
    } catch (err) {
      setError('Failed to fetch deployments. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeployments();
  }, []);

  if (!user) {
    return <div className="text-center text-red-500">Unauthorized access. Please log in.</div>;
  }

  return (
    <div className="p-4">
      {loading ? (
        <div className="animate-pulse">Loading deployments...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gradient-to-r from-blue-500 to-blue-700 text-white">
            <tr>
              <th className="py-3 px-6 text-left cursor-pointer" onClick={() => handleSort('name')}>
                Name
              </th>
              <th className="py-3 px-6 text-left cursor-pointer" onClick={() => handleSort('status')}>
                Status
              </th>
              <th className="py-3 px-6 text-left cursor-pointer" onClick={() => handleSort('date')}>
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedDeployments.map((deployment) => (
              <tr key={deployment.id} className="border-b hover:bg-gray-100">
                <td className="py-3 px-6">{deployment.name}</td>
                <td className="py-3 px-6">{deployment.status}</td>
                <td className="py-3 px-6">{new Date(deployment.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TestingSecurityDeploymentTable;