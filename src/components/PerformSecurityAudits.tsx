import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface SecurityAuditProps {
  onAuditComplete: () => void;
}

const PerformSecurityAudits: React.FC<SecurityAuditProps> = ({ onAuditComplete }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleAudit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await axios.post('/api/security-audits', { userId: user.id });
      if (response.status === 200) {
        setSuccess('Security audit completed successfully.');
        onAuditComplete();
      } else {
        setError('Failed to complete the security audit.');
      }
    } catch (err) {
      setError('An error occurred while performing the security audit.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6 mt-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Perform Security Audit</h2>
      <button
        onClick={handleAudit}
        disabled={loading}
        className={`w-full bg-blue-500 text-white py-2 px-4 rounded ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
        aria-label="Perform Security Audit"
      >
        {loading ? 'Performing Audit...' : 'Start Audit'}
      </button>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {success && <p className="text-green-500 mt-4">{success}</p>}
    </div>
  );
};

export default PerformSecurityAudits;