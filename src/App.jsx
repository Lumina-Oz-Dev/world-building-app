import React, { useState } from 'react';
import InputForm from './components/InputForm';
import LoadingSpinner from './components/LoadingSpinner';
import WorldDisplay from './components/WorldDisplay';
import ErrorMessage from './components/ErrorMessage';
import useGeminiApi from './hooks/useGeminiApi';

/**
 * Main App Component
 * Orchestrates the world-building application flow and state management
 * Enhanced with visual content generation progress tracking
 */
function App() {
  const [worldData, setWorldData] = useState(null);
  const { generateWorldContent, isLoading, error, setError, imageGenerationProgress } = useGeminiApi();

  /**
   * Handle world generation request from InputForm
   * @param {string} userIdea - User's world idea
   * @param {string} worldType - Selected world type
   * @param {boolean} enableVisuals - Whether to generate visual descriptions (default: true)
   */
  const handleGenerateWorld = async (userIdea, worldType, enableVisuals = true) => {
    try {
      // Clear any previous error state
      setError(null);
      
      // Clear any existing world data to prevent stale content display
      setWorldData(null);
      
      // Generate new world content with visual descriptions
      const newWorldData = await generateWorldContent(userIdea, worldType, enableVisuals);
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

  /**
   * Get current loading message based on generation progress
   */
  const getLoadingMessage = () => {
    if (!isLoading) return "Generating your world...";
    
    // Check visual generation progress
    const { concept, characters, scenarios } = imageGenerationProgress;
    
    if (concept.loading) {
      return "Creating visual concept for your world...";
    } else if (concept.completed) {
      const loadingCharacters = characters.filter(c => c.loading).length;
      const completedCharacters = characters.filter(c => c.completed).length;
      
      if (loadingCharacters > 0) {
        return `Generating character visual concepts (${completedCharacters}/6)...`;
      }
      
      const loadingScenarios = scenarios.filter(s => s.loading).length;
      const completedScenarios = scenarios.filter(s => s.completed).length;
      
      if (loadingScenarios > 0) {
        return `Creating scenario visual concepts (${completedScenarios}/3)...`;
      }
    }
    
    return "Generating your world content and visual concepts...";
  };

  /**
   * Get progress percentage for loading bar
   */
  const getProgressPercentage = () => {
    if (!isLoading) return 0;
    
    const { concept, characters, scenarios } = imageGenerationProgress;
    let completed = 0;
    const total = 10; // 1 concept + 6 characters + 3 scenarios
    
    if (concept.completed) completed += 1;
    completed += characters.filter(c => c.completed).length;
    completed += scenarios.filter(s => s.completed).length;
    
    return Math.round((completed / total) * 100);
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
            <LoadingSpinner message={getLoadingMessage()} />
            <div className="px-6 pb-6">
              {/* Progress Bar */}
              <div className="bg-slate-200 rounded-full h-3 mb-4">
                <div 
                  className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 h-3 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                  style={{ width: `${getProgressPercentage()}%` }}
                >
                  {/* Animated shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-pulse"></div>
                </div>
              </div>
              
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <div className="flex items-center justify-center space-x-6 mb-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-slate-800 font-mono">Content Generation</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-slate-800 font-mono">Visual Concepts</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-slate-800 font-mono">World Assembly</span>
                  </div>
                </div>
                
                <p className="text-sm text-slate-600 text-center font-mono">
                  ✨ Creating unique visual concepts and detailed descriptions for your world...
                </p>
                
                {getProgressPercentage() > 0 && (
                  <div className="mt-3 text-center">
                    <p className="text-xs text-slate-500 font-mono">
                      Progress: {getProgressPercentage()}% complete
                    </p>
                    <div className="mt-2 flex justify-center space-x-4 text-xs">
                      <span className={`font-mono ${imageGenerationProgress.concept.completed ? 'text-green-600' : 'text-slate-400'}`}>
                        {imageGenerationProgress.concept.completed ? '✓' : '○'} Concept Art
                      </span>
                      <span className={`font-mono ${imageGenerationProgress.characters.filter(c => c.completed).length > 0 ? 'text-green-600' : 'text-slate-400'}`}>
                        {imageGenerationProgress.characters.filter(c => c.completed).length > 0 ? '✓' : '○'} Characters ({imageGenerationProgress.characters.filter(c => c.completed).length}/6)
                      </span>
                      <span className={`font-mono ${imageGenerationProgress.scenarios.filter(s => s.completed).length > 0 ? 'text-green-600' : 'text-slate-400'}`}>
                        {imageGenerationProgress.scenarios.filter(s => s.completed).length > 0 ? '✓' : '○'} Scenarios ({imageGenerationProgress.scenarios.filter(s => s.completed).length}/3)
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Generated World Content */}
        {worldData && !isLoading && (
          <div id="world-results">
            <WorldDisplay 
              worldData={worldData} 
              imageGenerationProgress={imageGenerationProgress}
            />
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
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                <h4 className="text-sm font-medium text-blue-900 mb-3 flex items-center justify-center">
                  <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  ✨ Enhanced with AI Visual Concepts
                </h4>
                <div className="space-y-2 text-xs text-blue-800">
                  <div className="flex items-center">
                    <svg className="h-3 w-3 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Detailed visual descriptions for concept art</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="h-3 w-3 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Character portrait concepts for each character</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="h-3 w-3 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Environmental artwork descriptions for key locations</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="h-3 w-3 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Rich narrative content and world-building details</span>
                  </div>
                </div>
              </div>
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
              Built with React and Tailwind CSS. Powered by Google Gemini API with AI Visual Concepts.
            </p>
            <p className="text-xs text-slate-400 mt-2 font-mono">
              All generated content and visual descriptions are ephemeral and not stored permanently.
            </p>
            <p className="text-xs text-slate-500 mt-3 font-mono">
              © 2025 Lumina Oz Game Dev. World Building Tool v2.0 - Enhanced Visual Edition.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;