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
    <section id="keunggulan" className="py-16 md:py-22 bg-white border-y border-zinc-200/70">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Title with Editorial Elegance */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-xs uppercase tracking-widest text-[#a85267] font-semibold mb-2.5">
            Standar Kualitas Studio
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-zinc-900 tracking-tight mb-3">
            {displayTitle}
          </h2>
          <p className="text-zinc-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            {displaySubtitle}
          </p>
        </div>

        {/* 4 Grid Cards - Clean Boutique Aesthetic */}
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
                className="p-6 sm:p-7 rounded-2xl bg-[#faf9f6] border border-[#ebdcd5] hover:border-[#df829b]/60 hover:shadow-sm transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-11 h-11 rounded-xl bg-[#fdf0f3] text-[#c45a76] border border-[#f3ccd6]/60 flex items-center justify-center mb-5 shadow-2xs overflow-hidden relative">
                    {isCustomImg ? (
                      <div className="relative w-6 h-6">
                        <Image
                          src={feature.icon}
                          alt={feature.title}
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <Icon icon={solarIcon} className="w-6 h-6 text-[#c45a76]" />
                    )}
                  </div>
                  <h3 className="text-base font-serif font-bold text-zinc-900 group-hover:text-[#df829b] transition-colors mb-2 leading-snug">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-zinc-600 leading-relaxed">{feature.desc}</p>
                </div>

                <div className="pt-4 mt-5 border-t border-[#ebdcd5]/70 flex items-center gap-1 text-[11px] font-medium text-[#a85267]">
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
