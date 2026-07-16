'use client';

import { useState } from 'react';
import {
  MagnifyingGlass,
  CaretRight,
  CaretDown,
  Train,
  Bus,
  Cardholder,
  FirstAid,
  GraduationCap,
  Buildings,
  CurrencyCircleDollar,
  ShieldCheck,
  House,
  IdentificationCard,
  Wallet,
  Tree,
  WifiHigh,
  Phone,
  Newspaper,
  MapPin,
  Star,
  Camera,
} from '@phosphor-icons/react';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';

interface Service {
  id: number;
  name: string;
  desc: string;
  icon: React.ReactNode;
  iconColor: string;
  url: string;
  category: string;
  categoryName: string;
}

interface ServiceCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  iconColor: string;
}

// Icon colors for each category
const categoryColors: Record<string, string> = {
  transportasi: 'bg-blue-50 text-blue-500',
  keuangan: 'bg-amber-50 text-amber-500',
  bansos: 'bg-emerald-50 text-emerald-500',
  kesehatan: 'bg-red-50 text-red-500',
  pendidikan: 'bg-violet-50 text-violet-500',
  administrasi: 'bg-gray-100 text-gray-600',
  jakarta: 'bg-cyan-50 text-cyan-600',
  lingkungan: 'bg-green-50 text-green-600',
  usaha: 'bg-orange-50 text-orange-500',
};

