'use client';

import React from 'react';
import { MessageCircle, ShoppingBag, Mail } from 'lucide-react';
import { Icon } from '@iconify/react';

interface ContactSectionProps {
  contactInfo?: {
    name?: string;
    tagline?: string;
    address?: string;
    phone?: string;
    whatsapp?: string;
    whatsapp_display?: string;
    email?: string;
    instagram_url?: string | null;
    shopee_url?: string | null;
    map_embed_url?: string | null;
    operational_hours?: string;
  };
  config?: {
    name?: string;
    whatsapp?: string;
    whatsappDisplay?: string;
    shopeeUrl?: string;
    instagram?: string;
    email?: string;
    fullAddress?: string;
    operationalHours?: string;
  };
}

export default function ContactSection({ contactInfo, config }: ContactSectionProps) {
  const brandName = contactInfo?.name || config?.name || 'CraftByHanifa';
  const whatsappNum = contactInfo?.whatsapp || config?.whatsapp || '6281234567890';
  const whatsappDisplay =
    contactInfo?.whatsapp_display || config?.whatsappDisplay || '+62 812-3456-7890';
  const shopeeUrl =
    contactInfo?.shopee_url || config?.shopeeUrl || 'https://shopee.co.id/hanifakumala';
  const email = contactInfo?.email || config?.email || 'craftbyhanifa@gmail.com';
  const fullAddress =
    contactInfo?.address ||
    config?.fullAddress ||
    'Studio CraftByHanifa, Magetan, Jawa Timur, 63319';
  const operationalHours =
    contactInfo?.operational_hours ||
    config?.operationalHours ||
    'Senin - Sabtu: 08.00 - 17.00 WIB';

  return (
    <section id="kontak" className="py-16 md:py-24 bg-[#f5f5f7] border-t border-zinc-200/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-12">
          <p className="text-xs uppercase tracking-widest text-zinc-400 font-medium mb-2">
            Konsultasi
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 tracking-tight mb-2.5">
            Kontak & Layanan Studio
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed">
            Tim pengrajin kami siap mendiskusikan souvenir terbaik untuk momen bahagia Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: WhatsApp */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-zinc-200/80 text-center flex flex-col items-center justify-between shadow-2xs hover:shadow-xs transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-zinc-100 text-zinc-800 flex items-center justify-center mb-4">
              <Icon icon="solar:chat-round-dots-bold-duotone" className="w-6 h-6 text-zinc-700" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-zinc-900 mb-1">WhatsApp Studio</h3>
              <p className="text-xs text-zinc-500 mb-5">{whatsappDisplay}</p>
            </div>
            <a
              href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent('Halo Kak Hanifa (' + brandName + '), saya ingin konsultasi seputar pemesanan souvenir.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-full bg-[#1d1d1f] text-white text-xs font-medium hover:bg-zinc-800 transition-all flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Chat WhatsApp</span>
            </a>
          </div>

          {/* Card 2: Shopee */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-zinc-200/80 text-center flex flex-col items-center justify-between shadow-2xs hover:shadow-xs transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-zinc-100 text-zinc-800 flex items-center justify-center mb-4">
              <Icon icon="solar:bag-heart-bold-duotone" className="w-6 h-6 text-zinc-700" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-zinc-900 mb-1">Toko Shopee Resmi</h3>
              <p className="text-xs text-zinc-500 mb-5">Pesan sampel satuan & ulasan bintang 5</p>
            </div>
            <a
              href={shopeeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-full bg-zinc-100 text-zinc-800 hover:bg-zinc-200 text-xs font-medium transition-all flex items-center justify-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#ee4d2d]" />
              <span>Kunjungi Shopee</span>
            </a>
          </div>

          {/* Card 3: Workshop */}
          <div className="bg-white p-6 sm:p-7 rounded-2xl border border-zinc-200/80 text-center flex flex-col items-center justify-between shadow-2xs hover:shadow-xs transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-zinc-100 text-zinc-800 flex items-center justify-center mb-4">
              <Icon icon="solar:point-on-map-bold-duotone" className="w-6 h-6 text-zinc-700" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-zinc-900 mb-1">Workshop Studio</h3>
              <p className="text-xs text-zinc-600 mb-1">{fullAddress}</p>
              <p className="text-[11px] text-zinc-400">{operationalHours}</p>
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center gap-1.5 text-xs text-zinc-700 hover:text-zinc-900 font-medium mt-2"
                title={`Kirim email ke ${email}`}
              >
                <Mail className="w-3.5 h-3.5 text-zinc-400" />
                <span>{email}</span>
              </a>
            </div>
            <span className="text-[11px] text-zinc-500 font-medium mt-3 bg-zinc-50 border border-zinc-200/70 px-3 py-1 rounded-full">
              Pengiriman Seluruh Nusantara
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
