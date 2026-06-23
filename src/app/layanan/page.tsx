import Link from 'next/link';

const layananJaksel = [
  // Bantuan Sosial
  { id: 1, title: 'Cek Bansos', desc: 'Cek penerima bantuan sosial', icon: '💰', color: 'bg-emerald-500' },
  { id: 2, title: 'KJP Plus', desc: 'Cek saldo KJP Plus', icon: '🎓', color: 'bg-violet-500' },
  { id: 3, title: 'KJM Jakarta', desc: 'Kartu Jakarta Mahasiswa', icon: '📚', color: 'bg-purple-500' },
  { id: 4, title: 'KIP Kuliah', desc: 'Bantuan KIP Kuliah', icon: '🎒', color: 'bg-indigo-500' },
  { id: 5, title: 'PKH', desc: 'Program Keluarga Harapan', icon: '👨‍👩‍👧', color: 'bg-teal-500' },
  { id: 6, title: 'BPNT', desc: 'Bantuan Pangan Non Tunai', icon: '🍽️', color: 'bg-orange-500' },
  { id: 7, title: 'BLT DD', desc: 'Bantuan Tunai Dana Desa', icon: '🏘️', color: 'bg-amber-500' },
  { id: 8, title: 'RTLH', desc: 'Rumah Tidak Layak Huni', icon: '🏠', color: 'bg-red-500' },
  { id: 9, title: 'BebasTanggungan', desc: 'Bebas Tanggungan Sekolah', icon: '📜', color: 'bg-blue-500' },
  { id: 10, title: 'Indonesia Pintar', desc: 'Bantuan Pendidikan', icon: '🌟', color: 'bg-yellow-500' },

  // Kendaraan
  { id: 11, title: 'Cek ETLE', desc: 'Tilang Elektronik', icon: '📸', color: 'bg-blue-600' },
  { id: 12, title: 'Pajak Kendaraan', desc: 'Cek & Bayar Pajak', icon: '🚗', color: 'bg-amber-600' },
  { id: 13, title: 'Samsat', desc: 'Layanan Samsat', icon: '🏛️', color: 'bg-blue-700' },
  { id: 14, title: 'Uji Emisi', desc: 'Cek Emisi Kendaraan', icon: '🌿', color: 'bg-green-600' },
  { id: 15, title: 'Perpanjang SIM', desc: 'Info Perpanjang SIM', icon: '🪪', color: 'bg-red-600' },

  // Transportasi
  { id: 16, title: 'MRT Jakarta', desc: 'Rute & Jadwal MRT', icon: '🚇', color: 'bg-red-500' },
  { id: 17, title: 'KRL', desc: 'Rute & Jadwal KRL', icon: '🚆', color: 'bg-blue-500' },
  { id: 18, title: 'TransJakarta', desc: 'Rute & Halte', icon: '🚌', color: 'bg-yellow-500' },
  { id: 19, title: 'LRT Jakarta', desc: 'Rute & Jadwal LRT', icon: '🚝', color: 'bg-cyan-500' },
  { id: 20, title: 'JakLingko', desc: 'Integrasi Angkutan', icon: '🗺️', color: 'bg-green-500' },
];

export default function LayananPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-100">
        <h1 className="text-xl font-bold text-gray-900 mb-1">Layanan Publik</h1>
        <p className="text-sm text-gray-500">Layanan warga Jakarta</p>
      </div>

      {/* Kategori */}
      <div className="bg-white px-4 py-3 border-b border-gray-100 overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          <button className="px-4 py-2 bg-primary text-white rounded-full text-sm font-medium">
            Semua
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-200">
            Bantuan Sosial
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-200">
            Kendaraan
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-200">
            Transportasi
          </button>
        </div>
      </div>

      {/* Grid Layanan - 2 columns */}
      <div className="px-4 py-4">
        <div className="grid grid-cols-2 gap-3">
          {layananJaksel.map((layanan) => (
            <Link
              key={layanan.id}
              href={`/layanan/${layanan.id}`}
              className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center"
            >
              <div className={`w-12 h-12 ${layanan.color} rounded-xl flex items-center justify-center text-2xl mb-2`}>
                {layanan.icon}
              </div>
              <h4 className="font-semibold text-gray-900 text-sm">{layanan.title}</h4>
              <p className="text-[10px] text-gray-500 mt-0.5">{layanan.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
