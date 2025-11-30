import json
import os
from typing import List, Dict, Optional
from collections import defaultdict
import time
from models import Action, Pattern, PatternStatus


class Database:
    """Simple file-based database for demo purposes"""
    
    def __init__(self, data_dir: str = "./data"):
        self.data_dir = data_dir
        self.actions_file = os.path.join(data_dir, "actions.json")
        self.patterns_file = os.path.join(data_dir, "patterns.json")
        
        # Create data directory if it doesn't exist
        os.makedirs(data_dir, exist_ok=True)
        
        # Initialize files if they don't exist
        if not os.path.exists(self.actions_file):
            self._write_json(self.actions_file, [])
        if not os.path.exists(self.patterns_file):
            self._write_json(self.patterns_file, [])
    
    def _read_json(self, filepath: str) -> List[Dict]:
        """Read JSON file"""
        try:
            with open(filepath, 'r') as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return []
    
    def _write_json(self, filepath: str, data: List[Dict]):
        """Write JSON file"""
        with open(filepath, 'w') as f:
            json.dump(data, f, indent=2)
    
    def store_action(self, action: Dict) -> str:
        """Store a user action"""
        actions = self._read_json(self.actions_file)
        
        # Generate ID
        action_id = f"a_{len(actions) + 1}_{int(time.time())}"
        action['id'] = action_id
        
        actions.append(action)
        self._write_json(self.actions_file, actions)
        
        return action_id
    
    def get_actions(self, user_id: str, limit: int = 100) -> List[Dict]:
        """Get recent actions for a user"""
        actions = self._read_json(self.actions_file)
        user_actions = [a for a in actions if a.get('user_id') == user_id]
        return sorted(user_actions, key=lambda x: x['timestamp'], reverse=True)[:limit]
    
    def detect_patterns(self, user_id: str) -> List[Dict]:
        """Detect workflow patterns from user actions"""
        actions = self.get_actions(user_id, limit=200)
        patterns = self._read_json(self.patterns_file)
        
        # Simple pattern detection: group by URL sequences
        url_sequences = defaultdict(list)
        
        for i in range(len(actions) - 2):
            sequence = tuple([actions[i]['url'], actions[i+1]['url'], actions[i+2]['url']])
            url_sequences[sequence].append([actions[i], actions[i+1], actions[i+2]])
        
        # Create patterns for sequences that repeat
        new_patterns = []
        for sequence, occurrences in url_sequences.items():
            if len(occurrences) >= 3:  # Detected at least 3 times
                # Check if pattern already exists
                existing = any(p.get('user_id') == user_id and 
                             p.get('description', '').startswith(str(sequence[0])) 
                             for p in patterns)
                
                if not existing:
                    pattern_id = f"p_{len(patterns) + len(new_patterns) + 1}"
                    pattern = {
                        "id": pattern_id,
                        "user_id": user_id,
                        "name": f"Workflow Pattern {len(patterns) + len(new_patterns) + 1}",
                        "description": f"Navigate: {sequence[0][:50]} → {sequence[1][:50]} → {sequence[2][:50]}",
                        "frequency": len(occurrences),
                        "confidence": min(0.95, 0.7 + (len(occurrences) * 0.05)),
                        "time_saved": len(occurrences) * 5,  # 5 min per occurrence
                        "actions": occurrences[0],
                        "status": PatternStatus.DETECTED,
                        "created_at": int(time.time())
                    }
                    new_patterns.append(pattern)
        
        # Save new patterns
        if new_patterns:
            patterns.extend(new_patterns)
            self._write_json(self.patterns_file, patterns)
        
        return new_patterns
    
    def get_patterns(self, user_id: str) -> List[Dict]:
        """Get all patterns for a user"""
        patterns = self._read_json(self.patterns_file)
        return [p for p in patterns if p.get('user_id') == user_id]
    
    def get_pattern_by_id(self, pattern_id: str) -> Optional[Dict]:
        """Get a specific pattern by ID"""
        patterns = self._read_json(self.patterns_file)
        for pattern in patterns:
            if pattern.get('id') == pattern_id:
                return pattern
        return None
    
    def update_pattern_status(self, pattern_id: str, status: PatternStatus):
        """Update pattern status"""
        patterns = self._read_json(self.patterns_file)
        
        for pattern in patterns:
            if pattern.get('id') == pattern_id:
                pattern['status'] = status
                break
        
        self._write_json(self.patterns_file, patterns)
    
    def store_pattern_code(self, pattern_id: str, code: str):
        """Store generated code for a pattern"""
        patterns = self._read_json(self.patterns_file)
        
        for pattern in patterns:
            if pattern.get('id') == pattern_id:
                pattern['code'] = code
                break
        
        self._write_json(self.patterns_file, patterns)
    
    def store_pattern_tx(self, pattern_id: str, tx_hash: str):
        """Store blockchain transaction hash"""
        patterns = self._read_json(self.patterns_file)
        
        for pattern in patterns:
            if pattern.get('id') == pattern_id:
                pattern['tx_hash'] = tx_hash
                break
        
        self._write_json(self.patterns_file, patterns)
