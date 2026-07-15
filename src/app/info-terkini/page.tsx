'use client';

import { useState, useEffect } from 'react';
import {
  MapPin,
  Clock,
  Heart,
  ChatCircle,
  Share,
  Newspaper,
  PaperPlaneRight,
  X,
  Image as ImageIcon,
  VideoCamera,
} from '@phosphor-icons/react';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';

interface Comment {
  id: number;
  author: string;
  text: string;
  time: string;
  replies?: Comment[];
}

interface UGCReport {
  id: number;
  authorName: string;
  authorInitial: string;
  location: string;
  time: string;
  content: string;
  imageUrl?: string;
  likes: number;
  comments: number;
  shares: number;
  category: string;
  categoryName: string;
}

const mockPosts: UGCReport[] = [
  {
    id: 1,
    authorName: 'Warga Kemang',
    authorInitial: 'W',
    location: 'Kemang',
    time: '10 menit lalu',
    content: 'Air mulai pasang di Jl Kemang Raya arah Blok M. Tinggi air sudah 15cm. Masyarakat diminta waspada!',
    imageUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800&q=80',
    likes: 24,
    comments: 8,
    shares: 5,
    category: 'banjir',
    categoryName: 'Banjir',
  },
  {
    id: 2,
    authorName: 'Warga Blok M',
    authorInitial: 'W',
    location: 'Blok M',
    time: '25 menit lalu',
    content: 'Kemacetan parah di Jl. Melawai arah flyover. Estimated delay 30 menit.',
    imageUrl: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80',
    likes: 18,
    comments: 12,
    shares: 3,
    category: 'lalu-lintas',
    categoryName: 'Lalu Lintas',
  },
  {
    id: 3,
    authorName: 'Warga Cilandak',
    authorInitial: 'W',
    location: 'Cilandak',
    time: '45 menit lalu',
    content: 'Listrik padam di kawasan TB Simatupang. PLN sedang melakukan perbaikan.',
    imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&q=80',
    likes: 15,
    comments: 6,
    shares: 2,
    category: 'penerangan',
    categoryName: 'Penerangan',
  },
  {
    id: 4,
    authorName: 'Warga Kebayoran',
    authorInitial: 'W',
    location: 'Kebayoran',
    time: '1 jam lalu',
    content: 'Pohon tumbang di Jl. Trunojoyo. Arvodi dan tim kebersihan sudah di lokasi.',
    imageUrl: 'https://images.unsplash.com/photo-1518098268026-4e89f1a2cd8e?w=800&q=80',
    likes: 32,
    comments: 15,
    shares: 8,
    category: 'lingkungan',
    categoryName: 'Lingkungan',
  },
  {
    id: 5,
    authorName: 'Warga Pasar Minggu',
    authorInitial: 'W',
    location: 'Pasar Minggu',
    time: '2 jam lalu',
    content: 'Jalan berlubang di Jl. RM. Soedirdja. Mohon perhatian khusus untuk pengendara motor.',
    imageUrl: 'https://images.unsplash.com/photo-1505521377774-103a4d157444?w=800&q=80',
    likes: 20,
    comments: 9,
    shares: 4,
    category: 'jalan-rusak',
    categoryName: 'Jalan Rusak',
  },
  {
    id: 6,
    authorName: 'Warga Tebet',
    authorInitial: 'W',
    location: 'Tebet',
    time: '3 jam lalu',
    content: 'Ada aksi demonstrasi di Jl. Tebet Raya. Arus lalu lintas dialihkan.',
    imageUrl: 'https://images.unsplash.com/photo-1569949381669-ecf31ae8e613?w=800&q=80',
    likes: 45,
    comments: 22,
    shares: 12,
    category: 'kemacetan',
    categoryName: 'Kemacetan',
  },
];

const categories = [
  { id: 'semua', name: 'Semua' },
  { id: 'banjir', name: 'Banjir' },
  { id: 'lalu-lintas', name: 'Lalu Lintas' },
  { id: 'penerangan', name: 'Penerangan' },
  { id: 'lingkungan', name: 'Lingkungan' },
  { id: 'kemacetan', name: 'Kemacetan' },
];

