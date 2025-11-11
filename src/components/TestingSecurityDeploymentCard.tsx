import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface TestingSecurityDeploymentCardProps {
  title: string;
  description: string;
  apiEndpoint: string;
}

const TestingSecurityDeploymentCard: React.FC<TestingSecurityDeploymentCardProps> = ({ title, description, apiEndpoint }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(apiEndpoint);
        setData(response.data);
      } catch (err) {
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiEndpoint]);

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 py-4">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        <p className="text-gray-600 mt-2">{description}</p>
      </div>
      <div className="px-6 py-4">
        {loading ? (
          <div className="flex justify-center items-center">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : (
          <ul className="list-disc list-inside">
            {data.map((item, index) => (
              <li key={index} className="text-gray-700">
                {item.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TestingSecurityDeploymentCard;