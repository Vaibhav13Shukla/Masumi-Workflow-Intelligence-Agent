#!/bin/bash

echo "🌟 Starting Masumi Workflow Intelligence Platform"
echo "=================================================="
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down services..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# Start backend in background
echo "1️⃣  Starting Backend Server..."
bash start-backend.sh > backend.log 2>&1 &
BACKEND_PID=$!
sleep 3

# Check if backend started
if ps -p $BACKEND_PID > /dev/null; then
    echo "   ✅ Backend running on http://localhost:8000"
else
    echo "   ❌ Backend failed to start. Check backend.log"
    exit 1
fi

# Start frontend in background
echo ""
echo "2️⃣  Starting Frontend..."
bash start-frontend.sh > frontend.log 2>&1 &
FRONTEND_PID=$!
sleep 3

# Check if frontend started
if ps -p $FRONTEND_PID > /dev/null; then
    echo "   ✅ Frontend running on http://localhost:5173"
else
    echo "   ❌ Frontend failed to start. Check frontend.log"
    kill $BACKEND_PID
    exit 1
fi

echo ""
echo "=================================================="
echo "🎉 Masumi is ready!"
echo ""
echo "📱 Open your browser to: http://localhost:5173"
echo "🔧 API Documentation: http://localhost:8000/docs"
echo ""
echo "📝 Logs:"
echo "   Backend:  tail -f backend.log"
echo "   Frontend: tail -f frontend.log"
echo ""
echo "Press Ctrl+C to stop all services"
echo "=================================================="

# Wait for processes
wait
