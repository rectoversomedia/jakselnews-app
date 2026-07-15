'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  MagnifyingGlass,
  Phone,
  CaretRight,
  Heart,
  Star,
  ListChecks,
  X,
  Clock,
  MapPin,
} from '@phosphor-icons/react';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';

interface Service {
  id: number;
  name: string;
  slug: string;
  desc: string;
  icon: string;
  gradient: string;
  category: string;
  featured?: boolean;
}

interface ServiceDetail {
  id: number;
  slug: string;
  title: string;
  description: string;
  steps: string[];
  gradient: string;
  icon: string;
  url?: string;
}

const allServices: Service[] = [
  { id: 1, name: 'Cek Bansos Jakarta', slug: 'cek-bansos', desc: 'Cek penerima & status bantuan sosial', icon: '💰', gradient: 'from-emerald-500 to-teal-500', category: 'bansos', featured: true },
  { id: 2, name: 'KJP Plus', slug: 'kjp-plus', desc: 'Cek status dan saldo KJP Plus', icon: '🎓', gradient: 'from-violet-500 to-purple-500', category: 'pendidikan', featured: true },
  { id: 3, name: 'Cek ETLE', slug: 'cek-etle', desc: 'Cek tilang elektronik dan denda', icon: '📸', gradient: 'from-blue-500 to-cyan-500', category: 'transportasi', featured: true },
  { id: 4, name: 'Pajak Kendaraan', slug: 'pajak-kendaraan', desc: 'Cek & bayar pajak kendaraan', icon: '🚗', gradient: 'from-amber-500 to-orange-500', category: 'transportasi', featured: true },
  { id: 5, name: 'Info KRL', slug: 'info-krl', desc: 'Jadwal & rute KRL', icon: '🚆', gradient: 'from-blue-600 to-blue-400', category: 'transportasi' },
  { id: 6, name: 'TransJakarta', slug: 'transjakarta', desc: 'Rute & halte terdekat', icon: '🚌', gradient: 'from-red-500 to-rose-500', category: 'transportasi' },
  { id: 7, name: 'Cuaca Jaksel', slug: 'cuaca', desc: 'Info cuaca terkini Jaksel', icon: '🌤️', gradient: 'from-cyan-500 to-blue-400', category: 'info' },
  { id: 8, name: 'Nomor Darurat', slug: 'darurat', desc: 'Call center penting', icon: '📞', gradient: 'from-red-600 to-red-400', category: 'darurat' },
  { id: 9, name: 'Administrasi', slug: 'administrasi', desc: 'KTP, KK, akta lahir', icon: '📄', gradient: 'from-emerald-600 to-teal-500', category: 'administrasi' },
  { id: 10, name: 'PPDB Online', slug: 'ppdb', desc: 'Penerimaan peserta didik baru', icon: '📚', gradient: 'from-violet-600 to-purple-500', category: 'pendidikan' },
  { id: 11, name: 'RT/RW Digital', slug: 'rt-rw', desc: 'Layanan RT dan RW', icon: '🏠', gradient: 'from-amber-600 to-orange-500', category: 'administrasi' },
  { id: 12, name: 'Izin Usaha', slug: 'izin-usaha', desc: 'OSS & perizinan usaha', icon: '🏢', gradient: 'from-blue-700 to-blue-500', category: 'usaha' },
];

