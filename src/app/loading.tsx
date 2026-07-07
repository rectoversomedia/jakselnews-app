import { PhSpinner } from '@phosphor-icons/react';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-xl">J</span>
        </div>
        <PhSpinner size={32} className="animate-spin text-primary mx-auto" />
        <p className="text-gray-500 text-sm mt-4">Memuat...</p>
      </div>
    </div>
  );
}
