'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Icon } from '@iconify/react';

interface FooterProps {
  config?: {
    name?: string;
    tagline?: string;
    description?: string;
    owner?: string;
    whatsapp?: string;
    whatsappDisplay?: string;
    shopeeUrl?: string;
    instagramUrl?: string;
    email?: string;
    fullAddress?: string;
    operationalHours?: string;
  };
}

function InstagramIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export default function Footer({ config }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const brandName = config?.name || 'CraftByHanifa';
  const owner = config?.owner || 'Hanifa Kumala';
  const description =
    config?.description ||
    'Studio kerajinan lilin aromaterapi soy wax murni & souvenir custom eksklusif dari Magetan, Jawa Timur untuk momen bahagia pernikahan, seminar, dan acara spesial Anda.';
  const whatsappNum = config?.whatsapp || '6281234567890';
  const whatsappDisplay = config?.whatsappDisplay || '+62 812-3456-7890';
  const shopeeUrl = config?.shopeeUrl || 'https://shopee.co.id/hanifakumala';
  const instagramUrl = config?.instagramUrl || 'https://instagram.com/craftbyhanifa';
  const email = config?.email || 'craftbyhanifa@gmail.com';
  const fullAddress = config?.fullAddress || 'Studio CraftByHanifa, Magetan, Jawa Timur, 63319';
  const operationalHours = config?.operationalHours || 'Senin - Sabtu: 08.00 - 17.00 WIB';

  return (
    <footer className="bg-[#171615] text-zinc-300 pt-14 pb-8 border-t border-zinc-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-zinc-800/80">
          {/* Col 1: Brand */}
          <div className="md:col-span-7">
            <Link href="/" className="flex items-center gap-3 mb-3.5 group">
              <div className="w-8 h-8 rounded-full overflow-hidden relative border border-white/20 bg-white group-hover:scale-105 transition-transform shrink-0">
                <Image
                  src="/images/products/avatar.jpg"
                  alt={brandName}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="font-serif text-xl font-bold text-white tracking-tight">
                {brandName}
              </span>
            </Link>
            <p className="text-xs text-zinc-400 leading-relaxed mb-6 max-w-md">{description}</p>
            <div className="flex items-center gap-2.5">
              <a
                href={shopeeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#ee4d2d] text-white flex items-center justify-center hover:brightness-110 hover:scale-105 transition-all shadow-xs"
                title="Toko Shopee Resmi"
              >
                <Icon icon="solar:bag-heart-bold-duotone" className="w-4 h-4 text-white" />
              </a>
              <a
                href={`https://wa.me/${whatsappNum}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:bg-[#20bd5a] hover:scale-105 transition-all shadow-xs shadow-[#25D366]/30"
                title="Konsultasi WhatsApp"
              >
                <Icon icon="solar:chat-round-call-bold-duotone" className="w-4 h-4 text-white" />
              </a>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white flex items-center justify-center hover:brightness-110 hover:scale-105 transition-all shadow-xs"
                title="Instagram @craftbyhanifa"
              >
                <InstagramIcon className="w-3.5 h-3.5 text-white" />
              </a>
              <a
                href={`mailto:${email}`}
                className="w-8 h-8 rounded-full bg-[#ea4335] text-white flex items-center justify-center hover:brightness-110 hover:scale-105 transition-all shadow-xs"
                title={`Kirim Email: ${email}`}
              >
                <Icon icon="solar:letter-bold-duotone" className="w-4 h-4 text-white" />
              </a>
            </div>
          </div>

          {/* Col 2: Workshop Details */}
          <div className="md:col-span-5">
            <h4 className="font-serif font-bold text-white text-xs uppercase tracking-widest mb-3.5">
              Studio Workshop
            </h4>
            <div className="space-y-2.5 text-xs text-zinc-400">
              <p className="flex items-start gap-2">
                <Icon
                  icon="solar:point-on-map-bold-duotone"
                  className="w-4 h-4 text-[#df829b] shrink-0 mt-0.5"
                />
                <span>{fullAddress}</span>
              </p>
              <p className="flex items-center gap-2">
                <Icon
                  icon="solar:phone-calling-rounded-bold-duotone"
                  className="w-4 h-4 text-[#25D366] shrink-0"
                />
                <span>WA: {whatsappDisplay}</span>
              </p>
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-2 hover:text-white transition-colors"
                title={`Kirim email ke ${email}`}
              >
                <Icon
                  icon="solar:letter-bold-duotone"
                  className="w-4 h-4 text-[#ea4335] shrink-0"
                />
                <span>Email: {email}</span>
              </a>
              <p className="text-[11px] text-zinc-500 pt-1">Jam Layanan: {operationalHours}</p>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-500 gap-3">
          <p>
            &copy; {currentYear} <strong>{brandName}</strong> ({owner}). Kerajinan Tangan Asli
            Magetan, Jawa Timur.
          </p>

          <div className="flex items-center gap-3.5">
            <span>Handmade with care in Magetan, Indonesia</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