// All Jakarta services with official URLs
const allServices: Service[] = [
  // Transportasi
  { id: 1, name: 'KRL Commuterline', desc: 'Jadwal, rute & tarif KRL', url: 'https://www.krl.co.id', category: 'transportasi', categoryName: 'Transportasi', icon: <Train size={24} />, iconColor: categoryColors.transportasi },
  { id: 2, name: 'TransJakarta', desc: 'Rute bus & halte', url: 'https://transjakarta.co.id', category: 'transportasi', categoryName: 'Transportasi', icon: <Bus size={24} />, iconColor: categoryColors.transportasi },
  { id: 3, name: 'MRT Jakarta', desc: 'Rute & jadwal MRT', url: 'https://jakartamrt.co.id', category: 'transportasi', categoryName: 'Transportasi', icon: <Train size={24} />, iconColor: categoryColors.transportasi },
  { id: 4, name: 'LRT Jakarta', desc: 'Rute & jadwal LRT', url: 'https://lrtjakarta.com', category: 'transportasi', categoryName: 'Transportasi', icon: <Train size={24} />, iconColor: categoryColors.transportasi },
  { id: 5, name: 'Grab', desc: 'Taksi & ojol online', url: 'https://grab.com/id', category: 'transportasi', categoryName: 'Transportasi', icon: <Bus size={24} />, iconColor: categoryColors.transportasi },
  { id: 6, name: 'Gojek', desc: 'Transportasi & layanan', url: 'https://gojek.com', category: 'transportasi', categoryName: 'Transportasi', icon: <Bus size={24} />, iconColor: categoryColors.transportasi },

  // Keuangan & Pajak
  { id: 7, name: 'Cek ETLE', desc: 'Tilang elektronik', url: 'https://ettributtrafik.id', category: 'keuangan', categoryName: 'Keuangan', icon: <Camera size={24} />, iconColor: categoryColors.keuangan },
  { id: 8, name: 'Pajak Kendaraan', desc: 'Cek & bayar pajak', url: 'https://bapenda.jakarta.go.id', category: 'keuangan', categoryName: 'Keuangan', icon: <CurrencyCircleDollar size={24} />, iconColor: categoryColors.keuangan },
  { id: 9, name: 'Samsat Online', desc: 'Pendaftaran pajak kendaraan', url: 'https://bapenda.jakarta.go.id', category: 'keuangan', categoryName: 'Keuangan', icon: <Wallet size={24} />, iconColor: categoryColors.keuangan },

  // Bantuan Sosial
  { id: 10, name: 'Bansos Jakarta', desc: 'Cek penerima bansos', url: 'https://bansos.jakarta.go.id', category: 'bansos', categoryName: 'Bansos', icon: <Cardholder size={24} />, iconColor: categoryColors.bansos },
  { id: 11, name: 'KJP Plus', desc: 'Kartu Jakarta Pintar', url: 'https://kjp.jakarta.go.id', category: 'bansos', categoryName: 'Bansos', icon: <GraduationCap size={24} />, iconColor: categoryColors.bansos },
  { id: 12, name: 'Kartu Jakarta Sehat', desc: 'BPJS & kesehatan', url: 'https://kjs.jakarta.go.id', category: 'bansos', categoryName: 'Bansos', icon: <FirstAid size={24} />, iconColor: categoryColors.bansos },
  { id: 13, name: 'KIP Kuliah', desc: 'Beasiswa kuliah', url: 'https://kip-kuliah.kemendikbud.go.id', category: 'bansos', categoryName: 'Bansos', icon: <GraduationCap size={24} />, iconColor: categoryColors.bansos },

  // Kesehatan
  { id: 14, name: 'RSUD Jakarta', desc: 'Rumah sakit daerah', url: 'https://www.jakartasatu.jakarta.go.id', category: 'kesehatan', categoryName: 'Kesehatan', icon: <FirstAid size={24} />, iconColor: categoryColors.kesehatan },
  { id: 15, name: 'Puskesmas Jaksel', desc: 'Pusat kesehatan', url: 'https://www.jakartasatu.jakarta.go.id', category: 'kesehatan', categoryName: 'Kesehatan', icon: <FirstAid size={24} />, iconColor: categoryColors.kesehatan },

  // Pendidikan
  { id: 17, name: 'PPDB Jakarta', desc: 'Penerimaan peserta didik', url: 'https://ppdb.jakarta.go.id', category: 'pendidikan', categoryName: 'Pendidikan', icon: <GraduationCap size={24} />, iconColor: categoryColors.pendidikan },
  { id: 18, name: 'Jakarta Edukasi', desc: 'Portal pendidikan', url: 'https://dki.jakarta.go.id', category: 'pendidikan', categoryName: 'Pendidikan', icon: <GraduationCap size={24} />, iconColor: categoryColors.pendidikan },
  { id: 19, name: 'JakOne', desc: 'Kartu siswa & pelajar', url: 'https://jak-one.jakarta.go.id', category: 'pendidikan', categoryName: 'Pendidikan', icon: <Cardholder size={24} />, iconColor: categoryColors.pendidikan },

  // Administrasi
  { id: 20, name: 'KTP Online', desc: 'Pembuatan KTP', url: 'https://layanan.dukcapil.kemendagri.go.id', category: 'administrasi', categoryName: 'Admin', icon: <IdentificationCard size={24} />, iconColor: categoryColors.administrasi },
  { id: 21, name: 'KK Online', desc: 'Kartu keluarga', url: 'https://layanan.dukcapil.kemendagri.go.id', category: 'administrasi', categoryName: 'Admin', icon: <IdentificationCard size={24} />, iconColor: categoryColors.administrasi },
  { id: 22, name: 'Akta Kelahiran', desc: 'Surat kelahiran', url: 'https://layanan.dukcapil.kemendagri.go.id', category: 'administrasi', categoryName: 'Admin', icon: <IdentificationCard size={24} />, iconColor: categoryColors.administrasi },

  // Layanan Jakarta
  { id: 24, name: 'JakWifi', desc: 'Internet gratis', url: 'https://jaki.jakarta.go.id', category: 'jakarta', categoryName: 'Layanan Jakarta', icon: <WifiHigh size={24} />, iconColor: categoryColors.jakarta },
  { id: 25, name: 'JakLingko', desc: 'Integrasi transportasi', url: 'https://jaklingko.jakarta.go.id', category: 'jakarta', categoryName: 'Layanan Jakarta', icon: <Bus size={24} />, iconColor: categoryColors.jakarta },
  { id: 26, name: 'Jakarta Satu', desc: 'Portal data & layanan', url: 'https://www.jakartasatu.jakarta.go.id', category: 'jakarta', categoryName: 'Layanan Jakarta', icon: <Buildings size={24} />, iconColor: categoryColors.jakarta },
  { id: 27, name: 'DKI Open Data', desc: 'Data terbuka', url: 'https://data.jakarta.go.id', category: 'jakarta', categoryName: 'Layanan Jakarta', icon: <Newspaper size={24} />, iconColor: categoryColors.jakarta },

  // Lingkungan
  { id: 29, name: 'Bank Sampah', desc: 'Tukar sampah', url: 'https://jaki.jakarta.go.id', category: 'lingkungan', categoryName: 'Lingkungan', icon: <Tree size={24} />, iconColor: categoryColors.lingkungan },
  { id: 30, name: 'DKI Green', desc: 'Program hijau', url: 'https://www.jakartasatu.jakarta.go.id', category: 'lingkungan', categoryName: 'Lingkungan', icon: <Tree size={24} />, iconColor: categoryColors.lingkungan },

  // Usaha
  { id: 32, name: 'OSS UBBN', desc: 'Izin usaha online', url: 'https://oss.go.id', category: 'usaha', categoryName: 'Usaha', icon: <Buildings size={24} />, iconColor: categoryColors.usaha },
  { id: 33, name: 'JakClinic', desc: 'OSS & izin berusaha', url: 'https://jakclinic.jakarta.go.id', category: 'usaha', categoryName: 'Usaha', icon: <ShieldCheck size={24} />, iconColor: categoryColors.usaha },
];

