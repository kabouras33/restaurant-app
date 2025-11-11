import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface CDNConfig {
  provider: 'Cloudflare' | 'AWS';
  apiKey: string;
  loadBalancer: boolean;
}

const ConfigureCDNandLoadBalancing: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [config, setConfig] = useState<CDNConfig>({
    provider: 'Cloudflare',
    apiKey: '',
    loadBalancer: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setConfig((prevConfig) => ({
      ...prevConfig,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config.apiKey) {
      setError('API Key is required.');
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await axios.post('/api/configure-cdn', config, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setSuccess('CDN and Load Balancing configured successfully.');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError('Failed to configure CDN and Load Balancing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Configure CDN and Load Balancing</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="provider" className="block text-sm font-medium text-gray-700">
            CDN Provider
          </label>
          <select
            id="provider"
            name="provider"
            value={config.provider}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          >
            <option value="Cloudflare">Cloudflare</option>
            <option value="AWS">AWS</option>
          </select>
        </div>
        <div>
          <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">
            API Key
          </label>
          <input
            type="text"
            id="apiKey"
            name="apiKey"
            value={config.apiKey}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="loadBalancer"
            name="loadBalancer"
            checked={config.loadBalancer}
            onChange={handleChange}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="loadBalancer" className="ml-2 block text-sm text-gray-900">
            Enable Load Balancer
          </label>
        </div>
        <div>
          <button
            type="submit"
            className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={loading}
          >
            {loading ? 'Configuring...' : 'Configure'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConfigureCDNandLoadBalancing;