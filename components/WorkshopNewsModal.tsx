'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import { X, Calendar, MapPin, MessageCircle, Sparkles, CheckCircle2, Clock } from 'lucide-react';
import { WorkshopNewsItem } from '@/types/store';

interface WorkshopNewsModalProps {
  news: WorkshopNewsItem | null;
  onClose: () => void;
  whatsappNum?: string;
}

export default function WorkshopNewsModal({
  news,
  onClose,
  whatsappNum = '6281234567890',
}: WorkshopNewsModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (news) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [news, onClose]);

  if (!news) return null;

  const getStatusBadge = () => {
    switch (news.status) {
      case 'coming_soon':
        return {
          bg: 'bg-amber-100 text-amber-900 border-amber-300',
          icon: Sparkles,
          label: news.status_label || 'Segera Hadir / Coming Soon',
        };
      case 'open_registration':
        return {
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          icon: CheckCircle2,
          label: news.status_label || 'Pendaftaran Dibuka',
        };
      case 'completed':
        return {
          bg: 'bg-zinc-100 text-zinc-700 border-zinc-300',
          icon: Clock,
          label: news.status_label || 'Dokumentasi Acara',
        };
      default:
        return {
          bg: 'bg-[#fde8ee] text-[#c45a76] border-[#f8c4d2]',
          icon: Sparkles,
          label: news.status_label || 'Agenda Workshop',
        };
    }
  };

  const badgeInfo = getStatusBadge();
  const BadgeIcon = badgeInfo.icon;

  const defaultWaMsg =
    news.wa_message ||
    `Halo Kak Hanifa, saya tertarik dengan informasi/agenda "${news.title}". Boleh minta info detail dan pendaftarannya?`;
  const waUrl = `https://wa.me/${whatsappNum}?text=${encodeURIComponent(defaultWaMsg)}`;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-2xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#f3d7df] my-auto animate-scaleUp max-h-[92vh] flex flex-col"
      >
        {/* Floating Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-20 w-10 h-10 rounded-full bg-black/60 text-white hover:bg-[#e05d82] flex items-center justify-center transition-colors shadow-lg cursor-pointer backdrop-blur-sm"
          aria-label="Tutup Berita"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Content Container */}
        <div className="overflow-y-auto flex-1">
          {/* Cover Banner Image */}
          <div className="relative aspect-[16/9] w-full bg-zinc-900">
            <Image src={news.image_url} alt={news.title} fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            <div className="absolute bottom-4 left-4 right-4 text-white z-10">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-xs ${badgeInfo.bg}`}
                >
                  <BadgeIcon className="w-3.5 h-3.5" />
                  <span>{badgeInfo.label}</span>
                </span>
                {news.category_label && (
                  <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-white text-[11px] font-semibold">
                    {news.category_label}
                  </span>
                )}
              </div>
              <h2 className="font-serif font-bold text-lg sm:text-2xl text-white leading-snug drop-shadow-sm">
                {news.title}
              </h2>
            </div>
          </div>

          {/* Body Section */}
          <div className="p-5 sm:p-7 space-y-6">
            {/* Meta Info Bar: Date & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-[#fff7f9] border border-[#f3d7df]">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#fde8ee] text-[#e05d82] flex items-center justify-center shrink-0 mt-0.5">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-wider font-bold text-[#755562]">
                    Jadwal / Waktu
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-[#2e1c24]">
                    {news.date || 'Sesuai Pengumuman Resmi'}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#fde8ee] text-[#e05d82] flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[10px] uppercase tracking-wider font-bold text-[#755562]">
                    Lokasi Kegiatan
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-[#2e1c24]">
                    {news.location || 'Studio CraftByHanifa, Magetan'}
                  </span>
                </div>
              </div>
            </div>

            {/* Summary Highlight */}
            {news.summary && (
              <div className="border-l-4 border-[#e05d82] pl-4 py-1 text-xs sm:text-sm font-semibold text-[#5e3846] italic bg-[#fff9fa] rounded-r-xl">
                &ldquo;{news.summary}&rdquo;
              </div>
            )}

            {/* Article Content */}
            <div className="space-y-3.5 text-xs sm:text-sm text-zinc-700 leading-relaxed whitespace-pre-line font-normal">
              {news.content}
            </div>

            {/* Micro Benefit Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#faf6f2] via-[#fdf4f7] to-[#faf6f2] border border-[#ebdcd5] flex items-center gap-3">
              <span className="text-2xl">🕯️</span>
              <p className="text-[11px] sm:text-xs text-zinc-600 leading-normal">
                Sesi workshop CraftByHanifa menggunakan 100% natural soy wax nabati ramah lingkungan
                dengan bimbingan personal oleh perajin studio Magetan.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Action Bar */}
        <div className="p-4 sm:p-5 bg-white border-t border-[#f3d7df] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-zinc-200 text-xs font-bold text-zinc-600 hover:bg-zinc-50 transition-colors cursor-pointer"
          >
            Tutup
          </button>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#128c7e] hover:bg-[#0e7065] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-[#128c7e]/20 transition-all hover:scale-[1.02] cursor-pointer min-h-[44px]"
          >
            <MessageCircle className="w-4 h-4" />
            <span>
              {news.status === 'coming_soon'
                ? 'Daftar Antrean / Tanya Info via WA'
                : news.status === 'open_registration'
                  ? 'Daftar Sesi Workshop via WA'
                  : 'Tanya Jadwal Sesi Berikutnya'}
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
