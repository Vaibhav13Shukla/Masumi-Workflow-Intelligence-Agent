from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, validator
from typing import List, Optional
import os
import logging
import traceback
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('backend.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

try:
    import google.generativeai as genai
    GENAI_AVAILABLE = True
except ImportError:
    GENAI_AVAILABLE = False
    logger.warning("google-generativeai not installed. Using mock code generation.")

from database import Database
from models import Action, Pattern, PatternStatus
from blockchain import BlockchainService

load_dotenv()

app = FastAPI(title="Masumi Workflow Intelligence API")

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
db = Database()
blockchain = BlockchainService()

# Initialize Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY and GEMINI_API_KEY != "PLACEHOLDER_API_KEY" and GENAI_AVAILABLE:
    genai.configure(api_key=GEMINI_API_KEY)


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception on {request.url.path}: {traceback.format_exc()}")
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc), "type": type(exc).__name__}
    )


# Request Models
class ActionRequest(BaseModel):
    user_id: str
    type: str
    target: str
    url: str
    timestamp: int
    metadata: dict = {}
    
    @validator('timestamp')
    def validate_timestamp(cls, v):
        if not isinstance(v, int):
            raise ValueError(f'timestamp must be an integer, got {type(v)}')
        if v < 0:
            raise ValueError('timestamp must be positive')
        return v
    
    @validator('type')
    def validate_type(cls, v):
        valid_types = ['click', 'input', 'submit', 'navigate']
        if v not in valid_types:
            raise ValueError(f'type must be one of {valid_types}, got {v}')
        return v
    
    class Config:
        schema_extra = {
            "example": {
                "user_id": "demo_user",
                "type": "click",
                "target": "BUTTON#submit.btn.btn-primary",
                "url": "https://example.com/form",
                "timestamp": 1701360000000,
                "metadata": {"text": "Submit"}
            }
        }


class GenerateRequest(BaseModel):
    pattern_id: str
    name: str
    description: str


class MintRequest(BaseModel):
    pattern_id: str
    name: str
    description: str


@app.get("/")
async def root():
    return {"status": "Masumi Backend Running", "version": "1.0.0"}


@app.post("/api/track")
async def track_action(action: ActionRequest):
    """Receives and stores user actions from the browser extension"""
    try:
        action_id = db.store_action(action.dict())
        logger.info(f"Action tracked: {action.type} on {action.url}")
        
        # Trigger pattern detection
        patterns = db.detect_patterns(action.user_id)
        
        return {
            "success": True,
            "action_id": action_id,
            "patterns_detected": len(patterns)
        }
    except Exception as e:
        logger.error(f"Error tracking action: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/patterns")
async def get_patterns(user_id: str = "demo_user"):
    """Returns detected workflow patterns for a user"""
    try:
        patterns = db.get_patterns(user_id)
        return patterns
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/generate")
async def generate_code(req: GenerateRequest):
    """Generates automation code for a pattern using Gemini AI"""
    try:
        # Update status to GENERATING
        db.update_pattern_status(req.pattern_id, PatternStatus.GENERATING)
        
        # Generate code with Gemini
        code = await generate_agent_code(req.name, req.description)
        
        # Store code and update status
        db.store_pattern_code(req.pattern_id, code)
        db.update_pattern_status(req.pattern_id, PatternStatus.READY_TO_MINT)
        
        return {
            "success": True,
            "pattern_id": req.pattern_id,
            "code": code,
            "status": PatternStatus.READY_TO_MINT
        }
    except Exception as e:
        db.update_pattern_status(req.pattern_id, PatternStatus.DETECTED)
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/mint")
async def mint_agent(req: MintRequest):
    """Mints the agent as an NFT on Cardano blockchain"""
    try:
        # Update status to MINTING
        db.update_pattern_status(req.pattern_id, PatternStatus.MINTING)
        
        # Get pattern code
        pattern = db.get_pattern_by_id(req.pattern_id)
        if not pattern or not pattern.get("code"):
            raise HTTPException(status_code=400, detail="Pattern code not found")
        
        # Mint on blockchain
        tx_hash = blockchain.mint_agent_nft(
            name=req.name,
            description=req.description,
            code=pattern["code"]
        )
        
        # Update pattern with tx hash
        db.store_pattern_tx(req.pattern_id, tx_hash)
        db.update_pattern_status(req.pattern_id, PatternStatus.DEPLOYED)
        
        return {
            "success": True,
            "pattern_id": req.pattern_id,
            "tx_hash": tx_hash,
            "status": PatternStatus.DEPLOYED
        }
    except Exception as e:
        db.update_pattern_status(req.pattern_id, PatternStatus.READY_TO_MINT)
        raise HTTPException(status_code=500, detail=str(e))


async def generate_agent_code(name: str, description: str) -> str:
    """Generate automation code using Gemini AI"""
    if not GENAI_AVAILABLE or not GEMINI_API_KEY or GEMINI_API_KEY == "PLACEHOLDER_API_KEY":
        return generate_mock_code(name)
    
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        prompt = f"""
You are an expert Python automation engineer.
Generate a production-ready, error-handled Python script using Selenium 
for the following automation task:

Task Name: {name}
Description: {description}

Requirements:
- Include comprehensive error handling
- Use environment variables for credentials
- Include comments explaining the logic
- Make it modular and reusable
- Return ONLY the code, no markdown formatting.
"""
        
        response = model.generate_content(prompt)
        code = response.text
        
        # Clean up markdown if present
        code = code.replace("```python", "").replace("```", "").strip()
        
        return code
    except Exception as e:
        print(f"Gemini generation failed: {e}")
        return generate_mock_code(name)


def generate_mock_code(name: str) -> str:
    """Fallback mock code generator"""
    class_name = name.replace(" ", "").replace("-", "")
    return f"""
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class {class_name}Agent:
    def __init__(self):
        self.options = webdriver.ChromeOptions()
        self.options.add_argument('--headless')
        self.driver = webdriver.Chrome(options=self.options)

    def execute(self):
        print("Starting {name}...")
        try:
            # Step 1: Initialize
            self.driver.get("https://dashboard.example.com")
            time.sleep(2)
            
            # Step 2: Perform Actions
            print("Navigating to target...")
            # Automation logic here
            
            print("Task completed successfully")
            return True
        except Exception as e:
            print(f"Error: {{e}}")
            return False
        finally:
            self.driver.quit()

if __name__ == "__main__":
    agent = {class_name}Agent()
    agent.execute()
"""


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
