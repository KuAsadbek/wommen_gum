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
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { name: 'Boshqaruv paneli', path: '/', icon: LayoutDashboard },
  { name: 'Foydalanuvchilar', path: '/users', icon: Users },
  { name: 'Mashg\'ulot bosqichlari', path: '/phases', icon: Layers },
  { name: 'Mashg\'ulotlar', path: '/workouts', icon: Dumbbell },
  { name: 'Mashqlar', path: '/exercises', icon: Activity },
  { name: 'Natijalar va Sessiyalar', path: '/results', icon: ClipboardList },
  { name: 'Sozlamalar', path: '/settings', icon: Settings },
];

export const Sidebar = () => {
  const { logout, user } = useAuth();

  return (
    <aside className="w-64 bg-slate-900/90 border-r border-slate-800/80 flex flex-col justify-between backdrop-blur-xl h-screen sticky top-0">
      <div>
        {/* Logo Header */}
        <div className="h-16 px-6 flex items-center gap-3 border-b border-slate-800/80 bg-slate-900/40">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-500/20 text-white font-black text-xl tracking-wider">
            GW
          </div>
          <div>
            <h1 className="font-extrabold text-base tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              GUM WOMEN
            </h1>
            <span className="text-[10px] tracking-widest uppercase font-semibold text-rose-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Admin Panel
            </span>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-rose-500/15 text-rose-400 font-semibold border border-rose-500/20 shadow-sm'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User and Logout */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-900/30">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-rose-400 font-bold text-sm">
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
