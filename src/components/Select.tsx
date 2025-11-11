import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface SelectProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  optionsEndpoint: string;
  placeholder?: string;
  required?: boolean;
}

const Select: React.FC<SelectProps> = ({ label, name, value, onChange, optionsEndpoint, placeholder, required }) => {
  const [options, setOptions] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.get(optionsEndpoint);
        setOptions(response.data);
      } catch (err) {
        setError('Failed to load options');
      } finally {
        setLoading(false);
      }
    };
    fetchOptions();
  }, [optionsEndpoint]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value);
  };

  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1 relative">
        {loading ? (
          <div className="animate-pulse bg-gray-200 h-10 w-full rounded-md"></div>
        ) : (
          <select
            id={name}
            name={name}
            value={value}
            onChange={handleChange}
            required={required}
            className={`block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md ${
              error ? 'border-red-500' : ''
            }`}
            aria-invalid={!!error}
            aria-describedby={`${name}-error`}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
          </select>
        )}
        {error && (
          <p className="mt-2 text-sm text-red-600" id={`${name}-error`}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default Select;