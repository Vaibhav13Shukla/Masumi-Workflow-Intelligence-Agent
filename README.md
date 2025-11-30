# Masumi - AI-Powered Workflow Automation on Cardano

![Masumi Banner](https://img.shields.io/badge/Cardano-Hackathon-blue?style=for-the-badge&logo=cardano)
![Status](https://img.shields.io/badge/Status-Demo%20Ready-success?style=for-the-badge)

**Masumi** is an AI-powered workflow automation platform that captures user actions, detects patterns, generates automation code using AI, and mints agents as NFTs on the Cardano blockchain.

## 🎯 Overview

Masumi transforms repetitive workflows into autonomous AI agents:
1. **Browser extension** captures your actions across websites
2. **Pattern detection** identifies repetitive workflows automatically
3. **AI code generation** creates Python automation scripts using Gemini AI
4. **NFT minting** deploys agents as Cardano NFTs for ownership and monetization

## ✨ Features

- 🎨 **3D Animated UI** - Beautiful landing page with Three.js particle system
- 🤖 **AI Code Generation** - Gemini AI generates production-ready Python/Selenium scripts
- 🔗 **Cardano Integration** - NFT minting following CIP-25 standard
- 📊 **Real-time Dashboard** - Live pattern detection and statistics
- 🔌 **Browser Extension** - Captures user actions across all websites
- 📈 **Pattern Detection** - Automatically identifies repetitive workflows

## 🏗️ Architecture

```
┌─────────────────┐
│ Browser Extension│
│  (Action Capture)│
└────────┬─────────┘
         │
         ▼
┌─────────────────┐      ┌──────────────┐
│  Backend API    │◄────►│  Gemini AI   │
│   (FastAPI)     │      │ (Code Gen)   │
└────────┬─────────┘      └──────────────┘
         │
         ▼
┌─────────────────┐      ┌──────────────┐
│  Frontend UI    │      │   Cardano    │
│  (React + 3D)   │      │  Blockchain  │
└─────────────────┘      └──────────────┘
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+
- **Python** 3.9+
- **npm** or **yarn**

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/masumi-workflow-intelligence.git
cd masumi-workflow-intelligence
```

2. **Install dependencies**
```bash
# Frontend
npm install

# Backend
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ..
```

3. **Configure environment** (Optional)
```bash
# Create .env.local for Gemini AI
echo "GEMINI_API_KEY=your_api_key_here" > .env.local
```
Get your API key from: https://aistudio.google.com/apikey

4. **Start the application**
```bash
# Option 1: Start everything at once
./start-all.sh

# Option 2: Start services separately
./start-backend.sh  # Terminal 1
npm run dev         # Terminal 2
```

5. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## 🎮 Demo Mode

1. Open http://localhost:3000
2. Click **"Launch App"**
3. Demo mode activates with 3 pre-loaded patterns
4. Click **"Generate Agent"** on any pattern
5. View AI-generated code
6. Click **"Mint as NFT"** to simulate blockchain minting

## 🧩 Browser Extension

### Installation

1. Open Chrome/Edge: `chrome://extensions/`
2. Enable **"Developer mode"**
3. Click **"Load unpacked"**
4. Select the `extension` folder
5. Extension icon appears in toolbar

### Usage

- Browse any website with the extension active
- Actions are automatically captured and sent to the backend
- After 3+ similar sequences, patterns are auto-detected
- View detected patterns in the dashboard

## 📁 Project Structure

```
masumi-workflow-intelligence/
├── backend/              # FastAPI backend
│   ├── main.py          # API endpoints
│   ├── database.py      # Data storage
│   ├── models.py        # Pydantic models
│   ├── blockchain.py    # Cardano integration
│   └── requirements.txt # Python dependencies
├── components/          # React components
│   ├── Hero3D.tsx      # 3D visualization
│   └── MintModal.tsx   # NFT minting UI
├── pages/              # React pages
│   ├── Landing.tsx     # Landing page
│   └── Dashboard.tsx   # Main dashboard
├── services/           # API services
│   ├── api.ts         # Backend client
│   └── gemini.ts      # AI integration
├── extension/          # Browser extension
│   ├── manifest.json  # Extension config
│   ├── content.js     # Action recorder
│   └── background.js  # Service worker
├── App.tsx            # Main React app
├── store.ts           # State management
└── types.ts           # TypeScript types
```

## 🔧 Technology Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Three.js** - 3D graphics
- **Framer Motion** - Animations
- **Zustand** - State management
- **Recharts** - Data visualization

### Backend
- **FastAPI** - Python web framework
- **Uvicorn** - ASGI server
- **Google Generative AI** - Gemini for code generation
- **Pydantic** - Data validation

### Blockchain
- **Cardano** - NFT minting (simulated for demo)
- **CIP-25** - NFT metadata standard
- **IPFS** - Code storage (simulated)

## 📊 API Endpoints

### Health Check
```bash
GET /
```

### Track Action
```bash
POST /api/track
Content-Type: application/json

{
  "user_id": "demo_user",
  "type": "click",
  "target": "BUTTON#submit",
  "url": "https://example.com",
  "timestamp": 1701360000000,
  "metadata": {}
}
```

### Get Patterns
```bash
GET /api/patterns?user_id=demo_user
```

### Generate Code
```bash
POST /api/generate
Content-Type: application/json

{
  "pattern_id": "p1",
  "name": "Weekly Report",
  "description": "Export and email reports"
}
```

### Mint NFT
```bash
POST /api/mint
Content-Type: application/json

{
  "pattern_id": "p1",
  "name": "Weekly Report Agent",
  "description": "Automated report generation"
}
```

## 🧪 Testing

### Check Status
```bash
./check-status.sh
```

### View Logs
```bash
# Backend
tail -f backend.log

# Frontend
tail -f frontend.log
```

### Test API
```bash
# Health check
curl http://localhost:8000/

# Track action
curl -X POST http://localhost:8000/api/track \
  -H "Content-Type: application/json" \
  -d '{"user_id":"test","type":"click","target":"BUTTON","url":"https://test.com","timestamp":1701360000000,"metadata":{}}'
```

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check Python version
python3 --version  # Need 3.9+

# Recreate virtual environment
rm -rf backend/venv
python3 -m venv backend/venv
source backend/venv/bin/activate
pip install -r backend/requirements.txt
```

### Frontend won't start
```bash
# Check Node version
node --version  # Need 18+

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Port already in use
```bash
# Kill process on port 8000
kill -9 $(lsof -t -i:8000)

# Kill process on port 3000
kill -9 $(lsof -t -i:3000)
```

## 📚 Documentation

- **ARCHITECTURE.md** - Detailed system architecture
- **SETUP.md** - Complete setup guide
- **TROUBLESHOOTING.md** - Common issues and solutions
- **RUNNING_SERVICES.md** - Service management

## 🚢 Production Deployment

For production, you'll need:

1. **Database** - Replace file-based storage with PostgreSQL/MongoDB
2. **Blockchain** - Integrate PyCardano for real Cardano transactions
3. **IPFS** - Use Pinata or Web3.Storage for code storage
4. **Authentication** - Add user accounts (JWT, OAuth)
5. **API Keys** - Secure key management (AWS Secrets Manager)
6. **Scaling** - Redis caching, Celery for async tasks

## 🎯 Roadmap

- [ ] Real Cardano mainnet integration
- [ ] Agent marketplace
- [ ] Execution tracking and royalties
- [ ] Multi-chain support (Ethereum, Polygon)
- [ ] Advanced pattern detection with ML
- [ ] Agent collaboration and composition

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for the Cardano Hackathon
- Powered by Google Gemini AI
- Inspired by the future of work automation

## 📧 Contact

- **Project Link**: https://github.com/yourusername/masumi-workflow-intelligence
- **Demo Video**: [Coming Soon]
- **Documentation**: [Wiki](https://github.com/yourusername/masumi-workflow-intelligence/wiki)

---

**Built with ❤️ for the Cardano ecosystem**

*Transform your workflows into autonomous agents on the blockchain*
