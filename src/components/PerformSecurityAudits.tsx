import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface SecurityAuditProps {
  onComplete: () => void;
}

const PerformSecurityAudits: React.FC<SecurityAuditProps> = ({ onComplete }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false);
        onComplete();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, onComplete]);

  const handleAudit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('/api/security-audits', { userId: user.id });
      if (response.status === 200) {
        setSuccess(true);
      } else {
        throw new Error('Failed to perform security audit');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Perform Security Audit</h2>
      {error && <div className="text-red-500 mb-4" role="alert">{error}</div>}
      {success && <div className="text-green-500 mb-4" role="alert">Security audit completed successfully!</div>}
      <button
        onClick={handleAudit}
        disabled={loading}
        className={`w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        aria-busy={loading}
      >
        {loading ? 'Performing Audit...' : 'Start Security Audit'}
      </button>
    </div>
  );
};

export default PerformSecurityAudits;