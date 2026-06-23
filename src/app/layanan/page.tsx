import Link from 'next/link';

const layananJaksel = [
  // Bantuan Sosial
  { id: 1, title: 'Cek Bansos', desc: 'Cek penerima bantuan', icon: '💰', color: 'bg-emerald-500' },
  { id: 2, title: 'KJP Plus', desc: 'Kartu Jakarta Plus', icon: '🎓', color: 'bg-violet-500' },
  { id: 3, title: 'KJM', desc: 'Kartu Jakarta Mahasiswa', icon: '📚', color: 'bg-purple-500' },
  { id: 4, title: 'KIP Kuliah', desc: 'Bantuan Kuliah', icon: '🎒', color: 'bg-indigo-500' },
  { id: 5, title: 'PKH', desc: 'Program Keluarga Harapan', icon: '👨‍👩‍👧', color: 'bg-teal-500' },
  { id: 6, title: 'BPNT', desc: 'Bantuan Pangan', icon: '🍽️', color: 'bg-orange-500' },
  { id: 7, title: 'BLT DD', desc: 'Bantuan Tunai', icon: '🏘️', color: 'bg-amber-500' },
  { id: 8, title: 'Indonesia Pintar', desc: 'Bantuan Pendidikan', icon: '🌟', color: 'bg-yellow-500' },
  { id: 9, title: 'Bebas Tanggungan', desc: 'Bebas Sekolah', icon: '📜', color: 'bg-blue-500' },
  { id: 10, title: 'RTLH', desc: 'Rumah Tidak Layak', icon: '🏠', color: 'bg-red-500' },

  // Kesehatan
  { id: 11, title: 'Puskesmas Jaksel', desc: 'Pusat Kesehatan', icon: '🏥', color: 'bg-red-400' },
  { id: 12, title: 'RS Jakarta', desc: 'Rumah Sakit', icon: '🏨', color: 'bg-pink-500' },
  { id: 13, title: 'Jaksel Sehat', desc: 'Kartu Sehat', icon: '💊', color: 'bg-rose-500' },
  { id: 14, title: 'Donor Darah', desc: 'Jadwal Donor', icon: '🩸', color: 'bg-red-600' },
  { id: 15, title: 'Ambulans', desc: 'Layanan Darurat', icon: '🚑', color: 'bg-red-500' },

  // Kendaraan
  { id: 16, title: 'Cek ETLE', desc: 'Tilang Elektronik', icon: '📸', color: 'bg-blue-600' },
  { id: 17, title: 'Pajak Kendaraan', desc: 'Cek & Bayar', icon: '🚗', color: 'bg-amber-600' },
  { id: 18, title: 'Samsat', desc: 'Layanan Samsat', icon: '🏛️', color: 'bg-blue-700' },
  { id: 19, title: 'SIM', desc: 'Perpanjang SIM', icon: '🪪', color: 'bg-red-600' },
  { id: 20, title: 'Uji Emisi', desc: 'Cek Emisi', icon: '🌿', color: 'bg-green-600' },

  // Transportasi
  { id: 21, title: 'MRT', desc: 'Rute & Jadwal MRT', icon: '🚇', color: 'bg-red-500' },
  { id: 22, title: 'KRL', desc: 'Rute & Jadwal KRL', icon: '🚆', color: 'bg-blue-500' },
  { id: 23, title: 'TransJakarta', desc: 'Rute & Halte', icon: '🚌', color: 'bg-yellow-500' },
  { id: 24, title: 'LRT', desc: 'Rute & Jadwal LRT', icon: '🚝', color: 'bg-cyan-500' },
  { id: 25, title: 'JakLingko', desc: 'Integrasi Angkutan', icon: '🗺️', color: 'bg-green-500' },

  // Kecamatan & Kelurahan
  { id: 26, title: 'KUA', desc: 'KUA Kecamatan', icon: '🏢', color: 'bg-slate-600' },
  { id: 27, title: 'Kelurahan', desc: 'Layanan Kelurahan', icon: '📋', color: 'bg-gray-600' },
  { id: 28, title: 'Kecamatan', desc: 'Layanan Kecamatan', icon: '🏗️', color: 'bg-zinc-600' },
  { id: 29, title: 'RPTRA', desc: 'Taman Bermain', icon: '🎪', color: 'bg-pink-400' },
  { id: 30, title: 'Sanggar Seni', desc: 'Seni & Budaya', icon: '🎭', color: 'bg-purple-400' },

  // Lainnya
  { id: 31, title: 'Cuaca', desc: 'Info Cuaca', icon: '🌤️', color: 'bg-amber-400' },
  { id: 32, title: 'Banjir', desc: 'Info Banjir', icon: '🌊', color: 'bg-blue-400' },
  { id: 33, title: 'Listrik', desc: 'Cek Tagihan', icon: '💡', color: 'bg-yellow-500' },
  { id: 34, title: 'Air', desc: 'Perumda Air', icon: '🚰', color: 'bg-blue-500' },
  { id: 35, title: 'Gas', desc: 'PGN Gas', icon: '🔥', color: 'bg-orange-500' },
  { id: 36, title: 'Internet', desc: 'Provider Internet', icon: '📶', color: 'bg-indigo-500' },
  { id: 37, title: 'Pasar', desc: 'Info Pasar', icon: '🏪', color: 'bg-green-600' },
  { id: 38, title: 'Parkir', desc: 'Zona Parkir', icon: '🅿️', color: 'bg-gray-500' },
  { id: 39, title: 'Sampah', desc: 'Layanan Sampah', icon: '🗑️', color: 'bg-green-500' },
  { id: 40, title: 'Datun', desc: 'Layanan Hukum', icon: '⚖️', color: 'bg-slate-700' },
];

export default function LayananPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white px-4 py-4 border-b border-gray-100">
        <h1 className="text-xl font-bold text-gray-900 mb-1">Layanan Publik</h1>
        <p className="text-sm text-gray-500">Layanan warga Jakarta Selatan</p>
      </div>

      <div className="bg-white px-4 py-3 border-b border-gray-100 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          <button className="px-4 py-2 bg-primary text-white rounded-full text-sm font-medium">Semua</button>
          <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">Bansos</button>
          <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">Kesehatan</button>
          <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">Kendaraan</button>
          <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">Transportasi</button>
        </div>
      </div>

      <div className="px-4 py-4">
        <div className="grid grid-cols-2 gap-3">
          {layananJaksel.map((item) => (
            <Link
              key={item.id}
              href={"/layanan/" + item.id}
              className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center"
            >
              <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center text-2xl mb-2`}>
                {item.icon}
              </div>
              <h4 className="font-semibold text-gray-900 text-sm">{item.title}</h4>
              <p className="text-[10px] text-gray-500 mt-0.5">{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
