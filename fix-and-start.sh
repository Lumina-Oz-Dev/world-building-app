#!/bin/bash
cd /Users/diegomartinez/Desktop/world-building-app-v1

echo "🔧 Fixing jsPDF dependency issue..."
echo "=================================="

# Remove node_modules and package-lock.json to start fresh
echo "🗑️  Cleaning old dependencies..."
rm -rf node_modules
rm -f package-lock.json

# Install dependencies fresh
echo "📦 Installing all dependencies..."
npm install

# Specifically install jsPDF and html2canvas
echo "📄 Installing PDF export dependencies..."
npm install jspdf html2canvas

echo "✅ Dependencies installed successfully!"
echo "🚀 Starting the app..."
npm start