const serviceDetails: Record<string, ServiceDetail> = {
  'cek-bansos': {
    id: 1,
    slug: 'cek-bansos',
    title: 'Cek Bansos Jakarta',
    description: 'Cek status penerimaan bantuan sosial dari Pemerintah Provinsi DKI Jakarta',
    gradient: 'from-emerald-500 to-teal-500',
    icon: '💰',
    steps: [
      'Masukkan NIK (Nomor Induk Kependudukan)',
      'Sistem akan memverifikasi data',
      'Lihat status penerimaan bansos',
      'Cek jenis bantuan yang diterima'
    ],
    url: 'https://bansos.jakarta.go.id'
  },
  'kjp-plus': {
    id: 2,
    slug: 'kjp-plus',
    title: 'KJP Plus',
    description: 'Cek saldo dan status Kartu Jakarta Pintar Plus',
    gradient: 'from-violet-500 to-purple-500',
    icon: '🎓',
    steps: [
      'Masukkan nomor kartu KJP',
      'Masukkan NISN siswa',
      'Cek saldo yang tersedia',
      'Lihat riwayat transaksi'
    ],
    url: 'https://kjp.jakarta.go.id'
  },
  'cek-etle': {
    id: 3,
    slug: 'cek-etle',
    title: 'Cek ETLE',
    description: 'Cek tilang elektronik dan histori pelanggaran lalu lintas',
    gradient: 'from-blue-500 to-cyan-500',
    icon: '📸',
    steps: [
      'Masukkan nomor plat kendaraan',
      'Pilih jenis kendaraan',
      'Lihat daftar pelanggaran',
      'Cek nominal denda yang harus dibayar'
    ],
    url: 'https://etle.infobrimo.id'
  },
  'pajak-kendaraan': {
    id: 4,
    slug: 'pajak-kendaraan',
    title: 'Pajak Kendaraan',
    description: 'Cek dan bayar pajak kendaraan bermotor online',
    gradient: 'from-amber-500 to-orange-500',
    icon: '🚗',
    steps: [
      'Masukkan nomor plat kendaraan',
      'Cek jatuh tempo pajak',
      'Hitung otomatis PKB dan SWDKLLJ',
      'Bayar melalui berbagai metode'
    ],
    url: 'https://samsat-pkb2.jakarta.go.id'
  },
};

const categories = [
  { id: 'all', name: 'Semua', gradient: 'from-gray-500 to-gray-400' },
  { id: 'bansos', name: 'Bansos', gradient: 'from-emerald-500 to-teal-500' },
  { id: 'transportasi', name: 'Transportasi', gradient: 'from-blue-500 to-cyan-500' },
  { id: 'pendidikan', name: 'Pendidikan', gradient: 'from-violet-500 to-purple-500' },
  { id: 'administrasi', name: 'Admin', gradient: 'from-amber-500 to-orange-500' },
  { id: 'darurat', name: 'Darurat', gradient: 'from-red-500 to-rose-500' },
  { id: 'info', name: 'Info', gradient: 'from-cyan-500 to-blue-400' },
  { id: 'usaha', name: 'Usaha', gradient: 'from-blue-700 to-blue-500' },
];

const emergencyNumbers = [
  { name: '112', label: 'Call Center', gradient: 'from-red-500 to-rose-500', desc: 'Nomor darurat utama' },
  { name: '110', label: 'Polisi', gradient: 'from-blue-500 to-blue-400', desc: 'Kejadian kriminal' },
  { name: '118/119', label: 'Ambulans', gradient: 'from-emerald-500 to-teal-500', desc: 'Kondisi medis darurat' },
  { name: '113', label: 'Pemadam', gradient: 'from-orange-500 to-amber-400', desc: 'Kebakaran & bencana' },
];

