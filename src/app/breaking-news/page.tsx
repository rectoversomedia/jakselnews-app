'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  PhMapPin,
  PhHeart,
  PhChatCircle,
  PhShareNetwork,
  PhSpinner,
} from '@phosphor-icons/react';
import { SharePopup } from '@/components/SharePopup';
import { CommentsSection } from '@/components/UGCPost';

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
  },
  {
    id: 9,
    authorName: 'Warga Cipete',
    location: 'Cipete',
    time: '7 jam lalu',
    content: 'Parkir di sepanjang Jl Cipete Raya penuh banget nih! Kalo mau ke sini saranku pake motor aja. 🏍️',
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80',
    likes: 35,
    comments: 7,
    shares: 3
  },
  {
    id: 10,
    authorName: 'Warga Gandaria',
    location: 'Gandaria',
    time: '8 jam lalu',
    content: 'Ada yang tau restoran baru di Gandaria? Buka jam berapa ya? Mau rendezvous sama temen. 🍽️',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
    likes: 28,
    comments: 5,
    shares: 2
  },
  {
    id: 11,
    authorName: 'Warga Kemang',
    location: 'Kemang',
    time: '9 jam lalu',
    content: 'Baru aja turun hujan deras di Kemang. Semoga ga banjir ya! 🌧️',
    image: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800&q=80',
    likes: 45,
    comments: 12,
    shares: 6
  },
  {
    id: 12,
    authorName: 'Warga Blok M',
    location: 'Blok M',
    time: '10 jam lalu',
    content: 'Malam minggu di Blok M rame parah! Tapi lampu traffict light mati di pertigaan. 🚥',
    image: null,
    likes: 22,
    comments: 3,
    shares: 1
  }
];

// More reports for infinite scroll simulation
const moreReports: UGCReport[] = [
  {
    id: 13,
    authorName: 'Warga Bintaro',
    location: 'Bintaro',
    time: '11 jam lalu',
    content: 'KRL Bintaro arah Tanah Abang rame banget di jam ini. Kalo bisa hindari jam 5-7 malam ya! 🚆',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
    likes: 18,
    comments: 2,
    shares: 1
  },
  {
    id: 14,
    authorName: 'Warga Senayan',
    location: 'Senayan',
    time: '12 jam lalu',
    content: 'Ada konser di GBK malam ini, jadi macet parah di sekitar Senayan. Hati-hati ya! 🎤',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
    likes: 52,
    comments: 8,
    shares: 15
  },
  {
    id: 15,
    authorName: 'Warga Pondok Indah',
    location: 'Pondok Indah',
    time: '13 jam lalu',
    content: 'Mall Pondok Indah weekend ini promo gede banget! Sale up to 70% 🎉🛍️',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
    likes: 89,
    comments: 20,
    shares: 35
  },
  {
    id: 16,
    authorName: 'Warga Cilandak',
    location: 'Cilandak',
    time: '14 jam lalu',
    content: 'Pasar Rebo ada bazar книга makanan enak-enak. Cobain deh! 🍜',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
    likes: 33,
    comments: 6,
    shares: 4
  },
  {
    id: 17,
    authorName: 'Warga Manggarai',
    location: 'Manggarai',
    time: '15 jam lalu',
    content: 'Stasiun Manggarai lagi perbaikan. Ada yang informasi kapan selesai? 🚉',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
    likes: 25,
    comments: 4,
    shares: 2
  },
  {
    id: 18,
    authorName: 'Warga Kebayoran',
    location: 'Kebayoran',
    time: '16 jam lalu',
    content: 'Jalan Kebayoran Baru udah mulus sekarang! Makasih pak Jokowi! 😂',
    image: null,
    likes: 41,
    comments: 9,
    shares: 3
  },
  {
    id: 19,
    authorName: 'Warga Melawai',
    location: 'Melawai',
    time: '17 jam lalu',
    content: 'Hotel di Melawai lengkap bgt! Meeting weekend yuk在这里! 🏨',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
    likes: 19,
    comments: 3,
    shares: 1
  },
  {
    id: 20,
    authorName: 'Warga Cipete',
    location: 'Cipete',
    time: '18 jam lalu',
    content: 'Warung baru di Cipete Utara makanannya enak dan murah! Wajib cobain! 🍲',
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80',
    likes: 67,
    comments: 14,
    shares: 8
  }
];

