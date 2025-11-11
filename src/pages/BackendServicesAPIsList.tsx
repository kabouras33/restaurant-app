import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ApiService {
  id: number;
  name: string;
  description: string;
  status: string;
}

const BackendServicesAPIsList: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState<ApiService[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchServices();
    }
  }, [user, currentPage, search]);

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/services', {
        params: {
          page: currentPage,
          search,
          limit: itemsPerPage,
        },
      });
      setServices(response.data.services);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      setError('Failed to load services. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Backend Services & APIs</h1>
        <button onClick={handleLogout} className="text-red-500">Logout</button>
      </header>
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search services..."
          className="border p-2 w-full"
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
              <th className="py-2">Description</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {services.map(service => (
              <tr key={service.id}>
                <td className="border px-4 py-2">{service.name}</td>
                <td className="border px-4 py-2">{service.description}</td>
                <td className="border px-4 py-2">{service.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 disabled:bg-gray-200"
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 disabled:bg-gray-200"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BackendServicesAPIsList;