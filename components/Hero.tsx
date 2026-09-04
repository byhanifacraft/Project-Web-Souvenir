'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { MessageCircle, ShoppingBag, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

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
            {/* Subtle Editorial Badge */}
            <div className="inline-flex items-center gap-2 text-xs font-medium text-zinc-500 tracking-wide mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              <span>{badge}</span>
            </div>

            {/* Dynamic Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-serif font-bold text-zinc-900 tracking-tight leading-[1.16] mb-5 whitespace-pre-line">
              {title}
            </h1>

            {/* Dynamic Description */}
            <p className="text-sm sm:text-base text-zinc-600 leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8 whitespace-pre-line">
              {description}
            </p>

            {/* Clean Value Highlights (Minimalist) */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 mb-8 text-xs text-zinc-600 font-medium">
              <div className="flex items-center gap-1.5">
                <span className="text-[#df829b]">✦</span>
                <span>Free Mockup Desain</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[#df829b]">✦</span>
                <span>Kemasan Pita & Kartu Ucapan</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[#df829b]">✦</span>
                <span>Garansi Pengiriman Seluruh RI</span>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <a
                href="/produk"
                className="px-6 py-3 rounded-full bg-[#df829b] text-white font-medium text-xs sm:text-sm hover:bg-[#c96c85] shadow-sm transition-all flex items-center gap-2"
              >
                <span>Katalog Souvenir</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent('Halo Kak Hanifa (' + brandName + '), saya ingin konsultasi ide souvenir untuk acara kami.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-full bg-[#128c7e] text-white font-medium text-xs sm:text-sm hover:bg-[#0e7065] shadow-sm transition-all flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-white" />
                <span>Konsultasi WA</span>
              </a>

              <a
                href={shopeeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 rounded-full bg-[#ee4d2d] text-white font-medium text-xs sm:text-sm hover:bg-[#d73211] transition-all flex items-center gap-1.5 shadow-sm"
              >
                <ShoppingBag className="w-4 h-4 text-white" />
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
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 backdrop-blur-xs text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 cursor-pointer"
                    aria-label="Foto Sebelumnya"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/40 backdrop-blur-xs text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 cursor-pointer"
                    aria-label="Foto Berikutnya"
                  >
                    <ChevronRight className="w-4 h-4" />
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
