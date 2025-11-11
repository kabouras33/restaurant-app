import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface ConfigureCDNandLoadBalancingProps {
  onSuccess: () => void;
}

const ConfigureCDNandLoadBalancing: React.FC<ConfigureCDNandLoadBalancingProps> = ({ onSuccess }) => {
  const [cdnProvider, setCdnProvider] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!cdnProvider || !apiKey) {
      setError('All fields are required.');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('/api/configure-cdn', { cdnProvider, apiKey });
      if (response.status === 200) {
        onSuccess();
        navigate('/dashboard');
      } else {
        setError('Failed to configure CDN and Load Balancing.');
      }
    } catch (err) {
      setError('An error occurred while configuring CDN and Load Balancing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Configure CDN and Load Balancing</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-4">
          <label htmlFor="cdnProvider" className="block text-sm font-medium text-gray-700">
            CDN Provider
          </label>
          <select
            id="cdnProvider"
            value={cdnProvider}
            onChange={(e) => setCdnProvider(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Select a provider</option>
            <option value="cloudflare">Cloudflare</option>
            <option value="aws">AWS</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">
            API Key
          </label>
          <input
            type="text"
            id="apiKey"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loading ? 'Configuring...' : 'Configure'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConfigureCDNandLoadBalancing;