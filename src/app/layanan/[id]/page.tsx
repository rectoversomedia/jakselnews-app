import Link from 'next/link';
import { ChevronLeft, ExternalLink, Phone, MapPin, Clock, Info } from 'lucide-react';

// Layanan data - shared with parent page
const layananData: Record<number, {
  title: string;
  desc: string;
  icon: string;
  color: string;
  description: string;
  requirements?: string[];
  procedure?: string[];
  contact?: { name: string; value: string }[];
  links?: { name: string; url: string }[];
}> = {
  1: {
    title: 'Cek Bansos',
    desc: 'Cek penerima bantuan sosial',
    icon: '💰',
    color: 'bg-emerald-500',
    description: 'Layanan untuk mengecek status penerimaan bantuan sosial dari pemerintah.',
    requirements: ['KTP Jakarta Selatan', 'KK (Kartu Keluarga)', 'NIK (Nomor Induk Kependudukan)'],
    procedure: [
      'Buka website cek bansos',
      'Masukkan NIK dan nama',
      'Cek status bantuan',
    ],
    links: [{ name: 'Cek Bansos', url: 'https://cekbansos.kemensos.go.id' }],
  },
  2: {
    title: 'KJP Plus',
    desc: 'Kartu Jakarta Plus',
    icon: '🎓',
    color: 'bg-violet-500',
    description: 'Kartu Jakarta Plus untuk pelajar Jakarta dengan berbagai manfaat.',
    requirements: ['KTP orang tua/wali', 'Akta kelahiran siswa', 'Kartu Nisn', 'Foto siswa'],
    procedure: [
      'Daftar melalui sekolah',
      'Verifikasi data di合肥市',
      'Terima kartu KJP Plus',
    ],
    links: [{ name: 'Info KJP Plus', url: 'https://disdik.jakarta.go.id' }],
  },
  3: {
    title: 'KJM',
    desc: 'Kartu Jakarta Mahasiswa',
    icon: '📚',
    color: 'bg-purple-500',
    description: 'Bantuan biaya pendidikan untuk mahasiswa Jakarta.',
    requirements: ['KTP DKI Jakarta', 'Kartu mahasiswa', 'KRS semester terbaru', 'Rekening bank'],
    links: [{ name: 'Info KJM', url: 'https://dki jakarta.go.id' }],
  },
  11: {
    title: 'Puskesmas Jaksel',
    desc: 'Pusat Kesehatan Masyarakat',
    icon: '🏥',
    color: 'bg-red-400',
    description: 'Layanan kesehatan di Pusat Kesehatan Masyarakat Jakarta Selatan.',
    contact: [
      { name: 'Puskesmas Kec. Kebayoran Baru', value: '(021) 720-1234' },
      { name: 'Puskesmas Kec. Kebayoran Lama', value: '(021) 730-2345' },
      { name: 'Puskesmas Kec. Mampang Prapatan', value: '(021) 740-3456' },
      { name: 'Puskesmas Kec. Pancoran', value: '(021) 750-4567' },
      { name: 'Puskesmas Kec. Pasar Minggu', value: '(021) 760-5678' },
      { name: 'Puskesmas Kec. Pesanggrahan', value: '(021) 770-6789' },
      { name: 'Puskesmas Kec. Setiabudi', value: '(021) 780-7890' },
      { name: 'Puskesmas Kec. Tebet', value: '(021) 790-8901' },
    ],
  },
  16: {
    title: 'Cek ETLE',
    desc: 'Tilang Elektronik',
    icon: '📸',
    color: 'bg-blue-600',
    description: 'Cek tilang elektronik dan pembayaran tilang online.',
    links: [{ name: 'Cek ETLE', url: 'https://etle-policelink.polri.go.id' }],
  },
  17: {
    title: 'Pajak Kendaraan',
    desc: 'Cek & Bayar Pajak',
    icon: '🚗',
    color: 'bg-amber-600',
    description: 'Layanan cek dan pembayaran pajak kendaraan bermotor.',
    links: [
      { name: 'Samsat Online', url: 'https://samsat-pkb纳税' },
    ],
  },
  21: {
    title: 'MRT Jakarta',
    desc: 'Rute & Jadwal MRT',
    icon: '🚇',
    color: 'bg-red-500',
    description: 'Informasi rute, jadwal, dan tarif MRT Jakarta.',
    links: [{ name: 'Website MRT', url: 'https://jakartamrt.co.id' }],
  },
  22: {
    title: 'KRL',
    desc: 'Rute & Jadwal KRL',
    icon: '🚆',
    color: 'bg-blue-500',
    description: 'Informasi rute, jadwal, dan tarif KRL Commuterline.',
    links: [{ name: 'Website KRL', url: 'https://krl.co.id' }],
  },
  23: {
    title: 'TransJakarta',
    desc: 'Rute & Halte',
    icon: '🚌',
    color: 'bg-yellow-500',
    description: 'Informasi rute, halte, dan jadwal TransJakarta.',
    links: [{ name: 'Website TransJakarta', url: 'https://transjakarta.co.id' }],
  },
};

