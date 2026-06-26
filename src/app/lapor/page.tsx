'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Camera, X, ChevronLeft, Send } from 'lucide-react';

const categories = [
  { id: 1, name: 'Banjir', icon: '🌊' },
  { id: 2, name: 'Kemacetan', icon: '🚗' },
  { id: 3, name: 'Kriminal', icon: '🚨' },
  { id: 4, name: 'Infrastruktur', icon: '🏗️' },
  { id: 5, name: 'Jalan Rusak', icon: '🕳️' },
  { id: 6, name: 'Listrik', icon: '💡' },
  { id: 7, name: 'Air Bersih', icon: '🚰' },
  { id: 8, name: 'Kesehatan', icon: '🏥' },
  { id: 9, name: 'Kebersihan', icon: '🗑️' },
  { id: 10, name: 'Keamanan', icon: '🔒' },
  { id: 11, name: 'Pohon Tumbang', icon: '🌳' },
  { id: 12, name: 'Lainnya', icon: '📝' },
];

export default function LaporPage() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
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
      setPhotos(prev => [...prev, ...newPhotos].slice(0, 5));
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 text-center max-w-sm w-full shadow-lg">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-green-600" stroke="currentColor" strokeWidth={2}>
              <polyline points="20,6 9,17 4,12" />
            </svg>
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
              <span className="font-medium text-gray-900">{category?.name}</span>
            </div>
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

      {/* Categories - Horizontal scroll */}
      <div className="px-4 py-4">
        <h2 className="text-sm font-medium text-gray-700 mb-3">Pilih Kategori Laporan</h2>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className="flex flex-col items-center gap-2 shrink-0"
            >
              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                {category.icon}
              </div>
              <span className="text-xs font-medium text-gray-600 text-center">{category.name}</span>
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
