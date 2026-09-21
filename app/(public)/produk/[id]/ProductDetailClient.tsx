'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ProductItem } from '@/types/store';
import { formatRupiah, calculateDiscount } from '@/lib/utils';
import { Icon } from '@iconify/react';

interface ProductDetailClientProps {
  product: ProductItem;
  brandName: string;
  whatsapp: string;
}

export default function ProductDetailClient({
  product,
  brandName,
  whatsapp,
}: ProductDetailClientProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    product.variants?.[0]?.id || null
  );
  const [selectedChoices, setSelectedChoices] = useState<{ [key: string]: string }>({});
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const variants = product.variants || [];
  const selectedVariant =
    (selectedVariantId ? variants.find((v) => v.id === selectedVariantId) : null) ||
    variants[0] ||
    null;

  // Multi-image list
  const baseImages =
    product.images && product.images.length > 0
      ? product.images
      : [product.image_url || '/images/products/aromatherapy-candle.jpg'];
  const variantImages = variants
    .map((v) => v.image_url)
    .filter((url): url is string => Boolean(url && !baseImages.includes(url)));
  const imageList = [...baseImages, ...variantImages];
  const activeImage = imageList[activeImageIndex] || baseImages[0];

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const currentOriginalPrice = selectedVariant
    ? (selectedVariant.original_price ?? product.original_price)
    : product.original_price;
  const { hasDiscount, discountPercent } = calculateDiscount(currentOriginalPrice, currentPrice);

  const handleSelectChoice = (label: string, choice: string) => {
    setSelectedChoices((prev) => ({ ...prev, [label]: choice }));
  };

  const getWaOrderLink = () => {
    let customText = '';
    if (Object.keys(selectedChoices).length > 0) {
      customText = Object.entries(selectedChoices)
        .map(([k, v]) => `• ${k}: ${v}`)
        .join('\n');
    }

    const variantLine = selectedVariant
      ? `📌 *Varian Pilihan:* ${selectedVariant.name} (${formatRupiah(selectedVariant.price)}/pcs)\n`
      : '';
    const minOrder = product.min_order ?? 1;

    const message =
      `Halo Kak Hanifa (${brandName}), saya tertarik untuk pesan souvenir custom:\n\n` +
      `📌 *Produk:* ${product.name}\n` +
      variantLine +
      `📌 *Jumlah Min. Pesanan:* ${minOrder} pcs\n` +
      (customText ? `📌 *Pilihan Kustom Tambahan:*\n${customText}\n\n` : '\n') +
      `Link Produk: https://craftbyhanifa.com/produk/${encodeURIComponent(product.id)}\n\n` +
      `Boleh minta info simulasi desain mockup & ketersediaan jadwal produksinya kak? Terima kasih.`;

    return `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white rounded-3xl border border-zinc-200/80 p-5 sm:p-8 lg:p-10 shadow-xs">
      {/* SISI KIRI: GALERI GAMBAR */}
      <div className="lg:col-span-6 space-y-4">
        {/* Gambar Utama */}
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200/60 shadow-2xs">
          <Image
            src={activeImage}
            alt={product.name}
            fill
            className="object-cover"
            priority
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/products/aromatherapy-candle.jpg';
            }}
          />

          {hasDiscount && (
            <span className="absolute top-3.5 right-3.5 z-10 text-xs font-bold px-2.5 py-1 rounded-full bg-[#ee4d2d] text-white shadow-md">
              -{discountPercent}%
            </span>
          )}

          {/* Navigasi panah jika lebih dari 1 foto */}
          {imageList.length > 1 && (
            <>
              <button
                type="button"
                onClick={() =>
                  setActiveImageIndex((prev) => (prev - 1 + imageList.length) % imageList.length)
                }
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 text-zinc-700 hover:bg-white flex items-center justify-center shadow-md transition-all cursor-pointer"
                aria-label="Foto Sebelumnya"
              >
                <Icon icon="solar:alt-arrow-left-bold" className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setActiveImageIndex((prev) => (prev + 1) % imageList.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 text-zinc-700 hover:bg-white flex items-center justify-center shadow-md transition-all cursor-pointer"
                aria-label="Foto Selanjutnya"
              >
                <Icon icon="solar:alt-arrow-right-bold" className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnail Row */}
        {imageList.length > 1 && (
          <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
            {imageList.map((img, idx) => {
              const isActive = idx === activeImageIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    isActive
                      ? 'border-[#df829b] ring-2 ring-[#df829b]/30 scale-105'
                      : 'border-zinc-200/80 opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* SISI KANAN: SPESIFIKASI & FORM PEMESANAN */}
      <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
        <div className="space-y-4">
          {/* Tag Kategori & Rating */}
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs uppercase tracking-wider font-bold text-[#c45a76] bg-[#fdf0f3] px-3 py-1 rounded-full border border-[#f3ccd6]/60">
              {product.category_label || product.category}
            </span>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#f59e0b] bg-[#fef3c7] px-3 py-1 rounded-full">
              <Icon icon="solar:star-bold" className="w-3.5 h-3.5 text-[#f59e0b]" />
              <span>{product.rating ?? 4.9}</span>
              <span className="text-zinc-400 font-normal">
                ({product.sold_count ?? 1500}+ ulasan)
              </span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-900 tracking-tight leading-snug">
            {product.name}
          </h1>

          {/* Pricing Display */}
          <div className="p-4 rounded-2xl bg-[#fff7f9] border border-[#f3d7df] flex items-center justify-between">
            <div>
              <span className="text-[11px] text-zinc-400 block mb-0.5">Harga per pcs:</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold text-[#e05d82]">
                  {formatRupiah(currentPrice)}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-zinc-400 line-through">
                    {formatRupiah(currentOriginalPrice!)}
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-zinc-700 block">
                Min. Pesanan: {product.min_order ?? 1} pcs
              </span>
              <span className="text-[11px] text-emerald-600 font-medium">✓ Ready Order</span>
            </div>
          </div>

          {/* Deskripsi */}
          {product.description && (
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          )}

          {/* Pilihan Varian Harga jika ada */}
          {variants.length > 0 && (
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-900">
                Pilih Model Varian:
              </label>
              <div className="flex flex-wrap gap-2">
                {variants.map((v) => {
                  const isSelected = selectedVariant?.id === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => {
                        setSelectedVariantId(v.id);
                        if (v.image_url) {
                          const matchedIdx = imageList.indexOf(v.image_url);
                          if (matchedIdx !== -1) setActiveImageIndex(matchedIdx);
                        }
                      }}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-2 ${
                        isSelected
                          ? 'bg-[#df829b] text-white border-[#df829b] shadow-xs'
                          : 'bg-white text-zinc-700 border-zinc-200 hover:border-[#df829b]/60'
                      }`}
                    >
                      <span>{v.name}</span>
                      <span className={isSelected ? 'text-white/90' : 'text-[#df829b]'}>
                        ({formatRupiah(v.price)})
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Opsi Kustomisasi jika ada */}
          {product.options && product.options.length > 0 && (
            <div className="space-y-3 pt-2">
              {product.options.map((opt, oIdx) => (
                <div key={oIdx} className="space-y-1.5">
                  <label className="block text-xs font-bold text-zinc-800">{opt.label}:</label>
                  <div className="flex flex-wrap gap-1.5">
                    {opt.choices.map((choice, cIdx) => {
                      const isSelected = selectedChoices[opt.label] === choice;
                      return (
                        <button
                          key={cIdx}
                          type="button"
                          onClick={() => handleSelectChoice(opt.label, choice)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#df829b] text-white border-[#df829b]'
                              : 'bg-white text-zinc-600 border-zinc-200 hover:border-[#df829b]/40'
                          }`}
                        >
                          {choice}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Rincian Spesifikasi Teknis */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-zinc-100 text-xs">
            <div className="p-3 bg-zinc-50 rounded-xl">
              <span className="text-[10px] uppercase tracking-wider text-zinc-400 block font-semibold">
                Bahan Material
              </span>
              <span className="font-medium text-zinc-800 mt-0.5 block">
                {product.material || 'Premium Grade A'}
              </span>
            </div>
            <div className="p-3 bg-zinc-50 rounded-xl">
              <span className="text-[10px] uppercase tracking-wider text-zinc-400 block font-semibold">
                Dimensi / Ukuran
              </span>
              <span className="font-medium text-zinc-800 mt-0.5 block">
                {product.size || 'Ukuran Standar'}
              </span>
            </div>
            <div className="p-3 bg-zinc-50 rounded-xl">
              <span className="text-[10px] uppercase tracking-wider text-zinc-400 block font-semibold">
                Estimasi Pengerjaan
              </span>
              <span className="font-medium text-zinc-800 mt-0.5 block">
                {product.lead_time || '5 - 10 Hari Kerja'}
              </span>
            </div>
            <div className="p-3 bg-zinc-50 rounded-xl">
              <span className="text-[10px] uppercase tracking-wider text-zinc-400 block font-semibold">
                Free Fasilitas
              </span>
              <span className="font-medium text-zinc-800 mt-0.5 block">
                Pita Satin + Kartu Ucapan
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons: WhatsApp Consultation & Shopee */}
        <div className="pt-4 border-t border-zinc-200/80 flex flex-col sm:flex-row gap-3">
          <a
            href={getWaOrderLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 min-h-[48px] py-3 px-5 rounded-2xl bg-[#25D366] text-white font-bold text-sm hover:bg-[#20bd5a] flex items-center justify-center gap-2 shadow-md shadow-[#25D366]/25 transition-all hover:scale-[1.01]"
          >
            <Icon icon="solar:chat-round-call-bold-duotone" className="w-5 h-5 text-white" />
            <span>Konsultasi & Pesan via WhatsApp</span>
          </a>

          {product.shopee_url && (
            <a
              href={product.shopee_url}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[48px] py-3 px-5 rounded-2xl bg-[#ee4d2d] text-white font-bold text-sm hover:bg-[#d73211] flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-[1.01]"
            >
              <Icon icon="solar:bag-heart-bold-duotone" className="w-5 h-5 text-white" />
              <span>Beli di Shopee</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
