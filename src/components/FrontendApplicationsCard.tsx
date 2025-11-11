import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface Application {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
}

interface FrontendApplicationsCardProps {
  application: Application;
  onUpdate: (app: Application) => void;
  onDelete: (id: string) => void;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://ai-codepeak.com/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

const FrontendApplicationsCard: React.FC<FrontendApplicationsCardProps> = ({ application, onUpdate, onDelete }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateStatus = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`/applications/${application.id}`, {
        status: application.status === 'active' ? 'inactive' : 'active'
      });
      onUpdate(response.data);
    } catch (err) {
      setError('Failed to update application status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this application?')) return;
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/applications/${application.id}`);
      onDelete(application.id);
    } catch (err) {
      setError('Failed to delete application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-4 transition-transform transform hover:scale-105">
      <h3 className="text-xl font-semibold mb-2">{application.name}</h3>
      <p className="text-gray-700 mb-4">{application.description}</p>
      <div className="flex items-center justify-between">
        <button
          onClick={handleUpdateStatus}
          className={`px-4 py-2 rounded text-white ${
            application.status === 'active' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
          }`}
          disabled={loading}
          aria-label={`Toggle status of ${application.name}`}
        >
          {loading ? 'Processing...' : application.status === 'active' ? 'Deactivate' : 'Activate'}
        </button>
        <button
          onClick={handleDelete}
          className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white"
          disabled={loading}
          aria-label={`Delete ${application.name}`}
        >
          {loading ? 'Deleting...' : 'Delete'}
        </button>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default FrontendApplicationsCard;