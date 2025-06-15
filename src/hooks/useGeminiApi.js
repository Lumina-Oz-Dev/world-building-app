import { useState } from 'react';

/**
 * Custom hook for interacting with Google Gemini API
 * Handles text generation and image generation with proper error handling for CORS issues
 * @returns {Object} Object containing functions for API calls and state management
 */
const useGeminiApi = () => {
  // Get API key from environment variables
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error('REACT_APP_GEMINI_API_KEY environment variable is not set');
  }
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imageGenerationProgress, setImageGenerationProgress] = useState({
    concept: { loading: false, completed: false, failed: false },
    characters: Array(6).fill({ loading: false, completed: false, failed: false }),
    scenarios: Array(3).fill({ loading: false, completed: false, failed: false })
  });

  /**
   * Clean and format text by removing markdown and improving readability
   * @param {string} text - Raw text that might contain markdown
   * @returns {string} Cleaned text
   */
  const cleanText = (text) => {
    if (!text) return '';
    
    return text
      // Remove asterisks used for bold/italic
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/\*([^*]+)\*/g, '$1')
      // Remove hash symbols used for headers
      .replace(/^#{1,6}\s*/gm, '')
      // Remove underscores used for emphasis
      .replace(/__([^_]+)__/g, '$1')
      .replace(/_([^_]+)_/g, '$1')
      // Clean up extra whitespace
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  };

  /**
   * Generate text content using Gemini 2.0 Flash model
   * @param {string} prompt - The prompt to send to the API
   * @param {Object} schema - JSON schema for structured response (optional)
   * @returns {Promise<string|Object>} Generated text or structured data
   */
  const generateText = async (prompt, schema = null) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    
    const requestBody = {
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.8,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      }
    };

    // Add response schema if provided for structured output
    if (schema) {
      requestBody.generationConfig.responseMimeType = "application/json";
      requestBody.generationConfig.responseSchema = schema;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
        throw new Error('Invalid response structure from API');
      }

      const content = data.candidates[0].content.parts[0].text;
      
      // Parse JSON if schema was provided
      if (schema) {
        try {
          return JSON.parse(content);
        } catch (parseError) {
          console.warn('Failed to parse JSON response, returning raw text:', parseError);
          return content;
        }
      }
      
      return content;
    } catch (err) {
      console.error('Error generating text:', err);
      throw new Error(`Failed to generate content: ${err.message}`);
    }
  };

  /**
   * Generate mood keywords based on world type
   * @param {string} worldType - The type of world
   * @returns {string} Mood descriptors for image generation
   */
  const getMoodFromWorldType = (worldType) => {
    const moodMap = {
      'Medieval Fantasy': 'epic, mystical, magical, ancient, heroic',
      'Sci-Fi Future': 'futuristic, technological, sleek, advanced, cosmic',
      'Post-Apocalyptic': 'gritty, desolate, survival, ruins, harsh',
      'Steampunk': 'industrial, brass, steam, Victorian, mechanical',
      'Cyberpunk': 'neon, urban, dystopian, high-tech, noir',
      'Modern Urban Fantasy': 'contemporary, magical realism, urban, mysterious'
    };
    
    return moodMap[worldType] || 'atmospheric, detailed, immersive';
  };

  /**
   * Create optimized image prompt for world concept art
   * @param {string} userIdea - User's world idea
   * @param {string} worldType - Type of world
   * @returns {string} Optimized prompt for image generation
   */
  const createWorldImagePrompt = (userIdea, worldType) => {
    const mood = getMoodFromWorldType(worldType);
    return `Create a stunning cinematic concept art depicting a ${worldType} world inspired by: "${userIdea}". 
Style: High-quality digital art, masterpiece quality, detailed environment, atmospheric lighting, professional game concept art.
Composition: Epic wide landscape view showcasing the world's unique characteristics and atmosphere.
Mood: ${mood}, breathtaking, immersive.
Technical: 4K quality, sharp details, vibrant colors, dramatic composition.`;
  };

  /**
   * Create character image prompt
   * @param {Object} character - Character data
   * @param {string} worldType - Type of world
   * @returns {string} Character-specific image prompt
   */
  const createCharacterImagePrompt = (character, worldType) => {
    const mood = getMoodFromWorldType(worldType);
    return `Character concept art portrait of ${character.name}, a ${character.role} in a ${worldType} world.
Character Description: ${character.description}
Style: Professional digital character portrait, detailed, high-quality game art style, masterpiece.
Composition: Upper body portrait, showing personality and role clearly.
Mood: ${mood}, character-focused, expressive.
Technical: Sharp details, good lighting, character design quality.`;
  };

  /**
   * Create scenario/location image prompt
   * @param {number} index - Scenario index
   * @param {string} userIdea - User's world idea
   * @param {string} worldType - Type of world
   * @returns {string} Scenario-specific image prompt
   */
  const createScenarioImagePrompt = (index, userIdea, worldType) => {
    const mood = getMoodFromWorldType(worldType);
    const scenarioTypes = [
      'a key location where important events unfold',
      'a mysterious place filled with secrets and danger',
      'a central hub where characters gather and stories begin'
    ];
    
    return `Environmental concept art for ${scenarioTypes[index]} in a ${worldType} world.
World Concept: "${userIdea}"
Style: Atmospheric environment art, cinematic composition, professional quality.
Elements: Showcase unique features and atmosphere of this important location.
Mood: ${mood}, environmental storytelling, immersive.
Technical: Detailed background art, good composition, atmospheric lighting.`;
  };

  /**
   * Generate detailed visual description as fallback when image generation fails
   * @param {string} prompt - The image prompt
   * @param {string} type - Type of image (concept, character, scenario)
   * @returns {Promise<string>} Detailed visual description
   */
  const generateImageDescription = async (prompt, type = 'concept') => {
    const descriptionPrompt = `Based on this image generation prompt: "${prompt}"

Create a detailed visual description that an artist could use to create this image. Include:
- Composition and perspective details
- Color palette and lighting description
- Key visual elements and their placement
- Atmosphere and mood
- Specific artistic style notes
- Technical details for the artist

Write this as a comprehensive art direction brief that captures the essence of what the image should look like.`;

    try {
      const description = await generateText(descriptionPrompt);
      return {
        type,
        description: cleanText(description),
        prompt: prompt.substring(0, 200) + '...',
        isDescription: true
      };
    } catch (error) {
      console.error('Error generating image description:', error);
      return {
        type,
        description: `Visual concept for ${type}: ${prompt.substring(0, 300)}...`,
        prompt: prompt.substring(0, 200) + '...',
        isDescription: true
      };
    }
  };

  /**
   * Attempt to generate an image, with fallback to description
   * @param {string} prompt - The detailed image description prompt
   * @param {string} type - Type of image being generated
   * @returns {Promise<Object>} Image data or description fallback
   */
  const generateImageWithFallback = async (prompt, type = 'concept') => {
    if (!apiKey) {
      console.error('API key not available for image generation');
      return await generateImageDescription(prompt, type);
    }

    try {
      // Try the working API endpoint
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;
      
      const payload = {
        instances: { prompt: prompt },
        parameters: { "sampleCount": 1 }
      };

      console.log(`Attempting to generate ${type} image...`);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`Image generation failed (${response.status}): ${errorText}`);
        throw new Error(`API returned ${response.status}`);
      }

      const result = await response.json();

      // Check for successful image generation
      if (result.predictions && result.predictions.length > 0 && result.predictions[0].bytesBase64Encoded) {
        console.log(`✅ ${type} image generated successfully!`);
        return {
          type,
          image: result.predictions[0].bytesBase64Encoded,
          isImage: true
        };
      } else {
        console.warn(`No image data in ${type} response:`, result);
        throw new Error('No image data in response');
      }

    } catch (error) {
      console.warn(`Image generation failed for ${type}, falling back to description:`, error.message);
      
      // Fallback to generating a detailed description
      return await generateImageDescription(prompt, type);
    }
  };

  /**
   * Generate all visual content for the world
   * @param {Object} worldData - Complete world data
   * @returns {Promise<Object>} World data with visual content
   */
  const generateAllVisualContent = async (worldData) => {
    const { userIdea, worldType, characterConcepts } = worldData;
    const visualResults = { ...worldData };

    try {
      // Update progress state for concept art
      setImageGenerationProgress(prev => ({
        ...prev,
        concept: { loading: true, completed: false, failed: false }
      }));

      // Generate main concept art
      console.log('Generating concept art...');
      const conceptPrompt = createWorldImagePrompt(userIdea, worldType);
      const conceptResult = await generateImageWithFallback(conceptPrompt, 'concept');
      
      if (conceptResult.isImage) {
        visualResults.conceptImage = conceptResult.image;
      } else {
        visualResults.conceptImageDescription = conceptResult;
      }

      setImageGenerationProgress(prev => ({
        ...prev,
        concept: { 
          loading: false, 
          completed: true, 
          failed: !conceptResult.isImage 
        }
      }));

      // Generate character visuals
      if (characterConcepts && characterConcepts.length > 0) {
        console.log('Generating character visuals...');
        const characterVisuals = [];
        
        for (let i = 0; i < Math.min(characterConcepts.length, 6); i++) {
          setImageGenerationProgress(prev => {
            const newCharacters = [...prev.characters];
            newCharacters[i] = { loading: true, completed: false, failed: false };
            return { ...prev, characters: newCharacters };
          });

          const character = characterConcepts[i];
          const characterPrompt = createCharacterImagePrompt(character, worldType);
          const characterResult = await generateImageWithFallback(characterPrompt, 'character');
          characterVisuals.push(characterResult);

          setImageGenerationProgress(prev => {
            const newCharacters = [...prev.characters];
            newCharacters[i] = { 
              loading: false, 
              completed: true, 
              failed: !characterResult.isImage 
            };
            return { ...prev, characters: newCharacters };
          });

          // Small delay between requests
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        visualResults.characterVisuals = characterVisuals;
      }

      // Generate scenario visuals
      console.log('Generating scenario visuals...');
      const scenarioVisuals = [];
      
      for (let i = 0; i < 3; i++) {
        setImageGenerationProgress(prev => {
          const newScenarios = [...prev.scenarios];
          newScenarios[i] = { loading: true, completed: false, failed: false };
          return { ...prev, scenarios: newScenarios };
        });

        const scenarioPrompt = createScenarioImagePrompt(i, userIdea, worldType);
        const scenarioResult = await generateImageWithFallback(scenarioPrompt, 'scenario');
        scenarioVisuals.push(scenarioResult);

        setImageGenerationProgress(prev => {
          const newScenarios = [...prev.scenarios];
          newScenarios[i] = { 
            loading: false, 
            completed: true, 
            failed: !scenarioResult.isImage 
          };
          return { ...prev, scenarios: newScenarios };
        });

        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      visualResults.scenarioVisuals = scenarioVisuals;

    } catch (error) {
      console.error('Error generating visual content:', error);
    }

    return visualResults;
  };

  /**
   * Main function to generate complete world content with visual content
   * @param {string} userIdea - User's core world idea
   * @param {string} worldType - Selected world type
   * @param {boolean} generateVisuals - Whether to generate visual content (default: true)
   * @returns {Promise<Object>} Complete world data including all sections and visual content
   */
  const generateWorldContent = async (userIdea, worldType, generateVisuals = true) => {
    setIsLoading(true);
    setError(null);

    // Reset image generation progress
    setImageGenerationProgress({
      concept: { loading: false, completed: false, failed: false },
      characters: Array(6).fill({ loading: false, completed: false, failed: false }),
      scenarios: Array(3).fill({ loading: false, completed: false, failed: false })
    });

    // Check if API key is available
    if (!apiKey) {
      const errorMsg = 'API key not configured. Please check your environment variables.';
      setError(errorMsg);
      setIsLoading(false);
      throw new Error(errorMsg);
    }

    try {
      // Generate world narrative
      const narrativePrompt = `Create a detailed world-building narrative for a ${worldType} world based on the idea: "${userIdea}". Include history, geography, key factions, magic systems (if applicable), and societal structure. Make it rich and evocative. Write in engaging prose format with multiple paragraphs. Do not use markdown formatting, asterisks, or special characters. Write in plain text with natural paragraph breaks.`;
      
      const worldNarrative = await generateText(narrativePrompt);

      // Generate game/book ideas with structured JSON
      const ideasPrompt = `Based on the world idea "${userIdea}" in a ${worldType} setting, generate 5 distinct ideas for games or books set in this world. Each should be creative and different from the others.`;
      
      const ideasSchema = {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            title: { type: "STRING" },
            synopsis: { type: "STRING" }
          },
          propertyOrdering: ["title", "synopsis"]
        }
      };
      
      const gameBookIdeas = await generateText(ideasPrompt, ideasSchema);

      // Generate customization options
      const customizationPrompt = `For a ${worldType} world based on "${userIdea}", suggest 5 specific ways a developer could further customize or expand upon this world. Be practical and creative.`;
      
      const customizationSchema = {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            title: { type: "STRING" },
            description: { type: "STRING" }
          },
          propertyOrdering: ["title", "description"]
        }
      };
      
      const customizationOptions = await generateText(customizationPrompt, customizationSchema);

      // Generate character concepts
      const charactersPrompt = `Create 5 compelling character concepts for a ${worldType} world based on "${userIdea}". Each character should be unique and fit the world's tone.`;
      
      const charactersSchema = {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            name: { type: "STRING" },
            description: { type: "STRING" },
            role: { type: "STRING" }
          },
          propertyOrdering: ["name", "description", "role"]
        }
      };
      
      const characterConcepts = await generateText(charactersPrompt, charactersSchema);

      // Generate conceptual maps (textual descriptions)
      const mapsPrompt = `Create textual descriptions for 2 different regions/areas in a ${worldType} world based on "${userIdea}". Include geography, notable landmarks, settlements, and atmosphere. Format each as a separate section with clear headings using simple text - no asterisks or markdown. Use plain text formatting only.`;
      
      const conceptualMaps = await generateText(mapsPrompt);

      // Create base world data
      let worldData = {
        worldNarrative: cleanText(worldNarrative),
        gameBookIdeas: Array.isArray(gameBookIdeas) ? gameBookIdeas : [],
        customizationOptions: Array.isArray(customizationOptions) ? customizationOptions : [],
        characterConcepts: Array.isArray(characterConcepts) ? characterConcepts : [],
        conceptualMaps: cleanText(conceptualMaps),
        conceptImage: null,
        conceptImageDescription: null,
        characterVisuals: [],
        scenarioVisuals: [],
        userIdea,
        worldType
      };

      // Generate visual content if requested
      if (generateVisuals) {
        console.log('Starting visual content generation...');
        worldData = await generateAllVisualContent(worldData);
      }

      setIsLoading(false);
      return worldData;

    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  };

  return {
    generateWorldContent,
    generateImageWithFallback,
    isLoading,
    error,
    setError,
    imageGenerationProgress
  };
};

export default useGeminiApi;