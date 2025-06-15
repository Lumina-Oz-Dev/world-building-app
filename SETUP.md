# World Building App Setup Guide

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   - Copy `.env.example` to `.env` (if it doesn't exist, create `.env`)
   - Add your Google Gemini API key:
     ```
     REACT_APP_GEMINI_API_KEY=your_api_key_here
     ```

3. **Start the development server:**
   ```bash
   npm start
   ```

## Common Issues & Solutions

### Error: "API key not configured"
- Make sure you have a `.env` file in the root directory
- Ensure `REACT_APP_GEMINI_API_KEY` is set in your `.env` file
- Restart the development server after adding environment variables

### Error: "Module not found"
- Run `npm install` to install all dependencies
- Check that all imports are correct

### CORS Issues with Gemini API
- The Gemini API should work from localhost
- If you encounter CORS issues, you may need to use a proxy or backend service

### Build Issues
- Make sure you're using Node.js 14 or later
- Clear the cache: `npm start -- --reset-cache`

## Features

- ✨ AI-powered world generation using Google Gemini
- 🎭 Character concepts with detailed descriptions
- 🎮 Game and book ideas based on your world
- 🗺️ Conceptual maps and regions
- 🎨 Concept art generation (when available)
- 📄 PDF export functionality
- 🎨 Beautiful Tailwind CSS styling

## Tech Stack

- React 18
- Tailwind CSS (via CDN)
- Google Gemini 2.0 Flash API
- jsPDF for PDF export
- HTML2Canvas for capturing content

Built with ❤️ by Lumina Oz Game Dev
