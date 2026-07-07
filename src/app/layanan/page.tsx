'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  MagnifyingGlass,
  Phone,
  CaretRight,
  CaretLeft,
  Heart,
  Star,
  ListChecks,
} from '@phosphor-icons/react';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';

const popularServices = [
  { id: 1, name: 'Cek Bansos', slug: 'cek-bansos', desc: 'Cek penerima bansos', icon: '💰', gradient: 'from-emerald-500 to-teal-500' },
  { id: 2, name: 'KJP Plus', slug: 'kjp-plus', desc: 'Saldo KJP Plus', icon: '🎓', gradient: 'from-violet-500 to-purple-500' },
  { id: 3, name: 'Cek ETLE', slug: 'cek-etle', desc: 'Tilang elektronik', icon: '📸', gradient: 'from-blue-500 to-cyan-500' },
  { id: 4, name: 'Pajak', slug: 'pajak-kendaraan', desc: 'Bayar pajak', icon: '🚗', gradient: 'from-amber-500 to-orange-500' },
];

const allServices = [
  { id: 1, name: 'Cek Bansos Jakarta', slug: 'cek-bansos', desc: 'Cek penerima & status bantuan sosial', icon: '💰', gradient: 'from-emerald-500 to-teal-500', category: 'bansos' },
  { id: 2, name: 'KJP Plus', slug: 'kjp-plus', desc: 'Cek status dan saldo KJP Plus', icon: '🎓', gradient: 'from-violet-500 to-purple-500', category: 'pendidikan' },
  { id: 3, name: 'Cek ETLE', slug: 'cek-etle', desc: 'Cek tilang elektronik dan denda', icon: '📸', gradient: 'from-blue-500 to-cyan-500', category: 'transportasi' },
  { id: 4, name: 'Pajak Kendaraan', slug: 'pajak-kendaraan', desc: 'Cek & bayar pajak kendaraan', icon: '🚗', gradient: 'from-amber-500 to-orange-500', category: 'transportasi' },
  { id: 5, name: 'Info KRL', slug: 'info-krl', desc: 'Jadwal & rute KRL', icon: '🚆', gradient: 'from-blue-600 to-blue-400', category: 'transportasi' },
  { id: 6, name: 'TransJakarta', slug: 'transjakarta', desc: 'Rute & halte terdekat', icon: '🚌', gradient: 'from-red-500 to-rose-500', category: 'transportasi' },
  { id: 7, name: 'Cuaca Jaksel', slug: 'cuaca', desc: 'Info cuaca terkini Jaksel', icon: '🌤️', gradient: 'from-cyan-500 to-blue-400', category: 'info' },
  { id: 8, name: 'Nomor Darurat', slug: 'darurat', desc: 'Call center penting', icon: '📞', gradient: 'from-red-600 to-red-400', category: 'darurat' },
  { id: 9, name: 'Administrasi', slug: 'administrasi', desc: 'KTP, KK, akta lahir', icon: '📄', gradient: 'from-emerald-600 to-teal-500', category: 'administrasi' },
  { id: 10, name: 'PPDB Online', slug: 'ppdb', desc: 'Penerimaan peserta didik baru', icon: '📚', gradient: 'from-violet-600 to-purple-500', category: 'pendidikan' },
  { id: 11, name: 'RT/RW Digital', slug: 'rt-rw', desc: 'Layanan RT dan RW', icon: '🏠', gradient: 'from-amber-600 to-orange-500', category: 'administrasi' },
  { id: 12, name: 'Izin Usaha', slug: 'izin-usaha', desc: 'OSS & perizinan usaha', icon: '🏢', gradient: 'from-blue-700 to-blue-500', category: 'usaha' },
];

const categories = [
  { id: 'all', name: 'Semua', gradient: 'from-gray-500 to-gray-400' },
  { id: 'bansos', name: 'Bansos', gradient: 'from-emerald-500 to-teal-500' },
  { id: 'transportasi', name: 'Transportasi', gradient: 'from-blue-500 to-cyan-500' },
  { id: 'pendidikan', name: 'Pendidikan', gradient: 'from-violet-500 to-purple-500' },
  { id: 'administrasi', name: 'Admin', gradient: 'from-amber-500 to-orange-500' },
  { id: 'darurat', name: 'Darurat', gradient: 'from-red-500 to-rose-500' },
];

