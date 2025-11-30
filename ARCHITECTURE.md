# Masumi Workflow Intelligence - Architecture

## System Overview

Masumi is an AI-powered workflow automation platform that captures user actions, detects patterns, generates automation code using AI, and mints agents as NFTs on the Cardano blockchain.

## High-Level Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                         User's Browser                            │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │              Masumi Browser Extension                       │  │
│  │  • Content Script (captures DOM events)                    │  │
│  │  • Background Worker (buffers & sends data)                │  │
│  └────────────────────┬───────────────────────────────────────┘  │
└─────────────────────────┼──────────────────────────────────────────┘
                          │
                          │ HTTP POST /api/track
                          │ (Action data)
                          ▼
┌──────────────────────────────────────────────────────────────────┐
│                      Backend Server (FastAPI)                     │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                     API Layer                               │  │
│  │  • /api/track - Receive actions                            │  │
│  │  • /api/patterns - Get detected patterns                   │  │
│  │  • /api/generate - Generate agent code                     │  │
│  │  • /api/mint - Mint agent as NFT                           │  │
│  └────────────────────┬───────────────────────────────────────┘  │
│                       │                                            │
│  ┌────────────────────┴───────────────────────────────────────┐  │
│  │                  Business Logic Layer                       │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │  │
│  │  │   Database   │  │   Pattern    │  │  Blockchain  │     │  │
│  │  │   Service    │  │  Detection   │  │   Service    │     │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘     │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                  External Integrations                      │  │
│  │  ┌──────────────┐                  ┌──────────────┐        │  │
│  │  │  Gemini AI   │                  │   Cardano    │        │  │
│  │  │  (Code Gen)  │                  │  Blockchain  │        │  │
│  │  └──────────────┘                  └──────────────┘        │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  Port: 8000                                                        │
└────────────────────────┬───────────────────────────────────────────┘
                         │
                         │ REST API (JSON)
                         │
                         ▼
┌──────────────────────────────────────────────────────────────────┐
│                   Frontend Application (React)                    │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                      UI Components                          │  │
│  │  • Landing Page (Hero3D, CTA)                              │  │
│  │  • Dashboard (Pattern List, Stats)                         │  │
│  │  • Mint Modal (Code Viewer, NFT Minting)                   │  │
│  └────────────────────┬───────────────────────────────────────┘  │
│                       │                                            │
│  ┌────────────────────┴───────────────────────────────────────┐  │
│  │                   State Management                          │  │
│  │  • Zustand Store (patterns, stats, logs)                   │  │
│  │  • API Service (backend communication)                     │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  Port: 3000                                                        │
└──────────────────────────────────────────────────────────────────┘
```

## Component Details

### 1. Browser Extension

**Purpose**: Capture user actions across all websites

**Components**:
- **content.js**: Injected into every webpage
  - Listens for DOM events (click, input, submit, navigation)
  - Extracts element selectors and metadata
  - Sends actions to background worker

- **background.js**: Service worker
  - Buffers actions to reduce API calls
  - Sends batched data to backend
  - Handles offline scenarios

- **manifest.json**: Extension configuration
  - Permissions: activeTab, storage, scripting
  - Host permissions: all URLs

**Data Flow**:
```
User Action → DOM Event → Content Script → Background Worker → Backend API
```

### 2. Backend Server (FastAPI)

**Purpose**: Process actions, detect patterns, generate code, mint NFTs

#### 2.1 API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/` | GET | Health check |
| `/api/track` | POST | Receive user action |
| `/api/patterns` | GET | Get detected patterns |
| `/api/generate` | POST | Generate agent code |
| `/api/mint` | POST | Mint agent as NFT |

#### 2.2 Database Service (`database.py`)

**Storage**: File-based JSON (demo) - easily replaceable with PostgreSQL/MongoDB

**Files**:
- `backend/data/actions.json` - User actions
- `backend/data/patterns.json` - Detected patterns

