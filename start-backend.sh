#!/bin/bash

echo "🚀 Starting Masumi Backend..."

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 not found. Please install Python 3.9+"
    exit 1
fi

# Check if port 8000 is already in use
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠️  Port 8000 is already in use. Stopping existing process..."
    kill -9 $(lsof -t -i:8000) 2>/dev/null
    sleep 2
fi

# Check if virtual environment exists
if [ ! -d "backend/venv" ]; then
    echo "📦 Creating virtual environment..."
    cd backend
    python3 -m venv venv
    cd ..
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source backend/venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install -q -r backend/requirements.txt

# Create data directory
mkdir -p backend/data

# Start the backend
echo "✅ Backend starting on http://localhost:8000"
echo "📝 Logs will be written to backend.log"
cd backend
python main.py 2>&1 | tee -a ../backend.log
