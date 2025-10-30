#!/bin/bash

echo "🚀 Starting Torro Frontend + Backend"
echo ""

# Kill existing processes
pkill -f "uvicorn|vite" 2>/dev/null
sleep 2

# Backend
echo "📦 Starting Backend on http://localhost:8000"
cd server/torro2-backend
if [ ! -d ".venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv .venv
    source .venv/bin/activate
    pip install -r requirements.txt
else
    source .venv/bin/activate
fi
uvicorn main:app --host 127.0.0.1 --port 8000 --reload > /tmp/backend.log 2>&1 &

# Frontend
echo "🎨 Starting Frontend on http://localhost:5173"
cd ../..
cd server
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi
npm start > /tmp/frontend.log 2>&1 &

echo ""
echo "✅ Servers started!"
echo "📊 Backend logs: tail -f /tmp/backend.log"
echo "🎨 Frontend logs: tail -f /tmp/frontend.log"
echo ""
echo "📱 Open http://localhost:5173 in your browser"
echo "📚 API docs at http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for interrupt
wait

