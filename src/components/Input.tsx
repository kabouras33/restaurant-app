import React, { useState } from 'react';
import axios from 'axios';

interface InputProps {
  label: string;
  type: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  onChange: (value: string) => void;
  value: string;
  errorMessage?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  type,
  name,
  placeholder,
  required = false,
  minLength,
  maxLength,
  pattern,
  onChange,
  value,
  errorMessage
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBlur = () => {
    setIsFocused(false);
    if (required && !value) {
      setError('This field is required.');
    } else if (minLength && value.length < minLength) {
      setError(`Minimum length is ${minLength} characters.`);
    } else if (maxLength && value.length > maxLength) {
      setError(`Maximum length is ${maxLength} characters.`);
    } else if (pattern && !new RegExp(pattern).test(value)) {
      setError(errorMessage || 'Invalid format.');
    } else {
      setError(null);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        maxLength={maxLength}
        pattern={pattern}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`mt-1 block w-full px-3 py-2 border ${
          error ? 'border-red-500' : 'border-gray-300'
        } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
        aria-invalid={!!error}
        aria-describedby={`${name}-error`}
      />
      {error && (
        <p className="mt-2 text-sm text-red-600" id={`${name}-error`}>
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;