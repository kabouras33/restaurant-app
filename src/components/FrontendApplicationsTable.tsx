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
  const [sortConfig, setSortConfig] = useState<{ key: keyof Application; direction: 'asc' | 'desc' } | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/applications', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setApplications(response.data);
      } catch (err) {
        setError('Failed to load applications.');
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [user.token]);

  const sortApplications = (key: keyof Application) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    const sortedApplications = [...applications].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setApplications(sortedApplications);
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
            <th
              className="py-2 px-4 border-b cursor-pointer"
              onClick={() => sortApplications('name')}
              aria-sort={sortConfig?.key === 'name' ? sortConfig.direction : 'none'}
            >
              Name
            </th>
            <th
              className="py-2 px-4 border-b cursor-pointer"
              onClick={() => sortApplications('status')}
              aria-sort={sortConfig?.key === 'status' ? sortConfig.direction : 'none'}
            >
              Status
            </th>
            <th
              className="py-2 px-4 border-b cursor-pointer"
              onClick={() => sortApplications('createdAt')}
              aria-sort={sortConfig?.key === 'createdAt' ? sortConfig.direction : 'none'}
            >
              Created At
            </th>
          </tr>
        </thead>
        <tbody>
          {applications.map((application) => (
            <tr key={application.id} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b">{application.name}</td>
              <td className="py-2 px-4 border-b">{application.status}</td>
              <td className="py-2 px-4 border-b">{new Date(application.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FrontendApplicationsTable;