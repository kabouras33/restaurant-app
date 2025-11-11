import React, { useState, ChangeEvent, FocusEvent } from 'react';
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
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    setTouched(true);
    validateField(e.target);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    if (touched) {
      validateField(e.target);
    }
  };

  const validateField = (input: HTMLInputElement) => {
    if (input.validity.valid) {
      setError(null);
    } else {
      setError(errorMessage || input.validationMessage);
    }
  };

  const handleAsyncValidation = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/validate/${name}`, { params: { value } });
      if (!response.data.valid) {
        setError(response.data.message || 'Invalid input');
      } else {
        setError(null);
      }
    } catch (err) {
      setError('Validation error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
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
        onBlur={handleBlur}
        onFocus={handleAsyncValidation}
        className={`shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md ${
          error ? 'border-red-500' : ''
        }`}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {loading && <p className="text-blue-500 text-sm mt-1 animate-pulse">Validating...</p>}
      {error && (
        <p id={`${name}-error`} className="text-red-500 text-sm mt-1">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;