// Service Detail Modal
function ServiceDetailModal({ service, onClose }: { service: ServiceDetail; onClose: () => void }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-50" onClick={onClose} />
      <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-md mx-auto bg-white rounded-2xl z-50 max-h-[85vh] overflow-y-auto">
        <div className={`bg-gradient-to-r ${service.gradient} p-5`}>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl backdrop-blur-sm">
              {service.icon}
            </div>
            <div className="text-white">
              <h2 className="text-xl font-bold">{service.title}</h2>
              <p className="text-white/80 text-sm mt-1">{service.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div>
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <ListChecks size={18} className="text-emerald-500" />
              Langkah-langkah
            </h3>
            <div className="space-y-3">
              {service.steps.map((step, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={`w-7 h-7 bg-gradient-to-br ${service.gradient} rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0`}>
                    {index + 1}
                  </div>
                  <p className="text-gray-700 text-sm pt-0.5">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {service.url && (
            <a
              href={service.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`block w-full py-3.5 bg-gradient-to-r ${service.gradient} text-white font-bold rounded-xl text-center shadow-lg hover:shadow-xl transition-shadow`}
            >
              Buka Aplikasi
            </a>
          )}
        </div>
      </div>
    </>
  );
}

// Featured Service Card
function FeaturedServiceCard({ service }: { service: Service }) {
  return (
    <Link
      href={`/layanan/${service.slug}`}
      className="group bg-white rounded-2xl p-4 text-center shadow-md border border-gray-100 hover:shadow-xl hover:border-emerald-100 hover:-translate-y-1 transition-all duration-300"
    >
      <div className={`w-14 h-14 bg-gradient-to-br ${service.gradient} rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
        {service.icon}
      </div>
      <p className="font-bold text-gray-900 text-sm">{service.name}</p>
      <p className="text-xs text-gray-500 mt-0.5">{service.desc}</p>
    </Link>
  );
}

// Service List Item
function ServiceListItem({ service }: { service: Service }) {
  return (
    <Link
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
  );
}

export default function LayananPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedService, setSelectedService] = useState<ServiceDetail | null>(null);
  const [showSearch, setShowSearch] = useState(false);

  const filteredServices = allServices.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredServices = allServices.filter(s => s.featured);
  const recentServices = allServices.slice(4, 8);

  const handleServiceClick = (slug: string) => {
    const detail = serviceDetails[slug];
    if (detail) {
      setSelectedService(detail);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-24 lg:pb-0 lg:pt-20">
      <Header title="Layanan" />
      <BottomNav />

      {/* Search Bar - Mobile */}
      <div className="lg:hidden sticky top-14 z-30 bg-white border-b px-4 py-3">
        <div className="relative">
          <MagnifyingGlass size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari layanan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSearch(true)}
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
                  ? `bg-gradient-to-r ${cat.gradient} text-white shadow-lg`
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Search & Filter */}
      <div className="hidden lg:block sticky top-16 z-30 bg-white border-b px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlass size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari layanan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                    selectedCategory === cat.id
                      ? `bg-gradient-to-r ${cat.gradient} text-white shadow-lg`
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 lg:px-6 py-4 max-w-6xl mx-auto">
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
              {featuredServices.map((service) => (
                <FeaturedServiceCard key={service.id} service={service} />
              ))}
            </div>
          </section>
        )}

        {/* Recent Services */}
        {!searchQuery && selectedCategory === 'all' && (
          <section className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Clock size={18} className="text-blue-500" />
                Baru Dilihat
              </h2>
            </div>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2">
              {recentServices.map((service) => (
                <Link
                  key={service.id}
                  href={`/layanan/${service.slug}`}
                  className="shrink-0 w-40 bg-white rounded-xl p-3 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className={`w-10 h-10 bg-gradient-to-br ${service.gradient} rounded-lg flex items-center justify-center text-xl mb-2`}>
                    {service.icon}
                  </div>
                  <p className="font-semibold text-gray-900 text-xs truncate">{service.name}</p>
                  <p className="text-[10px] text-gray-500 truncate">{service.desc}</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredServices.map((service) => (
                <div key={service.id} onClick={() => handleServiceClick(service.slug)}>
                  <ServiceListItem service={service} />
                </div>
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

        {/* Quick Info */}
        {!searchQuery && selectedCategory === 'all' && (
          <section className="mt-8 mb-4">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                  <MapPin size={20} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Layanan Jaksel</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Jakselnews menyediakan berbagai informasi dan link ke layanan publik untuk warga Jakarta Selatan.
                    Semua layanan dikelola oleh instansi terkait.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Service Detail Modal */}
      {selectedService && (
        <ServiceDetailModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
        />
      )}
    </main>
  );
}
