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
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await axios.get('/api/maintenance-plans', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setPlans(response.data);
      } catch (err) {
        setError('Failed to load maintenance plans.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [user.token]);

  const handlePlanSelect = (planId: number) => {
    setSelectedPlan(planId);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedPlan === null) {
      setError('Please select a maintenance plan.');
      return;
    }

    try {
      await axios.post(
        '/api/user-maintenance',
        { planId: selectedPlan },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      alert('Maintenance plan set successfully!');
    } catch (err) {
      setError('Failed to set maintenance plan.');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="max-w-lg mx-auto p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Set Up Maintenance and Monitoring</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="maintenance-plan" className="block text-sm font-medium text-gray-700">
            Select a Maintenance Plan
          </label>
          <select
            id="maintenance-plan"
            name="maintenance-plan"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            value={selectedPlan ?? ''}
            onChange={(e) => handlePlanSelect(Number(e.target.value))}
            required
          >
            <option value="" disabled>
              Choose a plan
            </option>
            {plans.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.name} - {plan.frequency}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Set Plan
        </button>
      </form>
    </div>
  );
};

export default SetUpMaintenanceAndMonitoring;