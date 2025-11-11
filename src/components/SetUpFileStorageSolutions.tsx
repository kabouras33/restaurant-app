import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface FileStorageProps {
  onSuccess: (message: string) => void;
  onError: (error: string) => void;
}

const SetUpFileStorageSolutions: React.FC<FileStorageProps> = ({ onSuccess, onError }) => {
  const { user } = useAuth();
  const [bucketName, setBucketName] = useState('');
  const [region, setRegion] = useState('');
  const [accessKeyId, setAccessKeyId] = useState('');
  const [secretAccessKey, setSecretAccessKey] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!bucketName || !region || !accessKeyId || !secretAccessKey) {
      onError('All fields are required.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/storage/setup', {
        bucketName,
        region,
        accessKeyId,
        secretAccessKey,
        userId: user?.id,
      });

      if (response.status === 200) {
        onSuccess('AWS S3 setup successfully.');
      } else {
        onError('Failed to set up AWS S3.');
      }
    } catch (error) {
      onError('An error occurred while setting up AWS S3.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 mt-10">
      <h2 className="text-2xl font-bold mb-4">Set Up AWS S3 Storage</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="bucketName" className="block text-sm font-medium text-gray-700">
            Bucket Name
          </label>
          <input
            type="text"
            id="bucketName"
            value={bucketName}
            onChange={(e) => setBucketName(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="region" className="block text-sm font-medium text-gray-700">
            Region
          </label>
          <input
            type="text"
            id="region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="accessKeyId" className="block text-sm font-medium text-gray-700">
            Access Key ID
          </label>
          <input
            type="text"
            id="accessKeyId"
            value={accessKeyId}
            onChange={(e) => setAccessKeyId(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="secretAccessKey" className="block text-sm font-medium text-gray-700">
            Secret Access Key
          </label>
          <input
            type="password"
            id="secretAccessKey"
            value={secretAccessKey}
            onChange={(e) => setSecretAccessKey(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loading ? 'Setting Up...' : 'Set Up Storage'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SetUpFileStorageSolutions;