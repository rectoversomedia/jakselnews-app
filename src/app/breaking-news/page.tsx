'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Heart, MessageCircle, Share2, User } from 'lucide-react';
import { SharePopup } from '@/components/SharePopup';

interface UGCReport {
  id: number;
  authorName: string;
  location: string;
  time: string;
  content: string;
  image?: string | null;
  likes: number;
  comments: number;
  shares: number;
}

const allUGCReports: UGCReport[] = [
  {
    id: 1,
    authorName: 'Warga Kemang',
    location: 'Kemang',
    time: '10 menit lalu',
    content: 'Air mulai pasang di Jl Kemang Raya arah Blok M. Tinggi air sudah 15cm. Masyarakat diminta waspada! 🌊',
    image: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800&q=80',
    likes: 24,
    comments: 8,
    shares: 5
  },
  {
    id: 2,
    authorName: 'Warga Blok M',
    location: 'Blok M',
    time: '25 menit lalu',
    content: 'Jalanan di Jl Radio Dalam mulai ramai nih, ada lampu merah mati. Hati-hati ya! 🚦',
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80',
    likes: 15,
    comments: 3,
    shares: 2
  },
  {
    id: 3,
    authorName: 'Warga Pasar Minggu',
    location: 'Pasar Minggu',
    time: '1 jam lalu',
    content: 'Baru lihat mobil ambulance lewat cepat banget. Semoga bukan hal yang buruk ya 🙏',
    image: null,
    likes: 8,
    comments: 1,
    shares: 0
  },
  {
    id: 4,
    authorName: 'Warga Cilandak',
    location: 'Cilandak',
    time: '2 jam lalu',
    content: 'Enaknya makan siang di mana ya? Yang open space gitu, bisa kerja sambil makan. Ada rekomendasi? 🍜',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80',
    likes: 42,
    comments: 12,
    shares: 3
  },
  {
    id: 5,
    authorName: 'Warga Lebak Bulus',
    location: 'Lebak Bulus',
    time: '3 jam lalu',
    content: 'MRT Lebak Bulus hari ini rame banget! Kayaknya karena ada event di ICE BSD nih. 🎉',
    image: 'https://images.unsplash.com/photo-1555899434-94d1368aa7af?w=800&q=80',
    likes: 31,
    comments: 5,
    shares: 8
  },
  {
    id: 6,
    authorName: 'Warga Tebet',
    location: 'Tebet',
    time: '4 jam lalu',
    content: 'Kafe baru di Tebet ini recommend banget! Suasananya cozy, kopi-nya enak, WiFi kenceng. Perfect buat kerja remote ☕💻',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=80',
    likes: 56,
    comments: 9,
    shares: 4
  },
  {
    id: 7,
    authorName: 'Warga SCBD',
    location: 'SCBD',
    time: '5 jam lalu',
    content: 'Lampu jalan di area SCBD mati dari kemarin. Semoga segera diperbaiki ya! 🌃',
    image: 'https://images.unsplash.com/photo-1517732306149-e8f829eb588a?w=800&q=80',
    likes: 19,
    comments: 4,
    shares: 2
  },
  {
    id: 8,
    authorName: 'Warga Kuningan',
    location: 'Kuningan',
    time: '6 jam lalu',
    content: 'Festival Jaksel 2026 hari ini rame banget! Banyak makanan enak dan budaya menarik. Worth it untuk dikunjungi! 🎪✨',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80',
    likes: 78,
    comments: 15,
    shares: 22
  }
];

function UGCCard({ report }: { report: UGCReport }) {
  const [likes, setLikes] = useState(report.likes);
  const [isLiked, setIsLiked] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const handleLike = () => {
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
    setIsLiked(!isLiked);
  };

  const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://jakselnews.com'}/breaking-news/${report.id}`;
  const shareTitle = `${report.authorName}: ${report.content.substring(0, 50)}...`;

  return (
    <>
      <div className="bg-white rounded-xl overflow-hidden shadow-sm mb-4">
        {/* Author */}
        <div className="flex items-center gap-3 p-4">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <User size={24} className="text-gray-500" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900">{report.authorName}</p>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <MapPin size={14} />
              {report.location} • {report.time}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 pb-3">
          <p className="text-gray-700 leading-relaxed">{report.content}</p>
        </div>

        {/* Image - Using Next.js Image */}
        {report.image && (
          <div className="aspect-video relative">
            <Image
              src={report.image}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-around py-4 px-4 border-t border-gray-100">
          <button onClick={handleLike} className={`flex items-center gap-2 transition-colors ${isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}>
            <Heart size={22} fill={isLiked ? 'currentColor' : 'none'} />
            <span className="text-sm font-medium">{likes}</span>
          </button>
          <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors">
            <MessageCircle size={22} />
            <span className="text-sm font-medium">{report.comments}</span>
          </button>
          <button onClick={() => setIsShareOpen(true)} className="flex items-center gap-2 text-gray-500 hover:text-green-500 transition-colors">
            <Share2 size={22} />
            <span className="text-sm font-medium">{report.shares}</span>
          </button>
        </div>
      </div>

      <SharePopup isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} url={shareUrl} title={shareTitle} />
    </>
  );
}

export default function BreakingNewsPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-100 sticky top-0 z-30">
        <h1 className="text-xl font-bold text-gray-900">Info Terkini</h1>
        <p className="text-sm text-gray-500">Laporan dari warga Jakarta Selatan</p>
      </div>

      {/* UGC Feed */}
      <div className="px-4 py-4">
        {allUGCReports.map((report) => (
          <UGCCard key={report.id} report={report} />
        ))}
      </div>
    </div>
  );
}
