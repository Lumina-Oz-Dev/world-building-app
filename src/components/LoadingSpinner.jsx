import React from 'react';

/**
 * LoadingSpinner Component
 * Displays a loading animation with customizable message
 * @param {string} message - Optional loading message to display
 */
const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      {/* Spinning Circle Animation */}
      <div className="relative">
        <div className="w-16 h-16 border-4 border-slate-200 border-solid rounded-full animate-spin"></div>
        <div className="w-16 h-16 border-4 border-slate-600 border-solid rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
      </div>
      
      {/* Loading Message */}
      <p className="mt-4 text-lg font-medium text-slate-700 animate-pulse font-mono">
        {message}
      </p>
      
      {/* Subtle hint text */}
      <p className="mt-2 text-sm text-slate-500 font-mono">
        This may take a few moments...
      </p>
    </div>
  );
};

export default LoadingSpinner;