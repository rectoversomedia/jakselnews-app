'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Camera, MapPin, X, ChevronLeft, Send } from 'lucide-react';

const categories = [
  { id: 1, name: 'Banjir', icon: '🌊', color: 'bg-blue-500' },
  { id: 2, name: 'Kemacetan', icon: '🚗', color: 'bg-orange-500' },
  { id: 3, name: 'Kriminal', icon: '🚨', color: 'bg-red-500' },
  { id: 4, name: 'Begal', icon: '⚠️', color: 'bg-red-600' },
  { id: 5, name: 'Infrastruktur', icon: '🛠️', color: 'bg-gray-500' },
  { id: 6, name: 'Jalan Rusak', icon: '🕳️', color: 'bg-amber-500' },
  { id: 7, name: 'Listrik', icon: '💡', color: 'bg-yellow-500' },
  { id: 8, name: 'Air Bersih', icon: '🚰', color: 'bg-cyan-500' },
  { id: 9, name: 'Gas Bocor', icon: '🔥', color: 'bg-orange-400' },
  { id: 10, name: 'Internet', icon: '📶', color: 'bg-indigo-500' },
  { id: 11, name: 'Kesehatan', icon: '🏥', color: 'bg-green-500' },
  { id: 12, name: 'Ambulans', icon: '🚑', color: 'bg-red-400' },
  { id: 13, name: 'Kebersihan', icon: '🗑️', color: 'bg-emerald-500' },
  { id: 14, name: 'Sampah', icon: '🍂', color: 'bg-green-600' },
  { id: 15, name: 'Keamanan', icon: '🔒', color: 'bg-purple-500' },
  { id: 16, name: 'Kebisingan', icon: '🔊', color: 'bg-violet-500' },
  { id: 17, name: 'Parkir Liar', icon: '🅿️', color: 'bg-gray-600' },
  { id: 18, name: 'PKL Liar', icon: '🏪', color: 'bg-amber-600' },
  { id: 19, name: 'Pohon Tumbang', icon: '🌳', color: 'bg-green-500' },
  { id: 20, name: 'Banjir', icon: '🌧️', color: 'bg-blue-400' },
  { id: 21, name: 'Lahan Terbuka', icon: '🏞️', color: 'bg-teal-500' },
  { id: 22, name: 'Hewan Liar', icon: '🐕', color: 'bg-amber-700' },
  { id: 23, name: 'Fecebook', icon: '📘', color: 'bg-blue-300' },
  { id: 24, name: 'Lainnya', icon: '📝', color: 'bg-gray-400', isOther: true },
];

export default function LaporPage() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [customCategory, setCustomCategory] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<File[]>([]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newPhotos = Array.from(e.target.files);
      setPhotos(prev => [...prev, ...newPhotos].slice(0, 5)); // Max 5 photos
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submission
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 text-center max-w-sm w-full shadow-lg">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send size={32} className="text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Laporan Terkirim!</h2>
          <p className="text-gray-500 mb-6">Terima kasih atas laporan Anda. Tim kami akan meninjaunya segera.</p>
          <Link href="/" className="block w-full py-3 bg-primary text-white rounded-xl font-medium text-center">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  if (selectedCategory) {
    const category = categories.find(c => c.id === selectedCategory);
    const isOtherCategory = category?.isOther || (customCategory.length > 0);

    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        {/* Header */}
        <div className="bg-white px-4 py-4 border-b border-gray-100 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button onClick={() => setSelectedCategory(null)} className="p-2 hover:bg-gray-100 rounded-full">
              <ChevronLeft size={24} className="text-gray-600" />
            </button>
            <h1 className="text-lg font-bold text-gray-900">Buat Laporan</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-4 py-4 space-y-4">
          {/* Category */}
          <div className="bg-white rounded-xl p-4">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Kategori</label>
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-4 py-3">
              <span className="text-lg">{category?.icon}</span>
              <span className="font-medium text-gray-900">
                {isOtherCategory ? customCategory : category?.name}
              </span>
            </div>
            {category?.isOther && (
              <input
                type="text"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="Ketik kategori..."
                className="w-full mt-2 px-4 py-3 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            )}
          </div>

          {/* Location */}
          <div className="bg-white rounded-xl p-4">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Lokasi Kejadian</label>
            <div className="relative">
              <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Jl. Kemang Raya, Jakarta Selatan"
                className="w-full pl-11 pr-4 py-3 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl p-4">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Deskripsi Kejadian</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan kejadian yang ingin Anda laporkan..."
              rows={4}
              className="w-full px-4 py-3 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              required
            />
          </div>

          {/* Photos */}
          <div className="bg-white rounded-xl p-4">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Foto (Opsional, maks 5)</label>
            <div className="flex flex-wrap gap-2">
              {photos.map((photo, index) => (
                <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden">
                  <img src={URL.createObjectURL(photo)} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute top-1 right-1 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center"
                  >
                    <X size={14} className="text-white" />
                  </button>
                </div>
              ))}
              {photos.length < 5 && (
                <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                  <Camera size={24} className="text-gray-400" />
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Identity */}
          <div className="bg-white rounded-xl p-4">
            <label className="text-sm font-medium text-gray-700 mb-3 block">Identitas Pelapor</label>

            <label className="flex items-center gap-3 mb-4 cursor-pointer">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-5 h-5 text-primary rounded focus:ring-primary"
              />
              <span className="text-sm text-gray-700">Kirim sebagai anonim</span>
            </label>

            {!isAnonymous && (
              <div className="space-y-3">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama lengkap"
                  className="w-full px-4 py-3 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  required={!isAnonymous}
                />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Nomor WhatsApp (opsional)"
                  className="w-full px-4 py-3 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-shadow"
          >
            Kirim Laporan
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-100">
        <h1 className="text-xl font-bold text-gray-900 mb-1">Lapor Kejadian</h1>
        <p className="text-sm text-gray-500">Laporkan kejadian di Jakarta Selatan</p>
      </div>

      {/* Categories */}
      <div className="px-4 py-4">
        <h2 className="text-sm font-medium text-gray-700 mb-3">Pilih Kategori Laporan</h2>
        <div className="grid grid-cols-6 gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className="bg-white rounded-xl p-2 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`w-10 h-10 ${category.color} rounded-lg flex items-center justify-center text-xl mb-1`}>
                {category.icon}
              </div>
              <span className="text-[10px] font-medium text-gray-700 leading-tight">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="px-4">
        <div className="bg-blue-50 rounded-xl p-4">
          <p className="text-sm text-blue-700">
            <strong>Tips:</strong> Sertakan lokasi yang jelas dan foto pendukung untuk mempercepat proses penanganan.
          </p>
        </div>
      </div>
    </div>
  );
}
