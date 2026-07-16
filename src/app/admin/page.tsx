'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  MagnifyingGlass,
  Clock,
  MapPin,
  User,
  X,
  Warning,
  Spinner,
  ChatCircle,
  Envelope,
  ChartBar,
  Timer,
  ArrowsClockwise,
  CheckCircle,
  Check,
  SignOut,
  ShieldWarning,
} from '@phosphor-icons/react';
import Header from '@/components/layout/Header';

// Types
interface Report {
  id: string;
  type: string;
  description: string;
  location_name: string | null;
  reporter_name: string | null;
  reporter_phone: string | null;
  reporter_email: string | null;
  status: 'pending' | 'verified' | 'processing' | 'resolved' | 'rejected';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  created_at: string;
}

interface ApiError {
  success: false;
  error: string;
}

interface ApiResponse<T> {
  success: true;
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  role: 'user' | 'admin' | 'superadmin';
}

const statusConfig: Record<string, { label: string; color: string; bg: string; gradient: string }> = {
  pending: { label: 'Baru', color: 'text-amber-600', bg: 'bg-amber-100', gradient: 'from-amber-500 to-yellow-400' },
  verified: { label: 'Terverifikasi', color: 'text-blue-600', bg: 'bg-blue-100', gradient: 'from-blue-500 to-cyan-400' },
  processing: { label: 'Diproses', color: 'text-violet-600', bg: 'bg-violet-100', gradient: 'from-violet-500 to-purple-400' },
  resolved: { label: 'Selesai', color: 'text-emerald-600', bg: 'bg-emerald-100', gradient: 'from-emerald-500 to-teal-400' },
  rejected: { label: 'Ditolak', color: 'text-red-600', bg: 'bg-red-100', gradient: 'from-red-500 to-rose-400' },
};

