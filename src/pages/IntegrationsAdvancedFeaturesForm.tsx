import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface IntegrationFeature {
  id: number;
  name: string;
  description: string;
  enabled: boolean;
}

const IntegrationsAdvancedFeaturesForm: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [features, setFeatures] = useState<IntegrationFeature[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<IntegrationFeature>>({
    name: '',
    description: '',
    enabled: false,
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchFeatures();
    }
  }, [user]);

  const fetchFeatures = async () => {
    try {
      const response = await axios.get('/api/integrations');
      setFeatures(response.data);
    } catch (err) {
      setError('Failed to load features.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.description) {
      setError('Please fill in all required fields.');
      return;
    }
    try {
      setLoading(true);
      if (formData.id) {
        await axios.put(`/api/integrations/${formData.id}`, formData);
      } else {
        await axios.post('/api/integrations', formData);
      }
      setFormData({ name: '', description: '', enabled: false });
      fetchFeatures();
      setError(null);
    } catch (err) {
      setError('Failed to save feature.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (feature: IntegrationFeature) => {
    setFormData(feature);
  };

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      await axios.delete(`/api/integrations/${id}`);
      fetchFeatures();
    } catch (err) {
      setError('Failed to delete feature.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Integrations & Advanced Features</h1>
      {error && <div className="bg-red-100 text-red-700 p-2 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Feature Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="enabled">
            Enabled
          </label>
          <input
            type="checkbox"
            id="enabled"
            name="enabled"
            checked={formData.enabled}
            onChange={handleInputChange}
            className="mr-2 leading-tight"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {formData.id ? 'Update Feature' : 'Add Feature'}
          </button>
        </div>
      </form>
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">Name</th>
              <th className="py-2">Description</th>
              <th className="py-2">Enabled</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {features.map((feature) => (
              <tr key={feature.id}>
                <td className="border px-4 py-2">{feature.name}</td>
                <td className="border px-4 py-2">{feature.description}</td>
                <td className="border px-4 py-2">{feature.enabled ? 'Yes' : 'No'}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleEdit(feature)}
                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(feature.id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default IntegrationsAdvancedFeaturesForm;