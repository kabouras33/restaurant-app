import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface CDNConfigFormProps {
  onSuccess: () => void;
}

const ConfigureCDNandLoadBalancing: React.FC<CDNConfigFormProps> = ({ onSuccess }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cdnProvider, setCdnProvider] = useState<string>('Cloudflare');
  const [apiKey, setApiKey] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!apiKey) {
      setError('API Key is required.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/configure-cdn', {
        provider: cdnProvider,
        apiKey,
        userId: user.id,
      });
      if (response.status === 200) {
        onSuccess();
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Failed to configure CDN. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Configure CDN and Load Balancing</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="cdnProvider" className="block text-sm font-medium text-gray-700">
            CDN Provider
          </label>
          <select
            id="cdnProvider"
            value={cdnProvider}
            onChange={(e) => setCdnProvider(e.target.value)}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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