import React from 'react';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  ariaLabel?: string;
}

const Loader: React.FC<LoaderProps> = ({ size = 'medium', color = 'text-blue-500', ariaLabel = 'Loading' }) => {
  const sizeClasses = {
    small: 'h-4 w-4 border-2',
    medium: 'h-8 w-8 border-4',
    large: 'h-12 w-12 border-4',
  };

  return (
    <div
      role="status"
      aria-label={ariaLabel}
      className={`flex justify-center items-center ${sizeClasses[size]} ${color} border-t-transparent border-solid rounded-full animate-spin`}
    >
      <span className="sr-only">{ariaLabel}</span>
    </div>
  );
};

export default Loader;