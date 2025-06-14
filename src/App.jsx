import React, { useState } from 'react';
import InputForm from './components/InputForm';
import LoadingSpinner from './components/LoadingSpinner';
import WorldDisplay from './components/WorldDisplay';
import ErrorMessage from './components/ErrorMessage';
import useGeminiApi from './hooks/useGeminiApi';

/**
 * Main App Component
 * Orchestrates the world-building application flow and state management
 */
function App() {
  const [worldData, setWorldData] = useState(null);
  const { generateWorldContent, isLoading, error, setError } = useGeminiApi();

  /**
   * Handle world generation request from InputForm
   * @param {string} userIdea - User's world idea
   * @param {string} worldType - Selected world type
   */
  const handleGenerateWorld = async (userIdea, worldType) => {
    try {
      // Clear any previous error state
      setError(null);
      
      // Clear any existing world data to prevent stale content display
      setWorldData(null);
      
      // Generate new world content
      const newWorldData = await generateWorldContent(userIdea, worldType);
      setWorldData(newWorldData);
      
      // Scroll to results after generation completes
      setTimeout(() => {
        const resultsElement = document.getElementById('world-results');
        if (resultsElement) {
          resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
      
    } catch (err) {
      console.error('Error generating world:', err);
      // Error is already set by the hook, no need to set it again here
    }
  };

  /**
   * Handle retry action from error message
   */
  const handleRetry = () => {
    setError(null);
    setWorldData(null);
  };

  /**
   * Handle starting over (generate new world)
   */
  const handleStartOver = () => {
    setWorldData(null);
    setError(null);
    // Scroll back to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-200 via-slate-100 to-slate-50" style={{backgroundColor: '#f8fafc'}}>
      {/* Header */}
      <header className="shadow-lg border-b border-slate-600" style={{background: 'linear-gradient(to right, #3f4d64, #4a5568)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Brand Logo */}
              <div className="flex-shrink-0">
                <img 
                  src="/logo.svg" 
                  alt="Lumina Oz Game Dev" 
                  className="h-12 w-auto"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white font-mono">
                  World Building Tool
                </h1>
                <p className="mt-1 text-sm text-slate-300 font-mono">
                  Create immersive worlds for your games and stories
                </p>
              </div>
            </div>
            
            {/* Start Over Button (only show when world data exists) */}
            {worldData && !isLoading && (
              <button
                onClick={handleStartOver}
                className="text-white px-4 py-2 rounded-lg text-sm font-medium font-mono hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 transition-colors duration-200 border border-slate-500"
                style={{backgroundColor: '#4a5568'}}
              >
                Create New World
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Input Form - Always visible unless there's generated content */}
        {!worldData && !isLoading && (
          <InputForm onGenerate={handleGenerateWorld} isLoading={isLoading} />
        )}

        {/* Error Message */}
        {error && (
          <ErrorMessage message={error} onRetry={handleRetry} />
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white rounded-xl shadow-xl border-2 border-slate-200">
            <LoadingSpinner message="Generating your world..." />
            <div className="px-6 pb-6">
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <p className="text-sm text-slate-800 text-center font-mono">
                  ✨ Creating your world narrative, characters, and concept art...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Generated World Content */}
        {worldData && !isLoading && (
          <div id="world-results">
            <WorldDisplay worldData={worldData} />
          </div>
        )}

        {/* Empty State Message (when no content and not loading) */}
        {!worldData && !isLoading && !error && (
          <div className="text-center py-12">
            <div className="mx-auto max-w-md">
              <svg
                className="mx-auto h-12 w-12 text-slate-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-slate-900 font-mono">
                Ready to build your world
              </h3>
              <p className="mt-1 text-sm text-slate-500 font-mono">
                Enter your world idea above to get started with AI-powered world generation.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-600 mt-16" style={{background: 'linear-gradient(to right, #3f4d64, #4a5568)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <img src="/logo.svg" alt="Lumina Oz Game Dev" className="h-8 w-auto" />
            </div>
            <p className="text-sm text-slate-300 font-mono">
              Built with React and Tailwind CSS. Powered by Google Gemini API.
            </p>
            <p className="text-xs text-slate-400 mt-2 font-mono">
              All generated content is ephemeral and not stored permanently.
            </p>
            <p className="text-xs text-slate-500 mt-3 font-mono">
              © 2025 Lumina Oz Game Dev. World Building Tool.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;