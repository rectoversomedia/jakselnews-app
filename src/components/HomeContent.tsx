import Link from 'next/link';
import Image from 'next/image';
import { wpAPI, getFeaturedImage, getPostCategory, formatPostDate, stripHtml } from '@/lib/wordpress';
import { Clock, MapPin, ChevronRight, AlertTriangle, AlertCircle, ShieldAlert, Wrench } from 'lucide-react';

// Mock data for demo - replace with real API calls
const breakingNews = [
  {
    id: 1,
    title: 'Banjir Melanda Kawasan Kemang, Warga Diimbau Mengungsi',
    location: 'Kemang',
    time: '15 menit lalu',
    image: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800&q=80',
    type: 'banjir'
  },
  {
    id: 2,
    title: 'Perbaikan Jalan Raya TB Simatupang, Lalu Lintas Dialihkan',
    location: 'TB Simatupang',
    time: '30 menit lalu',
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80',
    type: 'jalan'
  },
  {
    id: 3,
    title: 'Demo Besar-besaran di Bundaran HI, Masyarakat Diminta Hindari Wilayah Ini',
    location: 'Bundaran HI',
    time: '1 jam lalu',
    image: 'https://images.unsplash.com/photo-1569982175971-d92b01cf8694?w=800&q=80',
    type: 'keamanan'
  }
];

const peringatanItems = [
  {
    id: 1,
    title: 'Genangan Air ±20cm',
    location: 'Jl. Kemang Raya',
    time: '12 menit lalu',
    icon: '🌊',
    color: 'bg-blue-500'
  },
  {
    id: 2,
    title: 'Jalan Ditutup Sementara',
    location: 'Jl. Ragunan',
    time: '45 menit lalu',
    icon: '🚧',
    color: 'bg-orange-500'
  },
  {
    id: 3,
    title: 'Potensi Banjir Rendah',
    location: 'Cilandak',
    time: '1 jam lalu',
    icon: '⚠️',
    color: 'bg-yellow-500'
  }
];

const infoTerkiniItems = [
  {
    id: 1,
    title: 'MRT Jakarta Resmi Buka Rute Baru ke东区',
    category: 'Transportasi',
    date: '2 jam lalu',
    image: 'https://images.unsplash.com/photo-1555899434-94d1368aa7af?w=400&q=80'
  },
  {
    id: 2,
    title: 'Pasar Murah di Blok M, Inilah Jadwal dan Lokasi',
    category: 'Ekonomi',
    date: '3 jam lalu',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80'
  },
  {
    id: 3,
    title: 'Warga Keluhkan Kerapihan Trotoar di Sekitar SCBD',
    category: 'Urban',
    date: '4 jam lalu',
    image: 'https://images.unsplash.com/photo-1517732306149-e8f829eb588a?w=400&q=80'
  },
  {
    id: 4,
    title: 'Festival Jaksel 2026: Menyatu dalam Keberagaman',
    category: 'Event',
    date: '5 jam lalu',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&q=80'
  },
  {
    id: 5,
    title: 'Tips Aman Berkendara di Musim Hujan',
    category: 'Tips',
    date: '6 jam lalu',
    image: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=400&q=80'
  }
];

const layananPopuler = [
  { id: 1, title: 'Cek Bansos', desc: 'Cek penerima bantuan', icon: '💰', color: 'bg-emerald-500' },
  { id: 2, title: 'KJP Plus', desc: 'Cek saldo KJP', icon: '🎓', color: 'bg-violet-500' },
  { id: 3, title: 'Cek ETLE', desc: 'Tilang elektronik', icon: '📸', color: 'bg-blue-500' },
  { id: 4, title: 'Pajak Kendaraan', desc: 'Cek & bayar', icon: '🚗', color: 'bg-amber-500' },
  { id: 5, title: 'KRL', desc: 'Jadwal & rute', icon: '🚆', color: 'bg-blue-600' },
  { id: 6, title: 'Transjakarta', desc: 'Rute & halte', icon: '🚌', color: 'bg-red-500' },
];

function BreakingNewsHero() {
  return (
    <section className="px-4 py-3">
      <div className="relative overflow-x-auto scrollbar-hide snap-x snap-mandatory flex gap-3">
        {breakingNews.map((item) => (
          <div
            key={item.id}
            className="snap-start shrink-0 w-[85%] md:w-[45%] lg:w-[30%]"
          >
            <Link href="/breaking-news" className="block relative rounded-2xl overflow-hidden aspect-[16/10]">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full">
                  BREAKING
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-bold text-sm md:text-base leading-tight line-clamp-2 mb-2">
                  {item.title}
                </h3>
                <div className="flex items-center gap-3 text-white/80 text-xs">
                  <span className="flex items-center gap-1">
                    <MapPin size={12} />
                    {item.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {item.time}
                  </span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

function PeringatanSection() {
  return (
    <section className="px-4 py-4">
      <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle size={20} className="text-red-600" />
          <h2 className="text-base font-bold text-red-700">PERINGATAN</h2>
        </div>
        <div className="space-y-2">
          {peringatanItems.map((item) => (
            <Link
              key={item.id}
              href="/kategori/banjir"
              className="flex items-center gap-3 bg-white p-3 rounded-xl hover:bg-red-50 transition-colors"
            >
              <div className={`w-10 h-10 ${item.color} rounded-full flex items-center justify-center text-xl shrink-0`}>
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 text-sm">{item.title}</h4>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <MapPin size={10} />
                    {item.location}
                  </span>
                  <span>•</span>
                  <span>{item.time}</span>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function InfoTerkiniSection() {
  return (
    <section className="px-4 py-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base md:text-lg font-bold text-gray-900">INFO TERKINI</h2>
        <Link href="/artikel" className="text-xs text-primary font-medium flex items-center gap-0.5">
          Lihat Semua <ChevronRight size={14} />
        </Link>
      </div>
      <div className="overflow-x-auto scrollbar-hide flex gap-3">
        {infoTerkiniItems.map((item) => (
          <Link
            key={item.id}
            href="/artikel"
            className="shrink-0 w-44 md:w-52"
          >
            <div className="rounded-xl overflow-hidden bg-white shadow-sm">
              <div className="aspect-[4/3] relative">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-2.5">
                <span className="text-[10px] text-primary font-medium">{item.category}</span>
                <h4 className="font-semibold text-gray-900 text-xs mt-1 line-clamp-2 leading-tight">
                  {item.title}
                </h4>
                <span className="text-[10px] text-gray-400 mt-1 block">{item.date}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function LayananPopulerSection() {
  return (
    <section className="px-4 py-4 mb-20">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base md:text-lg font-bold text-gray-900">LAYANAN POPULER</h2>
        <Link href="/layanan" className="text-xs text-primary font-medium flex items-center gap-0.5">
          Lihat Semua <ChevronRight size={14} />
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {layananPopuler.map((item) => (
          <Link
            key={item.id}
            href="/layanan"
            className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center"
          >
            <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center text-2xl mb-2`}>
              {item.icon}
            </div>
            <h4 className="font-semibold text-gray-900 text-sm">{item.title}</h4>
            <p className="text-[10px] text-gray-500">{item.desc}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default function HomeContent() {
  return (
    <>
      <BreakingNewsHero />
      <PeringatanSection />
      <InfoTerkiniSection />
      <LayananPopulerSection />
    </>
  );
}
