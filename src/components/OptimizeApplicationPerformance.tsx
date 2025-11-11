import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface Cache {
  [key: string]: any;
}

interface OptimizeApplicationPerformanceProps {
  endpoint: string;
}

const OptimizeApplicationPerformance: React.FC<OptimizeApplicationPerformanceProps> = ({ endpoint }) => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const cache: Cache = {};

  useEffect(() => {
    if (!user) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      if (cache[endpoint]) {
        setData(cache[endpoint]);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        cache[endpoint] = response.data;
        setData(response.data);
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, user]);

  if (loading) {
    return <div className="flex justify-center items-center h-full"><div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status"></div></div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Data</h2>
      <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default OptimizeApplicationPerformance;