'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application runtime error boundary caught:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-[#faf6f3] text-zinc-800">
      <div className="max-w-md w-full text-center space-y-6 animate-scaleUp">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shadow-sm">
          <Icon icon="solar:danger-triangle-bold-duotone" className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
            Terjadi Kesalahan Teknis
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900 mt-4">
            Mohon Maaf, Ada Kendala Sistem
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-2 leading-relaxed">
            Terjadi kesalahan sementara saat memproses halaman ini. Silakan coba muat ulang atau
            hubungi kami via WhatsApp jika kendala berlanjut.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#e05d82] text-white font-bold text-xs hover:bg-[#c8476c] transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
          >
            <Icon icon="solar:restart-bold" className="w-4 h-4" />
            <span>Coba Muat Ulang</span>
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-white border border-zinc-200 text-zinc-700 font-bold text-xs hover:bg-zinc-50 transition-all flex items-center justify-center gap-2 shadow-2xs"
          >
            <Icon icon="solar:home-2-bold" className="w-4 h-4 text-zinc-400" />
            <span>Ke Beranda</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
