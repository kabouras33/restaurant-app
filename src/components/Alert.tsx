import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface AlertProps {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, type, duration = 5000, onClose }) => {
  const [visible, setVisible] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!visible) return null;

  const alertStyles = {
    success: 'bg-green-100 border-green-400 text-green-700',
    error: 'bg-red-100 border-red-400 text-red-700',
    info: 'bg-blue-100 border-blue-400 text-blue-700',
    warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
  };

  return (
    <div
      className={`fixed top-4 right-4 max-w-sm w-full border-l-4 p-4 rounded shadow-lg ${alertStyles[type]}`}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="flex justify-between items-center">
        <span className="flex-1">{message}</span>
        <button
          onClick={() => {
            setVisible(false);
            if (onClose) onClose();
          }}
          className="ml-4 text-lg font-bold"
          aria-label="Close alert"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default Alert;