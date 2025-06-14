import React from 'react';

/**
 * ErrorMessage Component
 * Displays error messages with consistent styling and optional retry functionality
 * @param {string} message - Error message to display
 * @param {Function} onRetry - Optional callback function for retry button
 */
const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-6">
      <div className="flex items-start">
        {/* Error Icon */}
        <div className="flex-shrink-0">
          <svg 
            className="h-6 w-6 text-red-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
        </div>
        
        {/* Error Content */}
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800 font-mono">
            Error Generating World
          </h3>
          <div className="mt-2 text-sm text-red-700 font-mono">
            <p>{message}</p>
          </div>
          
          {/* Retry Button (if onRetry function is provided) */}
          {onRetry && (
            <div className="mt-4">
              <button
                onClick={onRetry}
                className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium font-mono hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200 border border-red-500"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Additional Help Text */}
      <div className="mt-4 text-xs text-red-600 font-mono">
        <p>
          If this error persists, try refreshing the page or simplifying your world idea.
        </p>
      </div>
    </div>
  );
};

export default ErrorMessage;