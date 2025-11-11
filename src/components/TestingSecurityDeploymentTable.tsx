import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface TableData {
  id: number;
  name: string;
  status: string;
  lastChecked: string;
}

const TestingSecurityDeploymentTable: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<TableData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof TableData; direction: 'ascending' | 'descending' } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/security-deployment', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setData(response.data);
      } catch (err) {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.token]);

  const sortedData = React.useMemo(() => {
    if (sortConfig !== null) {
      return [...data].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return data;
  }, [data, sortConfig]);

  const requestSort = (key: keyof TableData) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
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
            <th className="px-4 py-2 border-b" onClick={() => requestSort('name')}>
              Name
            </th>
            <th className="px-4 py-2 border-b" onClick={() => requestSort('status')}>
              Status
            </th>
            <th className="px-4 py-2 border-b" onClick={() => requestSort('lastChecked')}>
              Last Checked
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((item) => (
            <tr key={item.id} className="hover:bg-gray-100">
              <td className="px-4 py-2 border-b">{item.name}</td>
              <td className="px-4 py-2 border-b">{item.status}</td>
              <td className="px-4 py-2 border-b">{item.lastChecked}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TestingSecurityDeploymentTable;