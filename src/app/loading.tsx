'use client';

import { Spinner } from '@phosphor-icons/react';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500 text-sm mt-4">Memuat...</p>
      </div>
    </div>
  );
}
