/**
 * Test script to check available image generation endpoints
 * Run this with: node test-image-generation.js
 */

const API_KEY = 'AIzaSyA85hInKyNUv19yIR2E7VSoEwYXE_lWH8Y';

async function testImageGeneration() {
    console.log('Testing Gemini Image Generation Endpoints...\n');
    
    const testPrompt = "A beautiful fantasy landscape with mountains and magic";
    
    // Test different endpoints
    const endpoints = [
        {
            name: "Imagen 3.0 Generate",
            url: `https://generativelanguage.googleapis.com/v1/models/imagen-3.0-generate:generateImage?key=${API_KEY}`,
            body: {
                prompt: testPrompt,
                sampleCount: 1,
                aspectRatio: "16:9"
            }
        },
        {
            name: "Imagen 3.0 Fast Generate",
            url: `https://generativelanguage.googleapis.com/v1/models/imagen-3.0-fast-generate:generateImage?key=${API_KEY}`,
            body: {
                prompt: testPrompt,
                aspectRatio: "16:9"
            }
        },
        {
            name: "Imagen 3.0 Beta",
            url: `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate:generateImage?key=${API_KEY}`,
            body: {
                prompt: testPrompt,
                aspectRatio: "16:9"
            }
        }
    ];
    
    for (const endpoint of endpoints) {
        console.log(`Testing: ${endpoint.name}`);
        console.log(`URL: ${endpoint.url}`);
        
        try {
            const response = await fetch(endpoint.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(endpoint.body)
            });
            
            console.log(`Status: ${response.status}`);
            
            if (response.ok) {
                const data = await response.json();
                console.log('Success! Response structure:', Object.keys(data));
                
                if (data.candidates) {
                    console.log('Found candidates:', data.candidates.length);
                }
                if (data.generatedImages) {
                    console.log('Found generatedImages:', data.generatedImages.length);
                }
                
                console.log('✅ This endpoint works!\n');
                return endpoint;
            } else {
                const errorText = await response.text();
                console.log('Error response:', errorText);
                console.log('❌ This endpoint failed\n');
            }
        } catch (error) {
            console.log('Network error:', error.message);
            console.log('❌ This endpoint failed\n');
        }
    }
    
    console.log('❌ No working image generation endpoints found');
    return null;
}

// Test if we can use text generation to create image descriptions as fallback
async function testTextGeneration() {
    console.log('Testing text generation as fallback...\n');
    
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
    
    const requestBody = {
        contents: [{
            parts: [{
                text: "Create a detailed visual description for a fantasy world concept art. Describe colors, composition, lighting, and atmosphere in vivid detail."
            }]
        }],
        generationConfig: {
            temperature: 0.8,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1000,
        }
    };
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Text generation works');
            console.log('Generated description:', data.candidates[0].content.parts[0].text);
            return true;
        } else {
            console.log('❌ Text generation failed');
            return false;
        }
    } catch (error) {
        console.log('❌ Text generation error:', error.message);
        return false;
    }
}

// Run tests
async function runTests() {
    const workingImageEndpoint = await testImageGeneration();
    const textWorks = await testTextGeneration();
    
    console.log('\n=== TEST RESULTS ===');
    console.log('Image Generation:', workingImageEndpoint ? '✅ Available' : '❌ Not Available');
    console.log('Text Generation:', textWorks ? '✅ Available' : '❌ Not Available');
    
    if (!workingImageEndpoint) {
        console.log('\n💡 Recommendation: Implement placeholder images with rich descriptions instead');
    }
}

runTests().catch(console.error);
