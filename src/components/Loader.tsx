import React from 'react';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  message?: string;
}

const Loader: React.FC<LoaderProps> = ({ size = 'medium', color = 'text-blue-500', message }) => {
  const sizeClasses = {
    small: 'w-4 h-4 border-2',
    medium: 'w-8 h-8 border-4',
    large: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div
        className={`animate-spin rounded-full border-t-transparent ${sizeClasses[size]} ${color}`}
        role="status"
        aria-label="Loading"
      ></div>
      {message && <span className="text-gray-600">{message}</span>}
    </div>
  );
};

export default Loader;