'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Icon } from '@iconify/react';

interface NavbarProps {
  config?: {
    name?: string;
    whatsapp?: string;
    shopeeUrl?: string;
  };
}

export default function Navbar({ config }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const brandName = config?.name || 'CraftByHanifa';
  const whatsappNum = config?.whatsapp || '6281234567890';
  const shopeeUrl = config?.shopeeUrl || 'https://shopee.co.id/hanifakumala';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Beranda', href: '/' },
    { label: 'Produk', href: '/produk' },
    { label: 'Workshop', href: '/workshop' },
    { label: 'Tentang Kami', href: '/tentang-kami' },
    { label: 'Kontak', href: '/kontak' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/85 backdrop-blur-xl shadow-xs border-b border-zinc-200/70 py-2.5'
          : 'bg-white/75 backdrop-blur-xl border-b border-zinc-200/50 py-3'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-3 sm:gap-6">
        {/* Brand Logo with Official Shopee Avatar */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0 min-w-0">
          <div className="w-8 sm:w-9 h-8 sm:h-9 rounded-full overflow-hidden relative border border-zinc-200/80 bg-white shadow-2xs group-hover:scale-105 transition-transform shrink-0">
            <Image
              src="/images/products/avatar.jpg"
              alt={brandName}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="min-w-0">
            <span className="text-base sm:text-lg font-semibold tracking-tight text-zinc-900 group-hover:text-zinc-600 transition-colors leading-none block truncate">
              {brandName}
            </span>
            <span className="text-[9px] uppercase tracking-widest text-zinc-400 font-medium block mt-0.5 truncate">
              Studio Lilin & Kriya Magetan
            </span>
          </div>
        </Link>

        {/* Clean 5-Item Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-8 text-[13px] font-normal tracking-tight text-zinc-600">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-1 transition-colors ${
                  active ? 'text-zinc-900 font-medium' : 'text-zinc-500 hover:text-zinc-900'
                }`}
              >
                {link.label}
                {active && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-zinc-900 rounded-full animate-fadeIn" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <a
            href={shopeeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-[#ee4d2d]/10 text-[#ee4d2d] hover:bg-[#ee4d2d] hover:text-white transition-all flex items-center gap-1.5"
          >
            <Icon icon="solar:bag-heart-bold-duotone" className="w-4 h-4" />
            <span>Shopee</span>
          </a>

          <a
            href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent('Halo ' + brandName + ', saya ingin konsultasi pemesanan souvenir.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-1.5 rounded-full text-xs font-semibold bg-[#25D366] text-white hover:bg-[#20bd5a] transition-all flex items-center gap-1.5 shadow-sm shadow-[#25D366]/25 hover:scale-[1.02]"
          >
            <Icon icon="solar:chat-round-call-bold-duotone" className="w-4 h-4 text-white" />
            <span>Konsultasi</span>
          </a>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden w-9 h-9 flex items-center justify-center text-zinc-700 hover:bg-zinc-100 rounded-full transition-colors cursor-pointer shrink-0"
          aria-label="Buka Menu"
        >
          {mobileOpen ? (
            <Icon icon="solar:close-circle-bold-duotone" className="w-6 h-6 text-zinc-900" />
          ) : (
            <Icon icon="solar:hamburger-menu-bold-duotone" className="w-6 h-6 text-zinc-800" />
          )}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-zinc-200/80 bg-white/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    active ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-600 hover:bg-zinc-50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="pt-2 border-t border-zinc-100 flex flex-col gap-2">
            <a
              href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent('Halo ' + brandName + ', saya ingin konsultasi pemesanan souvenir.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-full text-xs font-semibold bg-[#25D366] text-white flex items-center justify-center gap-2 shadow-sm"
            >
              <Icon icon="solar:chat-round-call-bold-duotone" className="w-4 h-4 text-white" />
              <span>Konsultasi WhatsApp</span>
            </a>
            <a
              href={shopeeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 rounded-full text-xs font-medium bg-[#ee4d2d]/10 text-[#ee4d2d] flex items-center justify-center gap-2"
            >
              <Icon icon="solar:bag-heart-bold-duotone" className="w-4 h-4" />
              <span>Buka Toko Shopee</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
