import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getStoreData } from '@/lib/getStoreData';
import Hero from '@/components/Hero';
import Features, { FeatureItem } from '@/components/Features';
import WorkshopNewsSlider from '@/components/WorkshopNewsSlider';
import { Icon } from '@iconify/react';
import { formatRupiah, calculateDiscount, getWhatsAppLink } from '@/lib/utils';

export const revalidate = 300; // ISR 5 menit (di-revalidate instan saat admin simpan perubahan)

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

  let galleryImages = storeData?.galleryImages || [];
  if (siteContent['workshop_gallery']?.content) {
    try {
      const parsed = JSON.parse(siteContent['workshop_gallery'].content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        galleryImages = parsed;
      }
    } catch {
      // keep fallback
    }
  }
  const previewGallery = galleryImages.slice(0, 6);

  return (
    <div className="space-y-14 pb-16">
      {/* 1. Hero Section with Banner Slider & CTA */}
      <Hero config={siteConfig} hero={heroData} />

      {/* 1.5 Slider Foto Bergeser: Agenda & Berita Workshop Promosi */}
      <WorkshopNewsSlider newsList={storeData?.workshopNews} whatsappNum={siteConfig?.whatsapp} />

      {/* 2. Standar Mutu Kerajinan (Features) Dinamis */}
      <Features features={customFeatures} title={featuresTitle} subtitle={featuresSubtitle} />

      {/* 3. Preview Tentang Kami Studio CraftByHanifa */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl border border-[#ebdcd5] p-6 sm:p-10 lg:p-12 shadow-2xs overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Foto Studio */}
            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[4/3] sm:aspect-square w-full rounded-2xl overflow-hidden shadow-xs border border-zinc-200/80">
                <Image
                  src={siteContent['tentang_kami']?.image_url || '/images/products/shop-cover.jpg'}
                  alt="Studio CraftByHanifa"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-70" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 uppercase tracking-wider">
                    Studio Pengrajin Magetan
                  </span>
                  <p className="text-sm font-serif font-bold mt-1.5 drop-shadow-xs">
                    CraftByHanifa Studio & Workshop
                  </p>
                </div>
              </div>
            </div>

            {/* Konten Teks & Link ke /tentang-kami */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fde8ee] border border-[#f3d7df] text-[#c45a76] text-[11px] font-bold uppercase tracking-wider">
                <Icon icon="solar:heart-bold-duotone" className="w-3.5 h-3.5 text-[#e05d82]" />
                <span>Tentang CraftByHanifa</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900 leading-snug">
                {siteContent['tentang_kami']?.title ||
                  'Dedikasi Menghadirkan Makna di Setiap Sentuhan Lilin & Kerajinan'}
              </h2>

              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed line-clamp-4">
                {siteContent['tentang_kami']?.content ||
                  'Berawal dari kecintaan pada seni kerajinan lilin aromaterapi dan dried flowers, CraftByHanifa hadir mendampingi ribuan momen bahagia pernikahan, wisuda, dan corporate gift di seluruh penjuru Indonesia.'}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                  <span className="block text-base font-bold text-[#c45a76]">100%</span>
                  <span className="text-[11px] text-zinc-500">Natural Soy Wax</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                  <span className="block text-base font-bold text-[#c45a76]">50.000+</span>
                  <span className="text-[11px] text-zinc-500">Pcs Terkirim</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-100 col-span-2 sm:col-span-1">
                  <span className="block text-base font-bold text-[#c45a76]">Magetan</span>
                  <span className="text-[11px] text-zinc-500">Jawa Timur</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/tentang-kami"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#c45a76] hover:bg-[#a8445e] text-white text-xs sm:text-sm font-semibold transition-all shadow-xs hover:scale-105"
                >
                  <span>Baca Selengkapnya Tentang Kami</span>
                  <Icon icon="solar:alt-arrow-right-bold" className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

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

      {/* 4.5 Workshop Experience Spotlight & Galeri Dokumentasi */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
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

        {/* Preview Galeri Foto Dokumentasi Workshop */}
        {previewGallery.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon icon="solar:camera-bold-duotone" className="w-4 h-4 text-[#c45a76]" />
                <h4 className="text-sm sm:text-base font-serif font-bold text-zinc-900">
                  Dokumentasi Karya & Suasana Workshop Studio
                </h4>
              </div>
              <Link
                href="/workshop"
                className="text-xs font-semibold text-[#c45a76] hover:text-[#a8445e] flex items-center gap-1"
              >
                <span>Lihat Seluruh Dokumentasi ({galleryImages.length})</span>
                <Icon icon="solar:alt-arrow-right-bold" className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {previewGallery.map((photo, idx) => (
                <Link
                  key={`doc-${photo.id || idx}`}
                  href="/workshop"
                  className="group relative aspect-square rounded-2xl overflow-hidden bg-zinc-100 border border-[#ebdcd5] shadow-2xs hover:shadow-md transition-all duration-300 block"
                >
                  <Image
                    src={photo.image_url}
                    alt={photo.caption || 'Dokumentasi Workshop'}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2.5 text-white">
                    <p className="text-[10px] font-bold text-white line-clamp-1 leading-tight drop-shadow-xs">
                      {photo.caption || 'Workshop Studio'}
                    </p>
                    <span className="text-[9px] text-zinc-300 font-medium">Buka Galeri &rarr;</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
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