// Comments Modal Component
function CommentsModal({
  isOpen,
  onClose,
  post,
  onAddComment,
  onAddReply,
}: {
  isOpen: boolean;
  onClose: () => void;
  post: UGCReport;
  onAddComment: (postId: number, text: string) => void;
  onAddReply: (postId: number, parentId: number, text: string) => void;
}) {
  const [comments, setComments] = useState<Comment[]>([
    { id: 1, author: 'Warga Blok M', text: 'Tetap waspada ya!', time: '5 menit lalu', replies: [
      { id: 11, author: 'Warga Kemang', text: 'Iya makasih infonya!', time: '3 menit lalu' }
    ]},
    { id: 2, author: 'Warga Ragunan', text: 'Semoga cepat surut ya', time: '8 menit lalu', replies: [] },
  ]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [replyText, setReplyText] = useState('');

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;
    const comment: Comment = { id: Date.now(), author: 'Warga Jaksel', text: newComment, time: 'Baru saja' };
    setComments([...comments, comment]);
    onAddComment(post.id, newComment);
    setNewComment('');
  };

  const handleReply = (parentId: number) => {
    if (!replyText.trim()) return;
    const reply: Comment = { id: Date.now(), author: 'Warga Jaksel', text: replyText, time: 'Baru saja' };
    const updatedComments = comments.map(c =>
      c.id === parentId ? { ...c, replies: [...(c.replies || []), reply] } : c
    );
    setComments(updatedComments);
    onAddReply(post.id, parentId, replyText);
    setReplyTo(null);
    setReplyText('');
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed inset-x-0 bottom-0 top-[40%] bg-white rounded-t-3xl z-50 flex flex-col">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Komentar ({comments.length})</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="space-y-2">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-gray-600">{comment.author.charAt(0)}</span>
                </div>
                <div className="flex-1">
                  <div className="bg-gray-100 rounded-2xl rounded-tl-none p-3">
                    <p className="font-semibold text-sm text-gray-900">{comment.author}</p>
                    <p className="text-sm text-gray-700">{comment.text}</p>
                  </div>
                  <div className="flex items-center gap-3 mt-1 ml-1">
                    <span className="text-xs text-gray-400">{comment.time}</span>
                    <button
                      onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                      className="text-xs text-gray-500 hover:text-red-500 font-medium"
                    >
                      Balas
                    </button>
                  </div>
                </div>
              </div>

              {comment.replies?.map((reply) => (
                <div key={reply.id} className="flex gap-3 ml-8">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-gray-500">{reply.author.charAt(0)}</span>
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-50 rounded-2xl rounded-tl-none p-3">
                      <p className="font-semibold text-sm text-gray-900">{reply.author}</p>
                      <p className="text-sm text-gray-700">{reply.text}</p>
                    </div>
                    <span className="text-xs text-gray-400 ml-1">{reply.time}</span>
                  </div>
                </div>
              ))}

              {replyTo === comment.id && (
                <div className="flex gap-2 ml-8">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Tulis balasan..."
                    className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <button
                    onClick={() => handleReply(comment.id)}
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <PaperPlaneRight size={16} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-gray-100 flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Tulis komentar..."
            className="flex-1 px-4 py-3 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            onClick={handleSubmitComment}
            className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600"
          >
            <PaperPlaneRight size={16} />
          </button>
        </div>
      </div>
    </>
  );
}

// Share Modal Component
function ShareModal({
  isOpen,
  onClose,
  url,
  title,
}: {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
}) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareLinks = [
    {
      name: 'WhatsApp',
      color: 'bg-green-500',
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      ),
      url: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`
    },
    {
      name: 'Twitter',
      color: 'bg-black',
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`
    },
    {
      name: 'Facebook',
      color: 'bg-blue-600',
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    },
    {
      name: 'Telegram',
      color: 'bg-blue-500',
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
      ),
      url: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
    },
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      onClose();
    }, 1500);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed inset-x-4 bottom-0 max-w-md mx-auto bg-white rounded-t-3xl z-50 pb-8">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">Bagikan</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        <div className="p-4">
          <div className="flex justify-around mb-6">
            {shareLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2"
              >
                <div className={`w-14 h-14 ${link.color} rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform`}>
                  {link.icon}
                </div>
                <span className="text-xs text-gray-600">{link.name}</span>
              </a>
            ))}
          </div>
          <button
            onClick={handleCopyLink}
            className="w-full py-3 bg-gray-100 text-gray-700 font-medium rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
          >
            <Share size={18} />
            {copied ? 'Tersalin!' : 'Salin Link'}
          </button>
        </div>
      </div>
    </>
  );
}

