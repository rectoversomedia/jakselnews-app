'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  MagnifyingGlass,
  CaretRight,
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
  url: string;
  category: string;
  categoryName: string;
}

interface ServiceCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
}

// All Jakarta services with official URLs
const allServices: Service[] = [
  // Transportasi
  { id: 1, name: 'KRL Commuterline', desc: 'Jadwal, rute & tarif KRL Jabodetabek', url: 'https://www.krl.co.id', category: 'transportasi', categoryName: 'Transportasi', icon: <Train size={28} /> },
  { id: 2, name: 'TransJakarta', desc: 'Rute bus & halte terdekat', url: 'https://transjakarta.co.id', category: 'transportasi', categoryName: 'Transportasi', icon: <Bus size={28} /> },
  { id: 3, name: 'MRT Jakarta', desc: 'Rute & jadwal MRT Jakarta', url: 'https://jakartamrt.co.id', category: 'transportasi', categoryName: 'Transportasi', icon: <Train size={28} /> },
  { id: 4, name: 'LRT Jakarta', desc: 'Rute & jadwal LRT Jabodebek', url: 'https://lrtjabodebek.com', category: 'transportasi', categoryName: 'Transportasi', icon: <Train size={28} /> },
  { id: 5, name: 'Grab Indonesia', desc: 'Taksi & ojol online', url: 'https://grab.com/id', category: 'transportasi', categoryName: 'Transportasi', icon: <Bus size={28} /> },
  { id: 6, name: 'Gojek Indonesia', desc: 'Transportasi & layanan everyday', url: 'https://gojek.com', category: 'transportasi', categoryName: 'Transportasi', icon: <Bus size={28} /> },

  // Keuangan & Pajak
  { id: 7, name: 'Cek ETLE', desc: 'Tilang elektronik & histori pelanggaran', url: 'https://ettributtrafik.id', category: 'keuangan', categoryName: 'Keuangan & Pajak', icon: <Camera size={28} /> },
  { id: 8, name: 'Pajak Kendaraan', desc: 'Cek & bayar pajak kendaraan online', url: 'https://bapenda.jakarta.go.id', category: 'keuangan', categoryName: 'Keuangan & Pajak', icon: <CurrencyCircleDollar size={28} /> },
  { id: 9, name: 'Samsat Online', desc: 'Pendaftaran pajak kendaraan', url: 'https://pajak.kendaraanmu.com', category: 'keuangan', categoryName: 'Keuangan & Pajak', icon: <Wallet size={28} /> },

  // Bantuan Sosial
  { id: 10, name: 'Bansos Jakarta', desc: 'Cek penerima & status bantuan sosial', url: 'https://bansos.jakarta.go.id', category: 'bansos', categoryName: 'Bantuan Sosial', icon: <Cardholder size={28} /> },
  { id: 11, name: 'KJP Plus', desc: 'Kartu Jakarta Pintar Plus', url: 'https://kjp.jakarta.go.id', category: 'bansos', categoryName: 'Bantuan Sosial', icon: <GraduationCap size={28} /> },
  { id: 12, name: 'Kartu Jakarta Sehat', desc: 'BPJS & kesehatan gratis', url: 'https://kjs.jakarta.go.id', category: 'bansos', categoryName: 'Bantuan Sosial', icon: <FirstAid size={28} /> },
  { id: 13, name: 'KIP Kuliah', desc: 'Beasiswa kuliah & bantuan pendidikan', url: 'https://kip-kuliah.kemendikbud.go.id', category: 'bansos', categoryName: 'Bantuan Sosial', icon: <GraduationCap size={28} /> },

  // Kesehatan
  { id: 14, name: 'RSUD Jakarta', desc: 'Rumah sakit umum daerah', url: 'https://www.jakartasatu.jakarta.go.id', category: 'kesehatan', categoryName: 'Kesehatan', icon: <FirstAid size={28} /> },
  { id: 15, name: 'Puskesmas Jaksel', desc: 'Pusat kesehatan masyarakat', url: 'https://www.jakartasatu.jakarta.go.id', category: 'kesehatan', categoryName: 'Kesehatan', icon: <FirstAid size={28} /> },
  { id: 16, name: 'SIGIZI', desc: 'Stunting & gizi buruk', url: 'https://humas.jakarta.go.id', category: 'kesehatan', categoryName: 'Kesehatan', icon: <FirstAid size={28} /> },

  // Pendidikan
  { id: 17, name: 'PPDB Jakarta', desc: 'Penerimaan peserta didik baru', url: 'https://ppdb.jakarta.go.id', category: 'pendidikan', categoryName: 'Pendidikan', icon: <GraduationCap size={28} /> },
  { id: 18, name: 'Jakarta Edukasi', desc: 'Portal pendidikan Jakarta', url: 'https://dki jakarta.go.id', category: 'pendidikan', categoryName: 'Pendidikan', icon: <GraduationCap size={28} /> },
  { id: 19, name: 'JakOne', desc: 'Kartu siswa & pelajar Jakarta', url: 'https://jak-one.jakarta.go.id', category: 'pendidikan', categoryName: 'Pendidikan', icon: <Cardholder size={28} /> },

  // Administrasi
  { id: 20, name: 'KTP Online', desc: 'Pembuatan & perpanjangan KTP', url: 'https://layanan.dukcapil.kemendagri.go.id', category: 'administrasi', categoryName: 'Administrasi', icon: <IdentificationCard size={28} /> },
  { id: 21, name: 'KK Online', desc: 'Kartu keluarga online', url: 'https://layanan.dukcapil.kemendagri.go.id', category: 'administrasi', categoryName: 'Administrasi', icon: <IdentificationCard size={28} /> },
  { id: 22, name: 'Akta Kelahiran', desc: 'Surat kelahiran & kematian', url: 'https://layanan.dukcapil.kemendagri.go.id', category: 'administrasi', categoryName: 'Administrasi', icon: <IdentificationCard size={28} /> },
  { id: 23, name: 'IMKEL', desc: 'Isoman & isolasiCOVID', url: 'https://corona.jakarta.go.id', category: 'administrasi', categoryName: 'Administrasi', icon: <ShieldCheck size={28} /> },

  // Layanan Jakarta
  { id: 24, name: 'JakWifi', desc: 'Internet gratis di Jakarta', url: 'https://jaki.jakarta.go.id', category: 'jakarta', categoryName: 'Layanan Jakarta', icon: <WifiHigh size={28} /> },
  { id: 25, name: 'JakLingko', desc: 'Integrasi transportasi Jakarta', url: 'https://jaklingkojakarta.id', category: 'jakarta', categoryName: 'Layanan Jakarta', icon: <Bus size={28} /> },
  { id: 26, name: 'Jakarta Satu', desc: 'Portal data & layanan Jakarta', url: 'https://www.jakartasatu.jakarta.go.id', category: 'jakarta', categoryName: 'Layanan Jakarta', icon: <Buildings size={28} /> },
  { id: 27, name: 'DKI Open Data', desc: 'Data terbuka Jakarta', url: 'https://data.jakarta.go.id', category: 'jakarta', categoryName: 'Layanan Jakarta', icon: <Newspaper size={28} /> },
  { id: 28, name: 'RT/RW Digital', desc: 'Layanan digital RT/RW', url: 'https://jaki.jakarta.go.id', category: 'jakarta', categoryName: 'Layanan Jakarta', icon: <House size={28} /> },

  // Lingkungan
  { id: 29, name: 'Bank Sampah', desc: 'Tukar sampah jadi uang', url: 'https://jaki.jakarta.go.id', category: 'lingkungan', categoryName: 'Lingkungan', icon: <Tree size={28} /> },
  { id: 30, name: 'DKI Green', desc: 'Program hijau & konservasi', url: 'https://www.jakartasatu.jakarta.go.id', category: 'lingkungan', categoryName: 'Lingkungan', icon: <Tree size={28} /> },
  { id: 31, name: 'PDPS', desc: 'Penerangan & sampah Jakarta', url: 'https://www.jakartasatu.jakarta.go.id', category: 'lingkungan', categoryName: 'Lingkungan', icon: <Tree size={28} /> },

  // Usaha
  { id: 32, name: 'OSS UBBN', desc: 'Izin usaha online', url: 'https://oss.go.id', category: 'usaha', categoryName: 'Usaha', icon: <Buildings size={28} /> },
  { id: 33, name: 'JakClinic', desc: 'OSS & izin berusaha', url: 'https://pelayanan.jakarta.go.id', category: 'usaha', categoryName: 'Usaha', icon: <Buildings size={28} /> },
];

