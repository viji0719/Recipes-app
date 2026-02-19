#!/bin/bash
# Recipe Explorer - One-command startup script

echo "🍽️  Starting Recipe Explorer..."
echo ""

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required. Please install it first."
    exit 1
fi

# Check Node
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required. Please install it first."
    exit 1
fi

# Backend setup
echo "📦 Installing backend dependencies..."
cd backend
pip install -r requirements.txt -q
echo ""

# Start backend in background
echo "🚀 Starting backend API on http://localhost:8000 ..."
uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!
echo "   Backend PID: $BACKEND_PID"
echo ""

# Wait for backend to be ready
sleep 3

# Frontend setup
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install --silent
echo ""

echo "🎨 Starting frontend on http://localhost:5173 ..."
npm run dev &
FRONTEND_PID=$!
echo "   Frontend PID: $FRONTEND_PID"
echo ""

echo "✅ Both services are running!"
echo "   • Frontend: http://localhost:5173"
echo "   • Backend API: http://localhost:8000"
echo "   • API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop both services."

# Wait for both processes
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo ''; echo '👋 Stopped.'; exit" INT TERM
wait
