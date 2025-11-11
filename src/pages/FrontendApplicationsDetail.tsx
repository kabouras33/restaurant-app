import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface ApplicationDetail {
  id: number;
  name: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const FrontendApplicationsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [application, setApplication] = useState<ApplicationDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplicationDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/applications/${id}`, {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        setApplication(response.data);
      } catch (err) {
        setError('Failed to load application details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationDetail();
  }, [id, user]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this application?')) return;

    try {
      await axios.delete(`/api/applications/${id}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      navigate('/applications');
    } catch (err) {
      setError('Failed to delete application. Please try again later.');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center mt-4">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Application Details</h1>
      {application && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold">{application.name}</h2>
          <p className="text-gray-700 mt-2">{application.description}</p>
          <div className="mt-4">
            <span className="text-sm text-gray-500">Status: </span>
            <span className={`text-sm font-medium ${application.status === 'active' ? 'text-green-500' : 'text-red-500'}`}>
              {application.status}
            </span>
          </div>
          <div className="mt-4">
            <button
              onClick={() => navigate(`/applications/edit/${application.id}`)}
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FrontendApplicationsDetail;