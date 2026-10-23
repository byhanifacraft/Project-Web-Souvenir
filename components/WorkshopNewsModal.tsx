'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Icon } from '@iconify/react';
import { WorkshopNewsItem } from '@/types/store';

interface WorkshopNewsModalProps {
  news: WorkshopNewsItem | null;
  onClose: () => void;
  whatsappNum?: string;
}

function WhatsAppIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.39-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m-3.53 3.42c-.19 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.87 1.21 3.07c.15.2 2.1 3.2 5.09 4.49.71.31 1.27.49 1.7.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51-.17-.01-.37-.01-.56-.01z" />
    </svg>
  );
}

function InstagramIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function FacebookIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

export default function WorkshopNewsModal({
  news,
  onClose,
  whatsappNum = '6281234567890',
}: WorkshopNewsModalProps) {
  const [errorImageId, setErrorImageId] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const displayImage =
    errorImageId === news?.id || !news?.image_url
      ? '/images/products/studio-workshop.jpg'
      : news.image_url;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (news) {
      const prevBodyOverflow = document.body.style.overflow;
      const prevHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('lenis:stop'));
      }
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = prevBodyOverflow;
        document.documentElement.style.overflow = prevHtmlOverflow;
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('lenis:start'));
        }
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [news, onClose]);

  if (!news) return null;

  const getStatusBadge = () => {
    switch (news.status) {
      case 'coming_soon':
        return {
          bg: 'bg-amber-100 text-amber-900 border-amber-300',
          icon: 'solar:stars-minimalistic-bold-duotone',
          label: news.status_label || 'Segera Hadir / Coming Soon',
        };
      case 'open_registration':
        return {
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          icon: 'solar:verified-check-bold-duotone',
          label: news.status_label || 'Pendaftaran Dibuka',
        };
      case 'completed':
        return {
          bg: 'bg-zinc-100 text-zinc-700 border-zinc-300',
          icon: 'solar:clock-circle-bold-duotone',
          label: news.status_label || 'Dokumentasi Acara',
        };
      default:
        return {
          bg: 'bg-[#fde8ee] text-[#c45a76] border-[#f8c4d2]',
          icon: 'solar:stars-minimalistic-bold-duotone',
          label: news.status_label || 'Agenda Workshop',
        };
    }
  };

  const badgeInfo = getStatusBadge();

  const defaultWaMsg =
    news.wa_message ||
    `Halo Kak Hanifa, saya tertarik dengan informasi/agenda "${news.title}". Boleh minta info detail dan pendaftarannya?`;
  const waUrl = `https://wa.me/${whatsappNum}?text=${encodeURIComponent(defaultWaMsg)}`;

  // ================= SHARE HELPERS =================
  const getShareUrl = () => {
    if (typeof window === 'undefined') return 'https://craftbyhanifa.com/workshop';
    // Jika sedang running di localhost/IP internal, arahkan ke live domain agar scraper crawler Facebook & IG bisa membaca metadata/OpenGraph
    const isLocal =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname.startsWith('192.168.');
    const origin = isLocal ? 'https://craftbyhanifa.com' : window.location.origin;
    const url = new URL('/workshop', origin);
    if (news?.id) {
      url.searchParams.set('event', String(news.id));
    }
    return url.toString();
  };

  const getShareText = () => {
    const parts = [
      `Halo! Ada info workshop lilin aromaterapi menarik dari CraftByHanifa Magetan:`,
      `✨ "${news.title}"`,
    ];
    if (news.date) parts.push(`🗓️ Jadwal: ${news.date}`);
    if (news.location) parts.push(`📍 Lokasi: ${news.location}`);
    parts.push(`\nYuk cek rincian kelas dan pendaftarannya di sini:`);
    return parts.join('\n');
  };

  const shareWaUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `${getShareText()}\n${getShareUrl()}`
  )}`;

  const shareFbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    getShareUrl()
  )}&quote=${encodeURIComponent(
    `${news.title} | Workshop Lilin Aromaterapi CraftByHanifa Magetan`
  )}`;

  const handleCopyLink = async (customToast?: string) => {
    const shareUrl = getShareUrl();
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const input = document.createElement('textarea');
        input.value = shareUrl;
        input.style.position = 'fixed';
        input.style.opacity = '0';
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
      }
      setToastMsg(customToast || 'Tautan agenda workshop berhasil disalin ke clipboard!');
      setCopied(true);
      setTimeout(() => setCopied(false), 3500);
    } catch (e) {
      console.warn('Failed to copy link', e);
    }
  };

  const handleFacebookShare = (e: React.MouseEvent) => {
    e.preventDefault();
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      getShareUrl()
    )}&quote=${encodeURIComponent(
      `${news.title} | Workshop Lilin Aromaterapi CraftByHanifa Magetan`
    )}`;

    // Buka pop-up window standar Facebook Share (600x540) di tengah layar
    const width = 600;
    const height = 540;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    window.open(
      fbUrl,
      'facebook-share-dialog',
      `toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=${width},height=${height},top=${top},left=${left}`
    );
  };

  const handleInstagramShare = async () => {
    const shareUrl = getShareUrl();

    // 1. Coba Web Share API (terutama di Android / iPhone / iPad) agar langsung bisa pilih Instagram Story / Feed / Direct Message
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: news.title,
          text: `${getShareText()}\n`,
          url: shareUrl,
        });
        return;
      } catch (err: unknown) {
        if ((err as Error)?.name === 'AbortError') return;
      }
    }

    // 2. Salin teks ringkasan + tautan lengkap ke clipboard
    await handleCopyLink(
      'Teks dan tautan berhasil disalin! Silakan tempel (paste) di Instagram Story atau DM.'
    );

    // 3. Arahkan ke beranda Instagram (bukan profil toko)
    const isMobile =
      typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      window.location.href = 'instagram://app';
      setTimeout(() => {
        window.open('https://www.instagram.com/', '_blank');
      }, 1000);
    } else {
      window.open('https://www.instagram.com/', '_blank');
    }
  };

  return (
    <div
      onClick={onClose}
      onWheel={(e) => e.stopPropagation()}
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn overscroll-contain"
      role="dialog"
      aria-modal="true"
      data-lenis-prevent
    >
      <div
        onClick={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
        className="relative max-w-2xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#f3d7df] my-auto animate-scaleUp max-h-[90vh] sm:max-h-[92vh] flex flex-col"
        data-lenis-prevent
      >
        {/* Floating Action Buttons: Share & Close */}
        <div className="absolute top-3 right-3 z-30 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowShareModal(true)}
            className="w-10 h-10 rounded-full bg-black/60 text-white hover:bg-[#c45a76] flex items-center justify-center transition-colors shadow-lg cursor-pointer backdrop-blur-sm group"
            title="Bagikan Agenda Workshop"
            aria-label="Bagikan"
          >
            <Icon
              icon="solar:share-bold-duotone"
              className="w-5 h-5 text-white group-hover:scale-110 transition-transform"
            />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-black/60 text-white hover:bg-[#e05d82] flex items-center justify-center transition-colors shadow-lg cursor-pointer backdrop-blur-sm"
            aria-label="Tutup Berita"
          >
            <Icon icon="solar:close-circle-bold-duotone" className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Scrollable Content Container */}
        <div className="overflow-y-auto flex-1 overscroll-contain" data-lenis-prevent>
          {/* Cover Banner Image */}
          <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-zinc-900 shrink-0">
            <Image
              src={displayImage}
              alt={news.title}
              fill
              sizes="(max-width: 768px) 100vw, 672px"
              className="object-cover"
              priority
              loading="eager"
              onError={() => {
                if (news?.id) {
                  setErrorImageId(news.id);
                }
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/25" />

            <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 text-white z-10">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-bold border shadow-xs ${badgeInfo.bg}`}
                >
                  <Icon icon={badgeInfo.icon} className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                  <span>{badgeInfo.label}</span>
                </span>
                {news.category_label && (
                  <span className="px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-white text-[10px] sm:text-[11px] font-semibold">
                    {news.category_label}
                  </span>
                )}
              </div>
              <h2 className="font-serif font-bold text-base sm:text-xl md:text-2xl text-white leading-snug drop-shadow-sm line-clamp-2 sm:line-clamp-none">
                {news.title}
              </h2>
            </div>
          </div>

          {/* Body Section */}
          <div className="p-4 sm:p-7 space-y-4 sm:space-y-6">
            {/* Meta Info Bar: Date & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 p-3.5 sm:p-4 rounded-2xl bg-[#fff7f9] border border-[#f3d7df]">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#fde8ee] text-[#e05d82] flex items-center justify-center shrink-0 mt-0.5">
                  <Icon
                    icon="solar:calendar-date-bold-duotone"
                    className="w-4 h-4 text-[#e05d82]"
                  />
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
                  <Icon icon="solar:point-on-map-bold-duotone" className="w-4 h-4 text-[#e05d82]" />
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
              <div className="border-l-4 border-[#e05d82] pl-3.5 sm:pl-4 py-1 text-xs sm:text-sm font-semibold text-[#5e3846] italic bg-[#fff9fa] rounded-r-xl">
                &ldquo;{news.summary}&rdquo;
              </div>
            )}

            {/* Article Content */}
            <div className="space-y-3.5 text-xs sm:text-sm text-zinc-700 leading-relaxed whitespace-pre-line font-normal">
              {news.content}
            </div>

            {/* Micro Benefit Banner */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#faf6f2] via-[#fdf4f7] to-[#faf6f2] border border-[#ebdcd5] flex items-center gap-2.5 sm:gap-3">
              <span className="text-xl sm:text-2xl shrink-0">🕯️</span>
              <p className="text-[11px] sm:text-xs text-zinc-600 leading-normal">
                Sesi workshop CraftByHanifa menggunakan 100% natural soy wax nabati ramah lingkungan
                dengan bimbingan personal oleh perajin studio Magetan.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Action Bar */}
        <div className="p-3.5 sm:p-5 bg-white border-t border-[#f3d7df] flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3 shrink-0">
          <div className="flex items-center gap-2 w-full sm:w-auto order-2 sm:order-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-full border border-zinc-200 text-xs font-bold text-zinc-600 hover:bg-zinc-50 transition-colors cursor-pointer min-h-[42px] sm:min-h-0 flex items-center justify-center"
            >
              Tutup
            </button>

            <button
              type="button"
              onClick={() => setShowShareModal(true)}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-full border border-[#f3d7df] bg-[#fff7f9] hover:bg-[#fde8ee] text-xs font-bold text-[#c45a76] transition-colors cursor-pointer min-h-[42px] sm:min-h-0 flex items-center justify-center gap-1.5"
              title="Bagikan Info Agenda Ini"
            >
              <Icon icon="solar:share-bold-duotone" className="w-4 h-4 text-[#c45a76]" />
              <span>Bagikan</span>
            </button>
          </div>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-[#25D366]/25 transition-all hover:scale-[1.02] cursor-pointer min-h-[44px] order-1 sm:order-2"
          >
            <Icon
              icon="solar:chat-round-call-bold-duotone"
              className="w-4 h-4 text-white shrink-0"
            />
            <span className="text-center">
              {news.status === 'coming_soon'
                ? 'Daftar Antrean / Tanya Info via WA'
                : news.status === 'open_registration'
                  ? 'Daftar Sesi Workshop via WA'
                  : 'Tanya Jadwal Sesi Berikutnya'}
            </span>
          </a>
        </div>

        {/* ================= MODAL POPOVER FITUR SHARE (SIMPLE: WA, IG, FB) ================= */}
        {showShareModal && (
          <div
            className="absolute inset-0 z-40 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
            onClick={() => setShowShareModal(false)}
            onWheel={(e) => e.stopPropagation()}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-5 sm:p-6 max-w-sm w-full shadow-2xl border border-[#f3d7df] space-y-4 animate-scaleUp"
            >
              {/* Share Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#f3d7df]">
                <div>
                  <h3 className="font-serif font-bold text-base text-zinc-900 leading-tight">
                    Bagikan Info Workshop
                  </h3>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    Pilih media sosial untuk berbagi
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowShareModal(false)}
                  className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Tutup Menu Share"
                >
                  <Icon icon="solar:close-circle-bold" className="w-4 h-4" />
                </button>
              </div>

              {/* 3 Sosmed Utama: WhatsApp, Instagram, Facebook */}
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3 pt-1">
                {/* 1. WhatsApp */}
                <a
                  href={shareWaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center justify-center p-3 sm:p-3.5 rounded-2xl bg-[#f0fdf4] hover:bg-[#25D366] border border-[#bbf7d0] hover:border-[#25D366] transition-all duration-200 text-center shadow-2xs hover:shadow-md cursor-pointer"
                >
                  <div className="w-11 h-11 rounded-2xl bg-[#25D366] text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform mb-2">
                    <WhatsAppIcon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-[11px] sm:text-xs font-bold text-zinc-800 group-hover:text-white transition-colors">
                    WhatsApp
                  </span>
                </a>

                {/* 2. Instagram */}
                <button
                  type="button"
                  onClick={handleInstagramShare}
                  className="group flex flex-col items-center justify-center p-3 sm:p-3.5 rounded-2xl bg-[#fff5f7] hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] border border-[#fce7ed] hover:border-transparent transition-all duration-200 text-center shadow-2xs hover:shadow-md cursor-pointer"
                >
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform mb-2">
                    <InstagramIcon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-[11px] sm:text-xs font-bold text-zinc-800 group-hover:text-white transition-colors">
                    Instagram
                  </span>
                </button>

                {/* 3. Facebook */}
                <a
                  href={shareFbUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleFacebookShare}
                  className="group flex flex-col items-center justify-center p-3 sm:p-3.5 rounded-2xl bg-[#eff6ff] hover:bg-[#1877F2] border border-[#bfdbfe] hover:border-[#1877F2] transition-all duration-200 text-center shadow-2xs hover:shadow-md cursor-pointer"
                >
                  <div className="w-11 h-11 rounded-2xl bg-[#1877F2] text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform mb-2">
                    <FacebookIcon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-[11px] sm:text-xs font-bold text-zinc-800 group-hover:text-white transition-colors">
                    Facebook
                  </span>
                </a>
              </div>

              {/* Salin Tautan Langsung */}
              <div className="pt-2 border-t border-zinc-100">
                <div className="flex items-center gap-2 p-1.5 pl-3 bg-[#faf6f2] border border-[#ebdcd5] rounded-2xl">
                  <Icon icon="solar:link-bold-duotone" className="w-4 h-4 text-zinc-400 shrink-0" />
                  <input
                    type="text"
                    readOnly
                    value={getShareUrl()}
                    className="bg-transparent text-[11px] text-zinc-600 truncate flex-1 outline-none select-all"
                  />
                  <button
                    type="button"
                    onClick={() => handleCopyLink()}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                      copied
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-[#c45a76] hover:bg-[#b04863] text-white shadow-xs'
                    }`}
                  >
                    <Icon
                      icon={copied ? 'solar:check-circle-bold' : 'solar:copy-bold'}
                      className="w-3.5 h-3.5"
                    />
                    <span>{copied ? 'Tersalin!' : 'Salin Link'}</span>
                  </button>
                </div>
              </div>

              {/* Toast Feedback */}
              {copied && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-medium text-center animate-fadeIn flex items-center justify-center gap-1.5">
                  <Icon icon="solar:check-circle-bold" className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{toastMsg || 'Tautan agenda workshop berhasil disalin ke clipboard!'}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
