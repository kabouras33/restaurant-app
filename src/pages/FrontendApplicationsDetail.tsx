import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

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
  const [application, setApplication] = useState<ApplicationDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplicationDetail = async () => {
      try {
        const response = await axios.get(`/api/applications/${id}`);
        setApplication(response.data);
      } catch (err) {
        setError('Failed to load application details.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationDetail();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this application?')) return;

    try {
      await axios.delete(`/api/applications/${id}`);
      alert('Application deleted successfully.');
      navigate('/applications');
    } catch (err) {
      alert('Failed to delete the application.');
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
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{application?.name}</h1>
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Delete
        </button>
      </header>
      <div className="bg-white shadow-md rounded p-4">
        <p><strong>Description:</strong> {application?.description}</p>
        <p><strong>Status:</strong> {application?.status}</p>
        <p><strong>Created At:</strong> {new Date(application?.createdAt || '').toLocaleString()}</p>
        <p><strong>Updated At:</strong> {new Date(application?.updatedAt || '').toLocaleString()}</p>
      </div>
      <footer className="mt-4">
        <button
          onClick={() => navigate('/applications')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Back to Applications
        </button>
      </footer>
    </div>
  );
};

export default FrontendApplicationsDetail;