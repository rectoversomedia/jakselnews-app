'use client';

import { useState } from 'react';
import {
  MapPin,
  Clock,
  Heart,
  ChatCircle,
  Share,
  Funnel,
  Newspaper,
} from '@phosphor-icons/react';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';

const mockPosts = [
  {
    id: 1,
    authorName: 'Warga Kemang',
    location: 'Kemang',
    time: '10 menit lalu',
    content: 'Air mulai pasang di Jl Kemang Raya arah Blok M. Tinggi air sudah 15cm. Masyarakat diminta waspada! 🌊',
    likes: 24,
    comments: 8,
    shares: 5,
    category: 'banjir',
    gradient: 'from-blue-500 to-cyan-400',
  },
  {
    id: 2,
    authorName: 'Warga Blok M',
    location: 'Blok M',
    time: '25 menit lalu',
    content: 'Kemacetan parah di Jl. Melawai arah flyover. Estimated delay 30 menit. 🚗💨',
    likes: 18,
    comments: 12,
    shares: 3,
    category: 'lalu-lintas',
    gradient: 'from-amber-500 to-orange-400',
  },
  {
    id: 3,
    authorName: 'Warga Cilandak',
    location: 'Cilandak',
    time: '45 menit lalu',
    content: 'Listrik padam di kawasan TB Simatupang. PLN sedang melakukan perbaikan. ⚡',
    likes: 15,
    comments: 6,
    shares: 2,
    category: 'penerangan',
    gradient: 'from-yellow-400 to-amber-400',
  },
  {
    id: 4,
    authorName: 'Warga Kebayoran',
    location: 'Kebayoran',
    time: '1 jam lalu',
    content: 'Pohon tumbang di Jl. Trunojoyo. Arvodi dan tim kebersihan sudah di lokasi. 🌳',
    likes: 32,
    comments: 15,
    shares: 8,
    category: 'lingkungan',
    gradient: 'from-emerald-500 to-teal-400',
  },
  {
    id: 5,
    authorName: 'Warga Pasar Minggu',
    location: 'Pasar Minggu',
    time: '2 jam lalu',
    content: 'Jalan berlubang di Jl. RM. Soedirdja. Mohon perhatian khusus untuk pengendara motor. 🏍️',
    likes: 20,
    comments: 9,
    shares: 4,
    category: 'jalan-rusak',
    gradient: 'from-orange-500 to-amber-400',
  },
  {
    id: 6,
    authorName: 'Warga Tebet',
    location: 'Tebet',
    time: '3 jam lalu',
    content: 'Ada aksi demonstrasi di Jl. Tebet Raya. Arus lalu lintas dialihkan. ⚠️',
    likes: 45,
    comments: 22,
    shares: 12,
    category: 'kemacetan',
    gradient: 'from-red-500 to-rose-400',
  },
];

const categories = [
  { id: 'semua', name: 'Semua', gradient: 'from-gray-500 to-gray-400' },
  { id: 'banjir', name: 'Banjir', gradient: 'from-blue-500 to-cyan-400' },
  { id: 'lalu-lintas', name: 'Lalu Lintas', gradient: 'from-amber-500 to-orange-400' },
  { id: 'penerangan', name: 'Penerangan', gradient: 'from-yellow-400 to-amber-400' },
  { id: 'lingkungan', name: 'Lingkungan', gradient: 'from-emerald-500 to-teal-400' },
  { id: 'kemacetan', name: 'Kemacetan', gradient: 'from-red-500 to-rose-400' },
];

export default function InfoTerkiniPage() {
  const [selectedCategory, setSelectedCategory] = useState('semua');
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());

  const filteredPosts = selectedCategory === 'semua'
    ? mockPosts
    : mockPosts.filter(post => post.category === selectedCategory);

  const handleLike = (postId: number) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-24 lg:pb-0 lg:pt-20">
      <Header title="Info Terkini" />
      <BottomNav />

      {/* Category Filter */}
      <div className="sticky top-14 lg:top-16 z-30 bg-white border-b px-4 py-3">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                selectedCategory === cat.id
                  ? `bg-gradient-to-r ${cat.gradient} text-white shadow-lg shadow-red-500/20`
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Info Terkini Feed */}
      <div className="px-4 py-4 space-y-4">
        {filteredPosts.map((post) => (
          <article
            key={post.id}
            className="group bg-white rounded-2xl p-4 shadow-md border border-gray-100 hover:shadow-xl hover:border-red-100 hover:-translate-y-0.5 transition-all duration-300"
          >
            {/* Gradient Accent */}
            <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${post.gradient} rounded-l-2xl`} />

            {/* Author Header */}
            <div className="flex items-start gap-3 mb-3 pl-2">
              <div className={`w-12 h-12 bg-gradient-to-br ${post.gradient} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-105 transition-transform`}>
                {post.authorName.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-gray-900">{post.authorName}</h4>
                  <span className={`px-2.5 py-0.5 bg-gradient-to-r ${post.gradient} text-white text-xs font-semibold rounded-full shadow-sm`}>
                    {categories.find(c => c.id === post.category)?.name || post.category}
                  </span>
                </div>
                <p className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                  <MapPin size={12} />
                  {post.location}
                  <span className="mx-1">•</span>
                  <Clock size={12} />
                  {post.time}
                </p>
              </div>
            </div>

            {/* Content */}
            <div className={`pl-14 pr-2 py-3 rounded-xl bg-gradient-to-r ${post.gradient} bg-opacity-5 border-l-4 border-gradient-to-b ${post.gradient}`}>
              <p className="text-gray-700 leading-relaxed text-sm">
                {post.content}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1 mt-3 pt-3 border-t border-gray-100">
              <button
                onClick={() => handleLike(post.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  likedPosts.has(post.id)
                    ? 'text-red-500 bg-red-50'
                    : 'text-gray-500 hover:text-red-500 hover:bg-red-50'
                }`}
              >
                <Heart size={18} weight={likedPosts.has(post.id) ? 'fill' : 'regular'} />
                <span>{post.likes + (likedPosts.has(post.id) ? 1 : 0)}</span>
              </button>

              <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-gray-500 hover:text-violet-500 hover:bg-violet-50 transition-all duration-300">
                <ChatCircle size={18} />
                <span>{post.comments}</span>
              </button>

              <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-gray-500 hover:text-blue-500 hover:bg-blue-50 transition-all duration-300 ml-auto">
                <Share size={18} />
                <span>{post.shares}</span>
              </button>
            </div>
          </article>
        ))}

        {filteredPosts.length === 0 && (
          <div className="text-center py-16">
            <div className={`w-20 h-20 bg-gradient-to-br ${categories.find(c => c.id === selectedCategory)?.gradient || 'from-gray-400 to-gray-300'} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
              <Newspaper size={40} className="text-white" />
            </div>
            <p className="text-gray-500 mb-2">Tidak ada info terkini untuk kategori ini</p>
            <button
              onClick={() => setSelectedCategory('semua')}
              className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-rose-500 text-white font-semibold rounded-xl shadow-lg shadow-red-500/30"
            >
              Lihat Semua
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
