import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface ApplicationDetail {
  id: string;
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
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
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
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      navigate('/applications');
    } catch (err) {
      setError('Failed to delete the application. Please try again later.');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center mt-4">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Application Details</h1>
      {application && (
        <div className="bg-white shadow-md rounded p-6">
          <h2 className="text-xl font-semibold mb-2">{application.name}</h2>
          <p className="text-gray-700 mb-4">{application.description}</p>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Status: {application.status}</span>
            <span className="text-sm text-gray-500">Created: {new Date(application.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={() => navigate(`/applications/edit/${application.id}`)}
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2 hover:bg-blue-600"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
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