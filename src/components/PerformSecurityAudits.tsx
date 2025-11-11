import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface SecurityAudit {
  id: number;
  name: string;
  status: string;
  findings: string[];
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://ai-codepeak.com/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

const PerformSecurityAudits: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [audits, setAudits] = useState<SecurityAudit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const fetchAudits = async () => {
      try {
        const response = await api.get('/security-audits');
        setAudits(response.data);
      } catch (err) {
        setError('Failed to load security audits. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchAudits();
  }, [user, navigate]);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    fetchAudits();
  };

  const fetchAudits = async () => {
    try {
      const response = await api.get('/security-audits');
      setAudits(response.data);
    } catch (err) {
      setError('Failed to load security audits. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Security Audits</h1>
      {loading ? (
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
          <p>{error}</p>
          <button onClick={handleRetry} className="mt-2 text-blue-500 underline">
            Retry
          </button>
        </div>
      ) : (
        <ul className="space-y-4">
          {audits.map(audit => (
            <li key={audit.id} className="bg-white p-4 rounded shadow hover:shadow-lg transition-shadow">
              <h2 className="text-lg font-semibold">{audit.name}</h2>
              <p className={`text-sm ${audit.status === 'Completed' ? 'text-green-500' : 'text-yellow-500'}`}>{audit.status}</p>
              <ul className="list-disc pl-5 mt-2">
                {audit.findings.map((finding, index) => (
                  <li key={index} className="text-gray-700">{finding}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PerformSecurityAudits;