import React, { useState, useEffect } from 'react';
import { phasesService } from '../../services/api';
import { Modal } from '../../components/Modal';
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  Dumbbell,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

export const PhasesList = () => {
  const [phases, setPhases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPhase, setEditingPhase] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    level: 1,
    difficulty: 'beginner',
    description: '',
    is_active: true,
  });

  const fetchPhases = async () => {
    setLoading(true);
    try {
      const res = await phasesService.getPhases();
      setPhases(res.data.results || res.data);
    } catch (err) {
      console.error('Failed to load phases:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhases();
  }, []);

  const handleOpenCreate = () => {
    setEditingPhase(null);
    setFormData({
      name: '',
      level: phases.length + 1,
      difficulty: 'beginner',
      description: '',
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (phase) => {
    setEditingPhase(phase);
    setFormData({
      name: phase.name,
      level: phase.level,
      difficulty: phase.difficulty,
      description: phase.description || '',
      is_active: phase.is_active,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingPhase) {
        await phasesService.updatePhase(editingPhase.id, formData);
      } else {
        await phasesService.createPhase(formData);
      }
      setIsModalOpen(false);
      fetchPhases();
    } catch (err) {
      alert('Saqlashda xatolik: ' + JSON.stringify(err.response?.data || err.message));
    }
  };

  const handleDelete = async (phase) => {
    if (window.confirm(`Haqiqatan ham "${phase.name}" bosqichini o'chirmoqchimisiz? Bu uning barcha mashg'ulotlarini ham o'chiradi!`)) {
      try {
        await phasesService.deletePhase(phase.id);
        fetchPhases();
      } catch (err) {
        alert('O\'chirishda xatolik yuz berdi');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Mashg'ulot bosqichlari</h1>
          <p className="text-[11px] sm:text-xs text-slate-400 mt-1">
            Healty Gym Women T25 rivojlanish darajalari (Alpha → Beta → Gamma)
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-semibold text-xs shadow-lg shadow-rose-500/20 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Bosqich qo'shish
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {phases.map((phase) => (
            <div
              key={phase.id}
              className="glass-panel p-6 rounded-3xl relative overflow-hidden flex flex-col justify-between group border border-slate-800 hover:border-rose-500/30 transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center font-black text-base">
                      {phase.level}
                    </div>
                    <div>
                      <h3 className="text-lg font-extrabold text-white">
                        {phase.name}
                      </h3>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-rose-400">
                        {phase.difficulty === 'beginner' && 'Boshlang\'ich daraja'}
                        {phase.difficulty === 'intermediate' && 'O\'rta daraja'}
                        {phase.difficulty === 'advanced' && 'Yuqori daraja'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(phase)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(phase)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed mb-6 min-h-[48px]">
                  {phase.description || 'Bosqich tavsifi mavjud emas.'}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-400">
                  <Dumbbell className="w-4 h-4 text-rose-400" />
                  <span>{phase.workouts_count || 0} ta mashg'ulot</span>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                  phase.is_active ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  {phase.is_active ? 'Faol' : 'Yashirin'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal create / edit phase */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPhase ? `Tahrirlash: ${editingPhase.name}` : 'Yangi mashg\'ulot bosqichi'}
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1">Bosqich nomi</label>
              <input
                type="text"
                required
                placeholder="Alpha, Beta, Gamma..."
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-rose-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Daraja tartib raqami</label>
              <input
                type="number"
                required
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Murakkablik darajasi</label>
            <select
              value={formData.difficulty}
              onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-rose-500"
            >
              <option value="beginner">Boshlang'ich (Beginner)</option>
              <option value="intermediate">O'rta (Intermediate)</option>
              <option value="advanced">Yuqori (Advanced)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Bosqich tavsifi</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Mashg'ulot dasturining batafsil tavsifi..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="is_phase_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="rounded bg-slate-950 border-slate-800 text-rose-500 focus:ring-0"
            />
            <label htmlFor="is_phase_active" className="text-slate-300">
              Bosqich foydalanuvchilar uchun faol
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
