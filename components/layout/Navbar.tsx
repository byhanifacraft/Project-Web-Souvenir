'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShoppingBag, MessageCircle, Menu, X } from 'lucide-react';

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
          ? 'bg-[#faf6f2]/95 backdrop-blur-md shadow-2xs border-b border-[#ebdcd5] py-3'
          : 'bg-[#faf6f2]/90 backdrop-blur-md border-b border-[#ebdcd5]/70 py-3.5'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-6">
        {/* Brand Logo with Official Shopee Avatar */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <div className="w-10 h-10 rounded-full overflow-hidden relative border border-zinc-200 bg-white shadow-2xs group-hover:scale-105 transition-transform shrink-0">
            <Image
              src="/images/products/avatar.jpg"
              alt={brandName}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div>
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 group-hover:text-[#c8476c] transition-colors leading-none block">
              {brandName}
            </span>
            <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-medium block mt-0.5">
              Handmade Candles & Gifts
            </span>
          </div>
        </Link>

        {/* Clean 5-Item Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-8 text-sm font-medium text-zinc-600">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-1 transition-colors ${
                  active ? 'text-zinc-900 font-semibold' : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                {link.label}
                {active && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#df829b] rounded-full animate-fadeIn" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-2.5 shrink-0">
          <a
            href={shopeeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-[#ee4d2d] text-white hover:bg-[#d73211] transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-white" />
            <span>Shopee</span>
          </a>

          <a
            href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent('Halo ' + brandName + ', saya ingin konsultasi pemesanan souvenir.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-1.5 rounded-full text-xs font-medium bg-[#128c7e] text-white hover:bg-[#0e7065] transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Konsultasi WA</span>
          </a>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-zinc-700 hover:bg-zinc-100 rounded-full transition-colors cursor-pointer"
          aria-label="Buka Menu"
        >
          {mobileOpen ? <X className="w-5 h-5 text-zinc-900" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-zinc-200 px-5 py-4 space-y-2 shadow-lg animate-fadeIn">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block py-2 text-sm font-medium border-b border-zinc-100 last:border-0 ${
                  active
                    ? 'text-zinc-900 font-bold pl-2 bg-zinc-50 rounded-lg'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-zinc-100 flex gap-2">
            <a
              href={shopeeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2 text-center text-xs font-medium rounded-full border border-zinc-200 text-zinc-800 flex items-center justify-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#ee4d2d]" />
              <span>Shopee</span>
            </a>
            <a
              href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent('Halo ' + brandName + ', saya ingin konsultasi pemesanan souvenir.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2 text-center text-xs font-medium rounded-full bg-[#128c7e] text-white flex items-center justify-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
