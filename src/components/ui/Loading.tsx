'use client';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} border-2 border-gray-200 border-t-primary rounded-full animate-spin`}
      />
    </div>
  );
}

export function ArticleCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
      <div className="aspect-video skeleton" />
      <div className="p-4 space-y-3">
        <div className="h-4 w-20 skeleton rounded" />
        <div className="h-5 w-full skeleton rounded" />
        <div className="h-5 w-3/4 skeleton rounded" />
        <div className="h-4 w-1/2 skeleton rounded" />
      </div>
    </div>
  );
}

export function ArticleListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ArticleCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ReportFormSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-12 skeleton rounded-xl" />
      <div className="h-32 skeleton rounded-xl" />
      <div className="h-12 skeleton rounded-xl" />
      <div className="h-12 skeleton rounded-xl" />
      <div className="h-14 skeleton rounded-xl" />
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4">
          <img src="/logo-utama.png" alt="Jakselnews" className="w-full h-full object-contain animate-pulse" />
        </div>
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-500">Memuat...</p>
      </div>
    </div>
  );
}