const categories: ServiceCategory[] = [
  { id: 'semua', name: 'Semua', icon: <Star size={16} />, iconColor: 'bg-red-50 text-red-500' },
  { id: 'transportasi', name: 'Transportasi', icon: <Bus size={16} />, iconColor: categoryColors.transportasi },
  { id: 'keuangan', name: 'Keuangan', icon: <CurrencyCircleDollar size={16} />, iconColor: categoryColors.keuangan },
  { id: 'bansos', name: 'Bansos', icon: <Cardholder size={16} />, iconColor: categoryColors.bansos },
  { id: 'kesehatan', name: 'Kesehatan', icon: <FirstAid size={16} />, iconColor: categoryColors.kesehatan },
  { id: 'pendidikan', name: 'Pendidikan', icon: <GraduationCap size={16} />, iconColor: categoryColors.pendidikan },
  { id: 'administrasi', name: 'Admin', icon: <IdentificationCard size={16} />, iconColor: categoryColors.administrasi },
  { id: 'jakarta', name: 'Layanan Jakarta', icon: <Buildings size={16} />, iconColor: categoryColors.jakarta },
  { id: 'lingkungan', name: 'Lingkungan', icon: <Tree size={16} />, iconColor: categoryColors.lingkungan },
  { id: 'usaha', name: 'Usaha', icon: <Wallet size={16} />, iconColor: categoryColors.usaha },
];

const emergencyNumbers = [
  { name: '112', label: 'Call Center' },
  { name: '110', label: 'Polisi' },
  { name: '119', label: 'Ambulans' },
  { name: '113', label: 'Pemadam' },
];

// Service Card Component
function ServiceCard({ service }: { service: Service }) {
  return (
    <a
      href={service.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-200 flex flex-col items-center text-center"
    >
      <div className={`w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-3 group-hover:scale-110 transition-transform ${service.iconColor}`}>
        {service.icon}
      </div>
      <h3 className="font-semibold text-gray-900 text-xs leading-tight mb-1 text-center">{service.name}</h3>
      <p className="text-[10px] text-gray-500 leading-relaxed line-clamp-2 text-center">{service.desc}</p>
    </a>
  );
}

// Featured Service Card (Centered)
function FeaturedCard({ service }: { service: Service }) {
  return (
    <a
      href={service.url}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-200 flex flex-col items-center text-center"
    >
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-3 ${service.iconColor}`}>
        {service.icon}
      </div>
      <h3 className="font-bold text-gray-900 text-sm mb-1 text-center">{service.name}</h3>
      <p className="text-xs text-gray-500 text-center">{service.desc}</p>
    </a>
  );
}

// Category Section (Collapsible)
function CategorySection({ category, services, defaultOpen = false }: { category: ServiceCategory; services: Service[]; defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [showAll, setShowAll] = useState(false);

  return (
    <section className="mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between mb-3 p-2 rounded-xl hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${category.iconColor}`}>
            {category.icon}
          </div>
          <h2 className="text-base font-bold text-gray-900">{category.name}</h2>
          <span className="text-sm text-gray-400">({services.length})</span>
        </div>
        <CaretDown size={20} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
          {(showAll ? services : services.slice(0, 8)).map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}

      {isOpen && services.length > 8 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-3 text-sm text-red-500 font-medium hover:text-red-600 flex items-center gap-1 mx-auto"
        >
          {showAll ? 'Tutup' : `Lihat ${services.length - 8} lainnya`}
          <CaretRight size={16} className={showAll ? 'rotate-90' : ''} />
        </button>
      )}
    </section>
  );
}

