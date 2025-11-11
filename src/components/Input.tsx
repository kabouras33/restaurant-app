import React, { useState } from 'react';
import axios from 'axios';

interface InputProps {
  label: string;
  type: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  pattern?: string;
  minLength?: number;
  maxLength?: number;
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
  pattern,
  minLength,
  maxLength,
  onChange,
  value,
  errorMessage
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => {
    setIsFocused(false);
    setIsTouched(true);
  };

  const inputClass = `border rounded-md p-2 w-full ${
    isFocused ? 'border-blue-500' : 'border-gray-300'
  } ${isTouched && errorMessage ? 'border-red-500' : ''}`;

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
        pattern={pattern}
        minLength={minLength}
        maxLength={maxLength}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={inputClass}
        aria-invalid={!!errorMessage}
        aria-describedby={errorMessage ? `${name}-error` : undefined}
      />
      {isTouched && errorMessage && (
        <p id={`${name}-error`} className="mt-2 text-sm text-red-600">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default Input;