**Methods**:
```python
store_action(action: Dict) -> str
get_actions(user_id: str, limit: int) -> List[Dict]
detect_patterns(user_id: str) -> List[Dict]
get_patterns(user_id: str) -> List[Dict]
update_pattern_status(pattern_id: str, status: PatternStatus)
store_pattern_code(pattern_id: str, code: str)
store_pattern_tx(pattern_id: str, tx_hash: str)
```

**Pattern Detection Algorithm**:
1. Fetch recent actions for user (last 200)
2. Group actions into URL sequences (3-step sequences)
3. Count occurrences of each sequence
4. Create pattern if sequence repeats 3+ times
5. Calculate confidence score based on frequency
6. Estimate time saved (5 min per occurrence)

#### 2.3 Code Generation (`main.py`)

**AI Integration**: Google Gemini AI (gemini-1.5-flash)

**Process**:
1. Receive pattern description
2. Construct prompt for Gemini:
   - Task name and description
   - Requirements (error handling, env vars, modularity)
3. Call Gemini API
4. Clean up response (remove markdown)
5. Fallback to mock code if API fails

**Mock Code Generator**:
- Creates Selenium-based Python script
- Includes error handling and logging
- Uses headless Chrome
- Modular class structure

#### 2.4 Blockchain Service (`blockchain.py`)

**Purpose**: Mint AI agents as NFTs on Cardano

**Current Implementation**: Simulated (for demo)

**Production Requirements**:
- PyCardano for blockchain interaction
- IPFS for code storage (Pinata/Web3.Storage)
- Cardano wallet integration
- CIP-25 metadata standard

**Minting Process**:
1. Upload agent code to IPFS
2. Create CIP-25 compliant metadata
3. Build minting transaction
4. Sign with wallet
5. Submit to Cardano network
6. Return transaction hash

**Metadata Structure** (CIP-25):
```json
{
  "721": {
    "policy_id": "masumi_ai_agents_policy",
    "assets": {
      "agent_name": {
        "name": "Agent Name",
        "description": "Agent description",
        "image": "ipfs://...",
        "mediaType": "text/python",
        "files": [{
          "name": "agent.py",
          "mediaType": "text/python",
          "src": "ipfs://..."
        }],
        "attributes": {
          "type": "AI Automation Agent",
          "platform": "Masumi",
          "version": "1.0"
        }
      }
    }
  }
}
```

### 3. Frontend Application (React)

**Purpose**: User interface for viewing patterns and managing agents

#### 3.1 Pages

**Landing.tsx**:
- Hero section with 3D animation (Three.js)
- Feature showcase
- CTA buttons (Launch App, Watch Demo)
- Demo mode activation

**Dashboard.tsx**:
- Stats overview (actions, patterns, agents, time saved)
- Pattern list with status indicators
- Action buttons (Generate, Mint)
- Real-time logs
- 3D visualization

#### 3.2 Components

**Hero3D.tsx**:
- Three.js scene with animated particles
- Responsive canvas
- Performance optimized

**MintModal.tsx**:
- Code viewer with syntax highlighting
- NFT minting interface
- Status indicators
- Transaction hash display

#### 3.3 State Management (Zustand)

**Store Structure**:
```typescript
{
  walletConnected: boolean
  walletAddress: string | null
  patterns: Pattern[]
  stats: UserStats
  isDemoMode: boolean
  logs: LogEntry[]
  
  // Actions
  connectWallet()
  activateDemoMode()
  updatePatternStatus()
  addPattern()
  addLog()
}
```

#### 3.4 API Service (`services/api.ts`)

**Methods**:
```typescript
trackAction(action: any): Promise<void>
getPatterns(): Promise<Pattern[]>
generateCode(patternId, name, desc): Promise<any>
mintAgent(patternId, name, desc): Promise<any>
```

**Error Handling**:
- Graceful degradation if backend offline
- Silent failures for polling endpoints
- User-facing errors for actions

## Data Models

