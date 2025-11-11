import React, { ButtonHTMLAttributes, FC, useState } from 'react';
import classNames from 'classnames';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  isLoading?: boolean;
  disabled?: boolean;
}

const Button: FC<ButtonProps> = ({ 
  variant = 'primary', 
  isLoading = false, 
  disabled = false, 
  children, 
  ...props 
}) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || isLoading) return;
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 200); // Reset click state after 200ms
    if (props.onClick) {
      props.onClick(event);
    }
  };

  const buttonClasses = classNames(
    'px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-150 ease-in-out',
    {
      'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500': variant === 'primary',
      'bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-500': variant === 'secondary',
      'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500': variant === 'danger',
      'opacity-50 cursor-not-allowed': disabled || isLoading,
    }
  );

  return (
    <button
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled || isLoading}
      aria-pressed={isClicked}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center">
          <svg
            className="animate-spin h-5 w-5 mr-3 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            ></path>
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;