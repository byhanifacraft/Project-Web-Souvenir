import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getStoreData } from '@/lib/getStoreData';
import Hero from '@/components/Hero';
import Features, { FeatureItem } from '@/components/Features';
import WorkshopNewsSlider from '@/components/WorkshopNewsSlider';
import { Icon } from '@iconify/react';
import { formatRupiah, calculateDiscount, getWhatsAppLink } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const storeData = await getStoreData();
  const siteConfig = storeData?.siteConfig;
  const banners = (storeData?.banners || []).filter((b) => b.is_active !== false);
  const siteContent = storeData?.siteContent || {};
  const products = (storeData?.products || []).filter((p) => p.is_active !== false);
  const featuredProducts = products.slice(0, 3);

  const tagline =
    siteContent['tagline_beranda']?.content ||
    siteContent['deskripsi_beranda']?.content ||
    'Studio kerajinan lilin aromaterapi soy wax murni dan souvenir handmade estetik dari pengrajin Magetan, Jawa Timur untuk pernikahan, seminar, dan acara spesial Anda.';

  const heroData = {
    badge: '★ 4.85 / 5.0 • Star+ Shopee (1.500+ Ulasan Asli) • Studio Magetan',
    title:
      siteContent['tagline_beranda']?.title ||
      'Sentuhan Hangat Kerajinan Tangan untuk Setiap Momen',
    description: tagline,
    slides: banners.map((b) => ({
      image: b.image_url,
      title: b.title,
      subtitle: b.subtitle,
    })),
  };

  let customFeatures: FeatureItem[] | undefined = undefined;
  if (siteContent['keunggulan_features']?.content) {
    try {
      customFeatures = JSON.parse(siteContent['keunggulan_features'].content);
    } catch {
      customFeatures = undefined;
    }
  }
  const featuresTitle = siteContent['keunggulan_features']?.title || undefined;
  const featuresSubtitle = siteContent['keunggulan_features']?.image_url || undefined;

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Hero Section with Banner Slider & CTA */}
      <Hero config={siteConfig} hero={heroData} />

      {/* 1.5 Slider Foto Bergeser: Agenda & Berita Workshop Promosi */}
      <WorkshopNewsSlider newsList={storeData?.workshopNews} whatsappNum={siteConfig?.whatsapp} />

      {/* 2. Standar Mutu Kerajinan (Features) Dinamis */}
      <Features features={customFeatures} title={featuresTitle} subtitle={featuresSubtitle} />

      {/* 4. Featured Products Preview */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-xs uppercase tracking-widest text-zinc-400 font-semibold mb-2">
              Koleksi Terfavorit
            </p>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900 tracking-tight">
              Pilihan Lilin & Souvenir Terbaik
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">
              Rekomendasi paling digemari untuk pesta pernikahan, hampers bridesmaid, dan acara
              spesial.
            </p>
          </div>

          <Link
            href="/produk"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-zinc-900 hover:text-[#c8476c] transition-colors"
          >
            <span>Semua Produk ({products.length})</span>
            <Icon icon="solar:alt-arrow-right-bold" className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => {
            const { hasDiscount, discountPercent } = calculateDiscount(
              product.original_price,
              product.price
            );
            const originalPrice = product.original_price ? Number(product.original_price) : null;

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-zinc-200/80 overflow-hidden shadow-2xs hover:shadow-sm hover:border-zinc-300 transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative aspect-[4/3] w-full bg-zinc-100 overflow-hidden">
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-[#fdf0f3] text-[#c45a76] shadow-2xs">
                      {product.category_label || 'Lilin Aromaterapi'}
                    </span>
                    {hasDiscount && (
                      <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ee4d2d] text-white shadow-xs tracking-tight">
                        -{discountPercent}%
                      </span>
                    )}
                  </div>

                  <div className="p-5">
                    <h3 className="font-serif font-bold text-base text-zinc-900 mb-1.5 group-hover:text-[#df829b] transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2 mb-3">
                      {product.description}
                    </p>

                    {hasDiscount && (
                      <div className="flex items-center gap-1.5 leading-none mb-0.5">
                        <span className="text-xs text-zinc-400 line-through">
                          {formatRupiah(originalPrice!)}
                        </span>
                        <span className="text-[9px] font-bold text-[#ee4d2d] bg-[#fef0ed] px-1 py-0.2 rounded">
                          -{discountPercent}%
                        </span>
                      </div>
                    )}
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-bold text-[#c45a76]">
                        {formatRupiah(product.price)}
                      </span>
                      <span className="text-[11px] text-zinc-400">/ pcs</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-zinc-50/50 border-t border-zinc-100 flex items-center justify-between">
                  <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                    <Icon
                      icon="solar:verified-check-bold-duotone"
                      className="w-4 h-4 text-emerald-600"
                    />
                    <span>Stok: {product.stock ?? 100} pcs</span>
                  </span>
                  <Link
                    href="/produk"
                    className="px-4 py-1.5 rounded-full bg-[#df829b] text-white text-xs font-medium hover:bg-[#c96c85] transition-all shadow-2xs"
                  >
                    Detail & Pesan
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4.5 Workshop Experience Spotlight */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl bg-gradient-to-r from-[#fdf4f7] via-[#faf6f2] to-white border border-[#ebdcd5] p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xs">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#fde8ee] text-[#c45a76] flex items-center justify-center shrink-0 shadow-2xs">
              <Icon icon="solar:flame-bold-duotone" className="w-7 h-7 text-[#c45a76]" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#fde8ee] text-[#c45a76] text-[10px] font-bold uppercase tracking-wider mb-1">
                <Icon
                  icon="solar:stars-minimalistic-bold-duotone"
                  className="w-3.5 h-3.5 text-[#c45a76]"
                />
                <span>Kelas Meracik Lilin Magetan</span>
              </div>
              <h3 className="font-serif font-bold text-xl sm:text-2xl text-zinc-900 mb-1">
                Workshop Lilin Aromaterapi & Kerajinan Studio
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 max-w-xl leading-relaxed">
                Ingin belajar meracik lilin beraroma sendiri dengan 100% natural soy wax, essential
                oil, dan hiasan botanical? Sesi santai & healing untuk pemula, couple, maupun
                gathering group.
              </p>
            </div>
          </div>
          <Link
            href="/workshop"
            className="shrink-0 px-6 py-3 rounded-full bg-[#c45a76] hover:bg-[#a8445e] text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm transition-all hover:scale-105"
          >
            <span>Jelajahi Paket Workshop</span>
            <Icon icon="solar:alt-arrow-right-bold" className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 5. Direct Quick Action Consultation Bar */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-[#fae8ee] via-[#f7dbe3] to-[#f4d0db] text-[#2c1d23] p-8 sm:p-10 rounded-3xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 border border-[#ebd1dc] shadow-sm">
          <div className="max-w-xl z-10">
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#2c1d23] mb-2">
              Konsultasikan Konsep & Mockup Gratis
            </h3>
            <p className="text-xs sm:text-sm text-[#6d4f58] leading-relaxed">
              Diskusikan tema warna lilin, kartu ucapan custom, dan diskon kuantiti bersama Kak
              Hanifa via WhatsApp.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 z-10 w-full sm:w-auto">
            <a
              href={getWhatsAppLink(
                siteConfig?.whatsapp || '6281234567890',
                'Halo Kak Hanifa, saya ingin konsultasi pemesanan souvenir lilin.'
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-md shadow-[#25D366]/25 hover:scale-105"
            >
              <Icon icon="solar:chat-round-call-bold-duotone" className="w-4 h-4 text-white" />
              <span>Chat WhatsApp Sekarang</span>
            </a>
            <Link
              href="/kontak"
              className="px-5 py-3 rounded-full bg-white border border-[#ebd1dc] text-[#5e3846] text-xs sm:text-sm font-medium hover:bg-white/90 hover:border-[#df829b] flex items-center justify-center transition-all shadow-2xs"
            >
              <span>Info Kontak Lengkap</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
