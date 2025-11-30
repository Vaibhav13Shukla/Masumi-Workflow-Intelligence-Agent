import React, { useState, useEffect } from 'react';
import { useStore } from '../store';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { 
  Bot, Clock, Zap, TrendingUp, Code, Play, Box, CheckCircle, 
  AlertCircle, ArrowRight, Loader2, Sparkles, RefreshCcw, Activity
} from 'lucide-react';
import { AgentStatus } from '../types';
import { api } from '../services/api';
import MintModal from '../components/MintModal';

const StatCard = ({ title, value, unit, icon: Icon, color }: any) => (
  <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
    <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
        <Icon size={64} />
    </div>
    <div className="relative z-10">
        <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
        <div className="flex items-baseline gap-1">
            <h3 className="text-3xl font-display font-bold text-white">{value}</h3>
            <span className="text-sm text-gray-500">{unit}</span>
        </div>
    </div>
  </div>
);

const Dashboard = () => {
  const { stats, patterns, updatePatternStatus, addPattern, logs, addLog } = useStore();
  const [activeTab, setActiveTab] = useState<'patterns' | 'agents'>('patterns');
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [showMintModal, setShowMintModal] = useState(false);
  const [selectedPatternId, setSelectedPatternId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  
  // Poll for new patterns from backend
  const refreshPatterns = async () => {
    setIsRefreshing(true);
    try {
      const backendPatterns = await api.getPatterns();
      
      let newCount = 0;
      backendPatterns.forEach(p => {
         const exists = patterns.find(local => local.id === p.id);
         if (!exists) {
            addPattern(p);
            newCount++;
         } else if (exists.status !== p.status && p.status !== AgentStatus.DETECTED) {
             // Sync status if changed remotely (e.g. minting finished)
             updatePatternStatus(p.id, p.status, p.code, p.txHash);
         }
      });
      if (newCount > 0) {
        addLog(`Analysis complete. Found ${newCount} new patterns.`, 'success');
      }
    } catch (e) {
      // Silent fail on poll
    }
    setTimeout(() => setIsRefreshing(false), 800);
  };

  useEffect(() => {
    refreshPatterns();
  }, []);

  // Handlers
  const handleGenerate = async (id: string, name: string, desc: string) => {
    setGeneratingId(id);
    updatePatternStatus(id, AgentStatus.GENERATING);
    addLog(`Generating Python agent for "${name}"...`, 'info');
    
    try {
        const result = await api.generateCode(id, name, desc);
        updatePatternStatus(id, AgentStatus.READY_TO_MINT, result.code);
        addLog(`Code generated for "${name}". Ready to mint.`, 'success');
    } catch (e) {
        console.error(e);
        addLog(`Generation failed for "${name}"`, 'info');
        updatePatternStatus(id, AgentStatus.DETECTED);
    }
    setGeneratingId(null);
  };

  const handleMint = (id: string) => {
    setSelectedPatternId(id);
    setShowMintModal(true);
  };

  const simulateWorkflow = async () => {
    if (isSimulating) return;
    setIsSimulating(true);
    addLog("Starting workflow simulation...", 'info');
    
    // Scenario: Sales Lead Scraper
    // Designed to be easily recognized by Gemini
    const rawActions = [
        { type: 'click', target: 'button#login', meta: 'Login to CRM' },
        { type: 'click', target: 'a.nav-leads', meta: 'Navigate to Leads' },
        { type: 'input', target: 'input#industry-filter', meta: 'Filter: "Software"' },
        { type: 'click', target: 'button.apply', meta: 'Apply Filter' },
        { type: 'click', target: 'button.select-all', meta: 'Select All Rows' },
        { type: 'click', target: 'button.export-csv', meta: 'Export to CSV' },
        { type: 'click', target: 'button.confirm', meta: 'Confirm Download' }
    ];

    try {
        for (const action of rawActions) {
            // Construct payload matching backend UserAction model
            const payload = {
                user_id: 'demo_user_01',
                type: action.type,
                target: action.target,
                timestamp: Date.now() / 1000,
                url: 'https://crm.example.com/leads',
                metadata: { description: action.meta }
            };

            addLog(`Action: ${action.meta}`, 'action');
            await api.trackAction(payload);
            await new Promise(r => setTimeout(r, 600)); 
        }
        
        addLog("Simulation complete. Sending data to Gemini AI...", 'info');
        await new Promise(r => setTimeout(r, 2000));
        await refreshPatterns();
    } catch (e) {
        addLog("Simulation error. Check console.", 'info');
        console.error(e);
    } finally {
        setIsSimulating(false);
    }
  };

  // Mock Data for Chart
  const chartData = [
    { name: 'Mon', actions: 120 },
    { name: 'Tue', actions: 232 },
    { name: 'Wed', actions: 185 },
    { name: 'Thu', actions: 340 },
    { name: 'Fri', actions: 290 },
    { name: 'Sat', actions: 110 },
    { name: 'Sun', actions: 85 },
  ];

  return (
    <div className="min-h-screen bg-[#050508] pt-24 pb-12 px-4 sm:px-8">
      
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 max-w-7xl mx-auto">
        <StatCard title="Patterns Detected" value={patterns.length} unit="active" icon={Zap} color="text-yellow-400" />
        <StatCard title="Time Saved" value={stats.timeSavedHours} unit="hours" icon={Clock} color="text-cardano-cyan" />
        <StatCard title="Agents Deployed" value={stats.agentsDeployed} unit="NFTs" icon={Bot} color="text-cardano-purple" />
        <StatCard title="Est. Earnings" value={stats.adaEarned} unit="₳ ADA" icon={TrendingUp} color="text-neon-green" />
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
            
            {/* Chart Section */}
            <div className="glass-panel p-6 rounded-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-display font-semibold">Workflow Activity</h3>
                    <div className="flex gap-2">
                        <button 
                            onClick={simulateWorkflow}
                            disabled={isSimulating}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${isSimulating ? 'bg-white/5 text-gray-400' : 'bg-white text-black hover:bg-gray-200'}`}
                        >
                            {isSimulating ? <Loader2 className="animate-spin" size={16}/> : <Play size={16} fill="currentColor" />}
                            {isSimulating ? 'Recording...' : 'Simulate Workflow'}
                        </button>
                    </div>
                </div>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorActions" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#00D1FF" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#00D1FF" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                            <XAxis dataKey="name" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1a1a2e', border: 'none', borderRadius: '8px' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Area type="monotone" dataKey="actions" stroke="#00D1FF" strokeWidth={3} fillOpacity={1} fill="url(#colorActions)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Pattern/Agent List */}
            <div className="glass-panel rounded-2xl overflow-hidden min-h-[400px]">
                {/* Tabs */}
                <div className="flex border-b border-white/10 justify-between pr-4">
                    <div className="flex">
                        <button 
                            onClick={() => setActiveTab('patterns')}
                            className={`px-8 py-4 text-sm font-medium transition-colors relative ${activeTab === 'patterns' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            Detected Patterns
                            {activeTab === 'patterns' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-cardano-cyan shadow-[0_0_10px_#00D1FF]" />}
                        </button>
                        <button 
                            onClick={() => setActiveTab('agents')}
                            className={`px-8 py-4 text-sm font-medium transition-colors relative ${activeTab === 'agents' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            My Agents (NFTs)
                            {activeTab === 'agents' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-cardano-purple shadow-[0_0_10px_#667eea]" />}
                        </button>
                    </div>
                    <button onClick={refreshPatterns} className={`text-gray-400 hover:text-white transition ${isRefreshing ? 'animate-spin' : ''}`}>
                        <RefreshCcw size={18} />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    {patterns.length === 0 ? (
                        <div className="text-center py-20 text-gray-500">
                            <Bot size={48} className="mx-auto mb-4 opacity-20" />
                            <p className="mb-4">No patterns detected yet.</p>
                            <button onClick={simulateWorkflow} className="text-cardano-cyan hover:underline text-sm">
                                Simulate Workflow Activity
                            </button>
                        </div>
                    ) : (
                        patterns
                            .filter(p => activeTab === 'patterns' ? p.status !== AgentStatus.DEPLOYED : p.status === AgentStatus.DEPLOYED)
                            .map((pattern) => (
                            <motion.div 
                                key={pattern.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white/5 border border-white/5 hover:border-white/10 rounded-xl p-5 transition-all hover:bg-white/10 group"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <h4 className="font-semibold text-white text-lg">{pattern.name}</h4>
                                            {pattern.status === AgentStatus.DETECTED && (
                                                <span className="px-2 py-0.5 rounded text-[10px] bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">New Discovery</span>
                                            )}
                                            {pattern.status === AgentStatus.READY_TO_MINT && (
                                                <span className="px-2 py-0.5 rounded text-[10px] bg-green-500/20 text-green-400 border border-green-500/30">Ready to Mint</span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-400 mb-4 line-clamp-2">{pattern.description}</p>
                                        <div className="flex items-center gap-4 text-xs text-gray-500 font-mono">
                                            <div className="flex items-center gap-1">
                                                <Zap size={12} /> {pattern.frequency} repeats
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Clock size={12} /> {pattern.timeSaved}m saved/run
                                            </div>
                                            <div className="flex items-center gap-1 text-cardano-cyan">
                                                <Sparkles size={12} /> {Math.round(pattern.confidence * 100)}% Match
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col items-end gap-2">
                                        {/* Action Buttons based on Status */}
                                        {pattern.status === AgentStatus.DETECTED && (
                                            <button 
                                                onClick={() => handleGenerate(pattern.id, pattern.name, pattern.description)}
                                                disabled={generatingId === pattern.id}
                                                className="bg-white text-black hover:bg-gray-200 px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all"
                                            >
                                                {generatingId === pattern.id ? (
                                                    <><Loader2 className="animate-spin" size={16} /> Generating AI...</>
                                                ) : (
                                                    <><Bot size={16} /> Generate Agent</>
                                                )}
                                            </button>
                                        )}

                                        {pattern.status === AgentStatus.READY_TO_MINT && (
                                            <button 
                                                onClick={() => handleMint(pattern.id)}
                                                className="bg-gradient-to-r from-cardano-blue to-cardano-purple text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg shadow-cardano-blue/30 hover:shadow-cardano-blue/50 transition-all"
                                            >
                                                <Box size={16} /> Deploy to Cardano
                                            </button>
                                        )}
                                        
                                        {pattern.status === AgentStatus.DEPLOYED && (
                                            <div className="text-right">
                                                <div className="flex items-center gap-1 text-green-400 text-sm font-medium mb-1">
                                                    <CheckCircle size={14} /> Live on Masumi
                                                </div>
                                                <div className="text-xs text-gray-500 font-mono">
                                                    Tx: {pattern.txHash ? pattern.txHash.substring(0,8) : '...'}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
            {/* Wallet Card */}
            <div className="glass-panel p-6 rounded-2xl bg-gradient-to-br from-[#0a0a0f] to-[#14141f]">
                <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-4 font-semibold">Wallet Connection</h3>
                {useStore(s => s.walletConnected) ? (
                    <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 p-3 rounded-xl">
                        <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_#00ff00]" />
                        <div>
                            <p className="text-white text-sm font-medium">Nami Wallet</p>
                            <p className="text-xs text-gray-500 font-mono">addr_test1...84t37</p>
                        </div>
                    </div>
                ) : (
                     <div className="flex items-center gap-2 text-yellow-500 bg-yellow-500/10 p-3 rounded-xl border border-yellow-500/20">
                        <AlertCircle size={16} />
                        <span className="text-sm">Wallet not connected</span>
                    </div>
                )}
            </div>

            {/* Live Activity Log */}
             <div className="glass-panel p-6 rounded-2xl">
                <div className="flex items-center gap-2 mb-4">
                    <Activity size={16} className="text-cardano-cyan" />
                    <h3 className="text-white font-semibold">Live Network Activity</h3>
                </div>
                
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    <AnimatePresence>
                        {logs.length === 0 ? (
                            <div className="text-gray-600 text-xs text-center py-4">Waiting for signals...</div>
                        ) : (
                            logs.map((log) => (
                                <motion.div 
                                    key={log.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex gap-3 items-start"
                                >
                                    <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                                        log.type === 'action' ? 'bg-cardano-cyan' : 
                                        log.type === 'success' ? 'bg-green-500' : 'bg-gray-500'
                                    }`} />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-gray-300 break-words">{log.message}</p>
                                        <p className="text-[10px] text-gray-600 font-mono mt-0.5">{log.timestamp}</p>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </div>
            
            {/* Pepe Assistant */}
            <div className="glass-panel p-6 rounded-2xl relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 w-24 h-24 opacity-20 bg-green-500 blur-2xl rounded-full" />
                <div className="flex items-start gap-4">
                     <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700 overflow-hidden shrink-0">
                         {/* Placeholder for Pepe Image */}
                         <span className="text-xl">🐸</span>
                     </div>
                     <div>
                         <h4 className="font-bold text-white text-sm mb-1">Agent Pepe Says:</h4>
                         <p className="text-xs text-gray-400 leading-relaxed">
                             "GM! I noticed you download that Lead List every Monday. I can automate that for you and you'll earn $ADA every time someone else uses that agent!"
                         </p>
                     </div>
                </div>
            </div>
        </div>
      </div>

      <MintModal 
        isOpen={showMintModal} 
        onClose={() => setShowMintModal(false)} 
        patternId={selectedPatternId || ''}
        agentName={patterns.find(p => p.id === selectedPatternId)?.name || 'Agent'}
      />
    </div>
  );
};

export default Dashboard;