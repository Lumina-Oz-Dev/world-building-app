#!/bin/bash

echo "🌟 World Building App Setup & Start"
echo "=================================="

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
else
    echo "✅ Dependencies already installed"
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found!"
    echo "📋 Please copy .env.example to .env and add your API key"
    echo "   cp .env.example .env"
    echo "   Then edit .env with your Google Gemini API key"
    echo ""
fi

echo "🚀 Starting development server..."
echo "📱 Your app will open at http://localhost:3000"
echo ""
npm start
