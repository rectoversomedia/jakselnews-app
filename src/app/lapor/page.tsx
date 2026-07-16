'use client';

import { useState, useRef } from 'react';
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
  Camera,
  Upload,
  Trash,
} from '@phosphor-icons/react';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';

const kecamatanList = [
  'Cilandak', 'Jagakarsa', 'Kebayoran Baru', 'Kebayoran Lama',
  'Mampang Prapatan', 'Pancoran', 'Pasar Minggu', 'Pesanggrahan',
  'Setiabudi', 'Tebet'
];

const kelurahanMap: Record<string, string[]> = {
  'Cilandak': ['Cilandak Barat', 'Cilandak Timur', 'Lebak Bulus', 'Pondok Labu', 'Radang'],
  'Jagakarsa': ['Bogor', 'Ciganjur', 'Cipedak', 'Jatisari', 'Lenteng Agung', 'Srengseng Sawah', 'Tanjung Barat'],
  'Kebayoran Baru': ['Senayan', 'Gedonggi', 'Melawai', 'Pulo', 'Rawa Barat', 'Kramat Pela', 'Pinding'],
  'Kebayoran Lama': ['Cipete Utara', 'Duri Kelambl', 'Duri Kosambi', 'Grokgalong Utara', 'Grokgalong Selatan', 'Kalibata', 'Pondok Pinang'],
  'Mampang Prapatan': ['Bangka', 'Kuningan Barat', 'Mampang Prapatan', 'Pancoran', 'Tegal Parang'],
  'Pancoran': ['Bojong', 'Duren Tiga', 'Gillard', 'Kalibata', 'Pancoran', 'Rawa Jati', 'Susukan'],
  'Pasar Minggu': ['Cilandak Timur', 'Jatipadang', 'Kebbap', 'Pasar Minggu', 'Pejaten Timur', 'Pejaten Barat', 'Tanjung Barat'],
  'Pesanggrahan': ['Bintaro', 'Pesanggrahan', 'Petukangan Selatan', 'Petukangan Utara', 'Ulujami'],
  'Setiabudi': ['Gadobangkong', 'Karet', 'Karet Kuningan', 'Kuningan Timur', 'Menteng', 'Pasar Manggis', 'Setiabudi'],
  'Tebet': ['Bogor Dalam', 'Bukit Duri', 'Kebon Baru', 'Manggarai Selatan', 'Manggarai', 'Tebet Barat', 'Tebet Timur', 'Utan Kayu'],
};

// 8 main categories with "Lainnya" as #8
const mainCategories = [
  { slug: 'keamanan', name: 'Keamanan', icon: '🛡️', gradient: 'from-red-500 to-rose-500', bgGradient: 'bg-red-50 border-red-100' },
  { slug: 'lalu-lintas', name: 'Lalu Lintas', icon: '🚦', gradient: 'from-amber-500 to-orange-500', bgGradient: 'bg-amber-50 border-amber-100' },
  { slug: 'banjir', name: 'Banjir', icon: '🌊', gradient: 'from-blue-500 to-cyan-500', bgGradient: 'bg-blue-50 border-blue-100' },
  { slug: 'kebakaran', name: 'Kebakaran', icon: '🔥', gradient: 'from-orange-500 to-red-500', bgGradient: 'bg-orange-50 border-orange-100' },
  { slug: 'penerangan', name: 'Penerangan', icon: '💡', gradient: 'from-yellow-400 to-amber-400', bgGradient: 'bg-yellow-50 border-yellow-100' },
  { slug: 'lingkungan', name: 'Lingkungan', icon: '🌿', gradient: 'from-emerald-500 to-teal-500', bgGradient: 'bg-emerald-50 border-emerald-100' },
  { slug: 'kemacetan', name: 'Kemacetan', icon: '🚗', gradient: 'from-gray-500 to-gray-600', bgGradient: 'bg-gray-50 border-gray-100' },
  { slug: 'lainnya', name: 'Lainnya', icon: '📌', gradient: 'from-gray-400 to-gray-500', bgGradient: 'bg-gray-50 border-gray-100' },
];

