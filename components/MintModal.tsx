import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Cpu, Database, Share2, ExternalLink } from 'lucide-react';
import { useStore } from '../store';
import { AgentStatus } from '../types';
import { api } from '../services/api';

interface MintModalProps {
  isOpen: boolean;
  onClose: () => void;
  patternId: string;
  agentName: string;
}

const MintModal: React.FC<MintModalProps> = ({ isOpen, onClose, patternId, agentName }) => {
  const [step, setStep] = useState(0); // 0: Init, 1: Upload IPFS, 2: Minting, 3: Success
  const [txHash, setTxHash] = useState('');
  const updatePatternStatus = useStore((state) => state.updatePatternStatus);
  const patterns = useStore((state) => state.patterns);
  const pattern = patterns.find(p => p.id === patternId);

  useEffect(() => {
    if (isOpen && pattern) {
      setStep(0);
      
      const sequence = async () => {
        // Step 1: Uploading Metadata
        await new Promise(r => setTimeout(r, 1000));
        setStep(1);
        
        // Step 2: Minting (Call Real Backend)
        setStep(2);
        try {
            const result = await api.mintAgent(patternId, agentName, pattern.description);
            setTxHash(result.tx_hash);
            updatePatternStatus(
                patternId, 
                AgentStatus.DEPLOYED, 
                undefined, 
                result.tx_hash
            );
            setStep(3);
        } catch (e) {
            console.error("Minting failed", e);
            // Handle error state in UI if needed
        }
      };
      
      sequence();
    }
  }, [isOpen, patternId, updatePatternStatus]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={step === 3 ? onClose : undefined} />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative bg-[#0a0a0f] border border-cardano-blue/30 rounded-2xl w-full max-w-md p-8 overflow-hidden shadow-2xl shadow-cardano-blue/20"
      >
        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cardano-cyan to-cardano-purple" />
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-cardano-blue/20 blur-3xl rounded-full" />

        <div className="relative z-10 flex flex-col items-center text-center">
            
          {step < 3 && (
            <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="mb-6"
            >
                <div className="relative w-20 h-20 rounded-full border-2 border-dashed border-cardano-cyan flex items-center justify-center">
                    <Cpu className="text-cardano-purple w-8 h-8" />
                </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring" }}
                className="mb-6 w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/50"
            >
                <Check className="text-green-500 w-10 h-10" />
            </motion.div>
          )}

          <h3 className="text-2xl font-display font-bold text-white mb-2">
            {step === 0 && "Preparing Agent Assets..."}
            {step === 1 && "Uploading to IPFS..."}
            {step === 2 && "Minting on Cardano..."}
            {step === 3 && "Agent Deployed Successfully!"}
          </h3>
          
          <p className="text-gray-400 mb-6 text-sm">
             {step < 3 ? "Please wait while we secure your agent on the Masumi Network." : `Your agent "${agentName}" is now a tradeable asset.`}
          </p>

          {/* Progress Bar */}
          {step < 3 && (
            <div className="w-full bg-gray-800 h-2 rounded-full mb-6 overflow-hidden">
                <motion.div 
                    className="h-full bg-gradient-to-r from-cardano-cyan to-cardano-blue"
                    initial={{ width: "0%" }}
                    animate={{ width: `${((step + 1) / 3) * 100}%` }}
                />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3 w-full">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                    <span className="text-sm text-gray-400">Network</span>
                    <span className="text-sm font-semibold text-cardano-cyan">Cardano Testnet</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                    <span className="text-sm text-gray-400">Policy ID</span>
                    <span className="text-sm font-mono text-gray-300">a29f...8x92</span>
                </div>
                 <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                    <span className="text-sm text-gray-400">Tx Hash</span>
                    <span className="text-sm font-mono text-gray-300">{txHash.substring(0, 12)}...</span>
                </div>
                
                <button className="w-full mt-4 bg-white text-black py-3 rounded-xl font-bold hover:bg-gray-200 transition flex items-center justify-center gap-2">
                    <ExternalLink className="w-4 h-4" /> View on Explorer
                </button>
                <button onClick={onClose} className="w-full py-3 text-gray-400 hover:text-white transition">
                    Close
                </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default MintModal;
