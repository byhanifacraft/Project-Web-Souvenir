'use client';

import React, { useState } from 'react';
import { siteConfig } from '@/data/siteConfig';
import { MessageCircle, ShoppingBag, X } from 'lucide-react';
import { Icon } from '@iconify/react';

export default function FloatingButtons() {
  const [showGreeting, setShowGreeting] = useState(true);

  const getWaLink = () => {
    const text = encodeURIComponent(
      `Halo Kak Hanifa (CraftByHanifa), saya ingin konsultasi seputar rekomendasi & pemesanan souvenir handmade.`
    );
    return `https://wa.me/${siteConfig.contact.whatsapp}?text=${text}`;
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      {/* Friendly Chat Bubble Prompt */}
      {showGreeting && (
        <div className="bg-white p-3 rounded-xl shadow-lg border border-zinc-200/80 max-w-[230px] text-xs text-zinc-900 relative animate-fadeIn">
          <button
            onClick={() => setShowGreeting(false)}
            className="absolute -top-2 -left-2 w-5 h-5 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center hover:bg-zinc-200 cursor-pointer"
            aria-label="Tutup pesan"
          >
            <X className="w-3 h-3" />
          </button>
          <div className="flex items-center gap-1.5 font-semibold text-zinc-900 mb-0.5">
            <Icon icon="solar:chat-round-dots-bold-duotone" className="w-4 h-4 text-[#128c7e]" />
            <span>Butuh Rekomendasi?</span>
          </div>
          <p className="text-zinc-500 text-[11px] leading-snug">
            Konsultasikan ide souvenir & mockup gratis bersama Kak Hanifa via WhatsApp.
          </p>
        </div>
      )}

      <div className="flex items-center gap-2.5">
        {/* Shopee Floating Button */}
        <a
          href={siteConfig.contact.shopeeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-full bg-[#ee4d2d] text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all duration-200"
          title="Toko Shopee Resmi (Craftbyhanifa)"
        >
          <ShoppingBag className="w-5 h-5" />
        </a>

        {/* WhatsApp Floating Button */}
        <a
          href={getWaLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 rounded-full bg-[#128c7e] hover:bg-[#0e7065] text-white flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all duration-200 animate-pulse-glow"
          title="Chat WhatsApp CraftByHanifa"
        >
          <MessageCircle className="w-7 h-7" />
        </a>
      </div>
    </div>
  );
}
