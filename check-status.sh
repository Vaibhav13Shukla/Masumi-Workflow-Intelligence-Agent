#!/bin/bash

echo "🔍 Masumi Platform Status Check"
echo "================================"
echo ""

# Check Backend
echo -n "Backend (port 8000): "
if curl -s http://localhost:8000/ > /dev/null 2>&1; then
    echo "✅ Running"
    curl -s http://localhost:8000/ | python3 -m json.tool 2>/dev/null || echo ""
else
    echo "❌ Not running"
fi

echo ""

# Check Frontend
echo -n "Frontend (port 3000): "
if curl -s http://localhost:3000/ > /dev/null 2>&1; then
    echo "✅ Running"
else
    echo "❌ Not running"
fi

echo ""

# Check processes
echo "Running Processes:"
ps aux | grep -E "(uvicorn|vite)" | grep -v grep | awk '{print "  PID " $2 ": " $11 " " $12 " " $13}'

echo ""
echo "================================"
echo "📝 View logs:"
echo "  Backend:  tail -f backend.log"
echo "  Frontend: tail -f frontend.log"
