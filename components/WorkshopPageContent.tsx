'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Sparkles,
  Flame,
  Clock,
  Users,
  Check,
  MessageCircle,
  Gift,
  Award,
  Heart,
  Droplets,
  Flower2,
  PackageCheck,
  ShieldCheck,
  ArrowRight,
  Eye,
  X,
} from 'lucide-react';
import { GalleryImageItem } from '@/types/store';
import { WorkshopPackage, CurriculumStep, ReservationStep } from '@/types/workshop';
import {
  DEFAULT_WORKSHOP_PACKAGES,
  DEFAULT_CURRICULUM_STEPS,
  DEFAULT_RESERVATION_STEPS,
} from '@/lib/workshopDefaults';

interface WorkshopPageContentProps {
  whatsappNum: string;
  brandName: string;
  galleryImages: GalleryImageItem[];
  initialPackages?: WorkshopPackage[];
  initialCurriculum?: CurriculumStep[];
  initialReservationSteps?: ReservationStep[];
}

const CURATED_WORKSHOP_GALLERY = [
  {
    url: '/images/products/studio-workshop.jpg',
    title: 'Suasana Studio & Meja Kerja',
    caption: 'Suasana belajar santai dan hangat di studio CraftByHanifa Magetan',
    tag: 'Studio Atmosphere',
  },
  {
    url: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80',
    title: 'Praktik Penuangan Wax Cair',
    caption: 'Peserta mempraktikkan pouring lilin soy wax pada suhu yang presisi',
    tag: 'Pouring Technique',
  },
  {
    url: 'https://images.unsplash.com/photo-1585652757173-57de8b1b744b?auto=format&fit=crop&w=800&q=80',
    title: 'Peracikan Scent Oil & Aroma',
    caption: 'Mencampurkan essential oil pilihan untuk menciptakan signature aroma unik',
    tag: 'Scent Blending',
  },
  {
    url: '/images/products/aromatherapy-candle.jpg',
    title: 'Kreasi Lilin Jar Aromaterapi',
    caption: 'Hasil lilin kaca amber karya peserta dengan dried floral botanicals',
    tag: 'Finished Product',
  },
  {
    url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80',
    title: 'Sesi Belajar Bersama (Group Session)',
    caption: 'Keseruan interaksi dan tawa peserta selama workshop berlangsung',
    tag: 'Group Activity',
  },
  {
    url: '/images/products/gift-box.jpg',
    title: 'Packaging Hampers Siap Bawa Pulang',
    caption: 'Kemasan hardbox estetik berpita satin untuk melindungi hasil kreasi Anda',
    tag: 'Gift Packaging',
  },
];

