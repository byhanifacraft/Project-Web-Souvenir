'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Calendar,
  MapPin,
  ArrowRight,
  Flame,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { WorkshopNewsItem } from '@/types/store';
import WorkshopNewsModal from '@/components/WorkshopNewsModal';

interface WorkshopNewsSliderProps {
  newsList?: WorkshopNewsItem[];
  whatsappNum?: string;
}

export default function WorkshopNewsSlider({
  newsList = [],
  whatsappNum = '6281234567890',
}: WorkshopNewsSliderProps) {
  const activeNews = newsList.filter((n) => n.is_active !== false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedNews, setSelectedNews] = useState<WorkshopNewsItem | null>(null);

  useEffect(() => {
    if (activeNews.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeNews.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [activeNews.length]);

  if (activeNews.length === 0) return null;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % activeNews.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + activeNews.length) % activeNews.length);
  };

  const getStatusBadge = (status: string, label?: string) => {
    switch (status) {
      case 'coming_soon':
        return {
          bg: 'bg-amber-500 text-white',
          icon: Sparkles,
          text: label || 'Coming Soon',
        };
      case 'open_registration':
        return {
          bg: 'bg-emerald-600 text-white',
          icon: CheckCircle2,
          text: label || 'Pendaftaran Dibuka',
        };
      case 'completed':
        return {
          bg: 'bg-zinc-700 text-white',
          icon: Clock,
          text: label || 'Dokumentasi',
        };
      default:
        return {
          bg: 'bg-[#c45a76] text-white',
          icon: Sparkles,
          text: label || 'Event Spesial',
        };
    }
  };

  return (
    <>
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-2 pb-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fde8ee] text-[#c45a76] text-[10px] font-bold uppercase tracking-wider mb-2">
              <Flame className="w-3.5 h-3.5" />
              <span>Agenda & Berita Studio</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900 tracking-tight">
              Kabar Workshop & Promo Terkini
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">
              Informasi batch kelas terdekat, pengumuman promo, dan dokumentasi workshop
              CraftByHanifa.
            </p>
          </div>

          <Link
            href="/workshop"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#c45a76] hover:text-[#a8445e] transition-colors shrink-0"
          >
            <span>Semua Paket Workshop</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Carousel Slider Card */}
        <div className="relative rounded-3xl overflow-hidden border border-[#ebdcd5] bg-zinc-900 shadow-md aspect-[16/10] sm:aspect-[21/9] group">
          {activeNews.map((item, idx) => {
            const badge = getStatusBadge(item.status, item.status_label);
            const BadgeIcon = badge.icon;
            const isCurrent = idx === currentIndex;

            return (
              <div
                key={item.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  isCurrent ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                {/* Background Image */}
                <Image
                  src={item.image_url}
                  alt={item.title}
                  fill
                  className="object-cover"
                  priority={idx === 0}
                />

                {/* Dark Gradient Overlay for optimal readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />

                {/* Content Overlay */}
                <div className="absolute inset-0 p-5 sm:p-8 flex flex-col justify-between z-10">
                  {/* Top Bar: Badges */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold shadow-xs ${badge.bg}`}
                    >
                      <BadgeIcon className="w-3.5 h-3.5" />
                      <span>{badge.text}</span>
                    </span>

                    {item.category_label && (
                      <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-xs text-white text-[10px] font-semibold">
                        {item.category_label}
                      </span>
                    )}
                  </div>

                  {/* Bottom Bar: Title, Meta, and Action Button */}
                  <div className="space-y-2.5 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-white/80 text-[11px] sm:text-xs">
                      {item.date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-amber-300" />
                          <span>{item.date}</span>
                        </span>
                      )}
                      {item.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-rose-300" />
                          <span>{item.location}</span>
                        </span>
                      )}
                    </div>

                    <h3 className="font-serif font-bold text-lg sm:text-2xl lg:text-3xl text-white leading-snug drop-shadow-sm line-clamp-2">
                      {item.title}
                    </h3>

                    {item.summary && (
                      <p className="text-xs sm:text-sm text-white/90 line-clamp-2 leading-relaxed max-w-xl hidden sm:block">
                        {item.summary}
                      </p>
                    )}

                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => setSelectedNews(item)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-[#fde8ee] text-[#2e1c24] text-xs font-bold shadow-md transition-all hover:scale-105 cursor-pointer min-h-[40px]"
                      >
                        <span>Baca Berita & Info Pendaftaran</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#e05d82]" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Prev / Next Arrows */}
          {activeNews.length > 1 && (
            <>
              <button
                type="button"
                onClick={prevSlide}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-xs text-white flex items-center justify-center transition-all opacity-90 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer shadow-lg"
                aria-label="Berita Sebelumnya"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-xs text-white flex items-center justify-center transition-all opacity-90 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer shadow-lg"
                aria-label="Berita Berikutnya"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Dots Indicator */}
          {activeNews.length > 1 && (
            <div className="absolute bottom-3.5 right-5 z-20 flex items-center gap-1.5">
              {activeNews.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    idx === currentIndex
                      ? 'w-6 bg-white shadow-xs'
                      : 'w-1.5 bg-white/50 hover:bg-white'
                  }`}
                  aria-label={`Slide Berita ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Detail Popup Modal */}
      {selectedNews && (
        <WorkshopNewsModal
          news={selectedNews}
          onClose={() => setSelectedNews(null)}
          whatsappNum={whatsappNum}
        />
      )}
    </>
  );
}
