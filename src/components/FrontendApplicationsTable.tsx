import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Application {
  id: number;
  name: string;
  email: string;
  status: string;
  createdAt: string;
}

interface FrontendApplicationsTableProps {
  apiUrl: string;
}

const FrontendApplicationsTable: React.FC<FrontendApplicationsTableProps> = ({ apiUrl }) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Application; direction: 'ascending' | 'descending' } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get<Application[]>(apiUrl);
        setApplications(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load applications. Please try again later.');
        setLoading(false);
      }
    };
    fetchApplications();
  }, [apiUrl]);

  const handleSort = (key: keyof Application) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedApplications = React.useMemo(() => {
    if (!sortConfig) return applications;
    return [...applications].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
  }, [applications, sortConfig]);

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">{error}</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b" onClick={() => handleSort('name')}>Name</th>
            <th className="py-2 px-4 border-b" onClick={() => handleSort('email')}>Email</th>
            <th className="py-2 px-4 border-b" onClick={() => handleSort('status')}>Status</th>
            <th className="py-2 px-4 border-b" onClick={() => handleSort('createdAt')}>Created At</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedApplications.map((application) => (
            <tr key={application.id} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b">{application.name}</td>
              <td className="py-2 px-4 border-b">{application.email}</td>
              <td className="py-2 px-4 border-b">{application.status}</td>
              <td className="py-2 px-4 border-b">{new Date(application.createdAt).toLocaleDateString()}</td>
              <td className="py-2 px-4 border-b">
                <button
                  className="text-blue-500 hover:underline"
                  onClick={() => navigate(`/applications/${application.id}`)}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FrontendApplicationsTable;