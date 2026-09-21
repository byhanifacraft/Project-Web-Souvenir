'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Icon } from '@iconify/react';
import { GalleryImageItem, WorkshopNewsItem } from '@/types/store';
import {
  WorkshopPackage,
  CurriculumStep,
  ReservationStep,
  normalizeTakeHomeItem,
} from '@/types/workshop';
import {
  DEFAULT_WORKSHOP_PACKAGES,
  DEFAULT_CURRICULUM_STEPS,
  DEFAULT_RESERVATION_STEPS,
} from '@/lib/workshopDefaults';
import WorkshopNewsModal from '@/components/WorkshopNewsModal';

function SafeImage({
  src,
  alt,
  fill,
  className,
  fallback = '/images/products/studio-workshop.jpg',
  priority,
}: {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  fallback?: string;
  priority?: boolean;
}) {
  const [prevSrc, setPrevSrc] = useState(src);
  const [imgSrc, setImgSrc] = useState(src || fallback);

  if (src !== prevSrc) {
    setPrevSrc(src);
    setImgSrc(src || fallback);
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill={fill}
      className={className}
      priority={priority}
      onError={() => {
        if (imgSrc !== fallback) {
          setImgSrc(fallback);
        }
      }}
    />
  );
}

interface WorkshopPageContentProps {
  whatsappNum: string;
  brandName: string;
  galleryImages: GalleryImageItem[];
  initialPackages?: WorkshopPackage[];
  initialCurriculum?: CurriculumStep[];
  initialReservationSteps?: ReservationStep[];
  initialWorkshopNews?: WorkshopNewsItem[];
}