export default function WorkshopPageContent({
  whatsappNum,
  brandName,
  galleryImages,
  initialPackages,
  initialCurriculum,
  initialReservationSteps,
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

  const [selectedPackage, setSelectedPackage] = useState<string>(packages[0]?.id || 'premium');
  const [activeLightbox, setActiveLightbox] = useState<string | null>(null);

  // Combine curated workshop photos with any uploaded studio photos
  const displayPhotos = [
    ...CURATED_WORKSHOP_GALLERY,
    ...(galleryImages || []).slice(0, 4).map((g, i) => ({
      url: g.image_url,
      title: g.caption || `Karya Studio #${i + 1}`,
      caption: g.caption || 'Dokumentasi kegiatan dan karya studio CraftByHanifa',
      tag: g.category_label || 'Dokumentasi',
    })),
  ];

  const handleBooking = (pkg: WorkshopPackage) => {
    const url = `https://wa.me/${whatsappNum}?text=${encodeURIComponent(pkg.waMessage)}`;
    window.open(url, '_blank');
  };

  const scrollToPackages = () => {
    const el = document.getElementById('paket-workshop');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-20 pb-16">
      {/* 1. HERO BANNER */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#fdf4f7] via-[#faf6f2] to-white pt-8 pb-16 md:pt-14 md:pb-24 border-b border-[#ebdcd5]/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left: Text & CTA */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fde8ee] border border-[#f3d7df] text-[#c45a76] text-xs font-semibold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-[#e05d82]" />
                <span>Studio Kerajinan Lilin Aromaterapi Magetan</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[2.75rem] font-serif font-bold text-zinc-900 leading-[1.15] tracking-tight">
                Rasakan Ketenangan Meracik{' '}
                <span className="text-[#c45a76] italic font-normal">Lilin Aromaterapi</span> Sendiri
              </h1>

              <p className="text-sm sm:text-base text-zinc-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Ajak orang tersayang atau nikmati momen me-time berharga di studio {brandName}.
                Pelajari seni meramu 100% soy wax nabati murni, perpaduan fragrance oil mewah, dan
                hiasan botanical dried flowers yang menenangkan jiwa.
              </p>

              {/* 4 Value Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3 rounded-2xl bg-white border border-[#ebdcd5] shadow-2xs text-left">
                  <div className="text-xs font-bold text-zinc-800 flex items-center gap-1.5 mb-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>100% Soy Wax</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 leading-tight">
                    Alami, bebas asap hitam & aman dihirup.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-white border border-[#ebdcd5] shadow-2xs text-left">
                  <div className="text-xs font-bold text-zinc-800 flex items-center gap-1.5 mb-1">
                    <Droplets className="w-3.5 h-3.5 text-[#c45a76]" />
                    <span>12+ Signature Oil</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 leading-tight">
                    Bebas racik wangi favorit Anda.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-white border border-[#ebdcd5] shadow-2xs text-left">
                  <div className="text-xs font-bold text-zinc-800 flex items-center gap-1.5 mb-1">
                    <Gift className="w-3.5 h-3.5 text-amber-600" />
                    <span>Bawa Pulang Karya</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 leading-tight">
                    Dikemas gift box cantik berpita.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-white border border-[#ebdcd5] shadow-2xs text-left">
                  <div className="text-xs font-bold text-zinc-800 flex items-center gap-1.5 mb-1">
                    <Award className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Sertifikat Resmi</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 leading-tight">
                    Apresiasi skill kreasi artisan.
                  </p>
                </div>
              </div>

              {/* Action CTA Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-3">
                <button
                  onClick={scrollToPackages}
                  className="px-6 py-3.5 rounded-full bg-[#c45a76] hover:bg-[#a8445e] text-white text-xs sm:text-sm font-semibold shadow-md shadow-[#c45a76]/25 transition-all hover:scale-[1.02] cursor-pointer"
                >
                  Lihat Jadwal & Paket Kelas
                </button>
                <a
                  href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent('Halo Kak Hanifa, saya ingin tanya ketersediaan jadwal workshop lilin aromaterapi.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#128c7e] hover:bg-[#0e7065] text-white text-xs sm:text-sm font-semibold shadow-md shadow-[#128c7e]/20 transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Konsultasi Slot via WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Right: Studio Photo Showcase Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Decorative glow */}
                <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-[#df829b]/30 via-[#fde8ee]/40 to-transparent blur-xl -z-10" />

                {/* Floating Rating Pill - Positioned cleanly at Top-Right so it never collides with photo text */}
                <div className="absolute -top-4 -right-2 sm:-top-5 sm:-right-4 bg-white/95 backdrop-blur-md border border-[#ebdcd5] rounded-2xl px-4 py-2.5 shadow-lg flex items-center gap-3 z-10">
                  <div className="w-9 h-9 rounded-xl bg-[#fde8ee] text-[#c45a76] flex items-center justify-center shrink-0">
                    <Heart className="w-4 h-4 fill-[#c45a76]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-zinc-900 leading-tight">
                      4.9 / 5.0 Rating Peserta
                    </div>
                    <div className="text-[10px] text-zinc-500">500+ kreasi lilin tercipta</div>
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent pointer-events-none" />

                  <div className="absolute bottom-5 left-5 right-5 text-white pointer-events-none">
                    <div className="inline-block px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold tracking-wider uppercase mb-1.5">
                      Authentic Studio Experience
                    </div>
                    <p className="font-serif text-lg sm:text-xl font-bold leading-snug">
                      Studio Lilin Magetan, Jawa Timur
                    </p>
                    <p className="text-xs text-white/90 mt-0.5">
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
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#c45a76] mb-2">
            Pilihan Sesi & Biaya Investasi
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-zinc-900 tracking-tight mb-3">
            Pilih Paket Workshop Favorit Anda
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
            Semua paket sudah termasuk seluruh bahan baku murni, alat pelindung, instruktur
            berpengalaman, serta hasil lilin lengkap dengan gift box untuk dibawa pulang.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {packages.map((pkg) => {
            const isSelected = selectedPackage === pkg.id;
            return (
              <div
                key={pkg.id}
                onClick={() => setSelectedPackage(pkg.id)}
                className={`relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? 'bg-white border-2 border-[#c45a76] shadow-xl ring-4 ring-[#c45a76]/10'
                    : 'bg-white/90 backdrop-blur-xs border-2 border-[#ebdcd5] hover:border-[#df829b]/70 hover:shadow-md'
                }`}
              >
                {/* Popular Badge */}
                {pkg.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#c45a76] to-[#df829b] text-white text-[11px] font-bold uppercase tracking-wider shadow-sm pointer-events-none">
                    {pkg.badge}
                  </div>
                )}

                <div className="flex-1 flex flex-col">
                  {/* Interactive Checkbox / Selection Header */}
                  <div className="flex items-center justify-between gap-2 mb-3">
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
                        {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                      </span>
                      <span className="text-[11px]">{isSelected ? 'Dipilih' : 'Pilih Paket'}</span>
                    </div>
                  </div>

                  {/* Title & Tagline */}
                  <div className="mb-4">
                    <h3 className="font-serif font-bold text-xl text-zinc-900 mb-1">{pkg.name}</h3>
                    <p className="text-xs text-zinc-500 leading-relaxed min-h-[32px]">
                      {pkg.tagline}
                    </p>
                  </div>

                  {/* Price Tag */}
                  <div className="py-4 my-2 border-y border-zinc-100 bg-[#faf6f2]/50 -mx-6 sm:-mx-7 px-6 sm:px-7">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl sm:text-4xl font-bold font-serif text-[#c45a76]">
                        {pkg.price}
                      </span>
                      <span className="text-xs text-zinc-500">/ orang</span>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-[11px] text-zinc-600 font-medium">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#c45a76]" />
                        {pkg.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-zinc-500" />
                        {pkg.capacity}
                      </span>
                    </div>
                  </div>

                  {/* Feature Checklist */}
                  <div className="space-y-4 pt-4 mb-6 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-700 mb-2.5">
                        Materi & Fasilitas:
                      </p>
                      <ul className="space-y-2 text-xs text-zinc-600">
                        {pkg.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Take Home Items */}
                    <div className="pt-3 border-t border-dashed border-zinc-200">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-[#c45a76] mb-2 flex items-center gap-1.5">
                        <Gift className="w-3.5 h-3.5" />
                        <span>Karya Dibawa Pulang:</span>
                      </p>
                      <ul className="space-y-1.5 text-xs text-zinc-700 font-medium">
                        {pkg.takeHome.map((item, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 bg-[#fdf4f7] p-2 rounded-xl border border-[#f3d7df]"
                          >
                            <PackageCheck className="w-3.5 h-3.5 text-[#c45a76] shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
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
                  className={`w-full py-3.5 rounded-full text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm mt-2 ${
                    isSelected
                      ? 'bg-[#128c7e] hover:bg-[#0e7065] text-white shadow-md shadow-[#128c7e]/25 ring-2 ring-[#128c7e]/30 scale-[1.01]'
                      : 'bg-[#128c7e] hover:bg-[#0e7065] text-white shadow-[#128c7e]/15'
                  }`}
                >
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  <span>{pkg.buttonLabel}</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Note under packages */}
        <div className="mt-8 p-4 rounded-2xl bg-[#faf6f2] border border-[#ebdcd5] text-center max-w-xl mx-auto">
          <p className="text-xs text-zinc-600">
            💡{' '}
            <strong>Punya grup lebih dari 10 orang atau ingin diundang ke sekolah/kantor?</strong>{' '}
            Hubungi kami via WhatsApp untuk mendapatkan proposal materi & diskon grup khusus.
          </p>
        </div>
      </section>

      {/* 3. KURIKULUM & PROSES BELAJAR (LEARNING JOURNEY) */}
      <section className="bg-gradient-to-b from-white via-[#fdf4f7]/40 to-white py-14 border-y border-[#ebdcd5]/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#c45a76] mb-2">
              Step-by-Step Guidance
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-zinc-900 tracking-tight mb-3">
              Kurikulum Praktik: Apa Saja yang Dipelajari?
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              Kami menyusun materi agar mudah dipahami, interaktif, dan langsung dipraktikkan tanpa
              teori rumit yang membosankan.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {curriculum.map((step, idx) => {
              const icons = [Flame, Droplets, Clock, Flower2];
              const IconComp = icons[idx % icons.length];
              return (
                <div
                  key={idx}
                  className="bg-white p-6 rounded-3xl border border-[#ebdcd5] shadow-2xs hover:shadow-md hover:border-[#df829b] transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-serif text-3xl font-bold text-[#c45a76]/30">
                        {step.step || `0${idx + 1}`}
                      </span>
                      <div className="w-10 h-10 rounded-2xl bg-[#fde8ee] text-[#c45a76] flex items-center justify-center">
                        <IconComp className="w-5 h-5" />
                      </div>
                    </div>
                    <h3 className="font-serif font-bold text-base text-zinc-900 mb-2">
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

      {/* 5. DOKUMENTASI KEGIATAN & KARYA WORKSHOP (PHOTO SHOWCASE) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#c45a76] mb-1">
              Studio Atmosphere
            </p>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900 tracking-tight">
              Dokumentasi Suasana & Hasil Karya Peserta
            </h2>
          </div>
          <a
            href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent('Halo Kak Hanifa, saya ingin melihat dokumentasi kegiatan workshop lainnya.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#c45a76] hover:text-[#a8445e] transition-colors"
          >
            <span>Tanya Jadwal Sesi Selanjutnya</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayPhotos.map((item, idx) => (
            <div
              key={idx}
              onClick={() => setActiveLightbox(item.url)}
              className="group relative rounded-3xl overflow-hidden bg-zinc-100 border border-[#ebdcd5] aspect-[4/3] cursor-pointer shadow-2xs hover:shadow-md transition-all"
            >
              <Image
                src={item.url}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-8 h-8 rounded-full bg-white/80 backdrop-blur-md text-zinc-800 flex items-center justify-center">
                  <Eye className="w-4 h-4" />
                </div>
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#c45a76]/80 backdrop-blur-xs text-[10px] font-bold uppercase tracking-wider mb-1">
                  {item.tag}
                </span>
                <h4 className="font-serif font-bold text-sm sm:text-base leading-tight mb-0.5">
                  {item.title}
                </h4>
                <p className="text-[11px] text-zinc-200 line-clamp-1">{item.caption}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {activeLightbox && (
          <div
            onClick={() => setActiveLightbox(null)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl"
            >
              <button
                onClick={() => setActiveLightbox(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="relative aspect-[16/10] w-full">
                <Image
                  src={activeLightbox}
                  alt="Dokumentasi Workshop"
                  fill
                  className="object-contain bg-zinc-950"
                />
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 6. ALUR PENDAFTARAN MUDAH (HOW TO REGISTER) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#ebdcd5] shadow-xs">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-[11px] uppercase tracking-[0.2em] font-bold text-[#c45a76] mb-2">
              Simple Registration
            </p>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900 tracking-tight mb-2">
              4 Langkah Mudah Reservasi Workshop
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600">
              Proses pendaftaran cepat, transparan, dan terkonfirmasi langsung dengan tim studio
              kami.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {reservationSteps.map((resStep, idx) => (
              <div key={idx} className="text-center p-4">
                <div className="w-12 h-12 rounded-2xl bg-[#faf6f2] border border-[#ebdcd5] text-[#c45a76] font-serif font-bold text-lg flex items-center justify-center mx-auto mb-3 shadow-2xs">
                  {resStep.step || idx + 1}
                </div>
                <h4 className="font-serif font-bold text-sm text-zinc-900 mb-1">{resStep.title}</h4>
                <p className="text-xs text-zinc-600 leading-relaxed">{resStep.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
