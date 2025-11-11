import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

interface ServiceFormData {
  id?: number;
  name: string;
  description: string;
  endpoint: string;
  apiKey: string;
}

const BackendServicesAPIsForm: React.FC = () => {
  const [formData, setFormData] = useState<ServiceFormData>({
    name: '',
    description: '',
    endpoint: '',
    apiKey: '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      setLoading(true);
      axios.get(`/api/services/${id}`)
        .then(response => {
          setFormData(response.data);
          setLoading(false);
        })
        .catch(err => {
          setError('Failed to load service data.');
          setLoading(false);
        });
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const apiCall = id ? axios.put : axios.post;
    const url = id ? `/api/services/${id}` : '/api/services';

    apiCall(url, formData)
      .then(() => {
        setSuccess('Service saved successfully.');
        setLoading(false);
        setTimeout(() => navigate('/dashboard'), 2000);
      })
      .catch(err => {
        setError('Failed to save service.');
        setLoading(false);
      });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">{id ? 'Edit Service' : 'Create Service'}</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}
      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Service Name</label>
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
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="endpoint" className="block text-sm font-medium text-gray-700">API Endpoint</label>
          <input
            type="url"
            id="endpoint"
            name="endpoint"
            value={formData.endpoint}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">API Key</label>
          <input
            type="text"
            id="apiKey"
            name="apiKey"
            value={formData.apiKey}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {id ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BackendServicesAPIsForm;