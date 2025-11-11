import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Integration {
  id: number;
  name: string;
  description: string;
  status: string;
}

const IntegrationsAdvancedFeaturesList: React.FC = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchIntegrations = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/integrations');
        setIntegrations(response.data);
      } catch (err) {
        setError('Failed to load integrations');
      } finally {
        setLoading(false);
      }
    };
    fetchIntegrations();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredIntegrations = integrations.filter(integration =>
    integration.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentIntegrations = filteredIntegrations.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredIntegrations.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleEdit = (id: number) => {
    navigate(`/integrations/edit/${id}`);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/api/integrations/${id}`);
      setIntegrations(integrations.filter(integration => integration.id !== id));
    } catch (err) {
      setError('Failed to delete integration');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Integrations & Advanced Features</h1>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="border p-2 mb-4 w-full"
      />
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <>
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2">Name</th>
                <th className="py-2">Description</th>
                <th className="py-2">Status</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentIntegrations.map(integration => (
                <tr key={integration.id}>
                  <td className="border px-4 py-2">{integration.name}</td>
                  <td className="border px-4 py-2">{integration.description}</td>
                  <td className="border px-4 py-2">{integration.status}</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleEdit(integration.id)}
                      className="bg-blue-500 text-white px-2 py-1 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(integration.id)}
                      className="bg-red-500 text-white px-2 py-1"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center mt-4">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={`px-3 py-1 mx-1 ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default IntegrationsAdvancedFeaturesList;