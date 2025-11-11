import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface MaintenancePlan {
  id: number;
  name: string;
  description: string;
  frequency: string;
}

const SetUpMaintenanceAndMonitoring: React.FC = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState<MaintenancePlan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get('/api/maintenance-plans', {
          headers: {
            Authorization: `Bearer ${user?.token}`
          }
        });
        setPlans(response.data);
      } catch (err) {
        setError('Failed to load maintenance plans.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [user]);

  const handlePlanSelection = (planId: number) => {
    // Implement plan selection logic
    console.log(`Selected plan ID: ${planId}`);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Set Up Maintenance and Monitoring</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {plans.map(plan => (
          <div key={plan.id} className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold">{plan.name}</h2>
            <p className="text-gray-600">{plan.description}</p>
            <p className="text-sm text-gray-500">Frequency: {plan.frequency}</p>
            <button
              onClick={() => handlePlanSelection(plan.id)}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label={`Select ${plan.name} plan`}
            >
              Select Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SetUpMaintenanceAndMonitoring;