### Action
```typescript
{
  id: string
  user_id: string
  type: "click" | "input" | "submit" | "navigate"
  target: string  // CSS selector
  url: string
  timestamp: number
  metadata: object
}
```

### Pattern
```typescript
{
  id: string
  user_id: string
  name: string
  description: string
  frequency: number
  confidence: number  // 0-1
  time_saved: number  // minutes
  actions: Action[]
  status: AgentStatus
  code?: string
  tx_hash?: string
  created_at: number
}
```

### AgentStatus
```typescript
enum AgentStatus {
  DETECTED = "DETECTED"
  GENERATING = "GENERATING"
  READY_TO_MINT = "READY_TO_MINT"
  MINTING = "MINTING"
  DEPLOYED = "DEPLOYED"
}
```

## Security Considerations

### Current (Demo)
- No authentication
- No rate limiting
- API keys in environment variables
- File-based storage

### Production Requirements
- JWT authentication
- User accounts and sessions
- Rate limiting (per user/IP)
- Secure key management (AWS Secrets Manager)
- Database encryption
- HTTPS only
- CORS restrictions
- Input validation and sanitization
- SQL injection prevention (if using SQL DB)
- XSS protection

## Scalability Considerations

### Current Limitations
- File-based database (single server)
- No caching
- Synchronous processing
- No load balancing

### Production Improvements
- PostgreSQL/MongoDB for data
- Redis for caching and queues
- Celery for async task processing
- Load balancer (Nginx)
- Horizontal scaling (multiple backend instances)
- CDN for frontend assets
- WebSocket for real-time updates

## Deployment Architecture (Production)

```
┌─────────────────────────────────────────────────────────────┐
│                         CloudFlare CDN                       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                      Load Balancer (Nginx)                   │
└────────────────────────┬────────────────────────────────────┘
                         │
         ┌───────────────┴───────────────┐
         ▼                               ▼
┌──────────────────┐            ┌──────────────────┐
│  Frontend (S3)   │            │  Backend (EC2)   │
│  Static Assets   │            │  Auto-scaling    │
└──────────────────┘            └────────┬─────────┘
                                         │
                         ┌───────────────┴───────────────┐
                         ▼                               ▼
                ┌──────────────────┐          ┌──────────────────┐
                │  PostgreSQL RDS  │          │   Redis Cache    │
                └──────────────────┘          └──────────────────┘
```

## Technology Stack Summary

### Frontend
- **Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite
- **3D Graphics**: Three.js + React Three Fiber
- **Animation**: Framer Motion
- **State**: Zustand
- **Charts**: Recharts
- **Icons**: Lucide React

### Backend
- **Framework**: FastAPI
- **Language**: Python 3.9+
- **Server**: Uvicorn (ASGI)
- **AI**: Google Generative AI (Gemini)
- **Validation**: Pydantic
- **Environment**: python-dotenv

### Browser Extension
- **Manifest**: V3
- **APIs**: Chrome Extension APIs
- **Storage**: chrome.storage

### Blockchain
- **Network**: Cardano (Testnet/Mainnet)
- **Standard**: CIP-25 (NFT Metadata)
- **Storage**: IPFS
- **Library**: PyCardano (production)

## Development Workflow

1. **Local Development**:
   ```bash
   ./start-all.sh
   ```

2. **Testing**:
   - Backend: `pytest backend/tests/`
   - Frontend: `npm test`
   - E2E: Playwright/Cypress

3. **Building**:
   - Frontend: `npm run build`
   - Backend: Docker image

4. **Deployment**:
   - Frontend: S3 + CloudFront
   - Backend: EC2 + Docker
   - Database: RDS
   - Extension: Chrome Web Store

## Monitoring & Logging

### Current
- Console logs
- File logs (backend.log, frontend.log)

### Production
- **APM**: New Relic / DataDog
- **Logs**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **Errors**: Sentry
- **Metrics**: Prometheus + Grafana
- **Uptime**: Pingdom / UptimeRobot

---

**Last Updated**: 2025-11-30
