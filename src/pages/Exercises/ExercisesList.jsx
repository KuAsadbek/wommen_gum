import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { exercisesService, workoutsService } from '../../services/api';
import { Modal } from '../../components/Modal';
import {
  Activity,
  Plus,
  Search,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  Clock,
  Image as ImageIcon,
  CheckCircle,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';

export const ExercisesList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialWorkoutId = searchParams.get('workout') || '';

  const [exercises, setExercises] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState(initialWorkoutId);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    workout: '',
    name: '',
    description: '',
    duration_seconds: 180,
    rest_seconds: 0,
    order: 1,
    repetitions: '',
    tips: '',
    is_active: true,
  });

  const fetchWorkouts = async () => {
    try {
      const res = await workoutsService.getWorkouts();
      const list = res.data.results || res.data;
      setWorkouts(list);
      if (!selectedWorkout && list.length > 0) {
        setSelectedWorkout(list[0].id.toString());
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchExercises = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedWorkout) params.workout = selectedWorkout;
      if (search) params.search = search;
      const res = await exercisesService.getExercises(params);
      setExercises(res.data.results || res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  useEffect(() => {
    if (selectedWorkout) {
      fetchExercises();
    }
  }, [selectedWorkout, search]);

  const handleWorkoutChange = (wId) => {
    setSelectedWorkout(wId);
    setSearchParams(wId ? { workout: wId } : {});
  };

  const handleOpenCreate = () => {
    setEditingExercise(null);
    setImageFile(null);
    setImagePreview(null);
    setFormData({
      workout: selectedWorkout || (workouts[0]?.id || ''),
      name: '',
      description: '',
      duration_seconds: 180,
      rest_seconds: 0,
      order: exercises.length + 1,
      repetitions: '',
      tips: '',
      is_active: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ex) => {
    setEditingExercise(ex);
    setImageFile(null);
    setImagePreview(ex.image || null);
    setFormData({
      workout: ex.workout,
      name: ex.name,
      description: ex.description || '',
      duration_seconds: ex.duration_seconds || 180,
      rest_seconds: ex.rest_seconds || 0,
      order: ex.order || 1,
      repetitions: ex.repetitions || '',
      tips: ex.tips || '',
      is_active: ex.is_active,
    });
    setIsModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          form.append(key, value);
        }
      });
      if (imageFile) {
        form.append('image', imageFile);
      }

      if (editingExercise) {
        await exercisesService.updateExercise(editingExercise.id, form);
      } else {
        await exercisesService.createExercise(form);
      }
      setIsModalOpen(false);
      fetchExercises();
    } catch (err) {
      alert('Saqlashda xatolik: ' + JSON.stringify(err.response?.data || err.message));
    }
  };

  const handleDelete = async (ex) => {
    if (window.confirm(`"${ex.name}" mashqini o'chirmoqchimisiz?`)) {
      try {
        await exercisesService.deleteExercise(ex.id);
        fetchExercises();
      } catch (err) {
        alert('O\'chirishda xatolik yuz berdi');
      }
    }
  };

  const moveOrder = async (index, direction) => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= exercises.length) return;

    const list = [...exercises];
    const temp = list[index];
    list[index] = list[newIndex];
    list[newIndex] = temp;

    // Update orders
    const items = list.map((item, idx) => ({ id: item.id, order: idx + 1 }));
    setExercises(list.map((item, idx) => ({ ...item, order: idx + 1 })));

    try {
      await exercisesService.reorderExercises(items);
    } catch (err) {
      console.error('Failed to update order', err);
      fetchExercises();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Mashqlar</h1>
          <p className="text-xs text-slate-400 mt-1">
            Mashqlar bazasi, vaqt me'yorlari va bajarish texnikasini boshqarish
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-semibold text-xs shadow-lg shadow-rose-500/20 transition self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Mashq qo'shish
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={selectedWorkout}
          onChange={(e) => handleWorkoutChange(e.target.value)}
          className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-rose-500 font-medium"
        >
          {workouts.map((w) => (
            <option key={w.id} value={w.id}>
              {w.phase_name} • {w.name} (#{w.number})
            </option>
          ))}
        </select>

        <div className="relative w-64">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Nomi bo'yicha qidiruv..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500"
          />
        </div>
      </div>

      {/* Exercises List / Table */}
      <div className="glass-panel rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-4 w-16 text-center">Tartib</th>
                <th className="px-6 py-4">Mashq</th>
                <th className="px-6 py-4">Davomiyligi</th>
                <th className="px-6 py-4">Dam olish</th>
                <th className="px-6 py-4">Maslahatlar / Texnika</th>
                <th className="px-6 py-4 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <div className="inline-block w-6 h-6 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
                  </td>
                </tr>
              ) : exercises.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    Ushbu mashg'ulotda hozircha mashqlar mavjud emas
                  </td>
                </tr>
              ) : (
                exercises.map((ex, index) => (
                  <tr key={ex.id} className="hover:bg-slate-800/30 transition">
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <span className="font-bold text-slate-300 mr-2">{index + 1}</span>
                        <div className="flex flex-col gap-0.5">
                          <button
                            disabled={index === 0}
                            onClick={() => moveOrder(index, 'up')}
                            className="p-0.5 text-slate-500 hover:text-rose-400 disabled:opacity-20 transition"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            disabled={index === exercises.length - 1}
                            onClick={() => moveOrder(index, 'down')}
                            className="p-0.5 text-slate-500 hover:text-rose-400 disabled:opacity-20 transition"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                          {ex.image ? (
                            <img src={ex.image} alt={ex.name} className="w-full h-full object-cover" />
                          ) : (
                            <Activity className="w-4 h-4 text-rose-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-100">{ex.name}</p>
                          <p className="text-[11px] text-slate-400 line-clamp-1 max-w-sm">
                            {ex.description || 'Texnika tavsifi'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        <Clock className="w-3 h-3" /> {ex.duration_seconds} son ({Math.round(ex.duration_seconds / 60)} daq)
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {ex.rest_seconds > 0 ? `${ex.rest_seconds} son` : 'Dam olishsiz'}
                    </td>
                    <td className="px-6 py-4 text-slate-300 max-w-xs truncate">
                      {ex.tips ? (
                        <span className="flex items-center gap-1 text-[11px] text-amber-300/90">
                          <Lightbulb className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                          {ex.tips}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(ex)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(ex)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal create / edit exercise */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingExercise ? `Tahrirlash: ${editingExercise.name}` : 'Yangi mashq'}
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Mashg'ulot</label>
            <select
              required
              value={formData.workout}
              onChange={(e) => setFormData({ ...formData, workout: parseInt(e.target.value) })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-rose-500"
            >
              {workouts.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.phase_name} • {w.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Mashq nomi</label>
            <input
              type="text"
              required
              placeholder="Jumping Jacks, Squats, Mountain Climbers..."
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1">Davomiyligi (soniyalarda)</label>
              <input
                type="number"
                required
                value={formData.duration_seconds}
                onChange={(e) => setFormData({ ...formData, duration_seconds: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-rose-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Keyingi dam olish (soniyalarda)</label>
              <input
                type="number"
                value={formData.rest_seconds}
                onChange={(e) => setFormData({ ...formData, rest_seconds: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Bajarish texnikasi tavsifi</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Harakatni qanday to'g'ri bajarish kerak, oyoqlar va gavda holati..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Maslahatlar / Xatolar</label>
            <input
              type="text"
              placeholder="Tizzalarni yumshoq tuting, nafasni ushlab qolmang..."
              value={formData.tips}
              onChange={(e) => setFormData({ ...formData, tips: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-slate-400 mb-2">Mashq fotosurati (ko'rsatma)</label>
            <div className="flex items-center gap-4">
              {imagePreview ? (
                <div className="w-16 h-16 rounded-xl border border-rose-500/40 overflow-hidden relative group">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-500">
                  <ImageIcon className="w-6 h-6" />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="text-xs text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-rose-500/10 file:text-rose-400 hover:file:bg-rose-500/20"
              />
            </div>
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