export default function LayananPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('semua');

  const filteredServices = allServices.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'semua' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Featured services (most popular)
  const featuredServices = allServices.filter(s =>
    ['KRL Commuterline', 'TransJakarta', 'Bansos Jakarta', 'KJP Plus', 'Cek ETLE', 'Pajak Kendaraan'].includes(s.name)
  );

  // Group services by category
  const groupedServices = allServices.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {} as Record<string, Service[]>);

  return (
    <main className="min-h-screen bg-gray-50 pb-24 lg:pb-0">
      <Header title="Layanan" />
      <BottomNav />

      {/* Search Bar */}
      <div className="sticky top-14 lg:top-20 z-30 bg-white border-b px-4 py-3">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <MagnifyingGlass size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari layanan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white border-b px-4 py-3">
        <div className="max-w-2xl mx-auto">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.icon}
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 py-4 max-w-2xl mx-auto">
        {/* Featured Services */}
        {!searchQuery && selectedCategory === 'semua' && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 text-center">Layanan Populer</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {featuredServices.map((service) => (
                <FeaturedCard key={service.id} service={service} />
              ))}
            </div>
          </section>
        )}

        {/* Emergency Numbers */}
        {!searchQuery && selectedCategory === 'semua' && (
          <section className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Phone size={20} className="text-red-500" />
              Nomor Darurat
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {emergencyNumbers.map((num) => (
                <a
                  key={num.name}
                  href={`tel:${num.name}`}
                  className="bg-red-500 rounded-2xl p-4 text-center hover:bg-red-600 transition-colors"
                >
                  <p className="font-bold text-white text-xl mb-1">{num.name}</p>
                  <p className="text-red-100 text-xs">{num.label}</p>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Search Results */}
        {searchQuery && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Hasil Pencarian</h2>
              <span className="text-sm text-gray-500">{filteredServices.length} layanan</span>
            </div>
            {filteredServices.length > 0 ? (
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                {filteredServices.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-500 mb-4">Layanan tidak ditemukan</p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-6 py-2.5 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 transition-colors"
                >
                  Reset Pencarian
                </button>
              </div>
            )}
          </section>
        )}

        {/* Category Sections when "Semua" (collapsed by default) */}
        {!searchQuery && selectedCategory === 'semua' && (
          <section>
            <h2 className="text-lg font-bold text-gray-900 mb-4 text-center">Semua Layanan</h2>
            {Object.entries(groupedServices).map(([category, services]) => {
              const catInfo = categories.find(c => c.id === category);
              if (!catInfo || services.length === 0) return null;
              return (
                <CategorySection
                  key={category}
                  category={catInfo}
                  services={services}
                  defaultOpen={false}
                />
              );
            })}
          </section>
        )}

        {/* Category View (when specific category selected) */}
        {!searchQuery && selectedCategory !== 'semua' && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">
                {categories.find(c => c.id === selectedCategory)?.name}
              </h2>
              <span className="text-sm text-gray-500">{filteredServices.length} layanan</span>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
              {filteredServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </section>
        )}

        {/* Info Footer */}
        {!searchQuery && selectedCategory === 'semua' && (
          <section className="mt-6 mb-4">
            <div className="bg-white rounded-2xl p-4 border border-gray-100 text-center">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                <MapPin size={20} className="text-gray-500" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Layanan Jaksel</h3>
              <p className="text-sm text-gray-500">
                Link ke layanan publik resmi untuk warga Jakarta Selatan.
              </p>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
