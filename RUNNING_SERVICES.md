# ✅ Masumi Platform - Running Services

## 🎉 Status: ALL SYSTEMS OPERATIONAL

### Services Running

| Service | Status | URL | Port |
|---------|--------|-----|------|
| **Backend API** | ✅ Running | http://localhost:8000 | 8000 |
| **Frontend UI** | ✅ Running | http://localhost:3000 | 3000 |
| **API Docs** | ✅ Available | http://localhost:8000/docs | 8000 |
| **Database** | ✅ Active | File-based (backend/data/) | - |

---

## 🚀 Quick Access

### Open the Application
```
http://localhost:3000
```

### API Documentation (Swagger)
```
http://localhost:8000/docs
```

### Test Backend Health
```bash
curl http://localhost:8000/
```

---

## 📊 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser Extension                        │
│              (Captures user workflow actions)                │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP POST /api/track
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend (FastAPI)                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Pattern    │  │    Gemini    │  │  Blockchain  │      │
│  │  Detection   │  │  AI Code Gen │  │  NFT Minting │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  Port: 8000                                                   │
└────────────────────────┬────────────────────────────────────┘
                         │ REST API
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Frontend (React + Vite + Three.js)              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Dashboard   │  │  3D Visual   │  │  NFT Minting │      │
│  │   Patterns   │  │  Animation   │  │     UI       │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  Port: 3000                                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 How to Use

### 1. Access the Application
Open your browser and go to: **http://localhost:3000**

### 2. Activate Demo Mode
- Click "Launch App" on the landing page
- This loads 3 pre-configured workflow patterns
- No extension needed for demo mode

### 3. Generate AI Agent
- Select any detected pattern
- Click "Generate Agent"
- Watch as Gemini AI creates Python automation code
- View the generated code in the modal

### 4. Mint as NFT
- After code generation, click "Mint as NFT"
- Simulates Cardano blockchain transaction
- Receives transaction hash
- Agent is now "deployed"

### 5. Install Browser Extension (Optional)
For live action tracking:
1. Open `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `extension` folder
5. Browse websites - actions are tracked automatically!

---

## 🔧 Management Commands

### Check Status
```bash
./check-status.sh
```

### View Logs
```bash
# Backend logs
tail -f backend.log

# Frontend logs
tail -f frontend.log
```

### Stop Services
```bash
# Stop backend
pkill -f "python backend/main.py"

# Stop frontend
pkill -f vite

# Or stop both
pkill -f uvicorn && pkill -f vite
```

### Restart Services
```bash
# Restart everything
./start-all.sh

# Or restart individually
./start-backend.sh
./start-frontend.sh
```

---

## 📁 Data Storage

### Actions Database
```
backend/data/actions.json
```
Stores all captured user actions from the browser extension.

### Patterns Database
```
backend/data/patterns.json
```
Stores detected workflow patterns with generated code and NFT data.

### Reset Database
```bash
rm -rf backend/data/*.json
# Restart backend to recreate empty files
```

---

## 🧪 API Endpoints

### Health Check
```bash
GET http://localhost:8000/
```

### Track Action
```bash
POST http://localhost:8000/api/track
Content-Type: application/json

{
  "user_id": "demo_user",
  "type": "click",
  "target": "button#submit",
  "url": "https://example.com",
  "timestamp": 1234567890,
  "metadata": {}
}
```

### Get Patterns
```bash
GET http://localhost:8000/api/patterns?user_id=demo_user
```

### Generate Code
```bash
POST http://localhost:8000/api/generate
Content-Type: application/json

{
  "pattern_id": "p1",
  "name": "Weekly Report",
  "description": "Export and email reports"
}
```

### Mint NFT
```bash
POST http://localhost:8000/api/mint
Content-Type: application/json

{
  "pattern_id": "p1",
  "name": "Weekly Report Agent",
  "description": "Automated report generation"
}
```

---

## 🐛 Troubleshooting

### TypeScript Error: "Cannot find module 'react'"

This is an IDE issue, not a runtime error. The code compiles fine.

**Fix**: Restart your TypeScript server
- VS Code: `Ctrl+Shift+P` → "TypeScript: Restart TS Server"
- Or reload your editor window

See **TROUBLESHOOTING.md** for detailed solutions.

### Services Won't Start

Check if ports are already in use:
```bash
lsof -i :8000  # Backend
lsof -i :3000  # Frontend
```

Kill existing processes:
```bash
kill -9 <PID>
```

---

## 📝 Environment Configuration

### Gemini API Key (Optional)

Edit `.env.local`:
```bash
GEMINI_API_KEY=your_actual_api_key_here
```

Get your key from: https://aistudio.google.com/apikey

**Note**: The app works without this (uses mock code generation).

---

## 🎨 Tech Stack

### Frontend
- React 19
- TypeScript
- Vite (build tool)
- Three.js + React Three Fiber (3D graphics)
- Framer Motion (animations)
- Zustand (state management)
- Recharts (data visualization)

### Backend
- FastAPI (Python web framework)
- Uvicorn (ASGI server)
- Google Generative AI (Gemini)
- Pydantic (data validation)
- File-based JSON database

### Browser Extension
- Chrome Extension Manifest V3
- Content scripts for action capture
- Background service worker

---

## 📊 Current State

✅ Backend API running and healthy
✅ Frontend UI accessible
✅ Database initialized
✅ TypeScript configuration fixed
✅ All dependencies installed
✅ File watchers limit increased
✅ Demo mode ready to use

---

## 🎯 Next Steps

1. **Open the app**: http://localhost:3000
2. **Try demo mode**: Click "Launch App"
3. **Generate an agent**: Select a pattern and click "Generate Agent"
4. **Mint as NFT**: Click "Mint as NFT" after generation
5. **Install extension**: Load the extension from the `extension` folder
6. **Track real workflows**: Browse websites with the extension active

---

## 📚 Documentation

- **SETUP.md** - Complete setup guide
- **TROUBLESHOOTING.md** - Common issues and solutions
- **README.md** - Project overview
- **ARCHITECTURE.md** - Technical architecture details

---

**Built with ❤️ for the Cardano ecosystem**

Last updated: 2025-11-30
