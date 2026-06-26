import Link from 'next/link';

// Colorful Phosphor-style Icons - just the icon, no colored box
const BansosIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-emerald-500" stroke="currentColor" strokeWidth={1.5}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v12M9 9h6M9 15h6" />
  </svg>
);

const KJPPlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-violet-500" stroke="currentColor" strokeWidth={1.5}>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M7 8h10M7 12h6M7 16h4" />
  </svg>
);

const KJMIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-purple-500" stroke="currentColor" strokeWidth={1.5}>
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c0 1.657 2.686 3 6 3s6-1.343 6-3v-5" />
  </svg>
);

const KIPIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-indigo-500" stroke="currentColor" strokeWidth={1.5}>
    <rect x="2" y="6" width="20" height="12" rx="2" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const PKHIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-teal-500" stroke="currentColor" strokeWidth={1.5}>
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
  </svg>
);

const BPNTIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-orange-500" stroke="currentColor" strokeWidth={1.5}>
    <path d="M3 3h18v18H3zM3 9h18M3 15h18M9 3v18M15 3v18" />
  </svg>
);

const BLTIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-amber-500" stroke="currentColor" strokeWidth={1.5}>
    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
  </svg>
);

const IndonesiaPintarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-yellow-500" stroke="currentColor" strokeWidth={1.5}>
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
  </svg>
);

const BebasTanggunganIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-blue-500" stroke="currentColor" strokeWidth={1.5}>
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14,2 14,8 20,8" />
    <path d="M9 15l2 2 4-4" />
  </svg>
);

const RTLHIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-red-500" stroke="currentColor" strokeWidth={1.5}>
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    <polyline points="9,22 9,12 15,12 15,22" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const PuskesmasIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-red-400" stroke="currentColor" strokeWidth={1.5}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M12 8v8M8 12h8" />
  </svg>
);

const RSJakartaIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-pink-500" stroke="currentColor" strokeWidth={1.5}>
    <path d="M3 21h18M5 21V7l7-4 7 4v14" />
    <path d="M9 21v-6h6v6M9 9h.01M15 9h.01M9 13h.01M15 13h.01" />
  </svg>
);

const JakselSehatIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-rose-500" stroke="currentColor" strokeWidth={1.5}>
    <path d="M19.5 12.572l-7.5 7.428l-7.5-7.428A5 5 0 117.5 6.572a5 5 0 0112 0z" />
  </svg>
);

const DonorDarahIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-red-600" stroke="currentColor" strokeWidth={1.5}>
    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2S2 6.477 2 12s4.477 10 10 10z" />
    <path d="M12 6v6l4 2" />
  </svg>
);

const AmbulansIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-red-500" stroke="currentColor" strokeWidth={1.5}>
    <rect x="3" y="8" width="18" height="10" rx="2" />
    <path d="M12 8V5a2 2 0 00-2-2H3M12 8a2 2 0 012-2h3l2 2h6" />
    <circle cx="7" cy="18" r="2" />
    <circle cx="17" cy="18" r="2" />
  </svg>
);

const CekETLEIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-blue-600" stroke="currentColor" strokeWidth={1.5}>
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <circle cx="12" cy="12" r="3" />
    <path d="M6 9l3 3-3 3" />
  </svg>
);

const PajakKendIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-amber-600" stroke="currentColor" strokeWidth={1.5}>
    <rect x="3" y="8" width="18" height="10" rx="2" />
    <circle cx="7" cy="18" r="2" />
    <circle cx="17" cy="18" r="2" />
    <path d="M5 8h14" />
  </svg>
);

const SamsatIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-blue-700" stroke="currentColor" strokeWidth={1.5}>
    <path d="M3 21h18M3 7v14M21 7v14M6 7V4a1 1 0 011-1h10a1 1 0 011 1v3M12 12v9M8 12v9M16 12v9" />
  </svg>
);

const SIMIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-red-600" stroke="currentColor" strokeWidth={1.5}>
    <rect x="4" y="2" width="16" height="20" rx="2" />
    <circle cx="12" cy="10" r="3" />
    <path d="M8 16h8" />
  </svg>
);

const UjiEmisiIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-green-600" stroke="currentColor" strokeWidth={1.5}>
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    <circle cx="12" cy="12" r="4" />
  </svg>
);

const MRTIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-red-500" stroke="currentColor" strokeWidth={1.5}>
    <rect x="4" y="3" width="16" height="14" rx="2" />
    <path d="M4 17h16M8 21h8M9 14h.01M15 14h.01" />
    <path d="M12 7v3" />
  </svg>
);

const KRLIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-blue-500" stroke="currentColor" strokeWidth={1.5}>
    <rect x="4" y="3" width="16" height="14" rx="2" />
    <circle cx="8" cy="17" r="2" />
    <circle cx="16" cy="17" r="2" />
    <path d="M4 11h16" />
  </svg>
);

const TransJakartaIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-yellow-500" stroke="currentColor" strokeWidth={1.5}>
    <rect x="3" y="4" width="18" height="13" rx="2" />
    <circle cx="7" cy="17" r="2" />
    <circle cx="17" cy="17" r="2" />
    <path d="M14 8h2" />
  </svg>
);

const LRTIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-cyan-500" stroke="currentColor" strokeWidth={1.5}>
    <rect x="4" y="5" width="16" height="12" rx="2" />
    <path d="M4 12h16M8 5v12" />
  </svg>
);

const KUAIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-slate-600" stroke="currentColor" strokeWidth={1.5}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M9 9h6v6H9z" />
  </svg>
);

const KelurahanIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-gray-600" stroke="currentColor" strokeWidth={1.5}>
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    <polyline points="9,22 9,12 15,12 15,22" />
  </svg>
);

const KecamatanIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-zinc-600" stroke="currentColor" strokeWidth={1.5}>
    <rect x="3" y="8" width="7" height="8" />
    <rect x="14" y="8" width="7" height="8" />
    <rect x="7" y="3" width="10" height="5" />
  </svg>
);

const RPTRAIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-pink-400" stroke="currentColor" strokeWidth={1.5}>
    <circle cx="12" cy="8" r="5" />
    <path d="M3 21v-2a7 7 0 0114 0v2" />
  </svg>
);

const CuacaIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-amber-400" stroke="currentColor" strokeWidth={1.5}>
    <circle cx="12" cy="12" r="5" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
);

const BanjirIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-blue-400" stroke="currentColor" strokeWidth={1.5}>
    <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
  </svg>
);

const ListrikIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-yellow-500" stroke="currentColor" strokeWidth={1.5}>
    <polygon points="13,2 3,14 12,14 11,22 21,10 12,10" />
  </svg>
);

const AirIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-blue-500" stroke="currentColor" strokeWidth={1.5}>
    <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
  </svg>
);

const GasIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-orange-500" stroke="currentColor" strokeWidth={1.5}>
    <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6.5 6.5c0 2.5 2 5 6.5 5a2.5 2.5 0 002.5-2.5" />
  </svg>
);

const InternetIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-indigo-500" stroke="currentColor" strokeWidth={1.5}>
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
  </svg>
);

const PasarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-green-600" stroke="currentColor" strokeWidth={1.5}>
    <path d="M3 9l2.5-7h13L21 9M3 9v11a1 1 0 001 1h16a1 1 0 001-1V9M3 9h18M9 21V9M15 21V9" />
  </svg>
);

const ParkirIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-gray-500" stroke="currentColor" strokeWidth={1.5}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M9 17V7h4a3 3 0 010 6H9" />
  </svg>
);

const SampahIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-green-500" stroke="currentColor" strokeWidth={1.5}>
    <polyline points="3,6 5,6 21,6" />
    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
  </svg>
);

const DatunIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-slate-700" stroke="currentColor" strokeWidth={1.5}>
    <path d="M12 3l9 4.5v9L12 21l-9-4.5v-9L12 3z" />
    <path d="M12 12l9-4.5M12 12v9M12 12L3 7.5" />
  </svg>
);