export default function LaporPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    type: '',
    customCategory: '',
    description: '',
    kecamatan: '',
    kelurahan: '',
    reporter_name: '',
    reporter_phone: '',
    reporter_email: '',
    is_anonymous: false as boolean,
  });

  const [mediaFiles, setMediaFiles] = useState<{ file: File; preview: string; type: 'image' | 'video' }[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showKecamatanDropdown, setShowKecamatanDropdown] = useState(false);
  const [showKelurahanDropdown, setShowKelurahanDropdown] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const files = Array.from(e.target.files || []);
    const maxFiles = 3;
    const currentCount = mediaFiles.length;

    if (currentCount + files.length > maxFiles) {
      alert(`Maksimal ${maxFiles} file`);
      return;
    }

    const newFiles = files.slice(0, maxFiles - currentCount).map(file => ({
      file,
      preview: URL.createObjectURL(file),
      type
    }));

    setMediaFiles(prev => [...prev, ...newFiles]);
  };

  const removeMedia = (index: number) => {
    setMediaFiles(prev => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.type) {
      newErrors.type = 'Pilih kategori laporan';
    }
    if (formData.type === 'lainnya' && !formData.customCategory.trim()) {
      newErrors.customCategory = 'Masukkan kategori lainnya';
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

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setSubmitted(true);
    setSubmitting(false);
  };

  const selectedCategory = mainCategories.find(c => c.slug === formData.type);

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
                    customCategory: '',
                    description: '',
                    kecamatan: '',
                    reporter_name: '',
                    reporter_phone: '',
                    reporter_email: '',
                    is_anonymous: false,
                  } as any);
                  setMediaFiles([]);
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
          {/* Category Selection - 8 Categories Grid */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Kategori Laporan *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {mainCategories.map((cat) => {
                const isSelected = formData.type === cat.slug;
                return (
                  <button
                    key={cat.slug}
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, type: cat.slug });
                      setErrors({ ...errors, type: '' });
                    }}
                    className={`p-4 rounded-xl transition-all text-center ${
                      isSelected
                        ? 'bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/30'
                        : 'bg-white border-2 border-gray-200 hover:border-red-300'
                    }`}
                  >
                    <span className="text-2xl block mb-2">{cat.icon}</span>
                    <span className="text-xs font-semibold">{cat.name}</span>
                  </button>
                );
              })}
            </div>
            {errors.type && <p className="text-red-500 text-sm mt-2">{errors.type}</p>}
          </div>

          {/* Custom Category Input (when "Lainnya" is selected) */}
          {formData.type === 'lainnya' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Kategori Lainnya *
              </label>
              <input
                type="text"
                value={formData.customCategory}
                onChange={(e) => {
                  setFormData({ ...formData, customCategory: e.target.value });
                  setErrors({ ...errors, customCategory: '' });
                }}
                placeholder="Ketik kategori laporan..."
                className={`w-full px-4 py-3 border-2 rounded-xl text-sm focus:outline-none transition-all ${
                  errors.customCategory ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white focus:border-red-300'
                }`}
              />
              {errors.customCategory && <p className="text-red-500 text-sm mt-1">{errors.customCategory}</p>}
            </div>
          )}

          {/* Selected Category Display */}
          {selectedCategory && formData.type !== 'lainnya' && (
            <div className="bg-gradient-to-r from-red-400 to-rose-500 rounded-xl p-5 shadow-lg shadow-red-400/30 text-center">
              <p className="font-bold text-white text-base">Kategori: {selectedCategory.name}</p>
              <p className="text-sm text-white/90 mt-1">Laporkan kejadian terkait {selectedCategory.name.toLowerCase()}</p>
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

          {/* Media Upload - Optional */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Upload Foto/Video <span className="text-gray-400 font-normal">(opsional)</span>
            </label>

            {/* Media Previews */}
            {mediaFiles.length > 0 && (
              <div className="flex gap-2 mb-3 flex-wrap">
                {mediaFiles.map((media, index) => (
                  <div key={index} className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100">
                    {media.type === 'image' ? (
                      <img src={media.preview} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <video src={media.preview} className="w-full h-full object-cover" />
                    )}
                    <button
                      type="button"
                      onClick={() => removeMedia(index)}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Buttons */}
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleFileSelect(e, 'image')}
                className="hidden"
              />
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                multiple
                onChange={(e) => handleFileSelect(e, 'video')}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 py-3 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center gap-2 text-gray-500 hover:border-red-400 hover:text-red-500 hover:bg-red-50 transition-all"
              >
                <Camera size={20} />
                <span className="text-sm font-medium">Tambah Foto</span>
              </button>
              <button
                type="button"
                onClick={() => videoInputRef.current?.click()}
                className="flex-1 py-3 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center gap-2 text-gray-500 hover:border-red-400 hover:text-red-500 hover:bg-red-50 transition-all"
              >
                <ImageIcon size={20} />
                <span className="text-sm font-medium">Tambah Video</span>
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">Maksimal 3 file. Format: JPG, PNG, MP4</p>
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

          {/* Kelurahan Dropdown */}
          {formData.kecamatan && (
            <div className="relative -mt-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Kelurahan
              </label>
              <button
                type="button"
                onClick={() => setShowKelurahanDropdown(!showKelurahanDropdown)}
                className="w-full flex items-center justify-between px-4 py-3 border-2 rounded-xl text-sm transition-all border-gray-200 bg-white hover:border-gray-300"
              >
                <span className={formData.kelurahan ? 'text-gray-900' : 'text-gray-400'}>
                  {formData.kelurahan || 'Pilih Kelurahan'}
                </span>
                <CaretDown size={18} className={`text-gray-400 transition-transform ${showKelurahanDropdown ? 'rotate-180' : ''}`} />
              </button>

              {showKelurahanDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowKelurahanDropdown(false)} />
                  <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                    {(kelurahanMap[formData.kecamatan] || []).map((kel) => (
                      <button
                        key={kel}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, kelurahan: kel });
                          setShowKelurahanDropdown(false);
                        }}
                        className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                          formData.kelurahan === kel ? 'bg-red-50 text-red-600' : 'text-gray-700'
                        }`}
                      >
                        <MapPin size={16} className={formData.kelurahan === kel ? 'text-red-500' : 'text-gray-400'} />
                        {kel}
                        {formData.kelurahan === kel && <Check size={16} className="ml-auto text-red-500" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

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
