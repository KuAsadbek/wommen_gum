import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { workoutsService, phasesService } from '../../services/api';
import { Modal } from '../../components/Modal';
import {
  Dumbbell,
  Plus,
  Search,
  Edit2,
  Trash2,
  Clock,
  Activity,
  Layers,
  Sparkles,
} from 'lucide-react';

export const WorkoutsList = () => {
  const [workouts, setWorkouts] = useState([]);
  const [phases, setPhases] = useState([]);
  const [selectedPhase, setSelectedPhase] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    phase: '',
    number: 1,
    name: '',
    description: '',
    duration_minutes: 25,
    exercise_pattern: '3+3+3+3+3+3+3+4',
    order: 1,
    is_active: true,
  });

  const fetchPhases = async () => {
    try {
      const res = await phasesService.getPhases();
      setPhases(res.data.results || res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchWorkouts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedPhase) params.phase = selectedPhase;
      if (search) params.search = search;
      const res = await workoutsService.getWorkouts(params);
      setWorkouts(res.data.results || res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhases();
  }, []);

  useEffect(() => {
    fetchWorkouts();
  }, [selectedPhase, search]);

  const handleOpenCreate = () => {
    setEditingWorkout(null);
    setFormData({
      phase: phases[0]?.id || '',
      number: workouts.length + 1,
      name: '',
      description: '',
      duration_minutes: 25,
      exercise_pattern: '3+3+3+3+3+3+3+4',
      order: workouts.length + 1,
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (w) => {
    setEditingWorkout(w);
    setFormData({
      phase: w.phase,
      number: w.number,
      name: w.name,
      description: w.description || '',
      duration_minutes: w.duration_minutes || 25,
      exercise_pattern: w.exercise_pattern || '',
      order: w.order || 1,
      is_active: w.is_active,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingWorkout) {
        await workoutsService.updateWorkout(editingWorkout.id, formData);
      } else {
        await workoutsService.createWorkout(formData);
      }
      setIsModalOpen(false);
      fetchWorkouts();
    } catch (err) {
      alert('Saqlashda xatolik: ' + JSON.stringify(err.response?.data || err.message));
    }
  };

  const handleDelete = async (w) => {
    if (window.confirm(`"${w.name}" mashg'ulotini va uning barcha mashqlarini o'chirmoqchimisiz?`)) {
      try {
        await workoutsService.deleteWorkout(w.id);
        fetchWorkouts();
      } catch (err) {
        alert('O\'chirishda xatolik yuz berdi');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Dastur mashg'ulotlari</h1>
          <p className="text-xs text-slate-400 mt-1">
            T25 mashqlar majmuasi (har biri 25 daqiqa)
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-semibold text-xs shadow-lg shadow-rose-500/20 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Mashg'ulot yaratish
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-64">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Mashg'ulotni qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500"
          />
        </div>

        <select
          value={selectedPhase}
          onChange={(e) => setSelectedPhase(e.target.value)}
          className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-rose-500"
        >
          <option value="">Barcha bosqichlar (Alpha, Beta, Gamma)</option>
          {phases.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} bosqichi
            </option>
          ))}
        </select>
      </div>

      {/* Grid of Workouts */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {workouts.map((w) => (
            <div
              key={w.id}
              className="glass-card p-5 rounded-2xl flex flex-col justify-between group relative"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    {w.phase_name} bosqichi • №{w.number}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(w)}
                      className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(w)}
                      className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-rose-400 transition">
                  {w.name}
                </h3>
                <p className="text-xs text-slate-300 line-clamp-2 mb-4">
                  {w.description || 'T25 metodikasi bo\'yicha 25 daqiqalik mashg\'ulot.'}
                </p>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-800">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-rose-400" />
                    {w.duration_minutes} daqiqa
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-pink-400" />
                    {w.exercises_count || 0} ta mashq
                  </span>
                </div>

                <button
                  onClick={() => navigate(`/exercises?workout=${w.id}`)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border border-slate-700/60 hover:border-rose-500/30 text-xs font-semibold flex items-center justify-center gap-2 transition"
                >
                  <Activity className="w-3.5 h-3.5" /> Mashqlarni boshqarish
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingWorkout ? `Tahrirlash: ${editingWorkout.name}` : 'Yangi mashg\'ulot'}
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1">Mashg'ulot bosqichi</label>
              <select
                required
                value={formData.phase}
                onChange={(e) => setFormData({ ...formData, phase: parseInt(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-rose-500"
              >
                {phases.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} bosqichi
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Tartib raqami (1-14)</label>
              <input
                type="number"
                required
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, number: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Mashg'ulot nomi</label>
            <input
              type="text"
              required
              placeholder="Cardio, Speed 1.0, Total Body Circuit..."
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1">Davomiyligi (daq)</label>
              <input
                type="number"
                required
                value={formData.duration_minutes}
                onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 25 })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-rose-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Takrorlash tartibi</label>
              <input
                type="text"
                placeholder="3+3+3+3+3+3+3+4"
                value={formData.exercise_pattern}
                onChange={(e) => setFormData({ ...formData, exercise_pattern: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Tavsif</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Mashg'ulot yo'nalishi haqida tavsif..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="is_workout_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="rounded bg-slate-950 border-slate-800 text-rose-500 focus:ring-0"
            />
            <label htmlFor="is_workout_active" className="text-slate-300">
              Mashg'ulot faol
            </label>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold transition"
            >
              Saqlash
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
