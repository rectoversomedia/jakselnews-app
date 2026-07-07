'use client';

import { useState, useEffect } from 'react';
import {
  MagnifyingGlass,
  Funnel,
  Clock,
  MapPin,
  User,
  Check,
  X,
  Warning,
  Spinner,
  ChatCircle,
  Envelope,
  ChartBar,
  Timer,
  ArrowsClockwise,
  CheckCircle,
} from '@phosphor-icons/react';
import Header from '@/components/layout/Header';

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

export default function AdminDashboard() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const [filter, setFilter] = useState({ status: '', category: '' });
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data
  const mockReports = [
    {
      id: '1',
      type: 'keamanan',
      description: 'Terjadi aksi pencurian motor di depan mall Blok M Plaza sekitar pukul 02.00 WIB. Pelaku mengenakan helm hitam dan berhasil kabur.',
      location_name: 'Kebayoran Baru, Jakarta Selatan',
      reporter_name: 'Budi Santoso',
      reporter_phone: '081234567890',
      status: 'pending',
      priority: 'high',
      created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
      id: '2',
      type: 'banjir',
      description: 'Genangan air setinggi 30cm di Jl. Kemang Raya arah Blok M akibat hujan deras. Kendaraan roda dua diimbau berhati-hati.',
      location_name: 'Kemang, Jakarta Selatan',
      reporter_name: 'Anonim',
      status: 'verified',
      priority: 'normal',
      created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
    {
      id: '3',
      type: 'kemacetan',
      description: 'Kemacetan parah di Jl. MT. Haryono arah Pancoran. Volume kendaraan sangat tinggi setelah lampu merah mati.',
      location_name: 'Pancoran, Jakarta Selatan',
      reporter_name: 'Ahmad Hidayat',
      reporter_phone: '087654321098',
      status: 'processing',
      priority: 'normal',
      created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    },
    {
      id: '4',
      type: 'penerangan',
      description: '10 tiang lampu jalan mati di sepanjang Jl. Ampera Raya. Area menjadi gelap dan sangat berbahaya di malam hari.',
      location_name: 'Cilandak, Jakarta Selatan',
      reporter_name: 'Siti Nurhaliza',
      reporter_email: 'siti@email.com',
      status: 'resolved',
      priority: 'low',
      created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      setReports(mockReports);
      setLoading(false);
    }, 500);
  }, []);

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
    if (diffMins < 60) return `${diffMins} menit lalu`;
    if (diffHours < 24) return `${diffHours} jam lalu`;
    return `${diffDays} hari lalu`;
  };

  const handleUpdateStatus = (reportId: string, newStatus: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, status: newStatus } : r))
    );
    setSelectedReport(null);
  };

  const totalReports = reports.length;
  const pendingCount = reports.filter((r) => r.status === 'pending').length;
  const processingCount = reports.filter((r) => r.status === 'processing').length;
  const resolvedCount = reports.filter((r) => r.status === 'resolved').length;

  return (
    <main className="min-h-screen bg-gray-50 pb-20 lg:pb-0 lg:pt-20">
      <Header title="Admin Dashboard" />

      <div className="pt-14 lg:pt-4 lg:max-w-5xl lg:mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-gray-500 to-gray-400 rounded-xl flex items-center justify-center shadow-lg">
                <ChartBar size={24} weight="fill" className="text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalReports}</p>
                <p className="text-xs text-gray-500">Total</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-md border border-amber-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-400 rounded-xl flex items-center justify-center shadow-lg">
                <Timer size={24} weight="fill" className="text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
                <p className="text-xs text-gray-500">Baru</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-md border border-violet-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-400 rounded-xl flex items-center justify-center shadow-lg">
                <ArrowsClockwise size={24} weight="fill" className="text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-violet-600">{processingCount}</p>
                <p className="text-xs text-gray-500">Diproses</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-md border border-emerald-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-400 rounded-xl flex items-center justify-center shadow-lg">
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
        <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlass size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari laporan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
              />
            </div>
            <select
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
              className="px-4 py-2.5 bg-gray-100 rounded-xl text-sm focus:outline-none"
            >
              <option value="">Semua Status</option>
              {Object.entries(statusConfig).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
            <select
              value={filter.category}
              onChange={(e) => setFilter({ ...filter, category: e.target.value })}
              className="px-4 py-2.5 bg-gray-100 rounded-xl text-sm focus:outline-none"
            >
              <option value="">Semua Kategori</option>
              {Object.entries(categoryIcons).map(([key, icon]) => (
                <option key={key} value={key}>{icon} {key.replace('-', ' ')}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Reports List */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
          {loading ? (
            <div className="p-8 flex items-center justify-center">
              <Spinner size={32} className="animate-spin text-red-500" />
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔍</span>
              </div>
              <p className="text-gray-500">Tidak ada laporan ditemukan</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredReports.map((report) => (
                <div
                  key={report.id}
                  className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => setSelectedReport(report)}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-rose-400 rounded-xl flex items-center justify-center text-2xl shadow-lg">
                      {categoryIcons[report.type] || '📌'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusConfig[report.status].bg} ${statusConfig[report.status].color}`}>
                          {statusConfig[report.status].label}
                        </span>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock size={12} />
                          {getTimeAgo(report.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-900 line-clamp-2">{report.description}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin size={12} />
                          {report.location_name || '-'}
                        </span>
                        <span className="flex items-center gap-1">
                          <User size={12} />
                          {report.reporter_name || 'Anonim'}
                        </span>
                      </div>
                    </div>
                    <div className="text-gray-400">
                      <span>→</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end lg:items-center justify-center backdrop-blur-sm" onClick={() => setSelectedReport(null)}>
          <div className="bg-white w-full lg:max-w-lg rounded-t-3xl lg:rounded-2xl max-h-[85vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Gradient Header */}
            <div className="bg-gradient-to-r from-red-500 to-rose-500 p-6 text-white relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-2xl" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl">
                    {categoryIcons[selectedReport.type] || '📌'}
                  </div>
                  <div>
                    <span className={`px-2 py-0.5 bg-white/20 rounded-full text-xs font-medium`}>
                      {statusConfig[selectedReport.status].label}
                    </span>
                  </div>
                </div>
                <button onClick={() => setSelectedReport(null)} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                  <X size={20} className="text-white" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Location & Time */}
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <MapPin size={18} />
                <span>{selectedReport.location_name}</span>
                <span className="mx-2">•</span>
                <Clock size={18} />
                <span>{getTimeAgo(selectedReport.created_at)}</span>
              </div>

              {/* Description */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-700 leading-relaxed">{selectedReport.description}</p>
              </div>

              {/* Reporter Info */}
              <div className="border-t pt-4">
                <h3 className="font-bold text-sm text-gray-900 mb-3 flex items-center gap-2">
                  <User size={18} />
                  Informasi Pelapor
                </h3>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-500">Nama:</span> <span className="font-medium">{selectedReport.reporter_name || 'Anonim'}</span></p>
                  {selectedReport.reporter_phone && (
                    <p className="flex items-center gap-2">
                      <ChatCircle size={16} className="text-gray-400" />
                      <span className="text-gray-500">HP:</span> <a href={`tel:${selectedReport.reporter_phone}`} className="text-blue-600 hover:underline">{selectedReport.reporter_phone}</a>
                    </p>
                  )}
                  {selectedReport.reporter_email && (
                    <p className="flex items-center gap-2">
                      <Envelope size={16} className="text-gray-400" />
                      <span className="text-gray-500">Email:</span> <span className="font-medium">{selectedReport.reporter_email}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="border-t pt-4">
                <h3 className="font-bold text-sm text-gray-900 mb-3">Update Status</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedReport.id, 'verified')}
                    className="py-2.5 px-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all"
                  >
                    ✓ Verifikasi
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedReport.id, 'processing')}
                    className="py-2.5 px-3 bg-gradient-to-r from-violet-500 to-purple-400 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all"
                  >
                    ⟳ Proses
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedReport.id, 'resolved')}
                    className="py-2.5 px-3 bg-gradient-to-r from-emerald-500 to-teal-400 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all"
                  >
                    ✓ Selesai
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedReport.id, 'rejected')}
                    className="py-2.5 px-3 bg-gradient-to-r from-red-500 to-rose-400 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all"
                  >
                    ✕ Tolak
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
