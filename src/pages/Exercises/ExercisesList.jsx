import React, { useState, useEffect, useRef } from 'react';
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
  Video,
  Film,
  Eye,
  X,
  Upload,
  Play,
  FileVideo,
} from 'lucide-react';

export const getMediaType = (urlOrFile, fileObj = null) => {
  if (fileObj) {
    if (fileObj.type.startsWith('video/')) return 'video';
    if (fileObj.type === 'image/gif') return 'gif';
    return 'image';
  }
  if (!urlOrFile || typeof urlOrFile !== 'string') return null;
  const clean = urlOrFile.split('?')[0].toLowerCase();
  if (clean.match(/\.(mp4|webm|mov|ogg|m4v|avi|mkv)$/i)) return 'video';
  if (clean.endsWith('.gif')) return 'gif';
  return 'image';
};

export const ExercisesList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialWorkoutId = searchParams.get('workout') || '';

  const [exercises, setExercises] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [selectedWorkout, setSelectedWorkout] = useState(initialWorkoutId);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState(null);
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [mediaRemoved, setMediaRemoved] = useState(false);

  // Lightbox / Media Viewer Modal
  const [previewModal, setPreviewModal] = useState(null);

  const fileInputRef = useRef(null);

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
    setMediaFile(null);
    setMediaPreview(null);
    setMediaType(null);
    setMediaRemoved(false);
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
    setMediaFile(null);
    setMediaPreview(ex.image || null);
    setMediaType(getMediaType(ex.image));
    setMediaRemoved(false);
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

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        alert("Fayl hajmi 100MB dan oshmasligi kerak!");
        return;
      }
      setMediaFile(file);
      const url = URL.createObjectURL(file);
      setMediaPreview(url);
      setMediaType(getMediaType(url, file));
      setMediaRemoved(false);
    }
  };

  const handleRemoveMedia = () => {
    setMediaFile(null);
    setMediaPreview(null);
    setMediaType(null);
    setMediaRemoved(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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

      if (mediaFile) {
        form.append('image', mediaFile);
      } else if (mediaRemoved && editingExercise) {
        // Clear media on backend
        form.append('image', '');
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
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Mashqlar</h1>
          <p className="text-xs text-slate-400 mt-1">
            Mashqlar bazasi, video/GIF ko'rsatmalar, vaqt me'yorlari va texnikani boshqarish
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-semibold text-xs shadow-lg shadow-rose-500/20 transition self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Mashq qo'shish
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
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

        <div className="relative w-full sm:w-64">
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
                <th className="px-4 sm:px-6 py-3 sm:py-4 w-16 text-center hidden sm:table-cell">Tartib</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4">Mashq & Media</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 hidden md:table-cell">Davomiyligi</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 hidden lg:table-cell">Dam olish</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 hidden lg:table-cell">Maslahatlar / Texnika</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-right">Amallar</th>
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
                exercises.map((ex, index) => {
                  const type = getMediaType(ex.image);
                  return (
                    <tr key={ex.id} className="hover:bg-slate-800/30 transition">
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-center hidden sm:table-cell">
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
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <div className="flex items-center gap-3">
                          {/* Media Thumbnail with click to preview */}
                          <div
                            onClick={() => {
                              if (ex.image) {
                                setPreviewModal({
                                  url: ex.image,
                                  type,
                                  name: ex.name,
                                  description: ex.description,
                                  tips: ex.tips,
                                });
                              }
                            }}
                            title={ex.image ? "To'liq ekranda ko'rish uchun bosing" : ''}
                            className={`w-12 h-12 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-center overflow-hidden shrink-0 relative group ${
                              ex.image ? 'cursor-pointer hover:border-rose-500 transition-all shadow-sm' : ''
                            }`}
                          >
                            {ex.image ? (
                              <>
                                {type === 'video' ? (
                                  <video
                                    src={ex.image}
                                    className="w-full h-full object-cover"
                                    muted
                                    loop
                                    autoPlay
                                    playsInline
                                  />
                                ) : (
                                  <img
                                    src={ex.image}
                                    alt={ex.name}
                                    className="w-full h-full object-cover"
                                  />
                                )}
                                <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <Eye className="w-4 h-4 text-white drop-shadow" />
                                </div>
                                {type === 'video' && (
                                  <div className="absolute bottom-0.5 right-0.5 bg-rose-600/95 text-[7px] font-black tracking-wider text-white px-1 rounded">
                                    VIDEO
                                  </div>
                                )}
                                {type === 'gif' && (
                                  <div className="absolute bottom-0.5 right-0.5 bg-indigo-600/95 text-[7px] font-black tracking-wider text-white px-1 rounded">
                                    GIF
                                  </div>
                                )}
                              </>
                            ) : (
                              <Activity className="w-5 h-5 text-rose-400" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-slate-100">{ex.name}</p>
                              {type === 'video' && (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                  <Film className="w-2.5 h-2.5" /> Video
                                </span>
                              )}
                              {type === 'gif' && (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                  GIF
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400 line-clamp-1 max-w-sm mt-0.5">
                              {ex.description || 'Texnika tavsifi'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 hidden md:table-cell">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          <Clock className="w-3 h-3" /> {ex.duration_seconds} son ({Math.round(ex.duration_seconds / 60)} daq)
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-slate-400 hidden lg:table-cell">
                        {ex.rest_seconds > 0 ? `${ex.rest_seconds} son` : 'Dam olishsiz'}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-slate-300 max-w-xs truncate hidden lg:table-cell">
                        {ex.tips ? (
                          <span className="flex items-center gap-1 text-[11px] text-amber-300/90">
                            <Lightbulb className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                            {ex.tips}
                          </span>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(ex)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
                            title="Tahrirlash"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(ex)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                            title="O'chirish"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
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
            <label className="block text-slate-400 mb-1 font-medium">Mashg'ulot</label>
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
            <label className="block text-slate-400 mb-1 font-medium">Mashq nomi</label>
            <input
              type="text"
              required
              placeholder="Jumping Jacks, Squats, Mountain Climbers..."
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-rose-500"
            >
            </input>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Davomiyligi (soniyalarda)</label>
              <input
                type="number"
                required
                value={formData.duration_seconds}
                onChange={(e) => setFormData({ ...formData, duration_seconds: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-rose-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Keyingi dam olish (soniyalarda)</label>
              <input
                type="number"
                value={formData.rest_seconds}
                onChange={(e) => setFormData({ ...formData, rest_seconds: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Bajarish texnikasi tavsifi</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Harakatni qanday to'g'ri bajarish kerak, oyoqlar va gavda holati..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-slate-400 mb-1 font-medium">Maslahatlar / Xatolar</label>
            <input
              type="text"
              placeholder="Tizzalarni yumshoq tuting, nafasni ushlab qolmang..."
              value={formData.tips}
              onChange={(e) => setFormData({ ...formData, tips: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* Media Upload (Video, GIF, Photo) */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <label className="text-slate-300 font-semibold flex items-center gap-2">
                <Video className="w-4 h-4 text-rose-400" />
                Mashq media fayli (Video, GIF yoki Rasm)
              </label>
              {mediaType && (
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {mediaType === 'video' ? '🎬 Video format' : mediaType === 'gif' ? '✨ GIF animatsiya' : '🖼️ Fotosurat'}
                </span>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="video/*,image/*,.mp4,.webm,.mov,.gif,.jpg,.jpeg,.png,.webp"
              onChange={handleMediaChange}
              className="hidden"
            />

            {mediaPreview ? (
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                <div className="relative rounded-xl overflow-hidden bg-black/60 border border-slate-800/80 flex items-center justify-center max-h-56">
                  {mediaType === 'video' ? (
                    <video
                      src={mediaPreview}
                      controls
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full max-h-56 object-contain"
                    />
                  ) : (
                    <img
                      src={mediaPreview}
                      alt="Preview"
                      className="w-full max-h-56 object-contain"
                    />
                  )}
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 truncate max-w-xs">
                      {mediaFile ? mediaFile.name : "Mavjud media fayli"}
                    </span>
                    {mediaFile && (
                      <span className="text-[10px] text-slate-500 font-mono">
                        ({(mediaFile.size / (1024 * 1024)).toFixed(1)} MB)
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium transition"
                    >
                      Almashtirish
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveMedia}
                      className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[11px] font-medium transition flex items-center gap-1"
                    >
                      <X className="w-3 h-3" /> O'chirish
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-800 hover:border-rose-500/50 hover:bg-rose-500/5 rounded-2xl p-6 text-center cursor-pointer transition group"
              >
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400 group-hover:scale-110 transition">
                    <Video className="w-5 h-5" />
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition">
                    <Film className="w-5 h-5" />
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-slate-200 font-semibold text-xs">
                  Video, GIF yoki Rasm yuklash uchun bosing
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  MP4, WebM, MOV, GIF, JPG, PNG qo'llab-quvvatlanadi (100MB gacha)
                </p>
                <p className="text-[10px] text-rose-400/80 mt-1 font-medium">
                  💡 Mashq texnikasini ko'rsatish uchun qisqa Video yoki GIF tavsiya etiladi
                </p>
              </div>
            )}
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition cursor-pointer"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold transition cursor-pointer shadow-lg shadow-rose-600/20"
            >
              Saqlash
            </button>
          </div>
        </form>
      </Modal>

      {/* Lightbox / Media Viewer Modal */}
      {previewModal && (
        <Modal
          isOpen={!!previewModal}
          onClose={() => setPreviewModal(null)}
          title={`Mashq ko'rinishi: ${previewModal.name}`}
        >
          <div className="space-y-4">
            <div className="rounded-2xl overflow-hidden bg-black/90 border border-slate-800 flex items-center justify-center min-h-[260px] max-h-[70vh]">
              {previewModal.type === 'video' ? (
                <video
                  src={previewModal.url}
                  controls
                  autoPlay
                  loop
                  playsInline
                  className="w-full max-h-[65vh] object-contain"
                />
              ) : (
                <img
                  src={previewModal.url}
                  alt={previewModal.name}
                  className="w-full max-h-[65vh] object-contain"
                />
              )}
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-200">{previewModal.name}</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-rose-400 border border-slate-700">
                  {previewModal.type === 'video' ? 'Video format (MP4/WebM)' : previewModal.type === 'gif' ? 'GIF animatsiya' : 'Fotosurat'}
                </span>
              </div>
              {previewModal.description && (
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  {previewModal.description}
                </p>
              )}
              {previewModal.tips && (
                <div className="flex items-center gap-1.5 text-amber-300/90 text-[11px] pt-1">
                  <Lightbulb className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                  <span>{previewModal.tips}</span>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
              >
                Yopish
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
