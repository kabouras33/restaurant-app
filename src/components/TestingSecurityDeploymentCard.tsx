import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface TestingSecurityDeploymentCardProps {
  title: string;
  description: string;
  apiEndpoint: string;
}

const TestingSecurityDeploymentCard: React.FC<TestingSecurityDeploymentCardProps> = ({ title, description, apiEndpoint }) => {
  const { user } = useAuth();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(apiEndpoint, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        setData(response.data);
      } catch (err) {
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiEndpoint, user]);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="loader">Loading...</div></div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-4">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>
      <div className="px-6 py-4">
        <ul className="list-disc list-inside">
          {data.map((item, index) => (
            <li key={index} className="text-gray-700">{item.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TestingSecurityDeploymentCard;