import React from 'react';

const Badge = ({ children, color }) => {
  const colorClasses = {
    blue: 'bg-blue-200 text-blue-800',
    gray: 'bg-gray-200 text-gray-800',
    yellow: 'bg-yellow-200 text-yellow-800',
    green: 'bg-green-200 text-green-800',
  };
  return (
    <span className={`text-xs font-medium me-2 px-2.5 py-0.5 rounded-full ${colorClasses[color]}`}>
      {children}
    </span>
  );
};

export default Badge;