const emergencyNumbers = [
  { name: '112', label: 'Call Center', gradient: 'from-red-500 to-rose-500' },
  { name: '110', label: 'Polisi', gradient: 'from-blue-500 to-blue-400' },
  { name: '118/119', label: 'Ambulans', gradient: 'from-emerald-500 to-teal-500' },
  { name: '113', label: 'Pemadam', gradient: 'from-orange-500 to-amber-400' },
];

export default function LayananPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredServices = allServices.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-gray-50 pb-24 lg:pb-0 lg:pt-20">
      <Header title="Layanan" />
      <BottomNav />

      {/* Search Bar */}
      <div className="sticky top-14 lg:top-16 z-30 bg-white border-b px-4 py-3">
        <div className="relative">
          <MagnifyingGlass size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari layanan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                selectedCategory === cat.id
                  ? `bg-gradient-to-r ${cat.gradient} text-white shadow-lg shadow-red-500/20`
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4">
        {/* Popular Services */}
        {!searchQuery && selectedCategory === 'all' && (
          <section className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center shadow-lg">
                <Star size={18} weight="fill" className="text-white" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Layanan Populer</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {popularServices.map((service) => (
                <Link
                  key={service.id}
                  href={`/layanan/${service.slug}`}
                  className="group bg-white rounded-2xl p-4 text-center shadow-md border border-gray-100 hover:shadow-xl hover:border-emerald-100 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${service.gradient} rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    {service.icon}
                  </div>
                  <p className="font-bold text-gray-900 text-sm">{service.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{service.desc}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* All Services */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center shadow-lg">
              <ListChecks size={18} weight="fill" className="text-white" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">
              {searchQuery || selectedCategory !== 'all' ? 'Hasil Pencarian' : 'Semua Layanan'}
              <span className="font-normal text-gray-500 ml-2">({filteredServices.length})</span>
            </h2>
          </div>

          {filteredServices.length > 0 ? (
            <div className="space-y-3">
              {filteredServices.map((service) => (
                <Link
                  key={service.id}
                  href={`/layanan/${service.slug}`}
                  className="group bg-white rounded-2xl p-4 shadow-md border border-gray-100 hover:shadow-xl hover:border-red-100 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-4"
                >
                  <div className={`w-14 h-14 bg-gradient-to-br ${service.gradient} rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-lg group-hover:scale-110 transition-all duration-300`}>
                    {service.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 group-hover:text-red-500 transition-colors">{service.name}</h3>
                    <p className="text-sm text-gray-500 truncate">{service.desc}</p>
                  </div>
                  <CaretRight size={20} className="text-gray-400 group-hover:text-red-500 group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MagnifyingGlass size={40} className="text-gray-400" />
              </div>
              <p className="text-gray-500 mb-4">Layanan tidak ditemukan</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-rose-500 text-white font-semibold rounded-xl shadow-lg shadow-red-500/30"
              >
                Reset Pencarian
              </button>
            </div>
          )}
        </section>

        {/* Emergency Numbers */}
        {!searchQuery && selectedCategory === 'all' && (
          <section className="mt-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-rose-500 rounded-lg flex items-center justify-center shadow-lg animate-pulse">
                <Phone size={18} weight="fill" className="text-white" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">Nomor Darurat</h2>
            </div>

            <div className="bg-gradient-to-br from-red-500 to-rose-500 rounded-3xl p-5 shadow-xl shadow-red-500/30 relative overflow-hidden">
              {/* Decorative */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-white/10 rounded-full blur-xl" />

              <div className="relative grid grid-cols-2 md:grid-cols-4 gap-3">
                {emergencyNumbers.map((num) => (
                  <a
                    key={num.name}
                    href={`tel:${num.name.replace('/', '-')}`}
                    className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 text-center hover:bg-white/30 transition-all duration-300 group"
                  >
                    <div className={`w-12 h-12 bg-gradient-to-br ${num.gradient} rounded-xl flex items-center justify-center mx-auto mb-2 shadow-lg group-hover:scale-110 transition-transform`}>
                      <Phone size={24} weight="fill" className="text-white" />
                    </div>
                    <p className="font-bold text-white text-lg">{num.name}</p>
                    <p className="text-white/80 text-xs">{num.label}</p>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
