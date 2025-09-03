import React from 'react';

const LoadingSpinner = ({ 
  size = 'md', 
  className = '',
  text = 'Loading...' 
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className={`animate-spin rounded-full border-2 border-gray-300 border-t-emerald-500 ${sizeClasses[size]}`}
      ></div>
      {text && (
        <p className={`mt-2 text-gray-600 ${textSizes[size]}`}>{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;