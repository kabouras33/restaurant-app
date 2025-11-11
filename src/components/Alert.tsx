import React from 'react';
import { useState, useEffect } from 'react';
import { XIcon } from '@heroicons/react/solid';
import { Transition } from '@headlessui/react';

interface AlertProps {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
  onClose: () => void;
}

const Alert: React.FC<AlertProps> = ({ type, message, duration = 5000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getAlertStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      case 'info':
        return 'bg-blue-500 text-white';
      case 'warning':
        return 'bg-yellow-500 text-black';
      default:
        return '';
    }
  };

  return (
    <Transition
      show={isVisible}
      enter="transition ease-out duration-300"
      enterFrom="opacity-0 translate-y-2"
      enterTo="opacity-100 translate-y-0"
      leave="transition ease-in duration-200"
      leaveFrom="opacity-100 translate-y-0"
      leaveTo="opacity-0 translate-y-2"
    >
      <div
        className={`fixed top-4 right-4 max-w-sm w-full shadow-lg rounded-lg pointer-events-auto ${getAlertStyles()}`}
        role="alert"
        aria-live="assertive"
      >
        <div className="flex items-center justify-between p-4">
          <div className="flex-1">
            <p className="text-sm font-medium">{message}</p>
          </div>
          <button
            type="button"
            className="ml-4 flex-shrink-0 bg-transparent text-white hover:text-gray-200 focus:outline-none"
            onClick={() => {
              setIsVisible(false);
              onClose();
            }}
            aria-label="Close alert"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </Transition>
  );
};

export default Alert;