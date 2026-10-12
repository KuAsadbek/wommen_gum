import React from 'react';
import { Bell, Search, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { user } = useAuth();

  return (
    <header className="h-16 px-8 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-xl flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          Server faol (DRF API v1)
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/50 border border-slate-700/60 text-xs font-medium text-slate-300">
          <ShieldCheck className="w-4 h-4 text-rose-400" />
          <span>Superuser rejimi</span>
        </div>
      </div>
    </header>
  );
};
