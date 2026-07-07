'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  PhMapPin,
  PhPhone,
  PhEnvelope,
  PhUser,
  PhX,
  PhCheck,
  PhSpinner,
  PhWarning,
} from '@phosphor-icons/react';
import { api, Category } from '@/lib/api';
import Header from '@/components/layout/Header';

const kecamatanList = [
  'Cilandak', 'Jagakarsa', 'Kebayoran Baru', 'Kebayoran Lama',
  'Mampang Prapatan', 'Pancoran', 'Pasar Minggu', 'Pesanggrahan',
  'Setiabudi', 'Tebet'
];

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

export default function LaporPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    type: '',
    description: '',
    kecamatan: '',
    reporter_name: '',
    reporter_phone: '',
    reporter_email: '',
    is_anonymous: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    async function fetchCategories() {
      try {
        const result = await api.getCategories();
        if (result.success && result.data) {
          setCategories(result.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.type) {
      newErrors.type = 'Pilih kategori laporan';
    }
    if (!formData.description || formData.description.length < 10) {
      newErrors.description = 'Deskripsi minimal 10 karakter';
    }
    if (formData.description.length > 2000) {
      newErrors.description = 'Deskripsi maksimal 2000 karakter';
    }
    if (!formData.kecamatan) {
      newErrors.kecamatan = 'Pilih kecamatan';
    }
    if (!formData.is_anonymous) {
      if (!formData.reporter_name) {
        newErrors.reporter_name = 'Nama harus diisi';
      }
      if (!formData.reporter_phone && !formData.reporter_email) {
        newErrors.contact = 'Nomor HP atau email harus diisi';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const result = await api.createReport({
        type: formData.type,
        description: formData.description,
        kecamatan: formData.kecamatan,
        reporter_name: formData.is_anonymous ? undefined : formData.reporter_name,
        reporter_phone: formData.is_anonymous ? undefined : formData.reporter_phone,
        reporter_email: formData.is_anonymous ? undefined : formData.reporter_email,
        is_anonymous: formData.is_anonymous,
      });

      if (result.success) {
        setSubmitted(true);
      } else {
        setErrors({ submit: result.error || 'Gagal mengirim laporan' });
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      setErrors({ submit: 'Terjadi kesalahan. Silakan coba lagi.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-gray-50 pb-20 lg:pb-0 lg:pt-20">
        <Header title="Lapor" />
        <div className="pt-20 px-4 flex items-center justify-center min-h-[70vh]">
          <div className="text-center max-w-sm">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <PhCheck size={40} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Laporan Terkirim!</h2>
            <p className="text-gray-600 mb-6">
              Terima kasih atas laporan Anda. Tim kami akan memverifikasi dan menindaklanjuti secepat mungkin.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    type: '',
                    description: '',
                    kecamatan: '',
                    reporter_name: '',
                    reporter_phone: '',
                    reporter_email: '',
                    is_anonymous: false,
                  });
                }}
                className="w-full py-3 bg-primary text-white font-semibold rounded-xl"
              >
                Kirim Laporan Lain
              </button>
              <button
                onClick={() => router.push('/')}
                className="w-full py-3 bg-gray-100 text-gray-700 font-medium rounded-xl"
              >
                Kembali ke Beranda
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-20 lg:pb-0 lg:pt-20">
      <Header title="Lapor Kejadian" />

      <div className="pt-14 lg:pt-4 px-4 py-6 max-w-2xl mx-auto">
        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6">
          <div className="flex gap-3">
            <PhWarning size={20} className="text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Laporkan Kejadian</h3>
              <p className="text-sm text-blue-700">
                Bantu kami menjaga keamanan dan kenyamanan warga Jaksel dengan melaporkan kejadian yang Anda alami atau saksikan.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Kategori Laporan *
            </label>
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, type: cat.slug || cat.id });
                      setErrors({ ...errors, type: '' });
                    }}
                    className={`p-3 rounded-xl border-2 transition-all text-left ${
                      formData.type === (cat.slug || cat.id)
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{categoryIcons[cat.slug || cat.id] || '📌'}</span>
                      <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
            {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Deskripsi Kejadian *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value });
                setErrors({ ...errors, description: '' });
              }}
              placeholder="Jelaskan kejadian yang Anda laporkan secara detail..."
              rows={5}
              className={`w-full p-4 border-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none ${
                errors.description ? 'border-red-300' : 'border-gray-200'
              }`}
            />
            <div className="flex justify-between mt-1">
              {errors.description ? (
                <p className="text-red-500 text-sm">{errors.description}</p>
              ) : <span />}
              <span className="text-xs text-gray-400">{formData.description.length}/2000</span>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Kecamatan *
            </label>
            <div className="relative">
              <PhMapPin size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={formData.kecamatan}
                onChange={(e) => {
                  setFormData({ ...formData, kecamatan: e.target.value });
                  setErrors({ ...errors, kecamatan: '' });
                }}
                className={`w-full pl-12 pr-10 py-3 border-2 rounded-xl text-sm focus:outline-none appearance-none ${
                  errors.kecamatan ? 'border-red-300' : 'border-gray-200'
                }`}
              >
                <option value="">Pilih Kecamatan</option>
                {kecamatanList.map((kec) => (
                  <option key={kec} value={kec}>{kec}</option>
                ))}
              </select>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">▼</span>
            </div>
            {errors.kecamatan && <p className="text-red-500 text-sm mt-1">{errors.kecamatan}</p>}
          </div>

          {/* Reporter Info */}
          <div className="bg-gray-50 rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Identitas Pelapor</h3>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_anonymous}
                  onChange={(e) => setFormData({ ...formData, is_anonymous: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-gray-600">Lapor anonim</span>
              </label>
            </div>

            {!formData.is_anonymous && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Nama</label>
                  <div className="relative">
                    <PhUser size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={formData.reporter_name}
                      onChange={(e) => {
                        setFormData({ ...formData, reporter_name: e.target.value });
                        setErrors({ ...errors, reporter_name: '', contact: '' });
                      }}
                      placeholder="Nama lengkap"
                      className={`w-full pl-10 pr-4 py-2.5 border-2 rounded-xl text-sm focus:outline-none ${
                        errors.reporter_name ? 'border-red-300' : 'border-gray-200'
                      }`}
                    />
                  </div>
                  {errors.reporter_name && <p className="text-red-500 text-sm mt-1">{errors.reporter_name}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">No. HP</label>
                    <div className="relative">
                      <PhPhone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        value={formData.reporter_phone}
                        onChange={(e) => setFormData({ ...formData, reporter_phone: e.target.value })}
                        placeholder="08xxxxxxxxxx"
                        className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Email</label>
                    <div className="relative">
                      <PhEnvelope size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        value={formData.reporter_email}
                        onChange={(e) => setFormData({ ...formData, reporter_email: e.target.value })}
                        placeholder="email@email.com"
                        className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
                {errors.contact && <p className="text-red-500 text-sm">{errors.contact}</p>}
              </div>
            )}
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
              <PhWarning size={18} className="text-red-600" />
              <p className="text-sm text-red-700">{errors.submit}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <PhSpinner size={20} className="animate-spin" />
                Mengirim...
              </>
            ) : (
              <>
                <PhCheck size={20} />
                Kirim Laporan
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
