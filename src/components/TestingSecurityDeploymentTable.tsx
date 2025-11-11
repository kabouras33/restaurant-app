import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface TableRow {
  id: number;
  name: string;
  status: string;
  lastChecked: string;
}

interface TestingSecurityDeploymentTableProps {
  apiUrl: string;
}

const TestingSecurityDeploymentTable: React.FC<TestingSecurityDeploymentTableProps> = ({ apiUrl }) => {
  const { user } = useAuth();
  const [data, setData] = useState<TableRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof TableRow; direction: 'ascending' | 'descending' } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get<TableRow[]>(`${apiUrl}/testing-security-deployment`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setData(response.data);
      } catch (error) {
        setError('Failed to fetch data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [apiUrl, user.token]);

  const handleSort = (key: keyof TableRow) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig) return data;
    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b" onClick={() => handleSort('name')}>
              Name
            </th>
            <th className="py-2 px-4 border-b" onClick={() => handleSort('status')}>
              Status
            </th>
            <th className="py-2 px-4 border-b" onClick={() => handleSort('lastChecked')}>
              Last Checked
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row) => (
            <tr key={row.id} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b">{row.name}</td>
              <td className="py-2 px-4 border-b">{row.status}</td>
              <td className="py-2 px-4 border-b">{row.lastChecked}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TestingSecurityDeploymentTable;