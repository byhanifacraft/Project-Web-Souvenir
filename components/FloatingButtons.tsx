'use client';

import React, { useState } from 'react';
import { siteConfig } from '@/data/siteConfig';
import { Icon } from '@iconify/react';

interface FloatingButtonsProps {
  config?: {
    name?: string;
    whatsapp?: string;
    shopeeUrl?: string;
  };
}

export default function FloatingButtons({ config }: FloatingButtonsProps) {
  const [showGreeting, setShowGreeting] = useState(true);

  const brandName = config?.name || siteConfig.name;
  const whatsappNum = config?.whatsapp || siteConfig.contact.whatsapp;
  const shopeeUrl = config?.shopeeUrl || siteConfig.contact.shopeeUrl;

  const getWaLink = () => {
    const text = encodeURIComponent(
      `Halo Kak Hanifa (${brandName}), saya ingin konsultasi seputar rekomendasi & pemesanan souvenir handmade.`
    );
    return `https://wa.me/${whatsappNum}?text=${text}`;
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-40 flex flex-col items-end gap-2.5 sm:gap-3">
      {/* Friendly Chat Bubble Prompt */}
      {showGreeting && (
        <div className="bg-white p-2.5 sm:p-3 rounded-2xl shadow-xl border border-zinc-200/80 max-w-[210px] sm:max-w-[240px] text-xs text-zinc-900 relative animate-fadeIn">
          <button
            onClick={() => setShowGreeting(false)}
            className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-zinc-100 text-zinc-400 hover:text-zinc-700 flex items-center justify-center hover:bg-zinc-200 cursor-pointer transition-colors shadow-2xs"
            aria-label="Tutup pesan"
          >
            <Icon icon="solar:close-circle-bold-duotone" className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-center gap-1.5 font-semibold text-zinc-900 mb-0.5 sm:mb-1">
            <Icon icon="solar:chat-round-dots-bold-duotone" className="w-4 h-4 text-[#25D366]" />
            <span className="text-[11px] sm:text-xs">Butuh Rekomendasi?</span>
          </div>
          <p className="text-zinc-500 text-[10px] sm:text-[11px] leading-snug">
            Konsultasikan ide souvenir & mockup gratis bersama Kak Hanifa via WhatsApp.
          </p>
        </div>
      )}

      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Shopee Floating Button */}
        <a
          href={shopeeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#ee4d2d] text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all duration-200"
          title="Toko Shopee Resmi (Craftbyhanifa)"
        >
          <Icon icon="solar:bag-heart-bold-duotone" className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </a>

        {/* WhatsApp Floating Button */}
        <a
          href={getWaLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-xl shadow-[#25D366]/35 hover:scale-110 active:scale-95 transition-all duration-200 animate-pulse-glow"
          title="Chat WhatsApp CraftByHanifa"
        >
          <Icon
            icon="solar:chat-round-call-bold-duotone"
            className="w-6 h-6 sm:w-7 sm:h-7 text-white"
          />
        </a>
      </div>
    </div>
  );
}
