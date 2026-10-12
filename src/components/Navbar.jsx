import React from 'react';
import { Menu, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar = ({ onMenuToggle }) => {
  const { user } = useAuth();

  return (
    <header className="h-14 sm:h-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-xl flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        {/* Hamburger — visible on mobile/tablet */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
        >
          <Menu className="w-5 h-5" />
        </button>

        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="hidden sm:inline">Server faol (DRF API v1)</span>
          <span className="sm:hidden">Faol</span>
        </span>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-800/50 border border-slate-700/60 text-[10px] sm:text-xs font-medium text-slate-300">
          <ShieldCheck className="w-4 h-4 text-rose-400" />
          <span className="hidden sm:inline">Superuser rejimi</span>
          <span className="sm:hidden">Admin</span>
        </div>
      </div>
    </header>
  );
};