const layananJaksel = [
  { id: 1, title: 'Cek Bansos', desc: 'Bantuan sosial', icon: <BansosIcon /> },
  { id: 2, title: 'KJP Plus', desc: 'Kartu Jakarta Plus', icon: <KJPPlusIcon /> },
  { id: 3, title: 'KJM', desc: 'Mahasiswa', icon: <KJMIcon /> },
  { id: 4, title: 'KIP Kuliah', desc: 'Pendidikan', icon: <KIPIcon /> },
  { id: 5, title: 'PKH', desc: 'Keluarga', icon: <PKHIcon /> },
  { id: 6, title: 'BPNT', desc: 'Pangan', icon: <BPNTIcon /> },
  { id: 7, title: 'BLT DD', desc: 'Bantuan Tunai', icon: <BLTIcon /> },
  { id: 8, title: 'Indonesia Pintar', desc: 'Pendidikan', icon: <IndonesiaPintarIcon /> },
  { id: 9, title: 'Bebas Tanggungan', desc: 'Sekolah', icon: <BebasTanggunganIcon /> },
  { id: 10, title: 'RTLH', desc: 'Rumah', icon: <RTLHIcon /> },
  { id: 11, title: 'Puskesmas', desc: 'Kesehatan', icon: <PuskesmasIcon /> },
  { id: 12, title: 'RS Jakarta', desc: 'Rumah Sakit', icon: <RSJakartaIcon /> },
  { id: 13, title: 'Jaksel Sehat', desc: 'Kartu Sehat', icon: <JakselSehatIcon /> },
  { id: 14, title: 'Donor Darah', desc: 'Jadwal', icon: <DonorDarahIcon /> },
  { id: 15, title: 'Ambulans', desc: 'Darurat', icon: <AmbulansIcon /> },
  { id: 16, title: 'Cek ETLE', desc: 'Tilang', icon: <CekETLEIcon /> },
  { id: 17, title: 'Pajak Kend', desc: 'Cek & Bayar', icon: <PajakKendIcon /> },
  { id: 18, title: 'Samsat', desc: 'Layanan', icon: <SamsatIcon /> },
  { id: 19, title: 'SIM', desc: 'Perpanjang', icon: <SIMIcon /> },
  { id: 20, title: 'Uji Emisi', desc: 'Cek Emisi', icon: <UjiEmisiIcon /> },
  { id: 21, title: 'MRT', desc: 'Rute & Jadwal', icon: <MRTIcon /> },
  { id: 22, title: 'KRL', desc: 'Rute & Jadwal', icon: <KRLIcon /> },
  { id: 23, title: 'TransJakarta', desc: 'Rute & Halte', icon: <TransJakartaIcon /> },
  { id: 24, title: 'LRT', desc: 'Rute & Jadwal', icon: <LRTIcon /> },
  { id: 25, title: 'KUA', desc: 'KUA Kec.', icon: <KUAIcon /> },
  { id: 26, title: 'Kelurahan', desc: 'Layanan', icon: <KelurahanIcon /> },
  { id: 27, title: 'Kecamatan', desc: 'Layanan', icon: <KecamatanIcon /> },
  { id: 28, title: 'RPTRA', desc: 'Taman', icon: <RPTRAIcon /> },
  { id: 29, title: 'Cuaca', desc: 'Info', icon: <CuacaIcon /> },
  { id: 30, title: 'Banjir', desc: 'Info', icon: <BanjirIcon /> },
  { id: 31, title: 'Listrik', desc: 'Tagihan', icon: <ListrikIcon /> },
  { id: 32, title: 'Air', desc: 'Perumda', icon: <AirIcon /> },
  { id: 33, title: 'Gas', desc: 'PGN', icon: <GasIcon /> },
  { id: 34, title: 'Internet', desc: 'Provider', icon: <InternetIcon /> },
  { id: 35, title: 'Pasar', desc: 'Info', icon: <PasarIcon /> },
  { id: 36, title: 'Parkir', desc: 'Zona', icon: <ParkirIcon /> },
  { id: 37, title: 'Sampah', desc: 'Layanan', icon: <SampahIcon /> },
  { id: 38, title: 'Datun', desc: 'Hukum', icon: <DatunIcon /> },
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
        <div className="grid grid-cols-4 gap-2">
          {layananJaksel.map((item) => (
            <Link
              key={item.id}
              href={"/layanan/" + item.id}
              className="bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 flex items-center justify-center mb-1.5">
                {item.icon}
              </div>
              <h4 className="font-semibold text-gray-900 text-xs leading-tight">{item.title}</h4>
              <p className="text-[9px] text-gray-500 mt-0.5 leading-tight">{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
