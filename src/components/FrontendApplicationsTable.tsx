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
        const response = await axios.get('/applications', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setApplications(response.data);
      } catch (err) {
        setError('Failed to load applications. Please try again later.');
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
    setApplications((prevApplications) =>
      [...prevApplications].sort((a, b) => {
        if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
        if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
        return 0;
      })
    );
  };

  if (loading) {
    return <div className="animate-pulse text-center py-10">Loading applications...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-10">{error}</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-blue-600 text-white">
            <th className="py-3 px-6 text-left cursor-pointer" onClick={() => sortApplications('name')}>
              Name
            </th>
            <th className="py-3 px-6 text-left cursor-pointer" onClick={() => sortApplications('status')}>
              Status
            </th>
            <th className="py-3 px-6 text-left cursor-pointer" onClick={() => sortApplications('createdAt')}>
              Created At
            </th>
          </tr>
        </thead>
        <tbody>
          {applications.length === 0 ? (
            <tr>
              <td colSpan={3} className="text-center py-10">
                No applications found.
              </td>
            </tr>
          ) : (
            applications.map((app) => (
              <tr key={app.id} className="border-b hover:bg-gray-100">
                <td className="py-3 px-6">{app.name}</td>
                <td className="py-3 px-6">{app.status}</td>
                <td className="py-3 px-6">{new Date(app.createdAt).toLocaleDateString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FrontendApplicationsTable;