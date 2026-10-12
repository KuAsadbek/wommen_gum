import React, { useState, useEffect } from 'react';
import { usersService } from '../../services/api';
import { Modal } from '../../components/Modal';
import {
  Search,
  UserCheck,
  UserX,
  Edit2,
  Trash2,
  Eye,
  Shield,
  User as UserIcon,
  Phone,
  Mail,
  Calendar,
  Activity,
  CheckCircle,
} from 'lucide-react';

export const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  
  // Selected user for details or editing
  const [selectedUser, setSelectedUser] = useState(null);
  const [userProgress, setUserProgress] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    role: 'user',
    is_active: true,
    weight: '',
    height: '',
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;
      const res = await usersService.getUsers(params);
      setUsers(res.data.results || res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, roleFilter]);

  const handleOpenDetail = async (user) => {
    setSelectedUser(user);
    setIsDetailOpen(true);
    try {
      const res = await usersService.getUserProgress(user.id);
      setUserProgress(res.data.data);
    } catch (e) {
      setUserProgress([]);
    }
  };

  const handleOpenEdit = (user) => {
    setSelectedUser(user);
    setEditFormData({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      phone: user.phone || '',
      role: user.role || 'user',
      is_active: user.is_active,
      weight: user.weight || '',
      height: user.height || '',
    });
    setIsEditOpen(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      await usersService.updateUser(selectedUser.id, editFormData);
      setIsEditOpen(false);
      fetchUsers();
    } catch (err) {
      alert('Saqlashda xatolik: ' + JSON.stringify(err.response?.data || err.message));
    }
  };

  const handleDeleteUser = async (user) => {
    if (window.confirm(`Haqiqatan ham ${user.email} foydalanuvchisini o'chirmoqchimisiz?`)) {
      try {
        await usersService.deleteUser(user.id);
        fetchUsers();
      } catch (err) {
        alert('O\'chirishda xatolik yuz berdi');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">Foydalanuvchilar</h1>
          <p className="text-xs text-slate-400 mt-1">
            Dastur ishtirokchilarini boshqarish va kirish huquqlari
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Ism, email bo'yicha qidiruv..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-rose-500"
          >
            <option value="">Barcha rollar</option>
            <option value="user">Foydalanuvchi</option>
            <option value="admin">Administrator</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-panel rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-4 sm:px-6 py-3 sm:py-4">Foydalanuvchi</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 hidden md:table-cell">Telefon</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 hidden lg:table-cell">Ko'rsatkichlar</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 hidden sm:table-cell">Rol</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4">Holat</th>
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
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    Foydalanuvchilar topilmadi
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/30 transition">
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 font-bold flex items-center justify-center shrink-0 text-xs sm:text-sm">
                          {u.first_name ? u.first_name[0] : u.email[0].toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-200 truncate">
                            {u.full_name || 'Ismsiz'}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-slate-300 hidden md:table-cell">
                      {u.phone || '—'}
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-slate-300 hidden lg:table-cell">
                      {u.weight ? `${u.weight} kg` : '—'} / {u.height ? `${u.height} sm` : '—'}
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 hidden sm:table-cell">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                          u.role === 'admin'
                            ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                            : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                      >
                        {u.role === 'admin' ? <Shield className="w-3 h-3" /> : <UserIcon className="w-3 h-3" />}
                        {u.role === 'admin' ? 'Admin' : 'Foydalanuvchi'}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                          u.is_active
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${u.is_active ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                        {u.is_active ? 'Faol' : 'Bloklangan'}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenDetail(u)}
                          title="Natijalar"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(u)}
                          title="Tahrirlash"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u)}
                          title="O'chirish"
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

      {/* User Detail & Progress Modal */}
      <Modal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        title={`Profil: ${selectedUser?.full_name || selectedUser?.email}`}
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-950/50 border border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 block mb-1">Email:</span>
              <span className="font-semibold text-slate-200">{selectedUser?.email}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-1">Telefon:</span>
              <span className="font-semibold text-slate-200">{selectedUser?.phone || 'Ko\'rsatilmagan'}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-1">Tana ko'rsatkichlari:</span>
              <span className="font-semibold text-slate-200">
                Vazn: {selectedUser?.weight ? `${selectedUser.weight} kg` : '—'}, Bo'y: {selectedUser?.height ? `${selectedUser.height} sm` : '—'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-1">Ro'yxatdan o'tgan sana:</span>
              <span className="font-semibold text-slate-200">
                {selectedUser?.created_at ? new Date(selectedUser.created_at).toLocaleDateString() : '—'}
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 mb-3 flex items-center gap-1.5">
              <Activity className="w-4 h-4" /> T25 bosqichlari bo'yicha natija
            </h4>
            <div className="space-y-3">
              {userProgress && userProgress.length > 0 ? (
                userProgress.map((p) => (
                  <div key={p.id} className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800 text-xs flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-100">{p.phase_name}</p>
                      <p className="text-[11px] text-slate-400">
                        Joriy mashg'ulot: {p.current_workout_name || 'Boshlanmagan'}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        Yakunlangan mashg'ulotlar: {p.total_workouts_completed}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">Hozircha natijalar mavjud emas</p>
              )}
            </div>
          </div>
        </div>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title={`Tahrirlash: ${selectedUser?.email}`}
      >
        <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1">Ism</label>
              <input
                type="text"
                value={editFormData.first_name}
                onChange={(e) => setEditFormData({ ...editFormData, first_name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-rose-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Familiya</label>
              <input
                type="text"
                value={editFormData.last_name}
                onChange={(e) => setEditFormData({ ...editFormData, last_name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1">Telefon</label>
              <input
                type="text"
                value={editFormData.phone}
                onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-rose-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Rol</label>
              <select
                value={editFormData.role}
                onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-rose-500"
              >
                <option value="user">Foydalanuvchi</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1">Vazn (kg)</label>
              <input
                type="number"
                step="0.1"
                value={editFormData.weight}
                onChange={(e) => setEditFormData({ ...editFormData, weight: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-rose-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Bo'y (sm)</label>
              <input
                type="number"
                step="0.1"
                value={editFormData.height}
                onChange={(e) => setEditFormData({ ...editFormData, height: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="is_active_check"
              checked={editFormData.is_active}
              onChange={(e) => setEditFormData({ ...editFormData, is_active: e.target.checked })}
              className="rounded bg-slate-950 border-slate-800 text-rose-500 focus:ring-0"
            />
            <label htmlFor="is_active_check" className="text-slate-300">
              Hisob faol (kirishga ruxsat berilgan)
            </label>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsEditOpen(false)}
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
