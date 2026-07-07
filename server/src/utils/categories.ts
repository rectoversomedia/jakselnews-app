// Category keywords for auto-categorization
export const categoryKeywords: Record<string, string[]> = {
  'keamanan': [
    'rampok', 'curat', 'curanmor', 'pencurian', 'perampokan', 'maling',
    'kejadian', 'kriminal', 'polisi', 'tabligh', 'teror', 'begal',
    'penyalahgunaan', 'preman', 'geng', 'tawuran', 'pencopet', 'otnak'
  ],
  'lalu-lintas': [
    'macet', 'lalu lintas', 'kemacetan', 'laka', 'kecelakaan', 'tabrakan',
    'arus balik', 'one way', 'lalin', 'parkir', 'lampu merah', 'tilang'
  ],
  'banjir': [
    'banjir', 'genangan', 'air', 'tenggelam', 'kali meluap', 'drainase',
    'luapan', 'posko', 'sungai', ' IRB', 'pompa', 'anjir'
  ],
  'kebakaran': [
    'kebakaran', 'api', 'bakar', 'haus', 'asap', 'kobar', 'merembet', 'kebakar',
    'hangus', 'flame', 'fire'
  ],
  'penerangan': [
    'lampu jalan', 'penerangan', 'dlp', 'tiang listrik', 'pju', 'gelap',
    'dlp mati', 'lampu mati', 'straat', 'pencahayaan'
  ],
  'lingkungan': [
    'sampah', 'bau', 'limbah', 'illegal', 'felling', 'pohon tumbang',
    'penebangan', 'tumpukan', 'bersih', 'hijau', 'ruang terbuka'
  ],
  'kemacetan': [
    'macet parah', 'lalin', 'pengalihan', 'demonstrasi', 'unras', 'tolak',
    'demo', 'kerumunan', 'penutupan', 'one way', 'g一项'
  ],
  'jalan-rusak': [
    'jalan rusak', 'lubang', 'bolong', 'retak', 'kerusakan jalan',
    '坑洼', '坑洞', 'aspal', 'trotoar', 'pedestrian'
  ],
  'kriminal': [
    'penyalahgunaan', 'narkoba', 'balap liar', 'preman', 'geng', 'tawuran',
    'begal', 'ojek', 'judi', 'prostitusi', 'perdagangan', '神仙'
  ],
  'sampah': [
    'tumpukan sampah', 'ps2', 'tpa', 'buang sampah', 'bau sampah',
    'limbah', 'dump', 'waste', 'trash', 'dbdm', 'sampah menumpuk'
  ],
  'fenomena': [
    'langka', 'unusual', 'aneh', 'viral', 'fenomena', 'spesial',
    'istimewa', 'rare', 'unique', 'luar biasa'
  ],
  'lainnya': [
    'lain', 'other', 'varian', 'misc', 'lainnya', 'berbeda', 'umum'
  ]
};

// Jakarta Selatan neighborhoods
export const kecamatanList = [
  'Cilandak',
  'Jagakarsa',
  'Kebayoran Baru',
  'Kebayoran Lama',
  'Mampang Prapatan',
  'Pancoran',
  'Pasar Minggu',
  'Pesanggrahan',
  'Setiabudi',
  'Tebet',
];

export const kelurahanMap: Record<string, string[]> = {
  'Cilandak': ['Cilandak Barat', 'Cipete Selatan', 'Gandaria Selatan', 'Lebak Bulus', 'Pondok Labu'],
  'Jagakarsa': [' Cigudeg', 'Jatisampurna', 'Kedoya Utara', 'Kedoya Selatan', 'Sukma Bangsa'],
  'Kebayoran Baru': ['Senayan', 'Gugus Puri', 'Melawai', 'Kramat Pela', 'Pulo'],
  'Kebayoran Lama': ['Cipulir', 'Grogol Selatan', 'Grogol Utara', 'Kebuayan', 'Pondok Pinang'],
  'Mampang Prapatan': ['Bangunan', 'Daan Mogot', 'Kemang Timur', 'Mampang Prapatan', 'Tegalan'],
  'Pancoran': ['Kalibata', 'Pancoran', 'Rawa Jati', 'Duren Tiga', 'Pengadegan'],
  'Pasar Minggu': ['Cilandak Barat', 'Jati Padang', 'Kebagusan', 'Pasar Minggu', 'Ragunan'],
  'Pesanggrahan': ['Bintaro', 'Giri', 'Kedaung', 'Pesanggrahan', 'Selong'],
  'Setiabudi': ['(Setiabudi Utara', 'Gega', 'Karet', 'Kuningan', 'Menteng'],
  'Tebet': ['Tebet Barat', 'Tebet Timur', 'Keb Baru', 'Bukit Duri', 'Manggarai'],
};

