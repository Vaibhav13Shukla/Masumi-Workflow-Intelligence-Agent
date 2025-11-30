import { create } from 'zustand';
import { Pattern, UserStats, AgentStatus } from './types';
import { MOCK_PATTERNS } from './constants';

interface LogEntry {
  id: string;
  message: string;
  timestamp: string;
  type: 'info' | 'success' | 'action';
}

interface AppState {
  walletConnected: boolean;
  walletAddress: string | null;
  patterns: Pattern[];
  stats: UserStats;
  isDemoMode: boolean;
  logs: LogEntry[];
  
  // Actions
  connectWallet: () => void;
  activateDemoMode: () => void;
  updatePatternStatus: (id: string, status: AgentStatus, code?: string, txHash?: string) => void;
  addPattern: (pattern: Pattern) => void;
  addLog: (message: string, type?: 'info' | 'success' | 'action') => void;
}

export const useStore = create<AppState>((set) => ({
  walletConnected: false,
  walletAddress: null,
  patterns: [],
  isDemoMode: false,
  logs: [],
  stats: {
    actionsCaptured: 0,
    patternsDetected: 0,
    agentsDeployed: 0,
    timeSavedHours: 0,
    adaEarned: 0,
  },

  connectWallet: () => set({ 
    walletConnected: true, 
    walletAddress: "addr_test1qz..." 
  }),

  activateDemoMode: () => set((state) => ({
    isDemoMode: true,
    patterns: MOCK_PATTERNS,
    stats: {
      actionsCaptured: 1247,
      patternsDetected: 3,
      agentsDeployed: 1,
      timeSavedHours: 12.5,
      adaEarned: 0
    }
  })),

  updatePatternStatus: (id, status, code, txHash) => set((state) => ({
    patterns: state.patterns.map(p => 
      p.id === id ? { ...p, status, code, txHash } : p
    ),
    stats: status === AgentStatus.DEPLOYED ? {
      ...state.stats,
      agentsDeployed: state.stats.agentsDeployed + 1,
      adaEarned: state.stats.adaEarned + 50 // Mock earning
    } : state.stats
  })),

  addPattern: (pattern) => set((state) => ({
    patterns: [...state.patterns, pattern]
  })),

  addLog: (message, type = 'info') => set((state) => ({
    logs: [{
      id: Math.random().toString(),
      message,
      timestamp: new Date().toLocaleTimeString(),
      type
    }, ...state.logs].slice(0, 20) // Keep last 20 logs
  }))
}));
