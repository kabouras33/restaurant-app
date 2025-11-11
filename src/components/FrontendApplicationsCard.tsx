import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface Application {
  id: number;
  name: string;
  description: string;
  status: string;
}

interface FrontendApplicationsCardProps {
  application: Application;
  onApplicationUpdate: (updatedApplication: Application) => void;
}

const FrontendApplicationsCard: React.FC<FrontendApplicationsCardProps> = ({ application, onApplicationUpdate }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdateStatus = async (newStatus: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.patch(`/api/applications/${application.id}`, { status: newStatus });
      onApplicationUpdate(response.data);
    } catch (err) {
      setError('Failed to update application status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = () => {
    navigate(`/applications/${application.id}`);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <h2 className="text-xl font-semibold mb-2">{application.name}</h2>
      <p className="text-gray-700 mb-4">{application.description}</p>
      <div className="flex items-center justify-between">
        <span className={`px-2 py-1 rounded-full text-sm ${application.status === 'active' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
          {application.status}
        </span>
        <div className="flex space-x-2">
          <button
            onClick={handleViewDetails}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="View Details"
          >
            View
          </button>
          <button
            onClick={() => handleUpdateStatus(application.status === 'active' ? 'inactive' : 'active')}
            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            aria-label="Toggle Status"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Toggle Status'}
          </button>
        </div>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default FrontendApplicationsCard;