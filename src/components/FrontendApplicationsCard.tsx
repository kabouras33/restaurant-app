import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface Application {
  id: number;
  name: string;
  description: string;
  status: 'active' | 'inactive';
}

interface FrontendApplicationsCardProps {
  application: Application;
  onUpdate: (updatedApp: Application) => void;
}

const FrontendApplicationsCard: React.FC<FrontendApplicationsCardProps> = ({ application, onUpdate }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggleStatus = async () => {
    if (!user) {
      setError('You must be logged in to update the application status.');
      return;
    }

    setIsUpdating(true);
    setError(null);

    try {
      const response = await axios.patch(`/api/applications/${application.id}`, {
        status: application.status === 'active' ? 'inactive' : 'active',
      });

      onUpdate(response.data);
    } catch (err) {
      setError('Failed to update application status. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <h3 className="text-lg font-semibold">{application.name}</h3>
      <p className="text-gray-600">{application.description}</p>
      <div className="flex items-center justify-between mt-4">
        <span className={`text-sm ${application.status === 'active' ? 'text-green-500' : 'text-red-500'}`}>
          {application.status === 'active' ? 'Active' : 'Inactive'}
        </span>
        <button
          onClick={handleToggleStatus}
          disabled={isUpdating}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
          aria-label={`Toggle status for ${application.name}`}
        >
          {isUpdating ? 'Updating...' : 'Toggle Status'}
        </button>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default FrontendApplicationsCard;