'use client';

import { User } from '@phosphor-icons/react';

export default function ProfilPage() {
  return (
    <div className="container py-8 text-center">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <User size={32} className="text-gray-400" />
      </div>
      <h1 className="text-xl font-bold text-gray-900 mb-2">Profil</h1>
      <p className="text-gray-500 text-sm">Fitur profil sedang dalam pengembangan</p>
    </div>
  );
}
