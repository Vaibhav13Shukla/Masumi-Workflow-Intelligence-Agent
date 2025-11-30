import { Pattern, AgentStatus } from '../types';

// Points to the FastAPI backend
const API_BASE = 'http://localhost:8000/api';

export const api = {
  /**
   * Sends a user action to the backend for analysis.
   */
  async trackAction(action: any) {
    try {
        const res = await fetch(`${API_BASE}/track`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(action)
        });
        if (!res.ok) console.warn("Track action failed:", res.status);
    } catch (e) {
        console.warn("Tracking failed (Backend might be offline)", e);
    }
  },

  /**
   * Fetches detected patterns from the backend.
   */
  async getPatterns(): Promise<Pattern[]> {
    try {
        const res = await fetch(`${API_BASE}/patterns`, { 
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (!res.ok) throw new Error(`Backend returned ${res.status}`);
        
        const data = await res.json();
        
        if (Array.isArray(data)) {
            return data.map((p: any) => ({
                ...p,
                // Ensure the status string from backend matches our frontend Enum
                status: p.status as AgentStatus
            }));
        }
        
        return []; 
    } catch (e) {
        // Suppress errors during polling to keep UI clean
        return [];
    }
  },

  async generateCode(patternId: string, name: string, desc: string) {
    try {
        const res = await fetch(`${API_BASE}/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pattern_id: patternId, name, description: desc })
        });
        
        if (!res.ok) {
            const errText = await res.text();
            throw new Error(`Generation failed: ${errText}`);
        }
        return await res.json();
    } catch (e) {
        console.error("API Error during generation:", e);
        throw e;
    }
  },

  async mintAgent(patternId: string, name: string, desc: string) {
    try {
        const res = await fetch(`${API_BASE}/mint`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pattern_id: patternId, name, description: desc })
        });
        
        if (!res.ok) {
            const errText = await res.text();
             throw new Error(`Minting failed: ${errText}`);
        }
        return await res.json();
    } catch (e) {
        console.error("API Error during minting:", e);
        throw e;
    }
  }
};