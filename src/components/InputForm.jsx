import React, { useState } from 'react';

/**
 * InputForm Component
 * Handles user input for world idea, world type selection, and generation trigger
 * @param {Function} onGenerate - Callback function when generate button is clicked
 * @param {boolean} isLoading - Loading state from parent component
 */
const InputForm = ({ onGenerate, isLoading }) => {
  const [userIdea, setUserIdea] = useState('');
  const [worldType, setWorldType] = useState('Medieval Fantasy');
  const [customWorldType, setCustomWorldType] = useState('');

  // World type options for the dropdown
  const worldTypeOptions = [
    'Medieval Fantasy',
    'Sci-Fi Future',
    'Post-Apocalyptic',
    'Steampunk',
    'Cyberpunk',
    'Modern Urban Fantasy',
    'Custom'
  ];

  /**
   * Handle form submission
   * @param {Event} e - Form submission event
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate user input
    if (!userIdea.trim()) {
      return; // The HTML required attribute will handle this
    }

    if (worldType === 'Custom' && !customWorldType.trim()) {
      return; // The HTML required attribute will handle this
    }

    // Determine the final world type to use
    const finalWorldType = worldType === 'Custom' ? customWorldType : worldType;
    
    // Call the parent's generate function
    onGenerate(userIdea.trim(), finalWorldType);
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-8 mb-8 border-2 border-slate-200">
      <div className="pl-4 mb-6" style={{borderLeft: '4px solid #3f4d64'}}>
        <h2 className="text-2xl font-bold font-mono" style={{color: '#3f4d64'}}>Create Your World</h2>
        <p className="text-slate-600 text-sm font-mono mt-1">Powered by Lumina Oz Game Dev</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* User Idea Textarea */}
        <div>
          <label htmlFor="worldIdea" className="block text-sm font-medium text-slate-700 mb-2 font-mono">
            General Idea for the World *
          </label>
          <textarea
            id="worldIdea"
            value={userIdea}
            onChange={(e) => setUserIdea(e.target.value)}
            placeholder="Describe your world idea... For example: 'A book about magic creatures that use the power of colors to have powers' or 'A post-apocalyptic world where survivors live in floating cities above toxic clouds'"
            className="w-full px-3 py-2 border-2 border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 resize-vertical min-h-[120px] font-mono text-sm"
            style={{
              '--tw-ring-color': '#3f4d64',
              focusBorderColor: '#3f4d64'
            }}
            onFocus={(e) => e.target.style.borderColor = '#3f4d64'}
            onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
            rows={5}
            disabled={isLoading}
            required
          />
          <p className="mt-1 text-sm text-slate-500 font-mono">
            Be as detailed as you like - the more information you provide, the richer your generated world will be.
          </p>
        </div>

        {/* World Type Selection */}
        <div>
          <label htmlFor="worldType" className="block text-sm font-medium text-slate-700 mb-2 font-mono">
            World Type *
          </label>
          <select
            id="worldType"
            value={worldType}
            onChange={(e) => setWorldType(e.target.value)}
            className="w-full px-3 py-2 border-2 border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 font-mono text-sm"
            onFocus={(e) => e.target.style.borderColor = '#3f4d64'}
            onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
            disabled={isLoading}
            required
          >
            {worldTypeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Custom World Type Input (shown when Custom is selected) */}
        {worldType === 'Custom' && (
          <div>
            <label htmlFor="customWorldType" className="block text-sm font-medium text-slate-700 mb-2 font-mono">
              Specify Custom World Type *
            </label>
            <input
              type="text"
              id="customWorldType"
              value={customWorldType}
              onChange={(e) => setCustomWorldType(e.target.value)}
              placeholder="e.g., Gothic Horror, Space Western, Mythical Realism..."
              className="w-full px-3 py-2 border-2 border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 font-mono text-sm"
              onFocus={(e) => e.target.style.borderColor = '#3f4d64'}
              onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
              disabled={isLoading}
              required
            />
          </div>
        )}

        {/* Generate Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isLoading}
            className={`px-8 py-3 rounded-lg text-white font-bold text-lg font-mono transition-all duration-200 border-2 ${
              isLoading
                ? 'cursor-not-allowed'
                : 'hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transform hover:scale-105 shadow-lg'
            }`}
            style={{
              backgroundColor: isLoading ? '#94a3b8' : '#3f4d64',
              borderColor: isLoading ? '#94a3b8' : '#4a5568'
            }}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating World...
              </span>
            ) : (
              'Generate World'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputForm;
