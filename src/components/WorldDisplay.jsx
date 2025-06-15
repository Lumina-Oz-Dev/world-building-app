import React from 'react';
import PDFExportButton from './PDFExportButton';

/**
 * ImageWithFallback Component
 * Displays generated image or fallback placeholder with loading state
 * @param {string} imageData - Base64 image data
 * @param {string} alt - Alt text for image
 * @param {string} className - CSS classes
 * @param {JSX.Element} placeholder - Fallback placeholder component
 * @param {boolean} isLoading - Loading state
 */
const ImageWithFallback = ({ imageData, alt, className, placeholder, isLoading }) => {
  if (isLoading) {
    return (
      <div className={`${className} bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center animate-pulse`}>
        <div className="text-center">
          <svg className="mx-auto h-8 w-8 text-gray-400 mb-2 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <p className="text-xs text-gray-500 font-mono">Generating image...</p>
        </div>
      </div>
    );
  }

  if (imageData) {
    return (
      <img
        src={`data:image/png;base64,${imageData}`}
        alt={alt}
        className={`${className} object-cover transition-opacity duration-300 rounded-lg shadow-md`}
        loading="lazy"
        onError={(e) => {
          console.error('Failed to load generated image');
          e.target.style.display = 'none';
          if (e.target.nextSibling) {
            e.target.nextSibling.style.display = 'flex';
          }
        }}
      />
    );
  }

  return placeholder;
};

/**
 * ConceptArtPlaceholder Component
 * Fallback placeholder for main concept art
 */
const ConceptArtPlaceholder = () => (
  <div className="bg-slate-100 rounded-xl p-8 text-center border-2 border-dashed border-slate-300">
    <svg className="mx-auto h-12 w-12 text-slate-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
    <p className="text-slate-500 font-mono">Concept art generation unavailable</p>
    <p className="text-sm text-slate-400 mt-1 font-mono">Your world content has been generated successfully!</p>
  </div>
);

/**
 * CharacterPlaceholder Component
 * Fallback placeholder for character images
 */
const CharacterPlaceholder = () => (
  <div className="h-48 bg-gradient-to-br from-purple-200 to-violet-200 flex items-center justify-center">
    <div className="text-center">
      <svg className="mx-auto h-16 w-16 text-purple-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
      <p className="text-xs text-purple-600 font-mono">Character Art</p>
    </div>
  </div>
);

/**
 * ScenarioPlaceholder Component
 * Fallback placeholder for scenario images
 */
const ScenarioPlaceholder = () => (
  <div className="h-48 bg-gradient-to-br from-blue-200 to-cyan-200 flex items-center justify-center">
    <div className="text-center">
      <svg className="mx-auto h-16 w-16 text-blue-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p className="text-xs text-blue-600 font-mono">Scenario Art</p>
    </div>
  </div>
);

/**
 * WorldDisplay Component
 * Renders all generated world content with actual AI-generated images
 * @param {Object} worldData - Complete world data object from API
 * @param {Object} imageGenerationProgress - Progress state for image generation
 */