const categories: ServiceCategory[] = [
  { id: 'semua', name: 'Semua', icon: <Star size={16} /> },
  { id: 'transportasi', name: 'Transportasi', icon: <Bus size={16} /> },
  { id: 'keuangan', name: 'Keuangan', icon: <CurrencyCircleDollar size={16} /> },
  { id: 'bansos', name: 'Bansos', icon: <Cardholder size={16} /> },
  { id: 'kesehatan', name: 'Kesehatan', icon: <FirstAid size={16} /> },
  { id: 'pendidikan', name: 'Pendidikan', icon: <GraduationCap size={16} /> },
  { id: 'administrasi', name: 'Admin', icon: <IdentificationCard size={16} /> },
  { id: 'jakarta', name: 'Layanan Jakarta', icon: <Buildings size={16} /> },
  { id: 'lingkungan', name: 'Lingkungan', icon: <Tree size={16} /> },
  { id: 'usaha', name: 'Usaha', icon: <Wallet size={16} /> },
];

const emergencyNumbers = [
  { name: '112', label: 'Call Center', desc: 'Nomor darurat utama' },
  { name: '110', label: 'Polisi', desc: 'Kejadian kriminal' },
  { name: '119', label: 'Ambulans', desc: 'Kondisi medis darurat' },
  { name: '113', label: 'Pemadam', desc: 'Kebakaran & bencana' },
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
      <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-700 group-hover:bg-red-50 group-hover:text-red-500 transition-colors mb-3">
        {service.icon}
      </div>
      <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1">{service.name}</h3>
      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{service.desc}</p>
    </a>
  );
}

