import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface FileStorageProps {
  onSuccess: () => void;
  onError: (message: string) => void;
}

const SetUpFileStorageSolutions: React.FC<FileStorageProps> = ({ onSuccess, onError }) => {
  const [bucketName, setBucketName] = useState('');
  const [accessKeyId, setAccessKeyId] = useState('');
  const [secretAccessKey, setSecretAccessKey] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://ai-codepeak.com/api',
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bucketName || !accessKeyId || !secretAccessKey) {
      onError('All fields are required.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/setup-file-storage', { bucketName, accessKeyId, secretAccessKey });
      onSuccess();
      navigate('/dashboard');
    } catch (error) {
      onError('Failed to set up file storage. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-xl rounded-lg mt-10">
      <h2 className="text-2xl font-bold text-center mb-6">Set Up File Storage Solutions</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="bucketName" className="block text-sm font-medium text-gray-700">Bucket Name</label>
          <input
            type="text"
            id="bucketName"
            value={bucketName}
            onChange={(e) => setBucketName(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="accessKeyId" className="block text-sm font-medium text-gray-700">Access Key ID</label>
          <input
            type="text"
            id="accessKeyId"
            value={accessKeyId}
            onChange={(e) => setAccessKeyId(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="secretAccessKey" className="block text-sm font-medium text-gray-700">Secret Access Key</label>
          <input
            type="password"
            id="secretAccessKey"
            value={secretAccessKey}
            onChange={(e) => setSecretAccessKey(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Setting Up...' : 'Set Up Storage'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SetUpFileStorageSolutions;