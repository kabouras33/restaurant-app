import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Application {
  id: number;
  name: string;
  email: string;
  status: string;
}

const FrontendApplicationsList: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/applications?page=${currentPage}&search=${searchTerm}`);
        setApplications(response.data.applications);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        setError('Failed to load applications. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [currentPage, searchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/applications/${id}`);
      setApplications(applications.filter(app => app.id !== id));
    } catch (err) {
      setError('Failed to delete application. Please try again.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Frontend Applications</h1>
      <input
        type="text"
        placeholder="Search applications..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="border p-2 mb-4 w-full"
      />
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">Name</th>
              <th className="py-2">Email</th>
              <th className="py-2">Status</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map(app => (
              <tr key={app.id}>
                <td className="border px-4 py-2">{app.name}</td>
                <td className="border px-4 py-2">{app.email}</td>
                <td className="border px-4 py-2">{app.status}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => navigate(`/applications/edit/${app.id}`)}
                    className="bg-blue-500 text-white px-2 py-1 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(app.id)}
                    className="bg-red-500 text-white px-2 py-1"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-gray-300 px-4 py-2"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="bg-gray-300 px-4 py-2"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default FrontendApplicationsList;