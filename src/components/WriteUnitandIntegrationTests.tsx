import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface TestResult {
  id: number;
  componentName: string;
  status: 'passed' | 'failed';
  message: string;
}

const WriteUnitAndIntegrationTests: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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

  const retryTest = async (testId: number) => {
    setLoading(true);
    setError(null);
    try {
      await axios.post(`/api/tests/retry/${testId}`);
      fetchTestResults();
    } catch (err) {
      setError('Failed to retry test. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Unit and Integration Tests</h1>
      {loading && <div className="text-center">Loading...</div>}
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Component</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Message</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {testResults.map((result) => (
            <tr key={result.id}>
              <td className="py-2 px-4 border-b">{result.componentName}</td>
              <td className={`py-2 px-4 border-b ${result.status === 'passed' ? 'text-green-500' : 'text-red-500'}`}>
                {result.status}
              </td>
              <td className="py-2 px-4 border-b">{result.message}</td>
              <td className="py-2 px-4 border-b">
                {result.status === 'failed' && (
                  <button
                    onClick={() => retryTest(result.id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Retry
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WriteUnitAndIntegrationTests;