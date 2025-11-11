import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface DeploymentDetail {
  id: string;
  name: string;
  status: string;
  lastUpdated: string;
  description: string;
}

const TestingSecurityDeploymentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [deploymentDetail, setDeploymentDetail] = useState<DeploymentDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeploymentDetail = async () => {
      try {
        const response = await axios.get(`/api/deployments/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setDeploymentDetail(response.data);
      } catch (err) {
        setError('Failed to fetch deployment details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDeploymentDetail();
  }, [id, user.token]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this deployment?')) return;

    try {
      await axios.delete(`/api/deployments/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      navigate('/deployments');
    } catch (err) {
      setError('Failed to delete deployment. Please try again later.');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Deployment Detail</h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </header>
      {deploymentDetail && (
        <div className="bg-white shadow-md rounded p-6">
          <h2 className="text-xl font-semibold mb-2">{deploymentDetail.name}</h2>
          <p className="text-gray-700 mb-4">{deploymentDetail.description}</p>
          <div className="flex justify-between items-center">
            <span className={`px-2 py-1 rounded ${deploymentDetail.status === 'active' ? 'bg-green-200' : 'bg-red-200'}`}>
              {deploymentDetail.status}
            </span>
            <span className="text-sm text-gray-500">Last Updated: {new Date(deploymentDetail.lastUpdated).toLocaleDateString()}</span>
          </div>
          <div className="mt-4 flex justify-end">
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

export default TestingSecurityDeploymentDetail;