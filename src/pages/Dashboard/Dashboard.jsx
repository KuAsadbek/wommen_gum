import React, { useState, useEffect } from 'react';
import { statsService } from '../../services/api';
import {
  Users,
  Dumbbell,
  TrendingUp,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowUpRight,
  Flame,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const COLORS = ['#f43f5e', '#ec4899', '#8b5cf6', '#3b82f6'];

export const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    statsService
      .getDashboardStats()
      .then((res) => {
        setStats(res.data.data);
      })
      .catch((err) => {
        console.error('Failed to load dashboard stats:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const phaseChartData = stats?.users_by_phase
    ? Object.entries(stats.users_by_phase).map(([name, value]) => ({
        name: `${name} bosqichi`,
        value,
      }))
    : [
        { name: 'Alpha bosqichi', value: 12 },
        { name: 'Beta bosqichi', value: 8 },
        { name: 'Gamma bosqichi', value: 4 },
      ];

  const popularData = stats?.popular_workouts?.length
    ? stats.popular_workouts.map((item) => ({
        name: item.workout__name,
        sessions: item.count,
      }))
    : [
        { name: 'Cardio', sessions: 28 },
        { name: 'Speed 1.0', sessions: 19 },
        { name: 'Total Body Circuit', sessions: 15 },
        { name: 'Ab Intervals', sessions: 12 },
        { name: 'Lower Focus', sessions: 9 },
      ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Boshqaruv paneli</h1>
          <p className="text-[11px] sm:text-xs text-slate-400 mt-1">
            Foydalanuvchilar faolligi va Healty Gym Women T25 dasturi jarayoni sharhi
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] sm:text-xs text-slate-300 self-start sm:self-auto">
          <Calendar className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{new Date().toLocaleDateString('uz-UZ', { dateStyle: 'long' })}</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-card p-5 rounded-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Jami foydalanuvchilar</span>
            <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{stats?.total_users || 0}</span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +12%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Ilovada ro'yxatdan o'tganlar</p>
        </div>

        <div className="glass-card p-5 rounded-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Bugun faol</span>
            <div className="p-2.5 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400">
              <Flame className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{stats?.active_users_today || 0}</span>
            <span className="text-xs font-semibold text-slate-400">nafar</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Oxirgi 7 kunda {stats?.active_users_week || 0} nafar</p>
        </div>

        <div className="glass-card p-5 rounded-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Jami sessiyalar</span>
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Dumbbell className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{stats?.total_sessions || 0}</span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center">
              <Sparkles className="w-3.5 h-3.5" /> Faol
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Boshlangan mashg'ulotlar soni</p>
        </div>

        <div className="glass-card p-5 rounded-2xl relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Muvaffaqiyatli yakunlash</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{stats?.avg_completion_rate || 0}%</span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center">
              Yuqori
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Mashg'ulotni to'liq yakunlaganlar o'rtachasi</p>
        </div>
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Popular Workouts Bar Chart */}
        <div className="lg:col-span-2 glass-panel p-4 sm:p-6 rounded-2xl sm:rounded-3xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-white">Eng mashhur T25 mashg'ulotlari</h2>
              <p className="text-xs text-slate-400 mt-0.5">Yo'nalishlar bo'yicha boshlangan mashg'ulotlar soni</p>
            </div>
          </div>
          <div className="h-56 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={popularData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="sessions" fill="#f43f5e" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Users by Phase Pie Chart */}
        <div className="glass-panel p-4 sm:p-6 rounded-2xl sm:rounded-3xl flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Bosqichlar bo'yicha taqsimot</h2>
            <p className="text-xs text-slate-400 mt-0.5">Alpha, Beta va Gamma darajalari</p>
          </div>
          <div className="h-56 my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={phaseChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {phaseChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 pt-2 border-t border-slate-800">
            {phaseChartData.map((item, idx) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span className="text-slate-300">{item.name}</span>
                </div>
                <span className="font-semibold text-slate-100">{item.value} nafar</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
