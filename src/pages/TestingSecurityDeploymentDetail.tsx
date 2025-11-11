import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface SecurityDetail {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

const TestingSecurityDeploymentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [securityDetail, setSecurityDetail] = useState<SecurityDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSecurityDetail = async () => {
      try {
        const response = await axios.get(`/api/security/${id}`);
        setSecurityDetail(response.data);
      } catch (err) {
        setError('Failed to load security detail.');
      } finally {
        setLoading(false);
      }
    };

    fetchSecurityDetail();
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/security/${id}`);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to delete security detail.');
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
        <h1 className="text-2xl font-bold">{securityDetail?.name}</h1>
        <p className="text-gray-600">{securityDetail?.description}</p>
      </header>
      <div className="mb-4">
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
      <footer className="mt-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Back to Dashboard
        </button>
      </footer>
    </div>
  );
};

export default TestingSecurityDeploymentDetail;