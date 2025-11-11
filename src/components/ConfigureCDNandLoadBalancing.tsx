import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface CDNConfigProps {
  onSuccess: () => void;
  onError: (message: string) => void;
}

const ConfigureCDNandLoadBalancing: React.FC<CDNConfigProps> = ({ onSuccess, onError }) => {
  const [loading, setLoading] = useState(false);
  const [cdnProvider, setCdnProvider] = useState<string>('');
  const [apiKey, setApiKey] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://ai-codepeak.com/api',
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' }
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!cdnProvider || !apiKey) {
      setError('All fields are required.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/configure-cdn', { cdnProvider, apiKey });
      if (response.status === 200) {
        onSuccess();
        navigate('/dashboard');
      }
    } catch (err) {
      onError('Failed to configure CDN and Load Balancing.');
      setError('Failed to configure CDN and Load Balancing.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'Configure CDN & Load Balancing';
  }, []);

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-xl rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Configure CDN & Load Balancing</h1>
      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-4">
          <label htmlFor="cdnProvider" className="block text-sm font-medium text-gray-700">
            CDN Provider
          </label>
          <input
            type="text"
            id="cdnProvider"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={cdnProvider}
            onChange={(e) => setCdnProvider(e.target.value)}
            required
            aria-required="true"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">
            API Key
          </label>
          <input
            type="password"
            id="apiKey"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            required
            aria-required="true"
          />
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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