export default function WorkshopPageContent({
  whatsappNum,
  brandName,
  galleryImages,
  initialPackages,
  initialCurriculum,
  initialReservationSteps,
  initialWorkshopNews,
}: WorkshopPageContentProps) {
  const packages =
    initialPackages && initialPackages.length > 0 ? initialPackages : DEFAULT_WORKSHOP_PACKAGES;
  const curriculum =
    initialCurriculum && initialCurriculum.length > 0
      ? initialCurriculum
      : DEFAULT_CURRICULUM_STEPS;
  const reservationSteps =
    initialReservationSteps && initialReservationSteps.length > 0
      ? initialReservationSteps
      : DEFAULT_RESERVATION_STEPS;
  const newsList = initialWorkshopNews || [];
  const activeNews = newsList.filter((n) => n.is_active !== false);
  const galleryList: GalleryImageItem[] = galleryImages || [];

  const [selectedPackage, setSelectedPackage] = useState<string>(packages[0]?.id || 'premium');
  const [selectedNews, setSelectedNews] = useState<WorkshopNewsItem | null>(null);
  const [previewTakeHome, setPreviewTakeHome] = useState<{
    title: string;
    image_url: string;
    description?: string;
  } | null>(null);
  const [galleryTab, setGalleryTab] = useState<'all' | 'news' | 'gallery'>('all');

  const handleOpenGalleryPhoto = (photo: GalleryImageItem) => {
    // Cek apakah foto ini terhubung dengan suatu berita di activeNews
    const matched = activeNews.find(
      (n) =>
        n.image_url === photo.image_url ||
        n.title.toLowerCase() === (photo.caption || '').toLowerCase()
    );
    if (matched) {
      setSelectedNews(matched);
      return;
    }

    // Tampilkan modal detail informatif untuk foto dokumentasi studio
    setSelectedNews({
      id: photo.id,
      title: photo.caption || 'Dokumentasi Workshop Studio CraftByHanifa',
      image_url: photo.image_url,
      summary:
        photo.caption || 'Dokumentasi suasana dan kreasi workshop lilin aromaterapi CraftByHanifa.',
      content: `${photo.caption || 'Dokumentasi suasana dan hasil karya workshop lilin aromaterapi CraftByHanifa.'}\n\nIngin merasakan langsung pengalaman meracik lilin aromaterapi berkualitas di studio kami? Kelas workshop kami terbuka untuk umum, pemula, couple, maupun group private session di Magetan & sekitarnya.\n\nFasilitas lengkap: 100% natural soy wax murni tanpa jelaga, pilihan essential oil terapeutik, dried botanical flowers, jar kaca amber, apron kanvas studio, dan bimbingan langsung dari tim pengrajin CraftByHanifa. Hasil karya Anda langsung bisa dibawa pulang!\n\nHubungi WhatsApp admin kami untuk info ketersediaan slot sesi terdekat!`,
      date: 'Dokumentasi Studio',
      location: 'Studio CraftByHanifa, Magetan, Jawa Timur',
      status: 'completed',
      status_label: photo.category_label || 'Dokumentasi Studio',
      category_label: photo.category_label || 'Workshop Studio',
      wa_message: `Halo Kak Hanifa, saya tertarik dengan foto dokumentasi workshop "${photo.caption || 'Studio'}". Boleh minta info pendaftaran kelas terdekat?`,
      sort_order: photo.sort_order,
      is_active: true,
    });
  };

  const handleBooking = (pkg: WorkshopPackage) => {
    const url = `https://wa.me/${whatsappNum}?text=${encodeURIComponent(pkg.waMessage)}`;
    window.open(url, '_blank');
  };

  const scrollToPackages = () => {
    const el = document.getElementById('paket-workshop');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-12 sm:space-y-20 pb-16 overflow-x-hidden">
      {/* 1. HERO BANNER */}
      <section className="relative overflow-hidden bg-[#fbfbfd] pt-6 pb-12 sm:pt-10 sm:pb-16 md:pt-14 md:pb-24 border-b border-zinc-200/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left: Text & CTA */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-5 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-2 text-xs text-zinc-400">
                <Link
                  href="/"
                  className="hover:text-[#c45a76] transition-colors flex items-center gap-1 font-medium"
                >
                  <Icon icon="solar:home-2-bold-duotone" className="w-3.5 h-3.5" />
                  <span>Beranda</span>
                </Link>
                <span>/</span>
                <span className="text-[#c45a76] font-medium">Workshop & Studio</span>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 text-[11px] sm:text-xs font-medium tracking-wide">
                <Icon
                  icon="solar:stars-minimalistic-bold-duotone"
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 shrink-0"
                />
                <span className="truncate">Studio Kerajinan Lilin Aromaterapi Magetan</span>
              </div>

              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-[2.75rem] font-bold text-zinc-900 leading-[1.2] sm:leading-[1.15] tracking-tight">
                Rasakan Ketenangan Meracik{' '}
                <span className="text-zinc-900 font-bold">Lilin Aromaterapi</span> Sendiri
              </h1>

              <p className="text-xs sm:text-base text-zinc-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Ajak orang tersayang atau nikmati momen me-time berharga di studio {brandName}.
                Pelajari seni meramu 100% soy wax nabati murni, perpaduan fragrance oil mewah, dan
                hiasan botanical dried flowers yang menenangkan jiwa.
              </p>

              {/* 4 Value Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-1">
                <div className="p-2.5 sm:p-3 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs text-left flex flex-col justify-between">
                  <div className="text-xs font-semibold text-zinc-900 flex items-center gap-1.5 mb-1">
                    <Icon
                      icon="solar:shield-check-bold-duotone"
                      className="w-4 h-4 text-emerald-600 shrink-0"
                    />
                    <span className="truncate">100% Soy Wax</span>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-zinc-500 leading-tight">
                    Alami, bebas asap hitam & aman dihirup.
                  </p>
                </div>

                <div className="p-2.5 sm:p-3 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs text-left flex flex-col justify-between">
                  <div className="text-xs font-semibold text-zinc-900 flex items-center gap-1.5 mb-1">
                    <Icon
                      icon="solar:dropper-3-bold-duotone"
                      className="w-4 h-4 text-rose-500 shrink-0"
                    />
                    <span className="truncate">12+ Signature Oil</span>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-zinc-500 leading-tight">
                    Bebas racik wangi favorit Anda.
                  </p>
                </div>

                <div className="p-2.5 sm:p-3 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs text-left flex flex-col justify-between">
                  <div className="text-xs font-semibold text-zinc-900 flex items-center gap-1.5 mb-1">
                    <Icon
                      icon="solar:gift-bold-duotone"
                      className="w-4 h-4 text-amber-500 shrink-0"
                    />
                    <span className="truncate">Bawa Pulang Karya</span>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-zinc-500 leading-tight">
                    Dikemas gift box cantik berpita.
                  </p>
                </div>

                <div className="p-2.5 sm:p-3 rounded-2xl bg-white border border-zinc-200/80 shadow-2xs text-left flex flex-col justify-between">
                  <div className="text-xs font-semibold text-zinc-900 flex items-center gap-1.5 mb-1">
                    <Icon
                      icon="solar:medal-ribbons-star-bold-duotone"
                      className="w-4 h-4 text-indigo-500 shrink-0"
                    />
                    <span className="truncate">Sertifikat Resmi</span>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-zinc-500 leading-tight">
                    Apresiasi skill kreasi artisan.
                  </p>
                </div>
              </div>

              {/* Action CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-2.5 sm:gap-3 pt-2 w-full">
                <button
                  onClick={scrollToPackages}
                  className="w-full sm:w-auto text-center px-5 sm:px-6 py-3 sm:py-3.5 rounded-full bg-[#1d1d1f] hover:bg-zinc-800 text-white text-xs sm:text-sm font-medium shadow-xs transition-all cursor-pointer min-h-[44px] flex items-center justify-center"
                >
                  Lihat Jadwal & Paket Kelas
                </button>
                <a
                  href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent('Halo Kak Hanifa, saya ingin tanya ketersediaan jadwal workshop lilin aromaterapi.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs sm:text-sm font-semibold shadow-md shadow-[#25D366]/25 transition-all cursor-pointer hover:scale-[1.02] min-h-[44px]"
                >
                  <Icon
                    icon="solar:chat-round-call-bold-duotone"
                    className="w-4 h-4 text-white shrink-0"
                  />
                  <span>Konsultasi Slot via WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Right: Studio Photo Showcase Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Floating Rating Pill - Positioned safely inside container bounds */}
                <div className="absolute top-3 right-3 sm:-top-5 sm:-right-4 bg-white/95 backdrop-blur-md border border-zinc-200/80 rounded-2xl px-2.5 py-1.5 sm:px-4 sm:py-2.5 shadow-md flex items-center gap-2 sm:gap-3 z-10 max-w-[85%] sm:max-w-[90%]">
                  <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-xl bg-[#fde8ee] text-[#c45a76] flex items-center justify-center shrink-0">
                    <Icon
                      icon="solar:heart-bold"
                      className="w-4 h-4 sm:w-5 sm:h-5 text-[#c45a76]"
                    />
                  </div>
                  <div>
                    <div className="text-[11px] sm:text-xs font-bold text-zinc-900 leading-tight">
                      4.9 / 5.0 Rating Peserta
                    </div>
                    <div className="text-[9px] sm:text-[10px] text-zinc-500">
                      500+ kreasi lilin tercipta
                    </div>
                  </div>
                </div>

                <div className="relative rounded-3xl overflow-hidden border border-[#f3d7df] bg-white shadow-xl aspect-[4/3] sm:aspect-[5/4]">
                  <Image
                    src="/images/products/studio-workshop.jpg"
                    alt="Suasana Workshop Lilin Studio CraftByHanifa Magetan"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                  <div className="absolute bottom-3.5 left-3.5 right-3.5 sm:bottom-5 sm:left-5 sm:right-5 text-white pointer-events-none">
                    <div className="inline-block px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-white/20 backdrop-blur-md text-[9px] sm:text-[10px] font-bold tracking-wider uppercase mb-1 sm:mb-1.5">
                      Authentic Studio Experience
                    </div>
                    <p className="font-serif text-base sm:text-xl font-bold leading-snug">
                      Studio Lilin Magetan, Jawa Timur
                    </p>
                    <p className="text-[11px] sm:text-xs text-white/90 mt-0.5 line-clamp-2">
                      Suasana tenang, sejuk, dan penuh inspirasi untuk melepas penat.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DAFTAR PAKET & HARGA WORKSHOP (PRICING TIERS) */}
      <section id="paket-workshop" className="max-w-6xl mx-auto px-4 sm:px-6 scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#c45a76] mb-2">
            Pilihan Sesi & Biaya Investasi
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-zinc-900 tracking-tight mb-2 sm:mb-3">
            Pilih Paket Workshop Favorit Anda
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
            Semua paket sudah termasuk seluruh bahan baku murni, alat pelindung, instruktur
            berpengalaman, serta hasil lilin lengkap dengan gift box untuk dibawa pulang.
          </p>
        </div>

        {/* Mobile Quick Package Selector */}
        <div className="flex md:hidden items-center justify-center gap-2 mb-6 overflow-x-auto pb-1 max-w-full scrollbar-none">
          {packages.map((pkg) => {
            const isSel = selectedPackage === pkg.id;
            return (
              <button
                key={`tab-${pkg.id}`}
                type="button"
                onClick={() => {
                  setSelectedPackage(pkg.id);
                  const el = document.getElementById(`pkg-card-${pkg.id}`);
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isSel
                    ? 'bg-[#c45a76] text-white shadow-xs'
                    : 'bg-white border border-[#ebdcd5] text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                {pkg.name}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 items-stretch">
          {packages.map((pkg) => {
            const isSelected = selectedPackage === pkg.id;
            return (
              <div
                key={pkg.id}
                id={`pkg-card-${pkg.id}`}
                onClick={() => setSelectedPackage(pkg.id)}
                className={`relative rounded-3xl p-4 sm:p-6 lg:p-7 flex flex-col justify-between transition-all duration-300 cursor-pointer scroll-mt-28 ${
                  isSelected
                    ? 'bg-white border-2 border-[#c45a76] shadow-xl ring-4 ring-[#c45a76]/10'
                    : 'bg-white/90 backdrop-blur-xs border-2 border-[#ebdcd5] hover:border-[#df829b]/70 hover:shadow-md'
                }`}
              >
                {/* Popular Badge */}
                {pkg.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-gradient-to-r from-[#c45a76] to-[#df829b] text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-wider shadow-sm pointer-events-none whitespace-nowrap">
                    {pkg.badge}
                  </div>
                )}

                <div className="flex-1 flex flex-col">
                  {/* Interactive Checkbox / Selection Header */}
                  <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      {pkg.id === 'group' ? 'Private Session' : 'Workshop Sesi'}
                    </span>

                    {/* Interactive Checkbox Indicator */}
                    <div
                      className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border transition-all ${
                        isSelected
                          ? 'border-[#c45a76] bg-[#fde8ee] text-[#c45a76]'
                          : 'border-zinc-200 text-zinc-400 bg-zinc-50/50'
                      }`}
                    >
                      <span
                        className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border transition-all ${
                          isSelected
                            ? 'border-[#c45a76] bg-[#c45a76] text-white'
                            : 'border-zinc-300 bg-white'
                        }`}
                      >
                        {isSelected && (
                          <Icon icon="solar:check-read-linear" className="w-2.5 h-2.5" />
                        )}
                      </span>
                      <span className="text-[11px]">{isSelected ? 'Dipilih' : 'Pilih Paket'}</span>
                    </div>
                  </div>

                  {/* Title & Tagline */}
                  <div className="mb-3 sm:mb-4">
                    <h3 className="font-serif font-bold text-lg sm:text-xl text-zinc-900 mb-1">
                      {pkg.name}
                    </h3>
                    <p className="text-xs text-zinc-500 leading-relaxed min-h-[30px] sm:min-h-[32px]">
                      {pkg.tagline}
                    </p>
                  </div>

                  {/* Price Tag */}
                  <div className="py-3 sm:py-4 my-2 border-y border-zinc-100 bg-[#faf6f2]/50 -mx-4 sm:-mx-6 lg:-mx-7 px-4 sm:px-6 lg:px-7">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-[#c45a76]">
                        {pkg.price}
                      </span>
                      <span className="text-xs text-zinc-500">/ orang</span>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4 mt-2 text-[11px] text-zinc-600 font-medium flex-wrap">
                      <span className="flex items-center gap-1">
                        <Icon
                          icon="solar:clock-circle-bold-duotone"
                          className="w-4 h-4 text-[#c45a76] shrink-0"
                        />
                        {pkg.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon
                          icon="solar:users-group-rounded-bold-duotone"
                          className="w-4 h-4 text-zinc-500 shrink-0"
                        />
                        {pkg.capacity}
                      </span>
                    </div>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-4 pt-3 sm:pt-4 mb-5 sm:mb-6 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-700 mb-2 sm:mb-2.5">
                        Materi & Fasilitas:
                      </p>
                      <ul className="space-y-2 text-xs text-zinc-600">
                        {pkg.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Icon
                              icon="solar:verified-check-bold-duotone"
                              className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5"
                            />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Take Home Items with Visual Mini Cards */}
                    <div className="pt-3 border-t border-dashed border-zinc-200">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-[#c45a76] mb-2 sm:mb-2.5 flex items-center gap-1.5">
                        <Icon icon="solar:gift-bold-duotone" className="w-4 h-4 text-[#c45a76]" />
                        <span>Karya Dibawa Pulang:</span>
                      </p>
                      <div className="space-y-2">
                        {pkg.takeHome.map((rawItem, idx) => {
                          const item = normalizeTakeHomeItem(rawItem);
                          const hasImage = Boolean(item.image_url);

                          return (
                            <div
                              key={idx}
                              className="group flex items-center gap-2.5 bg-[#fdf4f7] hover:bg-[#faebf0] p-2 rounded-2xl border border-[#f3d7df] transition-all"
                            >
                              {hasImage ? (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setPreviewTakeHome({
                                      title: item.title,
                                      image_url: item.image_url!,
                                      description: item.description,
                                    });
                                  }}
                                  className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-[#f3d7df] bg-white cursor-pointer shadow-2xs hover:ring-2 hover:ring-[#c45a76]/50 transition-all"
                                  title="Klik untuk perbesar foto karya"
                                >
                                  <SafeImage
                                    src={item.image_url!}
                                    alt={item.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                  <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <Icon
                                      icon="solar:magnifer-zoom-in-bold"
                                      className="w-4 h-4 text-white drop-shadow-sm"
                                    />
                                  </div>
                                </button>
                              ) : (
                                <div className="w-10 h-10 rounded-xl bg-white border border-[#f3d7df] flex items-center justify-center shrink-0 text-[#c45a76] shadow-2xs">
                                  <Icon icon="solar:gift-bold-duotone" className="w-4 h-4" />
                                </div>
                              )}
                              <div className="flex-1 min-w-0 pr-1">
                                <p className="text-xs font-bold text-zinc-800 leading-snug break-words">
                                  {item.title}
                                </p>
                                {item.description ? (
                                  <p className="text-[11px] text-[#7d5260] line-clamp-2 mt-0.5 leading-tight">
                                    {item.description}
                                  </p>
                                ) : hasImage ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] text-[#c45a76] font-medium mt-0.5">
                                    <Icon
                                      icon="solar:camera-minimalistic-bold"
                                      className="w-3 h-3 shrink-0"
                                    />
                                    <span>Lihat foto karya</span>
                                  </span>
                                ) : null}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Booking Button - Unified WhatsApp Solid Green */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBooking(pkg);
                  }}
                  className={`w-full py-3 sm:py-3.5 rounded-full text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm mt-2 min-h-[44px] ${
                    isSelected
                      ? 'bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-md shadow-[#25D366]/25 ring-2 ring-[#25D366]/30 scale-[1.01]'
                      : 'bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-[#25D366]/15 hover:scale-[1.01]'
                  }`}
                >
                  <Icon
                    icon="solar:chat-round-call-bold-duotone"
                    className="w-4 h-4 shrink-0 text-white"
                  />
                  <span>{pkg.buttonLabel}</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Note under packages */}
        <div className="mt-6 sm:mt-8 p-3.5 sm:p-4 rounded-2xl bg-[#faf6f2] border border-[#ebdcd5] text-center max-w-xl mx-auto">
          <p className="text-xs text-zinc-600">
            💡{' '}
            <strong>Punya grup lebih dari 10 orang atau ingin diundang ke sekolah/kantor?</strong>{' '}
            Hubungi kami via WhatsApp untuk mendapatkan proposal materi & diskon grup khusus.
          </p>
        </div>
      </section>

      {/* 3. KURIKULUM & PROSES BELAJAR (LEARNING JOURNEY) */}
      <section className="bg-gradient-to-b from-white via-[#fdf4f7]/40 to-white py-10 sm:py-14 border-y border-[#ebdcd5]/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
            <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#c45a76] mb-2">
              Step-by-Step Guidance
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-zinc-900 tracking-tight mb-2 sm:mb-3">
              Kurikulum Praktik: Apa Saja yang Dipelajari?
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              Kami menyusun materi agar mudah dipahami, interaktif, dan langsung dipraktikkan tanpa
              teori rumit yang membosankan.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {curriculum.map((step, idx) => {
              const curriculumIcons = [
                'solar:flame-bold-duotone',
                'solar:dropper-3-bold-duotone',
                'solar:clock-circle-bold-duotone',
                'solar:magic-stick-3-bold-duotone',
              ];
              const iconName = curriculumIcons[idx % curriculumIcons.length];
              return (
                <div
                  key={idx}
                  className="bg-white p-4.5 sm:p-6 rounded-2xl sm:rounded-3xl border border-[#ebdcd5] shadow-2xs hover:shadow-md hover:border-[#df829b] transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <span className="font-serif text-2xl sm:text-3xl font-bold text-[#c45a76]/30">
                        {step.step || `0${idx + 1}`}
                      </span>
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#fde8ee] text-[#c45a76] flex items-center justify-center">
                        <Icon icon={iconName} className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                    </div>
                    <h3 className="font-serif font-bold text-sm sm:text-base text-zinc-900 mb-1.5 sm:mb-2">
                      {step.title}
                    </h3>
                    <p className="text-xs text-zinc-600 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. DOKUMENTASI KEGIATAN & EVENT PROMOSI WORKSHOP */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 sm:gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fde8ee] border border-[#f3d7df] text-[#c45a76] text-[11px] font-bold uppercase tracking-wider mb-2">
              <Icon
                icon="solar:stars-minimalistic-bold-duotone"
                className="w-3.5 h-3.5 text-[#e05d82]"
              />
              <span>Dokumentasi Studio & Agenda Event</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900 tracking-tight">
              Galeri Dokumentasi & Jadwal Event Promosi
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 mt-1 max-w-2xl">
              Klik pada foto untuk membaca pengumuman jadwal terdekat (Coming Soon), rincian
              pendaftaran kelas terbuka, atau melihat karya studio kami.
            </p>
          </div>

          {/* Filter Pills with Horizontal Scroll safety */}
          <div className="w-full md:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
            <div className="inline-flex items-center gap-1.5 p-1.5 bg-white border border-[#ebdcd5] rounded-2xl shadow-2xs min-w-max">
              <button
                onClick={() => setGalleryTab('all')}
                className={`px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  galleryTab === 'all'
                    ? 'bg-[#c45a76] text-white shadow-2xs'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
                }`}
              >
                Semua ({activeNews.length + galleryList.length})
              </button>
              <div className="w-px h-5 bg-zinc-200 shrink-0" />
              <button
                onClick={() => setGalleryTab('news')}
                className={`px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                  galleryTab === 'news'
                    ? 'bg-[#c45a76] text-white shadow-2xs'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
                }`}
              >
                <Icon icon="solar:bullhorn-bold-duotone" className="w-4 h-4 shrink-0" />
                <span>Event & Promosi ({activeNews.length})</span>
              </button>
              <div className="w-px h-5 bg-zinc-200 shrink-0" />
              <button
                onClick={() => setGalleryTab('gallery')}
                className={`px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${
                  galleryTab === 'gallery'
                    ? 'bg-[#c45a76] text-white shadow-2xs'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
                }`}
              >
                <Icon icon="solar:gallery-bold-duotone" className="w-4 h-4 shrink-0" />
                <span>Foto Dokumentasi ({galleryList.length})</span>
              </button>
            </div>
          </div>
        </div>

        {/* 1. BAGIAN EVENT & BERITA PROMOSI WORKSHOP */}
        {(galleryTab === 'all' || galleryTab === 'news') && activeNews.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#c45a76]">
                  <Icon icon="solar:bullhorn-bold-duotone" className="w-4 h-4" />
                  <span>Agenda Event & Jadwal Promosi</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-zinc-900">
                  Kelas Terbuka & Agenda Mendatang
                </h3>
              </div>
              <span className="hidden sm:inline-block text-xs font-semibold px-3 py-1 rounded-full bg-[#fde8ee] text-[#c45a76]">
                {activeNews.length} Agenda Aktif
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {activeNews.map((item) => {
                const statusColors: Record<string, { bg: string; text: string; border: string }> = {
                  coming_soon: {
                    bg: 'bg-amber-50',
                    text: 'text-amber-800',
                    border: 'border-amber-200',
                  },
                  open_registration: {
                    bg: 'bg-emerald-50',
                    text: 'text-emerald-800',
                    border: 'border-emerald-200',
                  },
                  completed: { bg: 'bg-zinc-50', text: 'text-zinc-700', border: 'border-zinc-200' },
                  special_event: {
                    bg: 'bg-purple-50',
                    text: 'text-purple-800',
                    border: 'border-purple-200',
                  },
                };
                const sc = statusColors[item.status] || {
                  bg: 'bg-[#fde8ee]',
                  text: 'text-[#c45a76]',
                  border: 'border-[#f3d7df]',
                };

                return (
                  <div
                    key={`news-${item.id}`}
                    onClick={() => setSelectedNews(item)}
                    className="group relative rounded-3xl overflow-hidden bg-white border border-[#ebdcd5] shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer"
                  >
                    <div>
                      <div className="relative aspect-[16/10] w-full bg-zinc-100 overflow-hidden">
                        <SafeImage
                          src={item.image_url}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-75 group-hover:opacity-50 transition-opacity" />

                        <div className="absolute top-3 left-3 z-10">
                          <span
                            className={`text-[10px] font-bold px-2.5 py-1 rounded-full border shadow-xs uppercase tracking-wider backdrop-blur-md ${sc.bg} ${sc.text} ${sc.border}`}
                          >
                            {item.status_label || item.status}
                          </span>
                        </div>

                        <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-zinc-900 text-[11px] font-bold flex items-center gap-1.5 shadow-sm">
                            <Icon
                              icon="solar:eye-bold-duotone"
                              className="w-4 h-4 text-[#e05d82]"
                            />
                            <span>Baca Berita</span>
                          </div>
                        </div>

                        <div className="absolute bottom-3 left-3 right-3 text-white flex items-center gap-2 text-[11px] font-medium drop-shadow-sm">
                          <Icon
                            icon="solar:calendar-date-bold-duotone"
                            className="w-4 h-4 text-rose-300 shrink-0"
                          />
                          <span className="truncate">{item.date}</span>
                        </div>
                      </div>

                      <div className="p-4 sm:p-5 space-y-2 sm:space-y-2.5">
                        <h3 className="font-serif font-bold text-sm sm:text-base text-zinc-900 leading-snug group-hover:text-[#c45a76] transition-colors line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed">
                          {item.summary}
                        </p>
                        <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 pt-1">
                          <Icon
                            icon="solar:point-on-map-bold-duotone"
                            className="w-4 h-4 text-[#e05d82] shrink-0"
                          />
                          <span className="truncate">{item.location}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 sm:p-5 pt-0">
                      <div className="w-full py-2.5 px-3 rounded-xl bg-[#fdf2f4] group-hover:bg-[#c45a76] text-[#c45a76] group-hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-[#f3d7df] group-hover:border-transparent min-h-[44px]">
                        <span>Lihat Rincian & Reservasi</span>
                        <Icon
                          icon="solar:alt-arrow-right-bold"
                          className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* State Kosong untuk Tab Event & Berita */}
        {galleryTab === 'news' && activeNews.length === 0 && (
          <div className="py-12 sm:py-16 text-center bg-white rounded-3xl border border-[#ebdcd5] p-6 sm:p-8 max-w-lg mx-auto shadow-2xs">
            <Icon
              icon="solar:bullhorn-bold-duotone"
              className="w-10 h-10 text-[#df829b] mx-auto mb-3 opacity-60"
            />
            <h3 className="font-serif font-bold text-base text-zinc-900 mb-1">
              Belum Ada Agenda Event
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Saat ini belum ada pengumuman kelas atau event promosi baru. Pantau terus halaman ini
              atau hubungi studio kami via WhatsApp!
            </p>
          </div>
        )}

        {/* ELEMEN PEMISAH ESTETIK (DIVIDER) HANYA JIKA KEDUANYA ADA */}
        {galleryTab === 'all' && activeNews.length > 0 && galleryList.length > 0 && (
          <div className="my-10 sm:my-14 relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-[#e4d4cd]" />
            </div>
            <div className="relative px-4 sm:px-6 py-1.5 sm:py-2 bg-[#faf6f3] rounded-full border border-[#ebdcd5] text-[11px] sm:text-xs font-bold text-[#c45a76] shadow-2xs flex items-center gap-2">
              <Icon icon="solar:camera-bold-duotone" className="w-4 h-4 text-[#e05d82] shrink-0" />
              <span>Koleksi Foto Dokumentasi Studio</span>
            </div>
          </div>
        )}

        {/* 2. BAGIAN FOTO DOKUMENTASI WORKSHOP */}
        {(galleryTab === 'all' || galleryTab === 'gallery') && galleryList.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#c45a76]">
                  <Icon icon="solar:gallery-bold-duotone" className="w-4 h-4" />
                  <span>Galeri Dokumentasi Studio</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-zinc-900">
                  Arsip Foto Kegiatan & Karya Studio
                </h3>
              </div>
              <span className="hidden sm:inline-block text-xs font-semibold px-3 py-1 rounded-full bg-zinc-100 text-zinc-700">
                {galleryList.length} Foto Tersedia
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {galleryList.map((photo, idx) => (
                <div
                  key={`photo-${photo.id || idx}`}
                  onClick={() => handleOpenGalleryPhoto(photo)}
                  className="group relative rounded-3xl overflow-hidden bg-white border border-[#ebdcd5] shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    <div className="relative aspect-[16/10] w-full bg-zinc-100 overflow-hidden">
                      <SafeImage
                        src={photo.image_url}
                        alt={photo.caption || 'Foto Dokumentasi Studio'}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent opacity-75 group-hover:opacity-45 transition-opacity" />

                      <div className="absolute top-3 left-3 z-10">
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 shadow-xs uppercase tracking-wider">
                          {photo.category_label || 'Dokumentasi Studio'}
                        </span>
                      </div>

                      <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-zinc-900 text-[11px] font-bold flex items-center gap-1.5 shadow-sm">
                          <Icon icon="solar:eye-bold-duotone" className="w-4 h-4 text-[#e05d82]" />
                          <span>Lihat Foto</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 sm:p-5 space-y-1.5 sm:space-y-2">
                      <p className="font-serif font-bold text-sm text-zinc-900 line-clamp-2 leading-snug group-hover:text-[#c45a76] transition-colors">
                        {photo.caption || 'Dokumentasi kegiatan & karya studio'}
                      </p>
                      <p className="text-[11px] text-zinc-500">Studio CraftByHanifa Magetan</p>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 pt-0">
                    <div className="w-full py-2.5 px-3 rounded-xl bg-zinc-50 group-hover:bg-[#fde8ee] text-zinc-700 group-hover:text-[#c45a76] text-xs font-semibold transition-all flex items-center justify-center gap-1.5 border border-zinc-200 group-hover:border-[#f3d7df] min-h-[44px]">
                      <span>Info & Tanya Jadwal Serupa</span>
                      <Icon
                        icon="solar:alt-arrow-right-bold"
                        className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* State Kosong untuk Tab Galeri */}
        {galleryTab === 'gallery' && galleryList.length === 0 && (
          <div className="py-12 sm:py-16 text-center bg-white rounded-3xl border border-[#ebdcd5] p-6 sm:p-8 max-w-lg mx-auto shadow-2xs">
            <Icon
              icon="solar:gallery-bold-duotone"
              className="w-10 h-10 text-[#df829b] mx-auto mb-3 opacity-60"
            />
            <h3 className="font-serif font-bold text-base text-zinc-900 mb-1">
              Belum Ada Foto Dokumentasi
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Foto dokumentasi workshop akan segera diunggah oleh studio.
            </p>
          </div>
        )}

        {/* State Kosong untuk Tab Semua jika Keduanya Kosong */}
        {galleryTab === 'all' && activeNews.length === 0 && galleryList.length === 0 && (
          <div className="py-12 sm:py-16 text-center bg-white rounded-3xl border border-[#ebdcd5] p-6 sm:p-8 max-w-lg mx-auto shadow-2xs">
            <Icon
              icon="solar:camera-bold-duotone"
              className="w-10 h-10 text-[#df829b] mx-auto mb-3 opacity-60"
            />
            <h3 className="font-serif font-bold text-base text-zinc-900 mb-1">
              Galeri Dokumentasi Belum Tersedia
            </h3>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Belum ada foto kegiatan maupun pengumuman workshop saat ini.
            </p>
          </div>
        )}

        {/* Detail Popup Modal Berita & Promosi Event */}
        {selectedNews && (
          <WorkshopNewsModal
            news={selectedNews}
            onClose={() => setSelectedNews(null)}
            whatsappNum={whatsappNum}
          />
        )}
      </section>

      {/* 6. ALUR PENDAFTARAN MUDAH (HOW TO REGISTER) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="p-5 sm:p-8 md:p-12 rounded-3xl bg-white border border-[#ebdcd5] shadow-xs">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
            <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#c45a76] mb-2">
              Simple Registration
            </p>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900 tracking-tight mb-2">
              4 Langkah Mudah Reservasi Workshop
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              Proses pendaftaran cepat, transparan, dan terkonfirmasi langsung dengan tim studio
              kami.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {reservationSteps.map((resStep, idx) => (
              <div
                key={idx}
                className="text-center p-3.5 sm:p-4 rounded-2xl bg-[#faf6f2]/50 sm:bg-transparent border border-[#ebdcd5]/50 sm:border-transparent"
              >
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white sm:bg-[#faf6f2] border border-[#ebdcd5] text-[#c45a76] font-serif font-bold text-base sm:text-lg flex items-center justify-center mx-auto mb-2.5 sm:mb-3 shadow-2xs">
                  {resStep.step || idx + 1}
                </div>
                <h4 className="font-serif font-bold text-xs sm:text-sm text-zinc-900 mb-1">
                  {resStep.title}
                </h4>
                <p className="text-xs text-zinc-600 leading-relaxed">{resStep.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Zoom Modal for Take-Home Creations */}
      {previewTakeHome && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn"
          onClick={() => setPreviewTakeHome(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-md sm:max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#ebdcd5] animate-scaleUp my-auto flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[4/3] w-full bg-zinc-100 shrink-0">
              <Image
                src={previewTakeHome.image_url}
                alt={previewTakeHome.title}
                fill
                className="object-cover"
                priority
              />
              <button
                type="button"
                onClick={() => setPreviewTakeHome(null)}
                className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center cursor-pointer transition-colors shadow-md z-10"
                aria-label="Tutup"
              >
                <Icon icon="solar:close-circle-bold" className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-2 shrink-0">
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#c45a76]">
                <Icon icon="solar:gift-bold-duotone" className="w-4 h-4 shrink-0" />
                <span>Karya Bawa Pulang Workshop</span>
              </div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-zinc-900 leading-snug">
                {previewTakeHome.title}
              </h3>
              {previewTakeHome.description && (
                <p className="text-xs text-zinc-600 leading-relaxed">
                  {previewTakeHome.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
