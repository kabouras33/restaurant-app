import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface AlertProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, type, onClose }) => {
  const [visible, setVisible] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible) return null;

  const alertStyles = {
    success: 'bg-green-100 border-green-400 text-green-700',
    error: 'bg-red-100 border-red-400 text-red-700',
    info: 'bg-blue-100 border-blue-400 text-blue-700',
  };

  return (
    <div
      className={`fixed top-4 right-4 max-w-sm w-full border-l-4 p-4 rounded shadow-lg ${alertStyles[type]}`}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex justify-between items-center">
        <span>{message}</span>
        <button
          onClick={() => {
            setVisible(false);
            onClose();
          }}
          className="text-lg font-bold ml-4"
          aria-label="Close alert"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default Alert;