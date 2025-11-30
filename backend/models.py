from enum import Enum
from typing import List, Dict, Optional
from pydantic import BaseModel


class PatternStatus(str, Enum):
    DETECTED = "DETECTED"
    GENERATING = "GENERATING"
    READY_TO_MINT = "READY_TO_MINT"
    MINTING = "MINTING"
    DEPLOYED = "DEPLOYED"


class Action(BaseModel):
    id: Optional[str] = None
    user_id: str
    type: str  # click, input, submit, navigate
    target: str  # CSS selector or element identifier
    url: str
    timestamp: int
    metadata: Dict = {}


class Pattern(BaseModel):
    id: str
    user_id: str
    name: str
    description: str
    frequency: int  # How many times detected
    confidence: float  # 0-1 confidence score
    time_saved: int  # Estimated minutes saved
    actions: List[Action]
    status: PatternStatus
    code: Optional[str] = None
    tx_hash: Optional[str] = None
    created_at: int
