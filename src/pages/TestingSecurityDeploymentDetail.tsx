import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface DeploymentDetail {
  id: number;
  name: string;
  status: string;
  lastTested: string;
  securityLevel: string;
}

const TestingSecurityDeploymentDetail: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [deploymentDetail, setDeploymentDetail] = useState<DeploymentDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchDeploymentDetail = async () => {
      try {
        const response = await axios.get<DeploymentDetail>('/api/deployment/detail');
        setDeploymentDetail(response.data);
      } catch (err) {
        setError('Failed to load deployment details.');
      } finally {
        setLoading(false);
      }
    };

    fetchDeploymentDetail();
  }, [user, navigate]);

  const handleUpdate = async (updatedDetail: DeploymentDetail) => {
    try {
      setLoading(true);
      await axios.put(`/api/deployment/${updatedDetail.id}`, updatedDetail);
      setDeploymentDetail(updatedDetail);
      alert('Deployment details updated successfully.');
    } catch (err) {
      setError('Failed to update deployment details.');
    } finally {
      setLoading(false);
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
      <h1 className="text-2xl font-bold mb-4">Deployment Detail</h1>
      {deploymentDetail && (
        <div className="bg-white shadow-md rounded p-4">
          <div className="mb-4">
            <label className="block text-gray-700">Name:</label>
            <input
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded p-2"
              value={deploymentDetail.name}
              onChange={(e) => setDeploymentDetail({ ...deploymentDetail, name: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Status:</label>
            <input
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded p-2"
              value={deploymentDetail.status}
              onChange={(e) => setDeploymentDetail({ ...deploymentDetail, status: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Last Tested:</label>
            <input
              type="date"
              className="mt-1 block w-full border border-gray-300 rounded p-2"
              value={deploymentDetail.lastTested}
              onChange={(e) => setDeploymentDetail({ ...deploymentDetail, lastTested: e.target.value })}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Security Level:</label>
            <input
              type="text"
              className="mt-1 block w-full border border-gray-300 rounded p-2"
              value={deploymentDetail.securityLevel}
              onChange={(e) => setDeploymentDetail({ ...deploymentDetail, securityLevel: e.target.value })}
              required
            />
          </div>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => handleUpdate(deploymentDetail)}
          >
            Update
          </button>
        </div>
      )}
    </div>
  );
};

export default TestingSecurityDeploymentDetail;