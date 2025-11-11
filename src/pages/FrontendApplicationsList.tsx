import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface Application {
  id: number;
  name: string;
  status: string;
  created_at: string;
}

const FrontendApplicationsList: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchApplications();
  }, [user, currentPage, searchTerm]);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/applications', {
        params: { page: currentPage, search: searchTerm },
      });
      setApplications(response.data.applications);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError('Failed to load applications.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="flex justify-between items-center bg-white p-4 shadow-md">
        <h1 className="text-xl font-bold">Frontend Applications</h1>
        <button onClick={handleLogout} className="text-red-500">Logout</button>
      </header>
      <main className="mt-4">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search applications..."
            value={searchTerm}
            onChange={handleSearch}
            className="p-2 border border-gray-300 rounded w-full"
          />
        </div>
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2">Name</th>
                <th className="py-2">Status</th>
                <th className="py-2">Created At</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id} className="text-center">
                  <td className="py-2">{app.name}</td>
                  <td className="py-2">{app.status}</td>
                  <td className="py-2">{new Date(app.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className="flex justify-center mt-4">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`px-4 py-2 mx-1 ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </main>
      <footer className="mt-4 text-center text-gray-500">
        &copy; 2023 Restaurant App
      </footer>
    </div>
  );
};

export default FrontendApplicationsList;