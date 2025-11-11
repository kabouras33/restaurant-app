import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface SelectProps {
  label: string;
  apiEndpoint: string;
  onSelect: (value: string) => void;
  defaultValue?: string;
  required?: boolean;
}

interface Option {
  id: string;
  name: string;
}

const Select: React.FC<SelectProps> = ({ label, apiEndpoint, onSelect, defaultValue, required = false }) => {
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedValue, setSelectedValue] = useState<string>(defaultValue || '');

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoading(true);
        const response = await axios.get(apiEndpoint);
        setOptions(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load options');
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [apiEndpoint]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedValue(value);
    onSelect(value);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700" htmlFor="select-component">
        {label}
      </label>
      {loading ? (
        <div className="mt-2 text-gray-500">Loading...</div>
      ) : error ? (
        <div className="mt-2 text-red-500">{error}</div>
      ) : (
        <select
          id="select-component"
          className="mt-2 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          value={selectedValue}
          onChange={handleChange}
          required={required}
          aria-label={label}
        >
          <option value="" disabled>
            Select an option
          </option>
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default Select;