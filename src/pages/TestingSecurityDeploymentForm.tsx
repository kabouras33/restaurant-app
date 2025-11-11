import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

interface FormData {
  name: string;
  description: string;
  deploymentUrl: string;
  securityLevel: string;
}

const TestingSecurityDeploymentForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    deploymentUrl: '',
    securityLevel: 'low',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      setLoading(true);
      axios.get(`/api/deployments/${id}`)
        .then(response => {
          setFormData(response.data);
        })
        .catch(() => {
          setError('Failed to load deployment data.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    const apiCall = id ? axios.put : axios.post;
    const url = id ? `/api/deployments/${id}` : '/api/deployments';

    apiCall(url, formData)
      .then(() => {
        setSuccessMessage('Deployment saved successfully.');
        setTimeout(() => navigate('/deployments'), 2000);
      })
      .catch(() => {
        setError('Failed to save deployment.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{id ? 'Edit Deployment' : 'Create Deployment'}</h1>
      {error && <div className="bg-red-100 text-red-700 p-2 mb-4">{error}</div>}
      {successMessage && <div className="bg-green-100 text-green-700 p-2 mb-4">{successMessage}</div>}
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="deploymentUrl" className="block text-sm font-medium text-gray-700">Deployment URL</label>
            <input
              type="url"
              id="deploymentUrl"
              name="deploymentUrl"
              value={formData.deploymentUrl}
              onChange={handleChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="securityLevel" className="block text-sm font-medium text-gray-700">Security Level</label>
            <select
              id="securityLevel"
              name="securityLevel"
              value={formData.securityLevel}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {id ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default TestingSecurityDeploymentForm;