const categoryIcons: Record<string, string> = {
  'keamanan': '🛡️',
  'lalu-lintas': '🚦',
  'banjir': '🌊',
  'kebakaran': '🔥',
  'penerangan': '💡',
  'lingkungan': '🌿',
  'kemacetan': '🚗',
  'jalan-rusak': '🕳️',
  'kriminal': '🚨',
  'sampah': '🗑️',
  'fenomena': '👁️',
  'lainnya': '📌',
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [filter, setFilter] = useState({ status: '', category: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      router.push('/login?redirect=/admin');
      return;
    }

    fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error('Unauthorized');
        }
        const data = await res.json();
        if (!data.success || !['admin', 'superadmin'].includes(data.data.role)) {
          throw new Error('Admin access required');
        }
        setUser(data.data);
        setAuthLoading(false);
      })
      .catch(() => {
        localStorage.removeItem('auth_token');
        router.push('/login?redirect=/admin');
      });
  }, [router]);

  // Fetch reports when authenticated
  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem('auth_token');
    const params = new URLSearchParams();
    if (filter.status) params.set('status', filter.status);
    if (filter.category) params.set('type', filter.category);
    if (searchQuery) params.set('search', searchQuery);
    params.set('limit', '50');

    fetch(`${API_BASE_URL}/admin/reports?${params}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setReports(data.data);
        } else {
          setError(data.error || 'Gagal memuat laporan');
        }
      })
      .catch(() => {
        setError('Tidak dapat terhubung ke server');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user, filter, searchQuery]);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    router.push('/');
  };

  const handleUpdateStatus = async (reportId: string, newStatus: string) => {
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    setUpdatingStatus(reportId);
    setUpdateError(null);

    try {
      const res = await fetch(`${API_BASE_URL}/admin/reports/${reportId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (data.success) {
        setReports((prev) =>
          prev.map((r) => (r.id === reportId ? { ...r, status: newStatus as Report['status'] } : r))
        );
        setSelectedReport(null);
      } else {
        setUpdateError(data.error || 'Gagal mengupdate status');
      }
    } catch {
      setUpdateError('Tidak dapat terhubung ke server');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const filteredReports = reports.filter((report) => {
    if (filter.status && report.status !== filter.status) return false;
    if (filter.category && report.type !== filter.category) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        report.description.toLowerCase().includes(query) ||
        report.location_name?.toLowerCase().includes(query) ||
        report.reporter_name?.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const getTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return `${diffMins} menit lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    return `${diffDays} hari lalu`;
  };

  const totalReports = reports.length;
  const pendingCount = reports.filter((r) => r.status === 'pending').length;
  const processingCount = reports.filter((r) => r.status === 'processing').length;
  const resolvedCount = reports.filter((r) => r.status === 'resolved').length;

  // Loading state
  if (authLoading) {
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
  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 pb-20 lg:pb-0 lg:pt-20">
        <Header title="Admin Dashboard" />
        <div className="pt-14 lg:pt-4 px-4 py-6 max-w-2xl mx-auto">
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

  return (
    <main className="min-h-screen bg-gray-50 pb-20 lg:pb-0 lg:pt-20">
      <Header title="Admin Dashboard" showBack />

      <div className="pt-14 lg:pt-4 lg:max-w-5xl lg:mx-auto px-4 py-6">
        {/* User Info & Logout */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-600 rounded-full flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">{user?.name || 'Admin'}</p>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <ShieldWarning size={12} className="text-red-500" />
                {user?.role === 'superadmin' ? 'Super Admin' : 'Admin'}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            aria-label="Keluar"
          >
            <SignOut size={18} />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-400 rounded-xl flex items-center justify-center shadow-sm">
                <ChartBar size={24} weight="fill" className="text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalReports}</p>
                <p className="text-xs text-gray-500">Total</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-amber-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-400 rounded-xl flex items-center justify-center shadow-sm">
                <Timer size={24} weight="fill" className="text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
                <p className="text-xs text-gray-500">Baru</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-violet-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-400 rounded-xl flex items-center justify-center shadow-sm">
                <ArrowsClockwise size={24} weight="fill" className="text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-violet-600">{processingCount}</p>
                <p className="text-xs text-gray-500">Diproses</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-emerald-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-400 rounded-xl flex items-center justify-center shadow-sm">
                <CheckCircle size={24} weight="fill" className="text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-600">{resolvedCount}</p>
                <p className="text-xs text-gray-500">Selesai</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <label htmlFor="search-reports" className="sr-only">Cari laporan</label>
              <MagnifyingGlass size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true" />
              <input
                id="search-reports"
                type="text"
                placeholder="Cari laporan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                aria-label="Cari laporan"
              />
            </div>
            <label htmlFor="filter-status" className="sr-only">Filter status</label>
            <select
              id="filter-status"
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
              className="px-4 py-2.5 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20"
              aria-label="Filter berdasarkan status"
            >
              <option value="">Semua Status</option>
              {Object.entries(statusConfig).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
            <label htmlFor="filter-category" className="sr-only">Filter kategori</label>
            <select
              id="filter-category"
              value={filter.category}
              onChange={(e) => setFilter({ ...filter, category: e.target.value })}
              className="px-4 py-2.5 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20"
              aria-label="Filter berdasarkan kategori"
            >
              <option value="">Semua Kategori</option>
              {Object.entries(categoryIcons).map(([key, icon]) => (
                <option key={key} value={key}>{icon} {key.replace('-', ' ')}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Reports List */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          {loading ? (
            <div className="p-8 flex flex-col items-center justify-center">
              <Spinner size={32} className="animate-spin text-red-500 mb-4" />
              <p className="text-gray-500">Memuat laporan...</p>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl" role="img" aria-label="Tidak ada">🔍</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Tidak Ada Laporan</h3>
              <p className="text-gray-500 text-sm">
                {searchQuery || filter.status || filter.category
                  ? 'Tidak ada laporan yang sesuai dengan filter'
                  : 'Belum ada laporan yang masuk'}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100" role="list">
              {filteredReports.map((report) => (
                <li
                  key={report.id}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setSelectedReport(report)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && setSelectedReport(report)}
                  aria-label={`Lihat detail laporan: ${report.description.substring(0, 50)}...`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-400 rounded-xl flex items-center justify-center text-2xl shadow-sm flex-shrink-0" aria-hidden="true">
                      {categoryIcons[report.type] || '📌'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusConfig[report.status]?.bg || 'bg-gray-100'} ${statusConfig[report.status]?.color || 'text-gray-600'}`}>
                          {statusConfig[report.status]?.label || report.status}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1" aria-label={`Dilaporkan ${getTimeAgo(report.created_at)}`}>
                          <Clock size={12} aria-hidden="true" />
                          {getTimeAgo(report.created_at)}
                        </span>
                        {report.priority === 'high' || report.priority === 'urgent' ? (
                          <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded-full text-xs font-bold flex items-center gap-1">
                            <Warning size={10} aria-hidden="true" />
                            {report.priority === 'urgent' ? 'Urgent' : 'High'}
                          </span>
                        ) : null}
                      </div>
                      <p className="text-sm text-gray-900 line-clamp-2">{report.description}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        {report.location_name && (
                          <span className="flex items-center gap-1">
                            <MapPin size={12} aria-hidden="true" />
                            <span>{report.location_name}</span>
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <User size={12} aria-hidden="true" />
                          <span>{report.reporter_name || 'Anonim'}</span>
                        </span>
                      </div>
                    </div>
                    <div className="text-gray-400 flex-shrink-0" aria-hidden="true">
                      <span>→</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Pagination hint */}
        {totalReports > 50 && (
          <p className="text-center text-sm text-gray-500 mt-4">
            Menampilkan 50 dari {totalReports} laporan. Gunakan filter untuk melihat lebih spesifik.
          </p>
        )}
      </div>

      {/* Report Detail Modal */}
      {selectedReport && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-end lg:items-center justify-center backdrop-blur-sm p-4"
          onClick={() => setSelectedReport(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            className="bg-white w-full lg:max-w-lg rounded-t-3xl lg:rounded-2xl max-h-[85vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Gradient Header */}
            <div className="bg-gradient-to-r from-red-500 to-rose-500 p-6 text-white relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl" aria-hidden="true" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl" aria-hidden="true">
                    {categoryIcons[selectedReport.type] || '📌'}
                  </div>
                  <div>
                    <span className={`px-2 py-0.5 bg-white/20 rounded-full text-xs font-medium`}>
                      {statusConfig[selectedReport.status]?.label || selectedReport.status}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                  aria-label="Tutup modal"
                >
                  <X size={20} className="text-white" />
                </button>
              </div>
              <h2 id="modal-title" className="font-bold text-lg mt-4">{categoryIcons[selectedReport.type] || '📌'} {selectedReport.type.replace('-', ' ').toUpperCase()}</h2>
            </div>

            <div className="p-6 space-y-4">
              {/* Location & Time */}
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                {selectedReport.location_name && (
                  <>
                    <span className="flex items-center gap-1">
                      <MapPin size={18} aria-hidden="true" />
                      <span>{selectedReport.location_name}</span>
                    </span>
                    <span className="mx-2" aria-hidden="true">•</span>
                  </>
                )}
                <span className="flex items-center gap-1">
                  <Clock size={18} aria-hidden="true" />
                  <span>{getTimeAgo(selectedReport.created_at)}</span>
                </span>
                <span className="mx-2" aria-hidden="true">•</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                  Priority: {selectedReport.priority}
                </span>
              </div>

              {/* Update Error */}
              {updateError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2" role="alert">
                  <Warning size={18} className="text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-700">{updateError}</p>
                </div>
              )}

              {/* Description */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 text-sm mb-2">Deskripsi</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{selectedReport.description}</p>
              </div>

              {/* Reporter Info */}
              <div className="border-t pt-4">
                <h3 className="font-bold text-sm text-gray-900 mb-3 flex items-center gap-2">
                  <User size={18} aria-hidden="true" />
                  Informasi Pelapor
                </h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <dt className="text-gray-500 w-16">Nama:</dt>
                    <dd className="font-medium text-gray-900">{selectedReport.reporter_name || 'Anonim'}</dd>
                  </div>
                  {selectedReport.reporter_phone && (
                    <div className="flex items-center gap-2">
                      <dt className="text-gray-500 w-16 flex items-center gap-1">
                        <ChatCircle size={14} aria-hidden="true" /> HP:
                      </dt>
                      <dd>
                        <a href={`tel:${selectedReport.reporter_phone}`} className="text-blue-600 hover:underline">
                          {selectedReport.reporter_phone}
                        </a>
                      </dd>
                    </div>
                  )}
                  {selectedReport.reporter_email && (
                    <div className="flex items-center gap-2">
                      <dt className="text-gray-500 w-16 flex items-center gap-1">
                        <Envelope size={14} aria-hidden="true" /> Email:
                      </dt>
                      <dd>
                        <span className="text-gray-900">{selectedReport.reporter_email}</span>
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Actions */}
              {selectedReport.status !== 'resolved' && selectedReport.status !== 'rejected' && (
                <div className="border-t pt-4">
                  <h3 className="font-bold text-sm text-gray-900 mb-3">Update Status</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedReport.status === 'pending' && (
                      <button
                        onClick={() => handleUpdateStatus(selectedReport.id, 'verified')}
                        disabled={updatingStatus === selectedReport.id}
                        className="py-2.5 px-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {updatingStatus === selectedReport.id ? (
                          <Spinner size={16} className="animate-spin" />
                        ) : (
                          <Check size={16} />
                        )}
                        Verifikasi
                      </button>
                    )}
                    {selectedReport.status !== 'processing' && (
                      <button
                        onClick={() => handleUpdateStatus(selectedReport.id, 'processing')}
                        disabled={updatingStatus === selectedReport.id}
                        className="py-2.5 px-3 bg-gradient-to-r from-violet-500 to-purple-400 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {updatingStatus === selectedReport.id ? (
                          <Spinner size={16} className="animate-spin" />
                        ) : (
                          <ArrowsClockwise size={16} />
                        )}
                        Proses
                      </button>
                    )}
                    {(selectedReport as any).status !== 'resolved' && (
                      <button
                        onClick={() => handleUpdateStatus(selectedReport.id, 'resolved')}
                        disabled={updatingStatus === selectedReport.id}
                        className="py-2.5 px-3 bg-gradient-to-r from-emerald-500 to-teal-400 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {updatingStatus === selectedReport.id ? (
                          <Spinner size={16} className="animate-spin" />
                        ) : (
                          <CheckCircle size={16} />
                        )}
                        Selesai
                      </button>
                    )}
                    <button
                      onClick={() => handleUpdateStatus(selectedReport.id, 'rejected')}
                      disabled={updatingStatus === selectedReport.id}
                      className="py-2.5 px-3 bg-gradient-to-r from-red-500 to-rose-400 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {updatingStatus === selectedReport.id ? (
                        <Spinner size={16} className="animate-spin" />
                      ) : (
                        <X size={16} />
                      )}
                      Tolak
                    </button>
                  </div>
                </div>
              )}

              {/* Already Resolved/Rejected Notice */}
              {(selectedReport.status === 'resolved' || selectedReport.status === 'rejected') && (
                <div className="bg-gray-100 rounded-xl p-4 text-center">
                  <p className="text-sm text-gray-600">
                    Laporan ini telah {selectedReport.status === 'resolved' ? 'diselesaikan' : 'ditolak'}.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
