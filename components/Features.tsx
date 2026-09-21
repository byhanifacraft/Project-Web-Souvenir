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

interface FeatureTheme {
  icon: string;
  gradientBg: string;
  iconColor: string;
  borderColor: string;
  glowColor: string;
}

const FEATURE_THEMES: Record<string, FeatureTheme> = {
  Flame: {
    icon: 'solar:flame-bold-duotone',
    gradientBg: 'bg-gradient-to-br from-amber-500/15 via-orange-500/20 to-rose-500/15',
    iconColor: 'text-orange-500',
    borderColor: 'border-orange-200/80',
    glowColor: 'shadow-orange-500/20',
  },
  Palette: {
    icon: 'solar:palette-bold-duotone',
    gradientBg: 'bg-gradient-to-br from-purple-500/15 via-fuchsia-500/20 to-pink-500/15',
    iconColor: 'text-purple-600',
    borderColor: 'border-purple-200/80',
    glowColor: 'shadow-purple-500/20',
  },
  ShieldCheck: {
    icon: 'solar:shield-check-bold-duotone',
    gradientBg: 'bg-gradient-to-br from-emerald-500/15 via-teal-500/20 to-cyan-500/15',
    iconColor: 'text-emerald-600',
    borderColor: 'border-emerald-200/80',
    glowColor: 'shadow-emerald-500/20',
  },
  BadgeCheck: {
    icon: 'solar:medal-ribbons-star-bold-duotone',
    gradientBg: 'bg-gradient-to-br from-amber-500/20 via-yellow-500/25 to-orange-500/15',
    iconColor: 'text-amber-600',
    borderColor: 'border-amber-300/80',
    glowColor: 'shadow-amber-500/25',
  },
  Sparkles: {
    icon: 'solar:magic-stick-3-bold-duotone',
    gradientBg: 'bg-gradient-to-br from-indigo-500/15 via-purple-500/20 to-pink-500/15',
    iconColor: 'text-indigo-600',
    borderColor: 'border-indigo-200/80',
    glowColor: 'shadow-indigo-500/20',
  },
  Gift: {
    icon: 'solar:gift-bold-duotone',
    gradientBg: 'bg-gradient-to-br from-rose-500/15 via-pink-500/20 to-orange-500/15',
    iconColor: 'text-rose-600',
    borderColor: 'border-rose-200/80',
    glowColor: 'shadow-rose-500/20',
  },
  Truck: {
    icon: 'solar:delivery-bold-duotone',
    gradientBg: 'bg-gradient-to-br from-blue-500/15 via-sky-500/20 to-cyan-500/15',
    iconColor: 'text-blue-600',
    borderColor: 'border-blue-200/80',
    glowColor: 'shadow-blue-500/20',
  },
  Heart: {
    icon: 'solar:heart-angle-bold-duotone',
    gradientBg: 'bg-gradient-to-br from-rose-500/20 via-red-500/20 to-pink-500/15',
    iconColor: 'text-rose-600',
    borderColor: 'border-rose-200/80',
    glowColor: 'shadow-rose-500/20',
  },
  Leaf: {
    icon: 'solar:leaf-bold-duotone',
    gradientBg: 'bg-gradient-to-br from-emerald-500/15 via-green-500/20 to-teal-500/15',
    iconColor: 'text-emerald-600',
    borderColor: 'border-emerald-200/80',
    glowColor: 'shadow-emerald-500/20',
  },
  Award: {
    icon: 'solar:cup-star-bold-duotone',
    gradientBg: 'bg-gradient-to-br from-amber-500/20 via-yellow-500/25 to-amber-600/15',
    iconColor: 'text-amber-600',
    borderColor: 'border-amber-300/80',
    glowColor: 'shadow-amber-500/20',
  },
  Clock: {
    icon: 'solar:clock-circle-bold-duotone',
    gradientBg: 'bg-gradient-to-br from-sky-500/15 via-blue-500/20 to-indigo-500/15',
    iconColor: 'text-sky-600',
    borderColor: 'border-sky-200/80',
    glowColor: 'shadow-sky-500/20',
  },
};

const DEFAULT_THEME: FeatureTheme = {
  icon: 'solar:hand-stars-bold-duotone',
  gradientBg: 'bg-gradient-to-br from-zinc-500/15 via-zinc-400/20 to-zinc-500/15',
  iconColor: 'text-zinc-800',
  borderColor: 'border-zinc-200/80',
  glowColor: 'shadow-zinc-500/15',
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
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-100 text-zinc-700 text-xs font-medium mb-3">
            <Icon icon="solar:stars-minimalistic-bold-duotone" className="w-4 h-4 text-amber-500" />
            <span>Standar Kualitas Studio</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-zinc-900 tracking-tight mb-3">
            {displayTitle}
          </h2>
          <p className="text-zinc-500 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            {displaySubtitle}
          </p>
        </div>

        {/* 4 Grid Cards - Expressive Modern Aesthetic */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {displayFeatures.map((feature: FeatureItem, idx: number) => {
            const isCustomImg =
              typeof feature.icon === 'string' &&
              (feature.icon.startsWith('http') || feature.icon.startsWith('/'));

            const theme = FEATURE_THEMES[feature.icon] || DEFAULT_THEME;
            const iconName =
              typeof feature.icon === 'string' && feature.icon.includes(':')
                ? feature.icon
                : theme.icon;

            return (
              <div
                key={idx}
                className="p-6 sm:p-7 rounded-3xl bg-white border border-zinc-200/80 hover:border-zinc-300 hover:shadow-xl hover:shadow-black/[0.04] transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Expressive Icon Box with Glowing Gradient Backdrop */}
                  <div
                    className={`w-14 h-14 rounded-2xl ${theme.gradientBg} border ${theme.borderColor} ${theme.glowColor} shadow-md flex items-center justify-center mb-5 overflow-hidden relative group-hover:scale-110 transition-transform duration-300`}
                  >
                    {isCustomImg ? (
                      <div className="relative w-7 h-7">
                        <Image
                          src={feature.icon}
                          alt={feature.title}
                          fill
                          sizes="28px"
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <Icon
                        icon={iconName}
                        className={`w-7 h-7 ${theme.iconColor} transition-transform duration-300 group-hover:scale-105`}
                      />
                    )}
                  </div>

                  <h3 className="text-[16px] font-semibold text-zinc-900 mb-2 leading-snug group-hover:text-zinc-800 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-zinc-500 leading-relaxed font-normal">
                    {feature.desc}
                  </p>
                </div>

                <div className="pt-3.5 mt-5 border-t border-zinc-100 flex items-center gap-1 text-[11px] font-medium text-zinc-400 group-hover:text-zinc-600 transition-colors">
                  <Icon
                    icon="solar:verified-check-bold-duotone"
                    className="w-3.5 h-3.5 text-emerald-500 shrink-0"
                  />
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
