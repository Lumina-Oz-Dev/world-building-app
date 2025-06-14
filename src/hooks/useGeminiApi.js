import { useState } from 'react';

/**
 * Custom hook for interacting with Google Gemini API
 * Handles both text generation and image generation
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
   * Generate an image using a different approach - try text-to-image with Gemini
   * @param {string} prompt - The image description prompt
   * @returns {Promise<string>} Base64 encoded image data or null
   */
  const generateImage = async (prompt) => {
    // For now, let's try a different model or approach
    // The imagen API might not be available, so we'll use a placeholder approach
    
    try {
      // Try the direct imagen endpoint first
      const url = `https://generativelanguage.googleapis.com/v1/models/imagen-3.0-generate:generateImage?key=${apiKey}`;
      
      const requestBody = {
        prompt: prompt,
        sampleCount: 1,
        aspectRatio: "16:9",
        safetyFilterLevel: "BLOCK_ONLY_HIGH",
        personGeneration: "ALLOW_ADULT"
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        const data = await response.json();
        if (data.candidates && data.candidates[0] && data.candidates[0].image) {
          return data.candidates[0].image.data;
        }
      }

      // If that doesn't work, try the beta endpoint
      const betaUrl = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-fast-generate:generateImage?key=${apiKey}`;
      
      const betaResponse = await fetch(betaUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          aspectRatio: "16:9"
        })
      });

      if (betaResponse.ok) {
        const betaData = await betaResponse.json();
        if (betaData.generatedImages && betaData.generatedImages[0]) {
          return betaData.generatedImages[0].generatedImage.data;
        }
      }

      console.warn('Image generation not available with current API configuration');
      return null;

    } catch (err) {
      console.error('Error generating image:', err);
      return null;
    }
  };

  /**
   * Main function to generate complete world content
   * @param {string} userIdea - User's core world idea
   * @param {string} worldType - Selected world type
   * @returns {Promise<Object>} Complete world data including all sections
   */
  const generateWorldContent = async (userIdea, worldType) => {
    setIsLoading(true);
    setError(null);

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

      // Generate concept art image (allow failure without breaking the whole process)
      let conceptImage = null;
      try {
        const imagePrompt = `Generate a concept art image of a ${worldType} world, inspired by the idea: "${userIdea}". Focus on key visual elements and atmosphere. The image should be cinematic, detailed, and capture the essence of this unique world. High quality digital art style.`;
        conceptImage = await generateImage(imagePrompt);
      } catch (imageErr) {
        console.warn('Image generation failed, continuing without image:', imageErr.message);
        conceptImage = null;
      }

      setIsLoading(false);
      
      return {
        worldNarrative: cleanText(worldNarrative),
        gameBookIdeas: Array.isArray(gameBookIdeas) ? gameBookIdeas : [],
        customizationOptions: Array.isArray(customizationOptions) ? customizationOptions : [],
        characterConcepts: Array.isArray(characterConcepts) ? characterConcepts : [],
        conceptualMaps: cleanText(conceptualMaps),
        conceptImage,
        userIdea,
        worldType
      };

    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  };

  return {
    generateWorldContent,
    isLoading,
    error,
    setError
  };
};

export default useGeminiApi;