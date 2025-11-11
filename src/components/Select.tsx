import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface SelectProps {
  label: string;
  name: string;
  apiEndpoint: string;
  onChange: (value: string) => void;
  value: string;
  error?: string;
}

const Select: React.FC<SelectProps> = ({ label, name, apiEndpoint, onChange, value, error }) => {
  const [options, setOptions] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOptions = async () => {
      setLoading(true);
      try {
        const response = await axios.get(apiEndpoint);
        setOptions(response.data);
        setFetchError(null);
      } catch (error) {
        setFetchError('Failed to load options. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [apiEndpoint]);

  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1 relative">
        <select
          id={name}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`block w-full pl-3 pr-10 py-2 text-base border ${
            error || fetchError ? 'border-red-500' : 'border-gray-300'
          } focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md`}
          aria-invalid={!!(error || fetchError)}
          aria-describedby={`${name}-error`}
          disabled={loading}
        >
          <option value="" disabled>
            {loading ? 'Loading...' : 'Select an option'}
          </option>
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
        {(error || fetchError) && (
          <p id={`${name}-error`} className="mt-2 text-sm text-red-600">
            {error || fetchError}
          </p>
        )}
      </div>
    </div>
  );
};

export default Select;