import React, { ButtonHTMLAttributes, useState } from 'react';
import axios from 'axios';
import classNames from 'classnames';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  isLoading = false,
  onClick,
  children,
  ...props
}) => {
  const [error, setError] = useState<string | null>(null);

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (onClick) {
      try {
        setError(null);
        await onClick();
      } catch (err) {
        setError('An error occurred. Please try again.');
      }
    }
  };

  const buttonClasses = classNames(
    'px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-offset-2',
    {
      'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500': variant === 'primary',
      'bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-500': variant === 'secondary',
      'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500': variant === 'danger',
      'opacity-50 cursor-not-allowed': isLoading,
    }
  );

  return (
    <div className="relative">
      <button
        className={buttonClasses}
        onClick={handleClick}
        disabled={isLoading}
        aria-busy={isLoading}
        aria-live="polite"
        {...props}
      >
        {isLoading ? (
          <span className="loader" aria-hidden="true"></span>
        ) : (
          children
        )}
      </button>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default Button;