import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface ApiDetail {
  id: string;
  name: string;
  description: string;
  endpoint: string;
  method: string;
  createdAt: string;
}

const BackendServicesAPIsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [apiDetail, setApiDetail] = useState<ApiDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApiDetail = async () => {
      try {
        const response = await axios.get(`/api/backend-services/${id}`);
        setApiDetail(response.data);
      } catch (err) {
        setError('Failed to load API details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchApiDetail();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this API?')) {
      try {
        await axios.delete(`/api/backend-services/${id}`);
        navigate('/dashboard');
      } catch (err) {
        setError('Failed to delete the API. Please try again later.');
      }
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
      <header className="mb-4">
        <h1 className="text-2xl font-bold">{apiDetail?.name}</h1>
        <p className="text-gray-600">{apiDetail?.description}</p>
      </header>
      <div className="bg-white shadow-md rounded-lg p-6 mb-4">
        <h2 className="text-xl font-semibold mb-2">API Details</h2>
        <div className="mb-2">
          <strong>Endpoint:</strong> {apiDetail?.endpoint}
        </div>
        <div className="mb-2">
          <strong>Method:</strong> {apiDetail?.method}
        </div>
        <div className="mb-2">
          <strong>Created At:</strong> {new Date(apiDetail?.createdAt || '').toLocaleDateString()}
        </div>
      </div>
      <div className="flex justify-between">
        <button
          onClick={() => navigate(`/dashboard/edit/${id}`)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
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
  );
};

export default BackendServicesAPIsDetail;