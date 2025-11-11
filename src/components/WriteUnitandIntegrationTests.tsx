import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface TestResult {
  id: number;
  name: string;
  status: 'passed' | 'failed';
  error?: string;
}

const WriteUnitAndIntegrationTests: React.FC = () => {
  const { user } = useAuth();
  const [tests, setTests] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://ai-codepeak.com/api',
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' }
  });

  const runTests = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/tests/run', {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setTests(response.data);
    } catch (err) {
      setError('Failed to run tests. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white shadow-xl rounded-lg max-w-3xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Unit and Integration Tests</h1>
      <button
        onClick={runTests}
        disabled={loading}
        className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        aria-label="Run Tests"
      >
        {loading ? 'Running...' : 'Run Tests'}
      </button>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      <div className="mt-6">
        {loading ? (
          <div className="animate-pulse">
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded"></div>
          </div>
        ) : (
          <ul>
            {tests.length === 0 ? (
              <p className="text-gray-500">No tests have been run yet.</p>
            ) : (
              tests.map(test => (
                <li key={test.id} className="mb-2">
                  <div className="flex justify-between items-center p-4 bg-gray-100 rounded shadow-sm">
                    <span className="font-medium">{test.name}</span>
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        test.status === 'passed'
                          ? 'bg-green-500 text-white'
                          : 'bg-red-500 text-white'
                      }`}
                    >
                      {test.status}
                    </span>
                  </div>
                  {test.error && (
                    <p className="text-red-500 mt-2">{test.error}</p>
                  )}
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default WriteUnitAndIntegrationTests;