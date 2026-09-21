'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

import Image from 'next/image';
import { Icon } from '@iconify/react';

export interface HeroSlide {
  image: string;
  title: string;
  subtitle: string;
}

export interface HeroData {
  badge?: string;
  title?: string;
  description?: string;
  slides?: HeroSlide[];
}

interface HeroProps {
  config?: {
    name?: string;
    whatsapp?: string;
    shopeeUrl?: string;
    stats?: {
      rating?: number;
      ratingCount?: string;
      orderCompleted?: string;
    };
  };
  hero?: HeroData;
}

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    image: '/images/products/hero-banner.jpg',
    title: 'CraftByHanifa Studio Workshop',
    subtitle: 'Kerajinan Lilin Aromaterapi & Souvenir Magetan',
  },
  {
    image: '/images/products/gift-box.jpg',
    title: 'Exclusive Hampers & Gift Box',
    subtitle: 'Kemasan Rustic Cantik Berpita Siap Dibagikan',
  },
  {
    image: '/images/products/resin-bookmark.jpg',
    title: 'Botanical Resin & Dried Flowers',
    subtitle: 'Sentuhan Estetik Bunga Abadi Asli Indonesia',
  },
];

export default function Hero({ config, hero }: HeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const brandName = config?.name || 'CraftByHanifa';
  const whatsappNum = config?.whatsapp || '6281234567890';
  const shopeeUrl = config?.shopeeUrl || 'https://shopee.co.id/hanifakumala';

  const badge = hero?.badge || '★ 4.85 / 5.0 di Shopee • Studio Magetan, Jawa Timur';
  const title = hero?.title || 'Sentuhan Hangat Kerajinan Tangan untuk Setiap Momen';
  const description =
    hero?.description ||
    'Studio kriya lilin aromaterapi 100% soy wax nabati alami dan souvenir estetik dari Magetan, Jawa Timur untuk pernikahan, seminar, dan perayaan spesial Anda.';

  const slides = hero?.slides && hero.slides.length > 0 ? hero.slides : DEFAULT_SLIDES;

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section
      id="beranda"
      className="pt-8 pb-16 md:pt-14 md:pb-20 relative overflow-hidden bg-transparent"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 text-center lg:text-left">
            {/* Expressive Pill Badge */}
            <div className="inline-flex items-center gap-2 text-[11px] font-medium text-zinc-700 bg-white/90 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-zinc-200/80 shadow-2xs mb-5">
              <Icon
                icon="solar:stars-minimalistic-bold-duotone"
                className="w-4 h-4 text-amber-500"
              />
              <span>{badge}</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.15rem] font-bold text-zinc-900 tracking-tight leading-[1.15] mb-4 whitespace-pre-line">
              {title}
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base text-zinc-500 leading-relaxed max-w-xl mx-auto lg:mx-0 mb-7 whitespace-pre-line">
              {description}
            </p>

            {/* Expressive Value Highlights */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2.5 mb-8 text-xs text-zinc-600 font-medium">
              <div className="flex items-center gap-1.5 bg-zinc-100/70 px-2.5 py-1 rounded-full border border-zinc-200/60">
                <Icon icon="solar:palette-bold-duotone" className="w-3.5 h-3.5 text-purple-600" />
                <span>Free Mockup Desain</span>
              </div>
              <div className="flex items-center gap-1.5 bg-zinc-100/70 px-2.5 py-1 rounded-full border border-zinc-200/60">
                <Icon icon="solar:gift-bold-duotone" className="w-3.5 h-3.5 text-rose-500" />
                <span>Kemasan Pita & Kartu</span>
              </div>
              <div className="flex items-center gap-1.5 bg-zinc-100/70 px-2.5 py-1 rounded-full border border-zinc-200/60">
                <Icon
                  icon="solar:shield-check-bold-duotone"
                  className="w-3.5 h-3.5 text-emerald-600"
                />
                <span>Garansi Seluruh RI</span>
              </div>
            </div>

            {/* Action CTAs - Expressive Pills with WhatsApp Green */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 sm:gap-3">
              <Link
                href="/produk"
                className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#1d1d1f] text-white font-medium text-xs sm:text-sm hover:bg-zinc-800 shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 min-h-[44px]"
              >
                <Icon icon="solar:bag-3-bold-duotone" className="w-4 h-4 text-white" />
                <span>Jelajahi Produk</span>
              </Link>

              <a
                href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent('Halo Kak Hanifa (' + brandName + '), saya ingin konsultasi ide souvenir untuk acara kami.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial px-5 py-3 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-medium text-xs sm:text-sm shadow-sm shadow-[#25D366]/25 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 min-h-[44px]"
              >
                <Icon icon="solar:chat-round-call-bold-duotone" className="w-4 h-4 text-white" />
                <span>Konsultasi WA</span>
              </a>

              <a
                href={shopeeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial px-4 py-3 rounded-full bg-[#ee4d2d] hover:bg-[#d73211] text-white font-medium text-xs sm:text-sm shadow-sm shadow-[#ee4d2d]/20 transition-all flex items-center justify-center gap-1.5 min-h-[44px]"
              >
                <Icon icon="solar:bag-heart-bold-duotone" className="w-4 h-4 text-white" />
                <span>Shopee</span>
              </a>
            </div>
          </div>

          {/* Right Column: Hero Slider Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border border-zinc-200/80 shadow-md bg-zinc-100 aspect-[4/3] group">
              {slides.map((slide, idx) => (
                <div
                  key={idx}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                  }`}
                >
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 550px"
                    className="object-cover"
                    priority={idx === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white z-10">
                    <h3 className="font-serif font-bold text-base sm:text-lg mb-1 leading-snug drop-shadow-sm">
                      {slide.title}
                    </h3>
                    <p className="text-xs text-white/80 line-clamp-1">{slide.subtitle}</p>
                  </div>
                </div>
              ))}

              {/* Prev / Next Navigation Arrows */}
              {slides.length > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/50 backdrop-blur-xs text-white flex items-center justify-center opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity hover:bg-black/70 cursor-pointer"
                    aria-label="Foto Sebelumnya"
                  >
                    <Icon icon="solar:alt-arrow-left-bold" className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-black/50 backdrop-blur-xs text-white flex items-center justify-center opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity hover:bg-black/70 cursor-pointer"
                    aria-label="Foto Berikutnya"
                  >
                    <Icon icon="solar:alt-arrow-right-bold" className="w-4 h-4" />
                  </button>
                </>
              )}

              {/* Carousel Dot Indicators */}
              {slides.length > 1 && (
                <div className="absolute bottom-3 right-4 z-20 flex items-center gap-1.5">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        idx === currentIndex
                          ? 'w-5 bg-white shadow-xs'
                          : 'w-1.5 bg-white/50 hover:bg-white'
                      }`}
                      aria-label={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
