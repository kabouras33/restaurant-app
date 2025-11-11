import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface Integration {
  id: number;
  name: string;
  description: string;
  enabled: boolean;
}

const IntegrationsAdvancedFeaturesList: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [integrations, setIntegrations] = useState<Integration[]>([]);
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
    const fetchIntegrations = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/integrations`, {
          params: { page: currentPage, search: searchTerm }
        });
        setIntegrations(response.data.integrations);
        setTotalPages(response.data.totalPages);
        setError(null);
      } catch (err) {
        setError('Failed to load integrations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchIntegrations();
  }, [currentPage, searchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEnableToggle = async (id: number, enabled: boolean) => {
    try {
      await api.patch(`/integrations/${id}`, { enabled: !enabled });
      setIntegrations(integrations.map(integration => 
        integration.id === id ? { ...integration, enabled: !enabled } : integration
      ));
    } catch {
      setError('Failed to update integration status.');
    }
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Integrations & Advanced Features</h1>
      {error && <div className="bg-red-500 text-white p-2 rounded mb-4">{error}</div>}
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search integrations..."
        className="border p-2 rounded w-full mb-4"
        aria-label="Search integrations"
      />
      {loading ? (
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded mb-2"></div>
          <div className="h-6 bg-gray-300 rounded mb-2"></div>
          <div className="h-6 bg-gray-300 rounded mb-2"></div>
        </div>
      ) : (
        <table className="w-full bg-white shadow rounded">
          <thead>
            <tr>
              <th className="border-b p-2 text-left">Name</th>
              <th className="border-b p-2 text-left">Description</th>
              <th className="border-b p-2 text-left">Status</th>
              <th className="border-b p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {integrations.map(integration => (
              <tr key={integration.id}>
                <td className="border-b p-2">{integration.name}</td>
                <td className="border-b p-2">{integration.description}</td>
                <td className="border-b p-2">{integration.enabled ? 'Enabled' : 'Disabled'}</td>
                <td className="border-b p-2">
                  <button
                    onClick={() => handleEnableToggle(integration.id, integration.enabled)}
                    className={`p-2 rounded ${integration.enabled ? 'bg-red-500' : 'bg-green-500'} text-white`}
                  >
                    {integration.enabled ? 'Disable' : 'Enable'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default IntegrationsAdvancedFeaturesList;