'use client';

import Link from 'next/link';
import {
  AlertTriangle,
  GraduationCap,
  Car,
  Search,
  Train,
  Bus,
  Cloud,
  Phone,
  Heart,
  Shield,
  Users,
  CreditCard,
  Receipt,
  Stethoscope,
  Scale,
  Building2,
  Lightbulb,
  TreePine,
} from 'lucide-react';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  color: string;
  badge?: string;
}

function ServiceCard({ icon, title, description, href, color, badge }: ServiceCardProps) {
  return (
    <Link href={href} className="card p-4 flex items-center gap-4">
      <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center text-white shrink-0`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900">{title}</h3>
          {badge && (
            <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-semibold rounded-full">
              {badge}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-0.5">{description}</p>
      </div>
    </Link>
  );
}

export default function LayananPage() {
  const services = [
    {
      category: 'Bantuan Sosial',
      items: [
        {
          icon: <AlertTriangle size={24} />,
          title: 'Cek Bansos',
          description: 'Cek penerima bantuan sosial',
          href: '/layanan/bansos',
          color: 'bg-emerald-500',
          badge: 'POPULER',
        },
        {
          icon: <GraduationCap size={24} />,
          title: 'KJP Plus',
          description: 'Cek status & saldo Kartu Jaksel Positif',
          href: '/layanan/kjp',
          color: 'bg-violet-500',
        },
        {
          icon: <Heart size={24} />,
          title: 'Kartu Jaksel Sehat',
          description: 'Program kesehatan warga Jaksel',
          href: '/layanan/jaksel-sehat',
          color: 'bg-pink-500',
        },
      ],
    },
    {
      category: 'Kendaraan',
      items: [
        {
          icon: <Car size={24} />,
          title: 'Pajak Kendaraan',
          description: 'Cek & bayar pajak kendaraan',
          href: '/layanan/pajak-kendaraan',
          color: 'bg-amber-500',
        },
        {
          icon: <Search size={24} />,
          title: 'Cek ETLE',
          description: 'Tilang elektronik & pelanggaran',
          href: '/layanan/etle',
          color: 'bg-blue-500',
          badge: 'BARU',
        },
        {
          icon: <Shield size={24} />,
          title: 'Asuransi Kendaraan',
          description: 'Info asuransi kendaraan',
          href: '/layanan/asuransi',
          color: 'bg-slate-600',
        },
      ],
    },
    {
      category: 'Transportasi',
      items: [
        {
          icon: <Train size={24} />,
          title: 'KRL Commuter',
          description: 'Jadwal & rute KRL',
          href: '/layanan/krl',
          color: 'bg-blue-600',
        },
        {
          icon: <Bus size={24} />,
          title: 'Transjakarta',
          description: 'Rute & halte terdekat',
          href: '/layanan/transjakarta',
          color: 'bg-red-600',
        },
        {
          icon: <Building2 size={24} />,
          title: 'MRT Jakarta',
          description: 'Info rute MRT',
          href: '/layanan/mrt',
          color: 'bg-teal-600',
        },
      ],
    },
    {
      category: 'Cuaca & Darurat',
      items: [
        {
          icon: <Cloud size={24} />,
          title: 'Cuaca Jaksel',
          description: 'Info cuaca terkini',
          href: '/layanan/cuaca',
          color: 'bg-amber-400',
        },
        {
          icon: <Phone size={24} />,
          title: 'Nomor Darurat',
          description: 'Akses cepat nomor darurat',
          href: '/layanan/darurat',
          color: 'bg-primary',
          badge: 'PENTING',
        },
        {
          icon: <Shield size={24} />,
          title: 'Lapor Bencana',
          description: 'Laporkan bencana di sekitar',
          href: '/layanan/lapor-bencana',
          color: 'bg-cyan-500',
        },
      ],
    },
    {
      category: 'Pelayanan Publik',
      items: [
        {
          icon: <Users size={24} />,
          title: 'KTP & KK',
          description: 'Info pembuatan KTP & KK',
          href: '/layanan/ktp-kk',
          color: 'bg-indigo-500',
        },
        {
          icon: <CreditCard size={24} />,
          title: 'PBB',
          description: 'Cek & bayar pajak bumi',
          href: '/layanan/pbb',
          color: 'bg-orange-500',
        },
        {
          icon: <Receipt size={24} />,
          title: 'Tagihan & Retribusi',
          description: 'Cek tagihan air, listrik, dll',
          href: '/layanan/tagihan',
          color: 'bg-cyan-600',
        },
      ],
    },
    {
      category: 'Kesehatan',
      items: [
        {
          icon: <Stethoscope size={24} />,
          title: 'Faskes Terdekat',
          description: 'Rumah sakit & klinik terdekat',
          href: '/layanan/faskes',
          color: 'bg-red-400',
        },
        {
          icon: <Heart size={24} />,
          title: 'Donor Darah',
          description: 'Jadwal donor darah',
          href: '/layanan/donor-darah',
          color: 'bg-rose-500',
        },
        {
          icon: <Scale size={24} />,
          title: 'Cek BMI',
          description: 'Kalkulator berat badan ideal',
          href: '/layanan/bmi',
          color: 'bg-green-500',
        },
      ],
    },
  ];

  return (
    <div className="pb-safe">
      {/* Header */}
      <div className="container py-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Layanan Publik</h1>
        <p className="text-sm text-gray-500 mt-1">Akses cepat layanan pemerintah & publik</p>
      </div>

      {/* Services by Category */}
      {services.map((section) => (
        <div key={section.category} className="container py-4">
          <h2 className="text-base font-semibold text-gray-700 mb-3">{section.category}</h2>
          <div className="space-y-3">
            {section.items.map((service) => (
              <ServiceCard key={service.title} {...service} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
