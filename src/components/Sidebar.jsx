import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Layers,
  Dumbbell,
  Activity,
  ClipboardList,
  Settings,
  Sparkles,
  LogOut,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { name: 'Boshqaruv paneli', path: '/', icon: LayoutDashboard },
  { name: 'Foydalanuvchilar', path: '/users', icon: Users },
  { name: "Mashg'ulot bosqichlari", path: '/phases', icon: Layers },
  { name: "Mashg'ulotlar", path: '/workouts', icon: Dumbbell },
  { name: 'Mashqlar', path: '/exercises', icon: Activity },
  { name: 'Natijalar va Sessiyalar', path: '/results', icon: ClipboardList },
  { name: 'Sozlamalar', path: '/settings', icon: Settings },
];

export const Sidebar = ({ isOpen, onClose }) => {
  const { logout, user } = useAuth();

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900/95 border-r border-slate-800/80 
        flex flex-col justify-between backdrop-blur-xl
        transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0 lg:z-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      <div>
        {/* Logo Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-800/80 bg-slate-900/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-500/20 text-white font-black text-lg sm:text-xl tracking-wider">
              GW
            </div>
            <div>
              <h1 className="font-extrabold text-sm sm:text-base tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                GUM WOMEN
              </h1>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-rose-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Admin Panel
              </span>
            </div>
          </div>

          {/* Close button — mobile only */}
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation links */}
        <nav className="p-3 sm:p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-rose-500/15 text-rose-400 font-semibold border border-rose-500/20 shadow-sm'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User and Logout */}
      <div className="p-3 sm:p-4 border-t border-slate-800/80 bg-slate-900/30">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-rose-400 font-bold text-sm shrink-0">
            {user?.first_name ? user.first_name[0] : 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-200 truncate">
              {user?.full_name || user?.email || 'Administrator'}
            </p>
            <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Tizimdan chiqish
        </button>
      </div>
    </aside>
  );
};
