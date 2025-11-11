import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface SetUpFileStorageSolutionsProps {
  onSuccess: (message: string) => void;
  onError: (error: string) => void;
}

const SetUpFileStorageSolutions: React.FC<SetUpFileStorageSolutionsProps> = ({ onSuccess, onError }) => {
  const { user } = useAuth();
  const [bucketName, setBucketName] = useState('');
  const [region, setRegion] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!bucketName || !region) {
      onError('Bucket name and region are required.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/setup-s3', {
        bucketName,
        region,
        userId: user?.id,
      });

      if (response.status === 200) {
        onSuccess('S3 bucket configured successfully.');
      } else {
        onError('Failed to configure S3 bucket.');
      }
    } catch (error) {
      onError('An error occurred while configuring S3 bucket.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Set Up File Storage Solutions</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-4">
          <label htmlFor="bucketName" className="block text-sm font-medium text-gray-700">
            Bucket Name
          </label>
          <input
            type="text"
            id="bucketName"
            name="bucketName"
            value={bucketName}
            onChange={(e) => setBucketName(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="region" className="block text-sm font-medium text-gray-700">
            Region
          </label>
          <input
            type="text"
            id="region"
            name="region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
              loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
          >
            {loading ? 'Configuring...' : 'Configure S3'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SetUpFileStorageSolutions;