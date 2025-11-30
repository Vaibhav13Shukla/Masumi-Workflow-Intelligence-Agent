# Masumi Workflow Intelligence - Setup Guide

## 🏗️ Architecture Overview

Masumi is an AI-powered workflow automation platform with three main components:

### 1. **Frontend (React + Vite + Three.js)**
- Modern React UI with 3D visualizations
- Real-time pattern detection dashboard
- Agent code viewer and NFT minting interface
- Built with TypeScript, Zustand for state management

### 2. **Backend (FastAPI + Python)**
- RESTful API for action tracking and pattern detection
- Gemini AI integration for code generation
- Cardano blockchain integration for NFT minting
- File-based database for demo purposes

### 3. **Browser Extension (Chrome/Edge)**
- Captures user actions across websites
- Tracks clicks, inputs, form submissions
- Sends data to backend for pattern analysis

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **Python** (v3.9 or higher)
- **npm** or **yarn**
- **Chrome/Edge browser** (for extension)

## 🚀 Quick Start

### Option 1: Start Everything at Once

```bash
./start-all.sh
```

This will:
- Install all dependencies
- Start backend on `http://localhost:8000`
- Start frontend on `http://localhost:5173`
- Show logs and status

### Option 2: Start Services Separately

#### Start Backend
```bash
./start-backend.sh
```

#### Start Frontend (in another terminal)
```bash
./start-frontend.sh
```

## 🔑 Configuration

### 1. Gemini API Key (Optional but Recommended)

For AI code generation, add your Gemini API key:

1. Get your key from: https://aistudio.google.com/apikey
2. Edit `.env.local`:
   ```bash
   GEMINI_API_KEY=your_actual_api_key_here
   ```

**Note:** The app works without this (uses mock code), but AI generation will be limited.

### 2. Environment Variables

**Frontend** (`.env.local`):
```bash
GEMINI_API_KEY=your_gemini_api_key
```

**Backend** (auto-loaded from `.env.local`):
- Same file is used by both frontend and backend

## 🧩 Browser Extension Setup

### Install the Extension

1. Open Chrome/Edge and go to: `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right)
3. Click "Load unpacked"
4. Select the `extension` folder from this project
5. The Masumi icon should appear in your toolbar

### Test the Extension

1. Click the Masumi extension icon
2. You should see "Masumi Recorder Active"
3. Browse any website - your actions are being tracked!
4. Check the backend logs to see actions being received

## 📁 Project Structure

```
masumi-workflow-intelligence/
├── backend/
│   ├── main.py              # FastAPI server
│   ├── database.py          # Data storage layer
│   ├── models.py            # Pydantic models
│   ├── blockchain.py        # Cardano integration
│   ├── requirements.txt     # Python dependencies
│   └── data/                # JSON database files
├── components/
│   ├── Hero3D.tsx           # 3D visualization
│   └── MintModal.tsx        # NFT minting UI
├── pages/
│   ├── Landing.tsx          # Landing page
│   └── Dashboard.tsx        # Main dashboard
├── services/
│   ├── api.ts               # Backend API client
│   └── gemini.ts            # Gemini AI integration
├── extension/
│   ├── manifest.json        # Extension config
│   ├── background.js        # Service worker
│   ├── content.js           # Action recorder
│   └── popup.html           # Extension popup
├── App.tsx                  # Main React app
├── store.ts                 # Zustand state management
├── types.ts                 # TypeScript types
└── constants.ts             # Mock data

```

## 🎯 How It Works

### 1. Action Tracking
- Browser extension captures user actions (clicks, inputs, navigation)
- Actions sent to backend via `/api/track` endpoint
- Stored in `backend/data/actions.json`

### 2. Pattern Detection
- Backend analyzes action sequences
- Detects repeated workflows (3+ occurrences)
- Creates pattern objects with confidence scores
- Stored in `backend/data/patterns.json`

### 3. Code Generation
- User selects a detected pattern
- Backend calls Gemini AI with pattern description
- Generates Python automation script (Selenium-based)
- Code stored with pattern

### 4. NFT Minting
- User mints agent as NFT on Cardano
- Code uploaded to IPFS (simulated)
- NFT metadata follows CIP-25 standard
- Transaction hash returned and stored

## 🧪 Testing the Full Flow

### Demo Mode (No Extension Required)

1. Start the app: `./start-all.sh`
2. Open: `http://localhost:5173`
3. Click "Activate Demo Mode"
4. You'll see 3 pre-loaded patterns
5. Click "Generate Agent" on any pattern
6. View the generated code
7. Click "Mint as NFT" to simulate blockchain minting

### Live Mode (With Extension)

1. Install the browser extension (see above)
2. Start the app
3. Browse websites and perform repetitive tasks
4. Return to Masumi dashboard
5. Watch patterns appear in real-time!

## 🔧 Development

### Backend Development

```bash
cd backend
source venv/bin/activate
python main.py
```

API docs available at: `http://localhost:8000/docs`

### Frontend Development

```bash
npm run dev
```

Hot reload enabled - changes reflect immediately.

### Database

Data stored in `backend/data/`:
- `actions.json` - User actions
- `patterns.json` - Detected patterns

To reset: `rm -rf backend/data/*.json`

## 🐛 Troubleshooting

### Backend won't start
- Check Python version: `python3 --version` (need 3.9+)
- Install dependencies: `pip install -r backend/requirements.txt`
- Check port 8000 is free: `lsof -i :8000`

### Frontend won't start
- Check Node version: `node --version` (need 18+)
- Clear cache: `rm -rf node_modules && npm install`
- Check port 5173 is free: `lsof -i :5173`

### Extension not working
- Check extension is enabled in `chrome://extensions/`
- Check console for errors (F12 → Console)
- Verify backend is running on port 8000

### No patterns detected
- Perform the same action sequence 3+ times
- Check backend logs: `tail -f backend.log`
- Verify actions are being received: `cat backend/data/actions.json`

## 📊 API Endpoints

### `POST /api/track`
Track a user action
```json
{
  "user_id": "demo_user",
  "type": "click",
  "target": "button#submit",
  "url": "https://example.com",
  "timestamp": 1234567890,
  "metadata": {}
}
```

### `GET /api/patterns?user_id=demo_user`
Get detected patterns

### `POST /api/generate`
Generate agent code
```json
{
  "pattern_id": "p1",
  "name": "Weekly Report",
  "description": "Export and email reports"
}
```

### `POST /api/mint`
Mint agent as NFT
```json
{
  "pattern_id": "p1",
  "name": "Weekly Report Agent",
  "description": "Automated report generation"
}
```

## 🚢 Production Deployment

For production, you'll need:

1. **Database**: Replace file-based DB with PostgreSQL/MongoDB
2. **IPFS**: Use Pinata or Web3.Storage for code storage
3. **Cardano**: Integrate PyCardano for real blockchain transactions
4. **Authentication**: Add user auth (JWT, OAuth)
5. **API Keys**: Secure key management (AWS Secrets Manager, etc.)

## 📝 License

MIT License - See LICENSE file

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.

## 📧 Support

For issues or questions, open a GitHub issue.

---

**Built with ❤️ for the Cardano ecosystem**
