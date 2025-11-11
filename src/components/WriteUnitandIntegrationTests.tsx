import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface TestResult {
  id: number;
  component: string;
  status: 'passed' | 'failed';
  message: string;
}

const WriteUnitAndIntegrationTests: React.FC = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchTestResults();
    }
  }, [user, navigate]);

  const fetchTestResults = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<TestResult[]>('/api/tests/results');
      setTestResults(response.data);
    } catch (err) {
      setError('Failed to load test results. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Unit and Integration Tests</h1>
      {loading && <div className="text-center">Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Component</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Message</th>
          </tr>
        </thead>
        <tbody>
          {testResults.map((result) => (
            <tr key={result.id} className="hover:bg-gray-100">
              <td className="py-2 px-4 border-b">{result.component}</td>
              <td className={`py-2 px-4 border-b ${result.status === 'passed' ? 'text-green-500' : 'text-red-500'}`}>
                {result.status}
              </td>
              <td className="py-2 px-4 border-b">{result.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WriteUnitAndIntegrationTests;