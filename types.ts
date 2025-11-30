export enum AgentStatus {
  DETECTED = 'DETECTED',
  GENERATING = 'GENERATING',
  READY_TO_MINT = 'READY_TO_MINT',
  MINTING = 'MINTING',
  DEPLOYED = 'DEPLOYED'
}

export interface Action {
  id: string;
  type: string;
  target: string;
  timestamp: number;
}

export interface Pattern {
  id: string;
  name: string;
  description: string;
  frequency: number;
  confidence: number;
  timeSaved: number; // in minutes
  actions: Action[];
  status: AgentStatus;
  code?: string;
  txHash?: string;
}

export interface UserStats {
  actionsCaptured: number;
  patternsDetected: number;
  agentsDeployed: number;
  timeSavedHours: number;
  adaEarned: number;
}