function UGCCard({ report }: { report: UGCReport }) {
  const [likes, setLikes] = useState(report.likes);
  const [isLiked, setIsLiked] = useState(false);
  const [commentCount, setCommentCount] = useState(report.comments);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  const handleLike = () => {
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
    setIsLiked(!isLiked);
  };

  const handleCommentAdded = () => {
    setCommentCount(prev => prev + 1);
  };

  const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://jakselnews.com'}/breaking-news/${report.id}`;
  const shareTitle = `${report.authorName}: ${report.content.substring(0, 50)}...`;

  return (
    <>
      <div className="bg-white rounded-xl overflow-hidden shadow-sm mb-4">
        {/* Author */}
        <div className="flex items-center gap-3 p-4">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="text-gray-500 font-bold text-sm">W</span>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900">{report.authorName}</p>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <PhMapPin size={14} />
              {report.location} • {report.time}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 pb-3">
          <p className="text-gray-700 leading-relaxed">{report.content}</p>
        </div>

        {/* Image */}
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
            <PhHeart size={22} weight={isLiked ? 'fill' : 'regular'} />
            <span className="text-sm font-medium">{likes}</span>
          </button>
          <button onClick={() => setIsCommentsOpen(true)} className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors">
            <PhChatCircle size={22} />
            <span className="text-sm font-medium">{commentCount}</span>
          </button>
          <button onClick={() => setIsShareOpen(true)} className="flex items-center gap-2 text-gray-500 hover:text-green-500 transition-colors">
            <PhShareNetwork size={22} />
            <span className="text-sm font-medium">{report.shares}</span>
          </button>
        </div>
      </div>

      <SharePopup isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} url={shareUrl} title={shareTitle} />
      <CommentsSection isOpen={isCommentsOpen} onClose={() => setIsCommentsOpen(false)} postId={report.id} />
    </>
  );
}

export default function BreakingNewsPage() {
  const [visibleCount, setVisibleCount] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  const allReports = [...allUGCReports, ...moreReports];
  const visibleReports = allReports.slice(0, visibleCount);
  const hasMore = visibleCount < allReports.length;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          setIsLoading(true);
          // Simulate loading delay
          setTimeout(() => {
            setVisibleCount(prev => Math.min(prev + 10, allReports.length));
            setIsLoading(false);
          }, 500);
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoading, allReports.length]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-100 sticky top-0 z-30">
        <h1 className="text-xl font-bold text-gray-900">Info Terkini</h1>
        <p className="text-sm text-gray-500">Laporan dari warga Jakarta Selatan</p>
      </div>

      {/* UGC Feed */}
      <div className="px-4 py-4">
        {visibleReports.map((report) => (
          <UGCCard key={report.id} report={report} />
        ))}

        {/* Loading indicator / Load more trigger */}
        {hasMore && (
          <div ref={loaderRef} className="py-8 text-center">
            {isLoading ? (
              <div className="flex items-center justify-center gap-2 text-gray-500">
                <PhSpinner size={20} className="animate-spin" />
                <span className="text-sm">Memuat lebih banyak...</span>
              </div>
            ) : (
              <span className="text-sm text-gray-400">Scroll untuk load lebih banyak</span>
            )}
          </div>
        )}

        {!hasMore && visibleReports.length > 0 && (
          <div className="py-8 text-center">
            <span className="text-sm text-gray-400">Semua laporan telah dimuat</span>
          </div>
        )}
      </div>
    </div>
  );
}