// Featured Service Card
function FeaturedCard({ service }: { service: Service }) {
  return (
    <a
      href={service.url}
      target="_blank"
      rel="noopener noreferrer"
      className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-lg hover:border-red-200 transition-all duration-200"
    >
      <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 mb-4">
        {service.icon}
      </div>
      <h3 className="font-bold text-gray-900 mb-1">{service.name}</h3>
      <p className="text-sm text-gray-500">{service.desc}</p>
    </a>
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
            <h2 className="text-lg font-bold text-gray-900 mb-4">Layanan Populer</h2>
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
                  href={`tel:${num.name.replace('/', '-')}`}
                  className="bg-red-500 rounded-2xl p-4 text-center hover:bg-red-600 transition-colors"
                >
                  <p className="font-bold text-white text-xl mb-1">{num.name}</p>
                  <p className="text-red-100 text-xs">{num.label}</p>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* All Services Grid */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">
              {searchQuery ? 'Hasil Pencarian' : selectedCategory === 'semua' ? 'Semua Layanan' : categories.find(c => c.id === selectedCategory)?.name}
            </h2>
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
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MagnifyingGlass size={32} className="text-gray-400" />
              </div>
              <p className="text-gray-500 mb-4">Layanan tidak ditemukan</p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('semua'); }}
                className="px-6 py-2.5 bg-red-500 text-white font-medium rounded-xl hover:bg-red-600 transition-colors"
              >
                Reset Pencarian
              </button>
            </div>
          )}
        </section>

        {/* Category Sections when "Semua" */}
        {!searchQuery && selectedCategory === 'semua' && (
          <>
            {Object.entries(groupedServices).map(([category, services]) => {
              const catInfo = categories.find(c => c.id === category);
              if (!catInfo || services.length === 0) return null;

              return (
                <section key={category} className="mt-8 first:mt-0">
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">
                      {catInfo.icon}
                    </span>
                    {catInfo.name}
                    <span className="text-sm font-normal text-gray-400">({services.length})</span>
                  </h2>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                    {services.slice(0, 8).map((service) => (
                      <ServiceCard key={service.id} service={service} />
                    ))}
                  </div>
                  {services.length > 8 && (
                    <button
                      onClick={() => setSelectedCategory(category)}
                      className="mt-3 text-sm text-red-500 font-medium hover:text-red-600 flex items-center gap-1"
                    >
                      Lihat semua {services.length} layanan
                      <CaretRight size={16} />
                    </button>
                  )}
                </section>
              );
            })}
          </>
        )}

        {/* Info Footer */}
        {!searchQuery && selectedCategory === 'semua' && (
          <section className="mt-8 mb-4">
            <div className="bg-white rounded-2xl p-4 border border-gray-100">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                  <MapPin size={20} className="text-gray-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Layanan Jaksel</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Jakselnews menyediakan link ke layanan publik resmi untuk warga Jakarta Selatan.
                    Semua layanan dikelola oleh instansi terkait.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
