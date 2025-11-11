import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface Application {
  id: number;
  name: string;
  status: string;
  createdAt: string;
}

const FrontendApplicationsTable: React.FC = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Application; direction: 'ascending' | 'descending' } | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get('/api/applications', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setApplications(response.data);
      } catch (err) {
        setError('Failed to load applications');
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [user]);

  const sortedApplications = React.useMemo(() => {
    if (sortConfig !== null) {
      return [...applications].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return applications;
  }, [applications, sortConfig]);

  const requestSort = (key: keyof Application) => {
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
            <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              <button type="button" onClick={() => requestSort('name')} className="focus:outline-none">
                Name
              </button>
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              <button type="button" onClick={() => requestSort('status')} className="focus:outline-none">
                Status
              </button>
            </th>
            <th className="px-6 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              <button type="button" onClick={() => requestSort('createdAt')} className="focus:outline-none">
                Created At
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedApplications.map((application) => (
            <tr key={application.id} className="hover:bg-gray-100">
              <td className="px-6 py-4 border-b border-gray-200">{application.name}</td>
              <td className="px-6 py-4 border-b border-gray-200">{application.status}</td>
              <td className="px-6 py-4 border-b border-gray-200">{new Date(application.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FrontendApplicationsTable;