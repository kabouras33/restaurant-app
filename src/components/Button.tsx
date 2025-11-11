import React, { ButtonHTMLAttributes } from 'react';
import classNames from 'classnames';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  isLoading = false,
  children,
  disabled,
  ...props
}) => {
  const buttonClass = classNames(
    'px-4 py-2 rounded-md font-semibold focus:outline-none transition-transform transform hover:scale-105',
    {
      'bg-blue-600 text-white hover:bg-blue-700': variant === 'primary',
      'bg-gray-500 text-white hover:bg-gray-600': variant === 'secondary',
      'bg-red-500 text-white hover:bg-red-600': variant === 'danger',
      'opacity-50 cursor-not-allowed': disabled || isLoading,
    }
  );

  return (
    <button
      className={buttonClass}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      aria-disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="animate-pulse">Loading...</span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;