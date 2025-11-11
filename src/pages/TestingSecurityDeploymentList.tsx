import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Deployment {
  id: number;
  name: string;
  status: string;
  createdAt: string;
}

const TestingSecurityDeploymentList: React.FC = () => {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDeployments = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/deployments', {
          params: { page: currentPage, search: searchTerm },
        });
        setDeployments(response.data.deployments);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        setError('Failed to load deployments');
      } finally {
        setLoading(false);
      }
    };
    fetchDeployments();
  }, [currentPage, searchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    setCurrentPage(1);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Testing, Security & Deployment</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search deployments..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="border p-2 rounded w-full"
          aria-label="Search deployments"
        />
      </div>
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">
          {error} <button onClick={handleRetry} className="text-blue-500">Retry</button>
        </div>
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
            {deployments.map((deployment) => (
              <tr key={deployment.id} className="text-center">
                <td className="py-2">{deployment.name}</td>
                <td className="py-2">{deployment.status}</td>
                <td className="py-2">{new Date(deployment.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="flex justify-between mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TestingSecurityDeploymentList;