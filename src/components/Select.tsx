import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  label: string;
  name: string;
  apiEndpoint: string;
  onChange: (value: string) => void;
  required?: boolean;
}

const Select: React.FC<SelectProps> = ({ label, name, apiEndpoint, onChange, required = false }) => {
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedValue, setSelectedValue] = useState<string>('');

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.get(apiEndpoint);
        setOptions(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load options');
        setLoading(false);
      }
    };

    fetchOptions();
  }, [apiEndpoint]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedValue(value);
    onChange(value);
  };

  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      {loading ? (
        <div className="mt-2 text-gray-500">Loading...</div>
      ) : error ? (
        <div className="mt-2 text-red-500">{error}</div>
      ) : (
        <select
          id={name}
          name={name}
          value={selectedValue}
          onChange={handleChange}
          required={required}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          aria-required={required}
          aria-invalid={!!error}
        >
          <option value="" disabled>
            Select an option
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default Select;