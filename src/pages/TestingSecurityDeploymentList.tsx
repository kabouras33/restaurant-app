import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface Deployment {
  id: number;
  name: string;
  status: string;
  createdAt: string;
}

const TestingSecurityDeploymentList: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://ai-codepeak.com/api',
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' }
  });

  useEffect(() => {
    const fetchDeployments = async () => {
      try {
        setLoading(true);
        const response = await api.get('/deployments', {
          params: { page: currentPage, search: searchTerm }
        });
        setDeployments(response.data.deployments);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        setError('Failed to load deployments. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchDeployments();
  }, [currentPage, searchTerm]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this deployment?')) return;
    try {
      await api.delete(`/deployments/${id}`);
      setDeployments(deployments.filter(deployment => deployment.id !== id));
      alert('Deployment deleted successfully.');
    } catch {
      alert('Failed to delete deployment. Please try again.');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) return <div className="animate-pulse">Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Testing, Security & Deployment</h1>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearch}
        className="mb-4 p-2 border rounded w-full"
      />
      <table className="min-w-full bg-white shadow-md rounded">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Created At</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {deployments.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center py-4">
                No deployments found.
              </td>
            </tr>
          ) : (
            deployments.map(deployment => (
              <tr key={deployment.id}>
                <td className="py-2 px-4 border-b">{deployment.name}</td>
                <td className="py-2 px-4 border-b">{deployment.status}</td>
                <td className="py-2 px-4 border-b">{new Date(deployment.createdAt).toLocaleDateString()}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => navigate(`/deployments/${deployment.id}`)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(deployment.id)}
                    className="bg-red-500 text-white px-4 py-2 ml-2 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div className="flex justify-between mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TestingSecurityDeploymentList;