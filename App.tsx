import React, { useState } from 'react';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import { useStore } from './store';
import { Bot } from 'lucide-react';

const Navbar = ({ onLogout }: { onLogout: () => void }) => (
  <nav className="fixed top-0 left-0 right-0 z-40 bg-[#050508]/80 backdrop-blur-md border-b border-white/10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center gap-2 cursor-pointer" onClick={onLogout}>
           <div className="w-8 h-8 bg-gradient-to-br from-cardano-blue to-cardano-cyan rounded-lg flex items-center justify-center">
                <span className="font-bold text-white text-lg">M</span>
            </div>
            <span className="font-display font-bold text-xl hidden sm:block">Masumi</span>
        </div>
        <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-gray-300">Extension Active</span>
             </div>
             <button className="w-8 h-8 rounded-full bg-gradient-to-r from-cardano-blue to-cardano-purple flex items-center justify-center text-xs font-bold ring-2 ring-black">
                JD
             </button>
        </div>
      </div>
    </div>
  </nav>
);

const App = () => {
  const [view, setView] = useState<'landing' | 'dashboard'>('landing');
  
  return (
    <div className="text-white min-h-screen font-sans selection:bg-cardano-cyan/30">
      {view === 'dashboard' && <Navbar onLogout={() => setView('landing')} />}
      
      {view === 'landing' ? (
        <Landing onEnter={() => setView('dashboard')} />
      ) : (
        <Dashboard />
      )}
    </div>
  );
};

export default App;