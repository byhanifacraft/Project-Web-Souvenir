import React from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-[#faf6f3] text-zinc-800">
      <div className="max-w-md w-full text-center space-y-6 animate-scaleUp">
        {/* Soft Badge / Icon */}
        <div className="w-20 h-20 mx-auto rounded-3xl bg-[#fde8ee] border border-[#f3ccd6] flex items-center justify-center text-[#e05d82] shadow-sm">
          <Icon icon="solar:candle-bold-duotone" className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#e05d82] bg-[#fff0f4] px-3 py-1 rounded-full border border-[#f3ccd6]/60">
            Error 404 • Halaman Tidak Ditemukan
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-zinc-900 mt-4">
            Aroma atau Halaman Belum Ditemukan
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-2 leading-relaxed">
            Halaman yang Anda cari mungkin telah dipindahkan, tautan salah, atau sedang dalam
            penataan ulang studio kerajinan kami.
          </p>
        </div>

        {/* Action Links */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#e05d82] text-white font-bold text-xs hover:bg-[#c8476c] transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <Icon icon="solar:home-2-bold" className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>
          <Link
            href="/produk"
            className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-white border border-zinc-200 text-zinc-700 font-bold text-xs hover:bg-zinc-50 transition-all flex items-center justify-center gap-2 shadow-2xs"
          >
            <Icon icon="solar:bag-heart-bold" className="w-4 h-4 text-[#e05d82]" />
            <span>Lihat Katalog Souvenir</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
