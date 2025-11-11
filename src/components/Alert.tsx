import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface AlertProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, type, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const handleClose = () => {
    setIsVisible(false);
    onClose();
  };

  const alertStyles = {
    success: 'bg-green-100 border-green-400 text-green-700',
    error: 'bg-red-100 border-red-400 text-red-700',
    info: 'bg-blue-100 border-blue-400 text-blue-700',
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-4 right-4 max-w-sm w-full border-l-4 p-4 rounded shadow-lg ${alertStyles[type]}`}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex justify-between items-center">
        <span>{message}</span>
        <button
          onClick={handleClose}
          className="ml-4 text-lg font-bold focus:outline-none"
          aria-label="Close alert"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default Alert;