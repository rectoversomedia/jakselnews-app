'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  User,
  Envelope,
  Phone,
  Camera,
  Check,
  Spinner,
  Warning,
  SignOut,
  ShieldWarning,
  Pencil,
} from '@phosphor-icons/react';
import Header from '@/components/layout/Header';

interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  role: 'user' | 'admin' | 'superadmin';
  avatar_url: string | null;
  created_at: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function ProfilPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      router.push('/login?redirect=/profil');
      return;
    }

    fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setUser(data.data);
          setFormData({
            name: data.data.name || '',
            phone: data.data.phone || '',
          });
        } else {
          throw new Error('Gagal memuat profil');
        }
      })
      .catch(() => {
        setError('Tidak dapat memuat data profil');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);

  const handleSave = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    setSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setUser((prev) => prev ? { ...prev, ...formData } : null);
        setIsEditing(false);
      } else {
        setError(data.error || 'Gagal menyimpan perubahan');
      }
    } catch {
      setError('Tidak dapat menyimpan perubahan');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    router.push('/');
  };

  // Loading state
  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Spinner size={48} className="animate-spin text-red-500 mx-auto mb-4" />
          <p className="text-gray-500">Memuat...</p>
        </div>
      </main>
    );
  }

  // Error state
  if (error && !user) {
    return (
      <main className="min-h-screen bg-gray-50 pb-20 lg:pb-0 lg:pt-20">
        <Header title="Profil" />
        <div className="pt-14 lg:pt-4 px-4 py-6 max-w-md mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <Warning size={48} className="text-red-500 mx-auto mb-4" />
            <h2 className="text-lg font-bold text-red-900 mb-2">Terjadi Kesalahan</h2>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </main>
    );
  }

  // Not logged in - should redirect but just in case
  if (!user) {
    return (
      <main className="min-h-screen bg-gray-50 pb-20 lg:pb-0 lg:pt-20">
        <Header title="Profil" />
        <div className="pt-14 lg:pt-4 px-4 py-6 max-w-md mx-auto text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User size={32} className="text-gray-400" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Profil</h1>
          <p className="text-gray-500 mb-4">Silakan login untuk melihat profil Anda</p>
          <Link
            href="/login"
            className="inline-block px-6 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
          >
            Masuk
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-20 lg:pb-0 lg:pt-20">
      <Header title="Profil" />

      <div className="pt-14 lg:pt-4 px-4 py-6 max-w-md mx-auto">
        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 mb-4" role="alert">
            <Warning size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={() => setError(null)}
                className="text-xs text-red-600 font-medium hover:underline mt-1"
              >
                Tutup
              </button>
            </div>
          </div>
        )}

        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-4">
          <div className="flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="relative mb-4">
              <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
                {user.avatar_url ? (
                  <Image
                    src={user.avatar_url}
                    alt={user.name || 'Profil'}
                    width={96}
                    height={96}
                    className="object-cover"
                  />
                ) : (
                  user.name?.charAt(0).toUpperCase() || 'U'
                )}
              </div>
              <button
                className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-red-600 transition-colors border-2 border-white"
                aria-label="Ganti foto profil"
              >
                <Camera size={16} />
              </button>
            </div>

            {/* Name */}
            <h1 className="text-xl font-bold text-gray-900">
              {user.name || 'Pengguna'}
            </h1>

            {/* Role Badge */}
            <div className="mt-2 px-3 py-1 bg-gray-100 rounded-full flex items-center gap-1.5">
              <ShieldWarning size={14} className="text-gray-500" />
              <span className="text-xs font-medium text-gray-600 capitalize">
                {user.role === 'superadmin' ? 'Super Admin' : user.role}
              </span>
            </div>

            {/* Email */}
            <p className="mt-3 text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

        {/* Profile Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-gray-900">Informasi Profil</h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 text-sm text-red-600 font-medium hover:text-red-700 transition-colors"
              >
                <Pencil size={16} />
                Edit
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({ name: user.name || '', phone: user.phone || '' });
                  }}
                  className="px-3 py-1.5 text-sm text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                  disabled={saving}
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-3 py-1.5 text-sm bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                >
                  {saving ? (
                    <Spinner size={14} className="animate-spin" />
                  ) : (
                    <Check size={14} weight="bold" />
                  )}
                  Simpan
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                Nama Lengkap
              </label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={!isEditing}
                  placeholder="Masukkan nama lengkap"
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors"
                />
              </div>
            </div>

            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                Nomor Telepon
              </label>
              <div className="relative">
                <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={!isEditing}
                  placeholder="08xxxxxxxxxx"
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors"
                />
              </div>
            </div>

            {/* Email Field (Read-only) */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Envelope size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
                <input
                  id="email"
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm bg-gray-50 cursor-not-allowed text-gray-500"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1.5">Email tidak dapat diubah</p>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full mt-4 py-3.5 bg-white border-2 border-red-200 text-red-600 font-semibold rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
        >
          <SignOut size={20} />
          Keluar
        </button>

        {/* App Info */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">Jakselnews v2.0.0</p>
          <p className="text-xs text-gray-400 mt-1">© 2024 Rectoverso Media</p>
        </div>
      </div>
    </main>
  );
}