// Report statuses
export const reportStatuses = [
  { value: 'pending', label: 'Baru', color: '#F59E0B', bgColor: 'rgba(245, 158, 11, 0.15)' },
  { value: 'verified', label: 'Terverifikasi', color: '#3B82F6', bgColor: 'rgba(59, 130, 246, 0.15)' },
  { value: 'processing', label: 'Diproses', color: '#8B5CF6', bgColor: 'rgba(139, 92, 246, 0.15)' },
  { value: 'resolved', label: 'Selesai', color: '#10B981', bgColor: 'rgba(16, 185, 129, 0.15)' },
  { value: 'rejected', label: 'Ditolak', color: '#EF4444', bgColor: 'rgba(239, 68, 68, 0.15)' },
];

// Report types/categories
export const reportCategories = [
  { id: 'keamanan', name: 'Keamanan', icon: 'shield-warning', color: '#EF4444', bgColor: 'rgba(239, 68, 68, 0.15)' },
  { id: 'lalu-lintas', name: 'Lalu Lintas', icon: 'traffic-cone', color: '#F59E0B', bgColor: 'rgba(245, 158, 11, 0.15)' },
  { id: 'banjir', name: 'Banjir', icon: 'cloud-rain', color: '#3B82F6', bgColor: 'rgba(59, 130, 246, 0.15)' },
  { id: 'kebakaran', name: 'Kebakaran', icon: 'flame', color: '#F97316', bgColor: 'rgba(249, 115, 22, 0.15)' },
  { id: 'penerangan', name: 'Penerangan', icon: 'lightbulb', color: '#EAB308', bgColor: 'rgba(234, 179, 8, 0.15)' },
  { id: 'lingkungan', name: 'Lingkungan', icon: 'tree', color: '#10B981', bgColor: 'rgba(16, 185, 129, 0.15)' },
  { id: 'kemacetan', name: 'Kemacetan', icon: 'car', color: '#D97706', bgColor: 'rgba(217, 119, 6, 0.15)' },
  { id: 'jalan-rusak', name: 'Jalan Rusak', icon: 'road-horizon', color: '#CA8A04', bgColor: 'rgba(202, 138, 4, 0.15)' },
  { id: 'kriminal', name: 'Kriminal', icon: 'user', color: '#DC2626', bgColor: 'rgba(220, 38, 38, 0.15)' },
  { id: 'sampah', name: 'Sampah', icon: 'trash', color: '#059669', bgColor: 'rgba(5, 150, 105, 0.15)' },
  { id: 'fenomena', name: 'Fenomena', icon: 'eye', color: '#7C3AED', bgColor: 'rgba(124, 58, 237, 0.15)' },
  { id: 'lainnya', name: 'Lainnya', icon: 'dots-three', color: '#6B7280', bgColor: 'rgba(107, 114, 128, 0.15)' },
];

// Auto-categorization function
export function autoCategorize(description: string): string {
  const lowerDesc = description.toLowerCase();
  let bestMatch = { category: 'lainnya', score: 0 };

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (category === 'lainnya') continue; // Skip default

    let matchCount = 0;
    for (const keyword of keywords) {
      if (lowerDesc.includes(keyword.toLowerCase())) {
        matchCount++;
      }
    }
    const score = matchCount / keywords.length;

    if (score > bestMatch.score && score > 0.02) { // 2% threshold
      bestMatch = { category, score };
    }
  }

  return bestMatch.category;
}
