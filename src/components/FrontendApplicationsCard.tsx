import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Application {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  status: 'active' | 'inactive';
}

interface FrontendApplicationsCardProps {
  application: Application;
  onStatusChange: (id: number, status: 'active' | 'inactive') => void;
}

const FrontendApplicationsCard: React.FC<FrontendApplicationsCardProps> = ({ application, onStatusChange }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleStatusToggle = async () => {
    setLoading(true);
    setError(null);
    try {
      const newStatus = application.status === 'active' ? 'inactive' : 'active';
      await axios.patch(`/api/applications/${application.id}/status`, { status: newStatus });
      onStatusChange(application.id, newStatus);
    } catch (err) {
      setError('Failed to update status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = () => {
    navigate(`/applications/${application.id}`);
  };

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white hover:shadow-xl transition-shadow duration-300">
      <img className="w-full h-48 object-cover" src={application.imageUrl} alt={application.name} />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{application.name}</div>
        <p className="text-gray-700 text-base">{application.description}</p>
      </div>
      <div className="px-6 pt-4 pb-2">
        <button
          onClick={handleViewDetails}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
          aria-label={`View details of ${application.name}`}
        >
          View Details
        </button>
        <button
          onClick={handleStatusToggle}
          className={`font-bold py-2 px-4 rounded ${application.status === 'active' ? 'bg-red-500 hover:bg-red-700' : 'bg-green-500 hover:bg-green-700'} text-white`}
          aria-label={`Toggle status of ${application.name}`}
          disabled={loading}
        >
          {loading ? 'Updating...' : application.status === 'active' ? 'Deactivate' : 'Activate'}
        </button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default FrontendApplicationsCard;