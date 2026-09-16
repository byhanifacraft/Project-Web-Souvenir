'use client';

import React from 'react';
import Image from 'next/image';
import { whyChooseUs } from '@/data/siteConfig';
import { Icon } from '@iconify/react';

export interface FeatureItem {
  icon: string;
  title: string;
  desc: string;
  linkText?: string;
}

const solarDuotoneMap: Record<string, string> = {
  Sparkles: 'solar:hand-stars-bold-duotone',
  Palette: 'solar:palette-bold-duotone',
  ShieldCheck: 'solar:shield-check-bold-duotone',
  BadgeCheck: 'solar:medal-ribbons-star-bold-duotone',
  Gift: 'solar:gift-bold-duotone',
  Truck: 'solar:delivery-bold-duotone',
  Heart: 'solar:heart-bold-duotone',
  Leaf: 'solar:leaf-bold-duotone',
  Award: 'solar:cup-star-bold-duotone',
  Clock: 'solar:clock-circle-bold-duotone',
  CheckCircle2: 'solar:check-circle-bold-duotone',
  Flame: 'solar:flame-bold-duotone',
  Star: 'solar:star-bold-duotone',
};

interface FeaturesProps {
  features?: FeatureItem[];
  title?: string | null;
  subtitle?: string | null;
}

export default function Features({ features, title, subtitle }: FeaturesProps) {
  // Gunakan data dinamis dari database CMS atau fallback ke default siteConfig
  const displayFeatures = features && features.length > 0 ? features : whyChooseUs;
  const displayTitle = title || 'Mengapa Souvenir CraftByHanifa Selalu Berkesan?';
  const displaySubtitle =
    subtitle ||
    'Setiap karya dibuat manual dengan ketelitian tinggi oleh pengrajin lokal di Magetan, menghasilkan souvenir bermakna yang berguna dan membahagiakan para tamu.';

  return (
    <section id="keunggulan" className="py-16 md:py-24 bg-white border-y border-zinc-200/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-xs uppercase tracking-widest text-zinc-400 font-medium mb-2.5">
            Standar Kualitas Studio
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-zinc-900 tracking-tight mb-3">
            {displayTitle}
          </h2>
          <p className="text-zinc-500 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            {displaySubtitle}
          </p>
        </div>

        {/* 4 Grid Cards - Apple Minimalist Aesthetic */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {displayFeatures.map((feature: FeatureItem, idx: number) => {
            const isCustomImg =
              typeof feature.icon === 'string' &&
              (feature.icon.startsWith('http') || feature.icon.startsWith('/'));
            const solarIcon =
              typeof feature.icon === 'string' && feature.icon.includes(':')
                ? feature.icon
                : solarDuotoneMap[feature.icon] || 'solar:hand-stars-bold-duotone';

            return (
              <div
                key={idx}
                className="p-6 sm:p-7 rounded-2xl bg-[#fbfbfd] border border-zinc-200/80 hover:border-zinc-300 hover:bg-white hover:shadow-xs transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 text-zinc-800 flex items-center justify-center mb-4 overflow-hidden relative">
                    {isCustomImg ? (
                      <div className="relative w-5 h-5">
                        <Image
                          src={feature.icon}
                          alt={feature.title}
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <Icon icon={solarIcon} className="w-5 h-5 text-zinc-700" />
                    )}
                  </div>
                  <h3 className="text-[15px] font-semibold text-zinc-900 mb-1.5 leading-snug">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">{feature.desc}</p>
                </div>

                <div className="pt-3 mt-4 border-t border-zinc-200/60 flex items-center gap-1 text-[11px] font-medium text-zinc-500">
                  <span>{feature.linkText || 'Standar Pengrajin Magetan'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
