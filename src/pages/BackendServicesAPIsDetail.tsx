import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface ApiDetail {
  id: string;
  name: string;
  description: string;
  endpoint: string;
  method: string;
  createdAt: string;
  updatedAt: string;
}

const BackendServicesAPIsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [apiDetail, setApiDetail] = useState<ApiDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchApiDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/backend-services/${id}`);
        setApiDetail(response.data);
      } catch (err) {
        setError('Failed to load API details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchApiDetail();
  }, [id, user, navigate]);

  const handleDelete = async () => {
    if (!apiDetail) return;

    try {
      await axios.delete(`/api/backend-services/${apiDetail.id}`);
      navigate('/backend-services');
    } catch (err) {
      setError('Failed to delete API. Please try again later.');
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
      <h1 className="text-2xl font-bold mb-4">API Detail</h1>
      {apiDetail && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold">{apiDetail.name}</h2>
          <p className="text-gray-700 mt-2">{apiDetail.description}</p>
          <div className="mt-4">
            <span className="font-medium">Endpoint:</span> {apiDetail.endpoint}
          </div>
          <div className="mt-2">
            <span className="font-medium">Method:</span> {apiDetail.method}
          </div>
          <div className="mt-2">
            <span className="font-medium">Created At:</span> {new Date(apiDetail.createdAt).toLocaleString()}
          </div>
          <div className="mt-2">
            <span className="font-medium">Updated At:</span> {new Date(apiDetail.updatedAt).toLocaleString()}
          </div>
          <div className="flex justify-end mt-6">
            <button
              onClick={() => navigate(`/backend-services/edit/${apiDetail.id}`)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded-md"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BackendServicesAPIsDetail;