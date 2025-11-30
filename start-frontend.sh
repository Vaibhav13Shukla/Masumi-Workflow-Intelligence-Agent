#!/bin/bash

echo "🚀 Starting Masumi Frontend..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if .env.local has API key
if grep -q "PLACEHOLDER_API_KEY" .env.local; then
    echo "⚠️  Warning: GEMINI_API_KEY is not set in .env.local"
    echo "   The app will work with mock data, but AI code generation will be limited."
    echo "   Get your API key from: https://aistudio.google.com/apikey"
fi

# Start the frontend
echo "✅ Frontend starting on http://localhost:5173"
npm run dev
