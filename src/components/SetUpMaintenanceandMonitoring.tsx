import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface MaintenancePlan {
  id: number;
  name: string;
  description: string;
  active: boolean;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://ai-codepeak.com/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' }
});

const SetUpMaintenanceAndMonitoring: React.FC = () => {
  const { user } = useAuth();
  const [plans, setPlans] = useState<MaintenancePlan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await api.get('/maintenance-plans');
        setPlans(response.data);
      } catch (err) {
        setError('Failed to load maintenance plans. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handlePlanSelect = async (planId: number) => {
    setLoading(true);
    try {
      await api.post(`/users/${user?.id}/select-plan`, { planId });
      setSelectedPlan(planId);
    } catch (err) {
      setError('Failed to select the plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse text-center text-blue-600">Loading plans...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Set Up Maintenance and Monitoring</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {plans.map(plan => (
          <div key={plan.id} className={`border rounded-lg p-4 shadow-lg ${selectedPlan === plan.id ? 'bg-blue-100' : 'bg-white'}`}>
            <h2 className="text-xl font-semibold">{plan.name}</h2>
            <p className="text-gray-700">{plan.description}</p>
            <button
              onClick={() => handlePlanSelect(plan.id)}
              className={`mt-4 px-4 py-2 rounded ${selectedPlan === plan.id ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white hover:bg-blue-600'} transition`}
              aria-label={`Select ${plan.name} plan`}
              disabled={selectedPlan === plan.id}
            >
              {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SetUpMaintenanceAndMonitoring;