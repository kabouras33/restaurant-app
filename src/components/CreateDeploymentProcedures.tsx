import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface DeploymentProcedure {
  name: string;
  description: string;
  steps: string[];
}

const CreateDeploymentProcedures: React.FC = () => {
  const [procedure, setProcedure] = useState<DeploymentProcedure>({ name: '', description: '', steps: [''] });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const navigate = useNavigate();

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://ai-codepeak.com/api',
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index?: number) => {
    const { name, value } = e.target;
    if (name === 'steps' && index !== undefined) {
      const newSteps = [...procedure.steps];
      newSteps[index] = value;
      setProcedure({ ...procedure, steps: newSteps });
    } else {
      setProcedure({ ...procedure, [name]: value });
    }
  };

  const addStep = () => {
    setProcedure({ ...procedure, steps: [...procedure.steps, ''] });
  };

  const removeStep = (index: number) => {
    const newSteps = procedure.steps.filter((_, i) => i !== index);
    setProcedure({ ...procedure, steps: newSteps });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.post('/deployments', procedure);
      setSuccess(true);
      setTimeout(() => navigate('/deployments'), 2000);
    } catch (err) {
      setError('Failed to create deployment procedure. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-xl rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-4">Create Deployment Procedure</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Procedure Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={procedure.name}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            name="description"
            value={procedure.description}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Steps</label>
          {procedure.steps.map((step, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                name="steps"
                value={step}
                onChange={(e) => handleInputChange(e, index)}
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              {procedure.steps.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeStep(index)}
                  className="ml-2 text-red-500 hover:text-red-700"
                  aria-label="Remove step"
                >
                  &times;
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addStep}
            className="mt-2 text-blue-500 hover:text-blue-700"
            aria-label="Add step"
          >
            + Add Step
          </button>
        </div>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && <div className="text-green-500 mb-4">Deployment procedure created successfully!</div>}
        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Creating...' : 'Create Procedure'}
        </button>
      </form>
    </div>
  );
};

export default CreateDeploymentProcedures;