const WorldDisplay = ({ worldData, imageGenerationProgress = null }) => {
  if (!worldData) return null;

  const {
    worldNarrative,
    gameBookIdeas,
    customizationOptions,
    characterConcepts,
    conceptualMaps,
    conceptImage,
    characterImages = [],
    scenarioImages = [],
    userIdea,
    worldType
  } = worldData;

  // Default progress state if not provided
  const defaultProgress = {
    concept: { loading: false, completed: false },
    characters: Array(6).fill({ loading: false, completed: false }),
    scenarios: Array(3).fill({ loading: false, completed: false })
  };

  const progress = imageGenerationProgress || defaultProgress;

  /**
   * Format narrative text with proper paragraph breaks and improved styling
   * @param {string} text - Raw narrative text
   * @returns {JSX.Element[]} Array of paragraph elements
   */
  const formatNarrative = (text) => {
    if (!text) return null;
    
    const paragraphs = text.split('\n\n').filter(p => p.trim());
    return paragraphs.map((paragraph, index) => (
      <p key={index} className="mb-6 text-gray-800 leading-relaxed text-lg font-light">
        {paragraph.trim()}
      </p>
    ));
  };

  /**
   * Format conceptual maps text with headings and improved styling
   * @param {string} text - Raw maps text
   * @returns {JSX.Element} Formatted maps content
   */
  const formatConceptualMaps = (text) => {
    if (!text) return null;
    
    const sections = text.split('\n\n').filter(s => s.trim());
    return sections.map((section, index) => {
      const lines = section.split('\n');
      const heading = lines[0];
      const content = lines.slice(1).join('\n');
      
      return (
        <div key={index} className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
          <h4 className="text-xl font-bold text-blue-900 mb-4 border-b-2 border-blue-200 pb-2">
            {heading.replace(/^#{1,4}\s*/, '')}
          </h4>
          <p className="text-gray-800 leading-relaxed text-base">
            {content.trim()}
          </p>
        </div>
      );
    });
  };

  /**
   * Generate scenario titles and descriptions
   * @param {number} index - Scenario index
   * @returns {Object} Scenario data
   */
  const getScenarioData = (index) => {
    const scenarios = [
      {
        title: "The Heart of the World",
        description: "This central location holds the key to understanding your world's mysteries and serves as a focal point for major events.",
        tag: "Core Location"
      },
      {
        title: "Realm of Secrets",
        description: "A mysterious place filled with hidden knowledge, ancient artifacts, and dangerous challenges that test heroes.",
        tag: "Mystery Zone"
      },
      {
        title: "Crossroads of Destiny",
        description: "Where different factions, cultures, or forces converge, creating opportunities for conflict, trade, and adventure.",
        tag: "Social Hub"
      }
    ];
    
    return scenarios[index] || scenarios[0];
  };

  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden border-2 border-slate-200">
      {/* Header Section */}
      <div className="text-white p-6" style={{background: 'linear-gradient(to right, #3f4d64, #4a5568)'}}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-2 font-mono">Your Generated World</h2>
            <p className="text-slate-200 text-lg font-mono">
              <span className="font-medium">Type:</span> {worldType}
            </p>
            <p className="text-slate-300 text-sm mt-2 font-mono">
              <span className="font-medium">Based on:</span> "{userIdea}"
            </p>
          </div>
          
          {/* PDF Export Button */}
          <div className="ml-6">
            <PDFExportButton worldData={worldData} />
          </div>
        </div>
      </div>

      <div className="p-8 space-y-16">
        {/* Concept Art Image */}
        <section>
          <h3 className="text-2xl font-bold mb-4 font-mono pl-4" style={{color: '#3f4d64', borderLeft: '4px solid #3f4d64'}}>Concept Art</h3>
          <div className="rounded-lg overflow-hidden shadow-md">
            <ImageWithFallback
              imageData={conceptImage}
              alt="AI-generated concept art for the world"
              className="w-full h-auto max-h-96"
              placeholder={<ConceptArtPlaceholder />}
              isLoading={progress.concept.loading}
            />
          </div>
          {progress.concept.completed && conceptImage && (
            <p className="text-sm text-green-600 mt-2 font-mono flex items-center">
              <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              ✨ AI-generated concept art created successfully
            </p>
          )}
        </section>

        {/* World Narrative */}
        {worldNarrative && (
          <section>
            <h3 className="text-2xl font-bold mb-4 font-mono pl-4" style={{color: '#3f4d64', borderLeft: '4px solid #3f4d64'}}>World Narrative</h3>
            <div className="prose prose-lg max-w-none bg-slate-50 rounded-xl p-6 border border-slate-200">
              {formatNarrative(worldNarrative)}
            </div>
          </section>
        )}

        {/* Game/Book Ideas */}
        {gameBookIdeas && gameBookIdeas.length > 0 && (
          <section>
            <h3 className="text-2xl font-bold mb-6 font-mono pl-4" style={{color: '#3f4d64', borderLeft: '4px solid #3f4d64'}}>Game & Book Ideas</h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {gameBookIdeas.map((idea, index) => (
                <div key={index} className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-lg font-bold text-green-900 flex-1">
                      {idea.title}
                    </h4>
                    <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full ml-2">
                      #{index + 1}
                    </span>
                  </div>
                  <p className="text-gray-800 text-sm leading-relaxed">
                    {idea.synopsis}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Character Concepts */}
        {characterConcepts && characterConcepts.length > 0 && (
          <section>
            <h3 className="text-2xl font-bold mb-6 font-mono pl-4" style={{color: '#3f4d64', borderLeft: '4px solid #3f4d64'}}>Character Concepts</h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {characterConcepts.slice(0, 6).map((character, index) => (
                <div key={index} className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl overflow-hidden border border-purple-100 hover:shadow-lg transition-shadow duration-300">
                  {/* Character Image */}
                  <ImageWithFallback
                    imageData={characterImages[index]}
                    alt={`AI-generated portrait of ${character.name}`}
                    className="h-48 w-full"
                    placeholder={<CharacterPlaceholder />}
                    isLoading={progress.characters[index]?.loading}
                  />
                  
                  {/* Character Info */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-xl font-bold text-purple-900 flex-1">
                        {character.name}
                      </h4>
                      <span className="bg-purple-100 text-purple-800 text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap">
                        {character.role}
                      </span>
                    </div>
                    <p className="text-gray-800 leading-relaxed text-sm mb-2">
                      {character.description}
                    </p>
                    {progress.characters[index]?.completed && characterImages[index] && (
                      <p className="text-xs text-green-600 font-mono flex items-center">
                        <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        ✨ AI Generated Portrait
                      </p>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Add empty placeholder cards if we have fewer than 6 characters */}
              {Array.from({ length: Math.max(0, 6 - characterConcepts.length) }, (_, index) => (
                <div key={`placeholder-${index}`} className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl overflow-hidden border-2 border-dashed border-gray-200 opacity-60">
                  <div className="h-48 bg-gradient-to-br from-gray-100 to-slate-100 flex items-center justify-center">
                    <div className="text-center">
                      <svg className="mx-auto h-16 w-16 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <p className="text-xs text-gray-400 font-mono">Character Slot</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="text-lg font-bold text-gray-400 mb-2">Character #{characterConcepts.length + index + 1}</h4>
                    <p className="text-gray-400 text-sm">Additional character concept available for expansion</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Customization Options */}
        {customizationOptions && customizationOptions.length > 0 && (
          <section>
            <h3 className="text-2xl font-bold mb-6 font-mono pl-4" style={{color: '#3f4d64', borderLeft: '4px solid #3f4d64'}}>Customization Options</h3>
            <div className="space-y-4">
              {customizationOptions.map((option, index) => (
                <div key={index} className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-100 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mr-4">
                      <span className="text-amber-700 font-bold text-sm">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold text-amber-900 mb-2">
                        {option.title}
                      </h4>
                      <p className="text-gray-800 leading-relaxed">
                        {option.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* World Scenarios Section */}
        <section>
          <h3 className="text-2xl font-bold mb-6 font-mono pl-4" style={{color: '#3f4d64', borderLeft: '4px solid #3f4d64'}}>World Scenarios</h3>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }, (_, index) => {
              const scenarioData = getScenarioData(index);
              return (
                <div key={`scenario-${index}`} className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl overflow-hidden border border-blue-100 hover:shadow-lg transition-shadow duration-300">
                  {/* Scenario Image */}
                  <ImageWithFallback
                    imageData={scenarioImages[index]}
                    alt={`AI-generated artwork for ${scenarioData.title}`}
                    className="h-48 w-full"
                    placeholder={<ScenarioPlaceholder />}
                    isLoading={progress.scenarios[index]?.loading}
                  />
                  
                  {/* Scenario Info */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="text-xl font-bold text-blue-900 flex-1">
                        {scenarioData.title}
                      </h4>
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap">
                        {scenarioData.tag}
                      </span>
                    </div>
                    <p className="text-gray-800 leading-relaxed text-sm mb-4">
                      {scenarioData.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-xs text-blue-600">
                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="font-mono">World Location</span>
                      </div>
                      {progress.scenarios[index]?.completed && scenarioImages[index] && (
                        <p className="text-xs text-green-600 font-mono flex items-center">
                          <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          ✨ AI Generated Art
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Conceptual Maps */}
        {conceptualMaps && (
          <section>
            <h3 className="text-2xl font-bold mb-6 font-mono pl-4" style={{color: '#3f4d64', borderLeft: '4px solid #3f4d64'}}>Conceptual Maps & Regions</h3>
            <div className="space-y-6">
              {formatConceptualMaps(conceptualMaps)}
            </div>
          </section>
        )}
      </div>

      {/* Footer */}
      <div className="bg-slate-50 px-6 py-4 border-t border-slate-200">
        <p className="text-center text-sm text-slate-500 font-mono">
          Generated world content and AI artwork are ephemeral and will be lost when you refresh or generate a new world.
        </p>
      </div>
    </div>
  );
};

export default WorldDisplay;