interface PageProps {
  params: { id: string };
}

export default function LayananDetailPage({ params }: PageProps) {
  const id = parseInt(params.id);
  const layanan = layananData[id];

  if (!layanan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Layanan Tidak Ditemukan</h1>
          <p className="text-gray-500 mb-4">Layanan yang Anda cari belum tersedia.</p>
          <Link href="/layanan" className="text-primary hover:underline">
            Kembali ke Daftar Layanan
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-100 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Link href="/layanan" className="p-2 hover:bg-gray-100 rounded-full">
            <ChevronLeft size={24} className="text-gray-600" />
          </Link>
          <h1 className="text-lg font-bold text-gray-900">{layanan.title}</h1>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Icon and Title */}
        <div className="bg-white rounded-2xl p-6 flex items-center gap-4">
          <div className={`w-16 h-16 ${layanan.color} rounded-2xl flex items-center justify-center text-3xl`}>
            {layanan.icon}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{layanan.title}</h2>
            <p className="text-gray-500">{layanan.desc}</p>
          </div>
        </div>

        {/* Description */}
        {layanan.description && (
          <div className="bg-white rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <Info size={20} className="text-gray-400" />
              <h3 className="font-semibold text-gray-900">Deskripsi</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">{layanan.description}</p>
          </div>
        )}

        {/* Requirements */}
        {layanan.requirements && layanan.requirements.length > 0 && (
          <div className="bg-white rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={20} className="text-gray-400" />
              <h3 className="font-semibold text-gray-900">Persyaratan</h3>
            </div>
            <ul className="space-y-2">
              {layanan.requirements.map((req, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-600">
                  <span className="text-primary mt-1">•</span>
                  {req}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Procedure */}
        {layanan.procedure && layanan.procedure.length > 0 && (
          <div className="bg-white rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <Clock size={20} className="text-gray-400" />
              <h3 className="font-semibold text-gray-900">Tata Cara</h3>
            </div>
            <ol className="space-y-3">
              {layanan.procedure.map((step, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className={`w-6 h-6 ${layanan.color} rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                    {index + 1}
                  </span>
                  <span className="text-gray-600 pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Contact */}
        {layanan.contact && layanan.contact.length > 0 && (
          <div className="bg-white rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <Phone size={20} className="text-gray-400" />
              <h3 className="font-semibold text-gray-900">Kontak</h3>
            </div>
            <div className="space-y-3">
              {layanan.contact.map((item, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <span className="text-gray-600">{item.name}</span>
                  <span className="font-medium text-gray-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Links */}
        {layanan.links && layanan.links.length > 0 && (
          <div className="space-y-3">
            {layanan.links.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white rounded-2xl p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900">{link.name}</span>
                <ExternalLink size={20} className="text-gray-400" />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