// Post Card Component
function PostCard({ post, onUpdatePost }: { post: UGCReport; onUpdatePost: (postId: number, updates: Partial<UGCReport>) => void }) {
  const [isLiked, setIsLiked] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [commentCount, setCommentCount] = useState(post.comments);
  const [shareCount, setShareCount] = useState(post.shares);

  const handleLike = () => {
    if (isLiked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setIsLiked(!isLiked);
    onUpdatePost(post.id, { likes: isLiked ? likeCount - 1 : likeCount + 1 });
  };

  const handleAddComment = () => {
    setCommentCount(commentCount + 1);
    onUpdatePost(post.id, { comments: commentCount + 1 });
  };

  const handleAddReply = () => {
    setCommentCount(commentCount + 1);
    onUpdatePost(post.id, { comments: commentCount + 1 });
  };

  const handleShare = () => {
    setShareCount(shareCount + 1);
    onUpdatePost(post.id, { shares: shareCount + 1 });
    setIsShareOpen(true);
  };

  const shareUrl = `https://jakselnews.com/info-terkini/${post.id}`;
  const shareTitle = `${post.authorName}: ${post.content.substring(0, 50)}...`;

  return (
    <>
      <article className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        {/* Author Info */}
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-sm">
              {post.authorInitial}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-bold text-gray-900 text-sm">{post.authorName}</h4>
                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                  {post.categoryName}
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
          <p className="text-gray-700 leading-relaxed text-sm mt-3">
            {post.content}
          </p>
        </div>

        {/* Image */}
        {post.imageUrl && (
          <div className="relative">
            <img
              src={post.imageUrl}
              alt=""
              className="w-full h-48 object-cover"
            />
            <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <ImageIcon size={12} />
              Foto
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-1 px-4 py-3 border-t border-gray-100">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
              isLiked
                ? 'text-red-500 bg-red-50'
                : 'text-gray-500 hover:text-red-500 hover:bg-red-50'
            }`}
          >
            <Heart size={18} weight={isLiked ? 'fill' : 'regular'} />
            <span>{likeCount}</span>
          </button>

          <button
            onClick={() => setIsCommentsOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all"
          >
            <ChatCircle size={18} />
            <span>{commentCount}</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all ml-auto"
          >
            <Share size={18} />
            <span>{shareCount}</span>
          </button>
        </div>
      </article>

      <CommentsModal
        isOpen={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
        post={post}
        onAddComment={handleAddComment}
        onAddReply={handleAddReply}
      />
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        url={shareUrl}
        title={shareTitle}
      />
    </>
  );
}

export default function InfoTerkiniPage() {
  const [selectedCategory, setSelectedCategory] = useState('semua');
  const [posts, setPosts] = useState(mockPosts);

  const filteredPosts = selectedCategory === 'semua'
    ? posts
    : posts.filter(post => post.category === selectedCategory);

  const handleUpdatePost = (postId: number, updates: Partial<UGCReport>) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, ...updates } : p));
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-24 lg:pb-0">
      <Header title="Info Terkini" />
      <BottomNav />

      {/* Category Filter - Fixed at top */}
      <div className="sticky top-14 lg:top-20 z-30 bg-white border-b px-4 py-3 mt-14 lg:mt-20">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide max-w-2xl mx-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-red-500 text-white shadow-lg shadow-red-500/30'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Feed */}
      <div className="px-4 py-4 space-y-4 max-w-2xl mx-auto">
        {filteredPosts.map((post) => (
          <PostCard key={post.id} post={post} onUpdatePost={handleUpdatePost} />
        ))}

        {filteredPosts.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Newspaper size={40} className="text-gray-400" />
            </div>
            <p className="text-gray-500 mb-4">Tidak ada info terkini untuk kategori ini</p>
            <button
              onClick={() => setSelectedCategory('semua')}
              className="px-6 py-2.5 bg-red-500 text-white font-semibold rounded-xl shadow-lg shadow-red-500/30"
            >
              Lihat Semua
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
