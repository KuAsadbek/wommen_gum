import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/api';
import {
  Settings as SettingsIcon,
  User,
  Shield,
  FileCode,
  CheckCircle,
  Save,
  Key,
  Server,
  ExternalLink,
} from 'lucide-react';

export const Settings = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    phone: user?.phone || '',
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);
    try {
      await authService.updateProfile(formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert('Profilni yangilashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Tizim sozlamalari</h1>
        <p className="text-xs text-slate-400 mt-1">
          Administrator hisobi konfiguratsiyasi va API parametrlari
        </p>
      </div>

      {/* Admin Profile Form */}
      <div className="glass-panel p-6 rounded-3xl space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Administrator profili</h3>
            <p className="text-xs text-slate-400">Tizimda ko'rsatiladigan shaxsiy ma'lumotlar</p>
          </div>
        </div>

        {saved && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle className="w-4 h-4" /> Ma'lumotlar muvaffaqiyatli yangilandi!
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1">Email (Login)</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full px-3 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-slate-400 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Tizimdagi roli</label>
              <input
                type="text"
                disabled
                value="Superuser Administrator"
                className="w-full px-3 py-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-purple-400 font-semibold cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1">Ism</label>
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-rose-500"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Familiya</label>
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Aloqa telefoni</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-semibold text-xs shadow-lg shadow-rose-500/20 flex items-center gap-2 transition"
            >
              <Save className="w-4 h-4" /> O'zgarishlarni saqlash
            </button>
          </div>
        </form>
      </div>

      {/* Backend & API Docs info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Backend Server</h3>
              <p className="text-[11px] text-slate-400">Django 5 + DRF + SimpleJWT</p>
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Server URL:</span>
              <span className="font-mono text-slate-200">https://gym.crmbot.uz</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Access Token:</span>
              <span className="text-slate-200">15 daqiqa</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Refresh Token:</span>
              <span className="text-slate-200">7 kun (Rotation)</span>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Swagger / OpenAPI Hujjatlari</h3>
              <p className="text-[11px] text-slate-400">Interaktiv REST API hujjatlari</p>
            </div>
          </div>
          <a
            href="https://gym.crmbot.uz/api/docs/"
            target="_blank"
            rel="noreferrer"
            className="w-full py-3 px-4 rounded-xl bg-slate-800/80 hover:bg-emerald-500/20 text-slate-200 hover:text-emerald-300 border border-slate-700/60 hover:border-emerald-500/30 text-xs font-semibold flex items-center justify-center gap-2 transition"
          >
            Swagger UI ochish <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};
