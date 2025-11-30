import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, ChevronRight, Check } from 'lucide-react';
import Hero3D from '../components/Hero3D';
import { useStore } from '../store';

const Landing = ({ onEnter }: { onEnter: () => void }) => {
  const { connectWallet, activateDemoMode } = useStore();

  const handleStart = () => {
    connectWallet();
    activateDemoMode(); // Simulates extension data
    onEnter();
  };

  return (
    <div className="relative min-h-screen bg-[#050508] overflow-hidden flex flex-col">
      {/* 3D Background */}
      <Hero3D />

      {/* Navbar Overlay */}
      <nav className="relative z-10 w-full px-6 py-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cardano-blue to-cardano-cyan rounded-lg flex items-center justify-center">
                <span className="font-bold text-white text-lg">M</span>
            </div>
            <span className="font-display font-bold text-xl tracking-tight">Masumi</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition">Features</a>
            <a href="#" className="hover:text-white transition">Network</a>
            <a href="#" className="hover:text-white transition">Pricing</a>
        </div>
        <button className="bg-white/10 hover:bg-white/20 border border-white/10 text-white px-5 py-2 rounded-full text-sm font-medium transition-all backdrop-blur-md">
            Connect Wallet
        </button>
      </nav>

      {/* Hero Content */}
      <main className="relative z-10 flex-1 flex flex-col justify-center items-center text-center px-4 max-w-5xl mx-auto mt-[-80px]">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
        >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-medium text-gray-300">Live on Cardano Testnet</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6">
                Turn Your Work into <br />
                <span className="gradient-text">Autonomous Agents</span>
            </h1>
            
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                Masumi watches your daily workflow, detects patterns using AI, and converts them into monetizable, blockchain-owned agents.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button 
                    onClick={handleStart}
                    className="group bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-200 transition-all flex items-center gap-2"
                >
                    Launch App
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="px-8 py-4 rounded-full font-medium text-white border border-white/20 hover:bg-white/5 transition-all flex items-center gap-3 backdrop-blur-md">
                    <Play size={20} className="fill-white" /> Watch Demo
                </button>
            </div>
        </motion.div>

        {/* Feature Grid Mockup */}
        <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-20 w-full grid grid-cols-1 md:grid-cols-3 gap-6 text-left"
        >
            {[
                { title: "Watch", desc: "Extension captures repetitive tasks silently.", color: "bg-blue-500" },
                { title: "Generate", desc: "AI writes production-grade Python code.", color: "bg-purple-500" },
                { title: "Monetize", desc: "Mint as NFT and earn per execution.", color: "bg-green-500" }
            ].map((feature, i) => (
                <div key={i} className="glass-panel p-6 rounded-xl hover:border-white/20 transition-colors">
                    <div className={`w-10 h-10 ${feature.color}/20 rounded-lg mb-4 flex items-center justify-center`}>
                        <div className={`w-3 h-3 rounded-full ${feature.color}`} />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                    <p className="text-gray-400 text-sm">{feature.desc}</p>
                </div>
            ))}
        </motion.div>
      </main>

      <footer className="relative z-10 w-full py-6 text-center text-xs text-gray-600">
        © 2025 Masumi Network. Built for Cardano Hackathon.
      </footer>
    </div>
  );
};

export default Landing;