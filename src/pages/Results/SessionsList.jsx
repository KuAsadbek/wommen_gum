import React, { useState, useEffect } from 'react';
import { resultsService } from '../../services/api';
import { Modal } from '../../components/Modal';
import {
  ClipboardList,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Flame,
  Calendar,
  Eye,
  User,
  Activity,
} from 'lucide-react';

export const SessionsList = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSession, setSelectedSession] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      const res = await resultsService.getSessions(params);
      setSessions(res.data.results || res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [search]);

  const handleOpenDetail = async (s) => {
    try {
      const res = await resultsService.getSessionDetail(s.id);
      setSelectedSession(res.data.data);
    } catch (e) {
      setSelectedSession(s);
    }
    setIsDetailOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Sessiyalar va Natijalar</h1>
          <p className="text-xs text-slate-400 mt-1">
            Foydalanuvchilarning tugallangan va faol mashg'ulotlari tarixi
          </p>
        </div>

        <div className="relative w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Email yoki mashg'ulot bo'yicha qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-4">Foydalanuvchi</th>
                <th className="px-6 py-4">Mashg'ulot</th>
                <th className="px-6 py-4">Davomiyligi</th>
                <th className="px-6 py-4">Kaloriya</th>
                <th className="px-6 py-4">Sana va vaqt</th>
                <th className="px-6 py-4">Holat</th>
                <th className="px-6 py-4 text-right">Batafsil</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    <div className="inline-block w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
                  </td>
                </tr>
              ) : sessions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    Mashg'ulot sessiyalari hali mavjud emas
                  </td>
                </tr>
              ) : (
                sessions.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-800/30 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold text-xs">
                          {s.user_email ? s.user_email[0].toUpperCase() : 'U'}
                        </div>
                        <span className="font-semibold text-slate-200">{s.user_email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-white">{s.workout_name}</span>
                      <span className="text-[10px] block text-slate-400">Bosqich: {s.phase_name || 'Alpha'}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-300">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-rose-400" />
                        {Math.round((s.total_duration_seconds || 0) / 60)} daq ({s.total_duration_seconds || 0} son)
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-300">
                      {s.calories_burned ? (
                        <span className="flex items-center gap-1 text-amber-400">
                          <Flame className="w-3.5 h-3.5" /> {s.calories_burned} kkal
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {s.started_at ? new Date(s.started_at).toLocaleString('uz-UZ') : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                          s.is_completed
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}
                      >
                        {s.is_completed ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {s.is_completed ? 'Tugallangan' : 'Jarayonda'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleOpenDetail(s)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Session Details Modal */}
      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title={`Sessiya tafsilotlari #${selectedSession?.id || ''}`}
      >
        <div className="space-y-5 text-xs">
          <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div>
              <span className="text-slate-400 block mb-1">Foydalanuvchi:</span>
              <span className="font-bold text-slate-200">{selectedSession?.user_email}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-1">Mashg'ulot:</span>
              <span className="font-bold text-rose-400">{selectedSession?.workout_name}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-1">Bajarilgan vaqt:</span>
              <span className="font-semibold text-slate-200">
                {Math.round((selectedSession?.total_duration_seconds || 0) / 60)} daqiqa ({selectedSession?.total_duration_seconds} soniya)
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-1">Kaloriya:</span>
              <span className="font-semibold text-slate-200">
                {selectedSession?.calories_burned ? `${selectedSession.calories_burned} kkal` : 'Ko\'rsatilmagan'}
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-3 flex items-center gap-1.5">
              <Activity className="w-4 h-4" /> Bajarilgan mashqlar
            </h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {selectedSession?.exercise_results && selectedSession.exercise_results.length > 0 ? (
                selectedSession.exercise_results.map((res, idx) => (
                  <div
                    key={res.id}
                    className="p-3 rounded-xl bg-slate-950/40 border border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-bold text-slate-200">{idx + 1}. {res.exercise_name}</p>
                      <p className="text-[10px] text-slate-400">
                        Haqiqiy vaqt: {res.actual_duration_seconds} son
                      </p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        res.is_completed
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : res.skipped
                          ? 'bg-slate-800 text-slate-400 border-slate-700'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}
                    >
                      {res.is_completed ? 'Bajarildi' : res.skipped ? 'O\'tkazib yuborildi' : 'Tugallanmadi'}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">Mashqlar bo'yicha batafsil natijalar yo'q</p>
              )}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
