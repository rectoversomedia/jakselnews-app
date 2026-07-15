'use client';

import { useEffect } from 'react';
import { Warning, ArrowLeft, House } from '@phosphor-icons/react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="text-center max-w-md w-full">
          {/* Error Icon */}
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-500/30">
            <Warning size={40} className="text-white" weight="fill" />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Terjadi Kesalahan
          </h1>

          {/* Description */}
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">
            Maaf, terjadi kesalahan yang tidak terduga saat memuat halaman ini.
            Tim kami akan segera memperbaiki masalah ini.
          </p>

          {/* Error Code (if available) */}
          {error.digest && (
            <div className="bg-gray-100 rounded-lg px-4 py-2 mb-6 inline-block">
              <p className="text-xs text-gray-500 font-mono">
                Error ID: {error.digest.substring(0, 8)}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={reset}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-red-500/30 transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft size={18} />
              Coba Lagi
            </button>
            <Link
              href="/"
              className="w-full sm:w-auto px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <House size={18} />
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="py-4 text-center">
        <p className="text-xs text-gray-400">
          Jika masalah terus berlanjut, silakan hubungi administrator
        </p>
      </div>
    </main>
  );
}
