// src/components/ui/Button.jsx
import React from 'react';

const Button = ({ onClick, children, variant = 'primary', className = '', disabled = false, type = 'button' }) => {
  const baseClasses = 'inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors';
  const variants = {
    primary: 'text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500',
    secondary: 'text-gray-300 bg-gray-700 hover:bg-gray-600 focus:ring-gray-500',
    danger: 'text-white bg-red-600 hover:bg-red-700 focus:ring-red-500',
  };
  const disabledClasses = 'opacity-50 cursor-not-allowed';
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${baseClasses} ${variants[variant]} ${disabled ? disabledClasses : ''} ${className}`}>
      {children}
    </button>
  );
};

export default Button;
