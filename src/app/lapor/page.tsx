'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  MapPin,
  Phone,
  Envelope,
  User,
  X,
  Check,
  Spinner,
  Warning,
  CaretDown,
  Image as ImageIcon,
} from '@phosphor-icons/react';
import { api, Category } from '@/lib/api';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';

const kecamatanList = [
  'Cilandak', 'Jagakarsa', 'Kebayoran Baru', 'Kebayoran Lama',
  'Mampang Prapatan', 'Pancoran', 'Pasar Minggu', 'Pesanggrahan',
  'Setiabudi', 'Tebet'
];

const categoryConfig: Record<string, { icon: string; gradient: string; bgGradient: string }> = {
  'keamanan': { icon: '🛡️', gradient: 'from-red-500 to-rose-500', bgGradient: 'bg-red-50 border-red-100' },
  'lalu-lintas': { icon: '🚦', gradient: 'from-amber-500 to-orange-500', bgGradient: 'bg-amber-50 border-amber-100' },
  'banjir': { icon: '🌊', gradient: 'from-blue-500 to-cyan-500', bgGradient: 'bg-blue-50 border-blue-100' },
  'kebakaran': { icon: '🔥', gradient: 'from-orange-500 to-red-500', bgGradient: 'bg-orange-50 border-orange-100' },
  'penerangan': { icon: '💡', gradient: 'from-yellow-400 to-amber-400', bgGradient: 'bg-yellow-50 border-yellow-100' },
  'lingkungan': { icon: '🌿', gradient: 'from-emerald-500 to-teal-500', bgGradient: 'bg-emerald-50 border-emerald-100' },
  'kemacetan': { icon: '🚗', gradient: 'from-gray-500 to-gray-600', bgGradient: 'bg-gray-50 border-gray-100' },
  'jalan-rusak': { icon: '🕳️', gradient: 'from-orange-600 to-amber-600', bgGradient: 'bg-orange-50 border-orange-100' },
  'kriminal': { icon: '🚨', gradient: 'from-red-600 to-red-700', bgGradient: 'bg-red-50 border-red-100' },
  'sampah': { icon: '🗑️', gradient: 'from-lime-500 to-green-500', bgGradient: 'bg-lime-50 border-lime-100' },
  'fenomena': { icon: '👁️', gradient: 'from-purple-500 to-violet-500', bgGradient: 'bg-purple-50 border-purple-100' },
  'lainnya': { icon: '📌', gradient: 'from-gray-400 to-gray-500', bgGradient: 'bg-gray-50 border-gray-100' },
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
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showKecamatanDropdown, setShowKecamatanDropdown] = useState(false);

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

  const selectedCategory = categories.find(c => c.slug === formData.type);
  const selectedConfig = categoryConfig[formData.type] || categoryConfig['lainnya'];

  if (submitted) {
    return (
      <main className="min-h-screen bg-gray-50 pb-20 lg:pb-0 lg:pt-20">
        <Header title="Lapor" />
        <div className="pt-20 px-4 flex items-center justify-center min-h-[70vh]">
          <div className="text-center max-w-sm">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl shadow-emerald-500/30">
              <Check size={40} className="text-white" />
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
                className="w-full py-3 bg-gradient-to-r from-red-500 to-rose-500 text-white font-semibold rounded-xl shadow-lg shadow-red-500/30"
              >
                Kirim Laporan Lain
              </button>
              <button
                onClick={() => router.push('/')}
                className="w-full py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors"
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
      <BottomNav />

      <div className="pt-14 lg:pt-4 px-4 py-6 max-w-2xl mx-auto">
        {/* Info Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 rounded-2xl p-4 mb-6">
          <div className="flex gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
              <Warning size={20} className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Laporkan Kejadian</h3>
              <p className="text-sm text-blue-700 leading-relaxed">
                Bantu kami menjaga keamanan dan kenyamanan warga Jaksel dengan melaporkan kejadian yang Anda alami atau saksikan.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Selection - Grid Style */}
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
                {categories.map((cat) => {
                  const config = categoryConfig[cat.slug] || categoryConfig['lainnya'];
                  const isSelected = formData.type === cat.slug;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, type: cat.slug });
                        setErrors({ ...errors, type: '' });
                      }}
                      className={`p-3 rounded-xl border-2 transition-all text-left ${
                        isSelected
                          ? `border-gradient-to-r ${config.gradient} bg-gradient-to-r ${config.bgGradient}`
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{config.icon}</span>
                        <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
            {errors.type && <p className="text-red-500 text-sm mt-2">{errors.type}</p>}
          </div>

          {/* Selected Category Display */}
          {selectedCategory && (
            <div className={`bg-gradient-to-r ${selectedConfig.gradient} bg-opacity-10 rounded-xl p-4 border border-gradient-to-r ${selectedConfig.gradient} border-opacity-20`}>
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 bg-gradient-to-br ${selectedConfig.gradient} rounded-xl flex items-center justify-center text-2xl shadow-lg`}>
                  {selectedConfig.icon}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Kategori: {selectedCategory.name}</p>
                  <p className="text-sm text-gray-500">Laporkan kejadian terkait {selectedCategory.name.toLowerCase()}</p>
                </div>
              </div>
            </div>
          )}

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
              placeholder="Jelaskan kejadian yang Anda laporkan secara detail. Sertakan waktu, lokasi, dan pihak yang terlibat jika memungkinkan..."
              rows={5}
              className={`w-full p-4 border-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 resize-none transition-all ${
                errors.description ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white'
              }`}
            />
            <div className="flex justify-between mt-1">
              {errors.description ? (
                <p className="text-red-500 text-sm">{errors.description}</p>
              ) : <span />}
              <span className={`text-xs ${formData.description.length > 2000 ? 'text-red-500' : 'text-gray-400'}`}>
                {formData.description.length}/2000
              </span>
            </div>
          </div>

          {/* Location - Dropdown */}
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Kecamatan *
            </label>
            <button
              type="button"
              onClick={() => setShowKecamatanDropdown(!showKecamatanDropdown)}
              className={`w-full flex items-center justify-between px-4 py-3 border-2 rounded-xl text-sm transition-all ${
                errors.kecamatan ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <span className={formData.kecamatan ? 'text-gray-900' : 'text-gray-400'}>
                {formData.kecamatan || 'Pilih Kecamatan'}
              </span>
              <CaretDown size={18} className={`text-gray-400 transition-transform ${showKecamatanDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showKecamatanDropdown && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowKecamatanDropdown(false)} />
                <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                  {kecamatanList.map((kec) => (
                    <button
                      key={kec}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, kecamatan: kec });
                        setErrors({ ...errors, kecamatan: '' });
                        setShowKecamatanDropdown(false);
                      }}
                      className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                        formData.kecamatan === kec ? 'bg-red-50 text-red-600' : 'text-gray-700'
                      }`}
                    >
                      <MapPin size={16} className={formData.kecamatan === kec ? 'text-red-500' : 'text-gray-400'} />
                      {kec}
                      {formData.kecamatan === kec && <Check size={16} className="ml-auto text-red-500" />}
                    </button>
                  ))}
                </div>
              </>
            )}
            {errors.kecamatan && <p className="text-red-500 text-sm mt-1">{errors.kecamatan}</p>}
          </div>

          {/* Reporter Info Card */}
          <div className="bg-gray-50 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <User size={18} className="text-gray-500" />
                Identitas Pelapor
              </h3>
              <label className="flex items-center gap-3 cursor-pointer">
                <span className="text-sm text-gray-600">Lapor anonim</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={formData.is_anonymous}
                    onChange={(e) => setFormData({ ...formData, is_anonymous: e.target.checked })}
                    className="sr-only"
                  />
                  <div className={`w-12 h-7 rounded-full transition-colors ${formData.is_anonymous ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform mt-1 ${formData.is_anonymous ? 'translate-x-6' : 'translate-x-1'}`} />
                  </div>
                </div>
              </label>
            </div>

            {formData.is_anonymous && (
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                <p className="text-sm text-amber-700">
                  ℹ️ Laporan Anda akan dikirim tanpa identitas. Anda tidak akan bisa melacak status laporan.
                </p>
              </div>
            )}

            {!formData.is_anonymous && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5">Nama Lengkap</label>
                  <div className="relative">
                    <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={formData.reporter_name}
                      onChange={(e) => {
                        setFormData({ ...formData, reporter_name: e.target.value });
                        setErrors({ ...errors, reporter_name: '', contact: '' });
                      }}
                      placeholder="Masukkan nama lengkap"
                      className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl text-sm focus:outline-none transition-all ${
                        errors.reporter_name ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white focus:border-red-300'
                      }`}
                    />
                  </div>
                  {errors.reporter_name && <p className="text-red-500 text-sm mt-1">{errors.reporter_name}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1.5">No. HP</label>
                    <div className="relative">
                      <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        value={formData.reporter_phone}
                        onChange={(e) => setFormData({ ...formData, reporter_phone: e.target.value })}
                        placeholder="08xxxxxxxxxx"
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-300 transition-all bg-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1.5">Email</label>
                    <div className="relative">
                      <Envelope size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        value={formData.reporter_email}
                        onChange={(e) => setFormData({ ...formData, reporter_email: e.target.value })}
                        placeholder="email@email.com"
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-300 transition-all bg-white"
                      />
                    </div>
                  </div>
                </div>
                {errors.contact && <p className="text-red-500 text-sm col-span-2">{errors.contact}</p>}
              </div>
            )}
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
              <Warning size={20} className="text-red-600 shrink-0" />
              <p className="text-sm text-red-700">{errors.submit}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-gradient-to-r from-red-500 to-rose-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-red-500/30 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
          >
            {submitting ? (
              <>
                <Spinner size={20} className="animate-spin" />
                Mengirim...
              </>
            ) : (
              <>
                <Check size={20} />
                Kirim Laporan
              </>
            )}
          </button>

          {/* Disclaimer */}
          <p className="text-xs text-gray-400 text-center">
            Dengan mengirim laporan, Anda menyetujui bahwa informasi yang diberikan adalah benar dan dapat dipertanggungjawabkan.
          </p>
        </form>
      </div>
    </main>
  );
}
