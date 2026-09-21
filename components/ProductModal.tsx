'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Product } from '@/types';
import { Icon } from '@iconify/react';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  whatsapp?: string;
  brandName?: string;
}

export default function ProductModal({
  product,
  onClose,
  whatsapp = '6281234567890',
  brandName = 'CraftByHanifa',
}: ProductModalProps) {
  const [selectedChoices, setSelectedChoices] = useState<{ [key: string]: string }>({});
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    product?.variants?.[0]?.id || null
  );
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!product) return null;

  // Hitung varian aktif berdasarkan pilihan atau fallback ke varian pertama
  const selectedVariant =
    (selectedVariantId ? product.variants?.find((v) => v.id === selectedVariantId) : null) ||
    product.variants?.[0] ||
    null;

  // Daftar galeri foto produk (multi-foto + foto varian unik)
  const baseImages = product.images && product.images.length > 0 ? product.images : [product.image];
  const variantImages = (product.variants || [])
    .map((v) => v.image_url)
    .filter((url): url is string => Boolean(url && !baseImages.includes(url)));
  const imageList: string[] = [...baseImages, ...variantImages];
  const activeImage =
    imageList[activeImageIndex] || product.image || '/images/products/aromatherapy-candle.jpg';

  const handleSelectChoice = (optionLabel: string, choice: string) => {
    setSelectedChoices((prev) => ({
      ...prev,
      [optionLabel]: choice,
    }));
  };

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  // Hitung harga aktif berdasarkan varian yang dipilih (ala Shopee)
  const currentPrice = selectedVariant ? selectedVariant.price : product.priceMin;
  const currentOriginalPrice = selectedVariant
    ? (selectedVariant.original_price ?? product.originalPrice)
    : product.originalPrice;
  const hasDiscount = Boolean(currentOriginalPrice && currentOriginalPrice > currentPrice);
  const discountPercent = hasDiscount
    ? Math.round(((currentOriginalPrice! - currentPrice) / currentOriginalPrice!) * 100)
    : 0;

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % imageList.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
  };

  const getWaOrderLink = () => {
    let customText = '';
    if (Object.keys(selectedChoices).length > 0) {
      customText = Object.entries(selectedChoices)
        .map(([k, v]) => `• ${k}: ${v}`)
        .join('\n');
    }

    const variantLine = selectedVariant
      ? `📌 *Varian Model:* ${selectedVariant.name} (${formatRupiah(selectedVariant.price)}/pcs)\n`
      : '';
    const subtotalLine = selectedVariant
      ? `📌 *Estimasi Min. Total:* ${formatRupiah(selectedVariant.price * product.minOrder)} (${product.minOrder} pcs)\n`
      : '';

    const message =
      `Halo Kak Hanifa (${brandName}), saya tertarik untuk pesan souvenir custom:\n\n` +
      `📌 *Produk:* ${product.name}\n` +
      variantLine +
      `📌 *Jumlah Min. Pesanan:* ${product.minOrder} pcs\n` +
      subtotalLine +
      (customText ? `📌 *Pilihan Kustomisasi Tambahan:*\n${customText}\n\n` : '\n') +
      `Boleh minta rincian penawaran harga & simulasi desain mock-up nya kak? Terima kasih.`;

    return `https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden border border-[#f3d7df] my-auto animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button - 44px touch target on mobile */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 w-10 h-10 rounded-full bg-white/95 backdrop-blur-md text-[#2e1c24] hover:bg-[#fae1e8] hover:text-[#e05d82] transition-all flex items-center justify-center shadow-lg border border-black/5 cursor-pointer"
          aria-label="Tutup"
        >
          <Icon
            icon="solar:close-circle-bold-duotone"
            className="w-5 h-5 text-zinc-600 hover:text-zinc-900"
          />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[88vh] overflow-y-auto">
          {/* ================= SISI KIRI: MULTI-IMAGE GALLERY ================= */}
          <div className="md:col-span-5 relative bg-[#fff7f9] flex flex-col border-b md:border-b-0 md:border-r border-[#f3d7df]">
            {/* Foto Utama Besar */}
            <div className="relative aspect-[4/3] md:aspect-square w-full bg-zinc-100 overflow-hidden">
              <Image
                src={activeImage}
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 450px"
                className="object-cover"
                priority
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/products/aromatherapy-candle.jpg';
                }}
              />

              {product.badge && (
                <span className="absolute top-4 left-4 z-10 text-xs font-bold px-3 py-1 rounded-full bg-[#df829b] text-white shadow-md">
                  {product.badge}
                </span>
              )}

              {hasDiscount && (
                <span className="absolute top-4 right-4 z-10 text-xs font-bold px-2.5 py-1 rounded-full bg-[#ee4d2d] text-white shadow-md">
                  -{discountPercent}%
                </span>
              )}

              {/* Tombol Navigasi Panah Slider (Jika lebih dari 1 foto) */}
              {imageList.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                    className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/85 hover:bg-white text-zinc-700 flex items-center justify-center shadow-md transition-all cursor-pointer"
                    aria-label="Foto Sebelumnya"
                  >
                    <Icon icon="solar:alt-arrow-left-bold" className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/85 hover:bg-white text-zinc-700 flex items-center justify-center shadow-md transition-all cursor-pointer"
                    aria-label="Foto Selanjutnya"
                  >
                    <Icon icon="solar:alt-arrow-right-bold" className="w-4 h-4" />
                  </button>

                  {/* Indikator Angka Foto */}
                  <span className="absolute bottom-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-xs">
                    {activeImageIndex + 1} / {imageList.length}
                  </span>
                </>
              )}
            </div>

            {/* Thumbnail Gallery Row (Jika ada banyak foto) */}
            {imageList.length > 1 && (
              <div className="p-3 bg-[#fff0f4] border-t border-[#f3d7df] flex items-center gap-2 overflow-x-auto">
                {imageList.map((img, idx) => {
                  const isActive = idx === activeImageIndex;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                        isActive
                          ? 'border-[#e05d82] ring-2 ring-[#e05d82]/30 scale-105'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <Image
                        src={img}
                        alt=""
                        fill
                        sizes="56px"
                        className="object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            '/images/products/aromatherapy-candle.jpg';
                        }}
                      />
                    </button>
                  );
                })}
              </div>
            )}

            {/* Micro Benefit Banner on Left */}
            <div className="p-4 bg-gradient-to-r from-[#fde8ee] to-[#fff0f4] border-t border-[#f3d7df] text-xs text-[#5e414d] space-y-1.5 mt-auto">
              <div className="font-bold text-[#a85267] text-[11px] uppercase tracking-wider">
                Kelebihan Kerajinan Studio:
              </div>
              <p className="text-[11px] leading-relaxed">
                ✓ Dikerjakan manual oleh pengrajin lokal di Magetan.
                <br />✓ Bahan premium ramah lingkungan, wangi tahan lama, & awet bertahun-tahun.
              </p>
            </div>
          </div>

          {/* ================= SISI KANAN: DETAIL & VARIAN ALA SHOPEE ================= */}
          <div className="md:col-span-7 p-4 sm:p-7 flex flex-col justify-between">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs uppercase tracking-wider font-bold text-[#c45a76] bg-[#fdf0f3] px-2.5 py-0.5 rounded-full border border-[#f3ccd6]/60">
                  {product.categoryLabel || product.category}
                </span>
                <div className="flex items-center gap-1 text-xs font-bold text-[#f59e0b] bg-[#fef3c7] px-2.5 py-0.5 rounded-full">
                  <Icon icon="solar:star-bold" className="w-3.5 h-3.5 text-[#f59e0b]" />
                  <span>{product.rating || 4.9}</span>
                  <span className="text-[#755562] font-normal">
                    ({product.soldCount || 1000}+ terjual)
                  </span>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#2e1c24] mb-2 leading-snug">
                {product.name}
              </h3>

              {/* Pricing Display (Dinamis Sesuai Varian yang Dipilih) */}
              <div className="mb-4 pb-3.5 border-b border-[#f3d7df]">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-[#755562] block mb-0.5">
                    {selectedVariant
                      ? `Harga Varian (${selectedVariant.name}):`
                      : 'Harga Souvenir:'}
                  </span>
                  {selectedVariant && (
                    <span className="text-[10px] uppercase font-bold text-[#e05d82] bg-[#fde8ee] px-2 py-0.5 rounded-full">
                      Varian Dipilih
                    </span>
                  )}
                </div>

                {hasDiscount && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-zinc-400 line-through">
                      {formatRupiah(currentOriginalPrice!)}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#fef0ed] text-[#ee4d2d] border border-[#fcd5cd]">
                      Hemat {discountPercent}%
                    </span>
                  </div>
                )}

                <div className="text-xl sm:text-2xl font-extrabold text-[#c45a76] flex items-baseline gap-1">
                  <span>{formatRupiah(currentPrice)}</span>
                  <span className="text-xs font-normal text-zinc-500"> / pcs</span>
                </div>

                <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-[#4d8b74] font-semibold">
                  <Icon
                    icon="solar:sale-bold-duotone"
                    className="w-4 h-4 shrink-0 text-[#4d8b74]"
                  />
                  <span>
                    Diskon kuantiti tambahan untuk pemesanan partai besar (Hubungi admin via WA)
                  </span>
                </div>
              </div>

              {/* ================= SHOPEE-STYLE VARIANT SELECTOR ================= */}
              {product.variants && product.variants.length > 0 && (
                <div className="mb-4 space-y-2.5 bg-[#faf6f2] p-3.5 rounded-2xl border border-[#ebdcd5]">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#2e1c24] flex items-center gap-1.5">
                      <Icon
                        icon="solar:tag-price-bold-duotone"
                        className="w-4 h-4 text-[#e05d82]"
                      />
                      <span>Pilihan Model / Varian:</span>
                    </h4>
                    <span className="text-[11px] text-[#c45a76] font-bold">
                      {selectedVariant ? selectedVariant.name : 'Pilih Varian'}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((variant) => {
                      const isSelected = selectedVariant?.id === variant.id;
                      return (
                        <button
                          key={variant.id}
                          type="button"
                          onClick={() => {
                            setSelectedVariantId(variant.id);
                            // Jika varian punya foto khusus, beralih ke foto tersebut
                            if (variant.image_url) {
                              const matchIdx = imageList.indexOf(variant.image_url);
                              if (matchIdx >= 0) {
                                setActiveImageIndex(matchIdx);
                              }
                            }
                          }}
                          className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-2 text-left ${
                            isSelected
                              ? 'bg-white text-[#c45a76] border-[#e05d82] shadow-sm ring-2 ring-[#e05d82]/25'
                              : 'bg-white/80 text-zinc-700 border-zinc-200 hover:border-zinc-300 hover:bg-white'
                          }`}
                        >
                          {variant.image_url && (
                            <div className="relative w-6 h-6 rounded-lg overflow-hidden shrink-0 border border-black/5">
                              <Image
                                src={variant.image_url}
                                alt=""
                                fill
                                sizes="24px"
                                className="object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    '/images/products/aromatherapy-candle.jpg';
                                }}
                              />
                            </div>
                          )}
                          <div>
                            <span className="block font-bold leading-tight">{variant.name}</span>
                            <span
                              className={`text-[10px] ${
                                isSelected ? 'text-[#c45a76] font-bold' : 'text-zinc-500'
                              }`}
                            >
                              {formatRupiah(variant.price)}
                            </span>
                          </div>
                          {isSelected && (
                            <Icon
                              icon="solar:check-circle-bold"
                              className="w-4 h-4 text-[#e05d82] ml-1 shrink-0"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#4a2e3a] leading-relaxed mb-4">
                {product.description || product.shortDesc}
              </p>

              {/* Specs Breakdown */}
              <div className="space-y-2 bg-[#fff7f9] p-3.5 rounded-2xl border border-[#f3d7df] mb-4 text-xs text-[#3d2530]">
                <div className="flex items-start gap-2">
                  <Icon
                    icon="solar:box-minimalistic-bold-duotone"
                    className="w-4 h-4 text-[#e05d82] shrink-0 mt-0.5"
                  />
                  <div>
                    <strong className="text-[#2e1c24]">Minimal Pemesanan:</strong>{' '}
                    {product.minOrder} pcs (eceran tersedia di Shopee)
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Icon
                    icon="solar:clock-circle-bold-duotone"
                    className="w-4 h-4 text-[#ff7e67] shrink-0 mt-0.5"
                  />
                  <div>
                    <strong className="text-[#2e1c24]">Waktu Pengerjaan:</strong>{' '}
                    {product.leadTime || '5 - 10 Hari Kerja'}
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Icon
                    icon="solar:shield-check-bold-duotone"
                    className="w-4 h-4 text-[#4d8b74] shrink-0 mt-0.5"
                  />
                  <div>
                    <strong className="text-[#2e1c24]">Material Berkualitas:</strong>{' '}
                    {product.material || 'Material Grade A Premium'}
                  </div>
                </div>
              </div>

              {/* Options / Customization choices (Pilihan kustom tambahan: aroma, warna pita, dll) */}
              {product.options && product.options.length > 0 && (
                <div className="mb-4 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#2e1c24] flex items-center gap-1">
                    <span>Pilihan Kustomisasi Tambahan:</span>
                    <span className="text-[10px] text-[#755562] font-normal">
                      (Klik untuk rincian WA)
                    </span>
                  </h4>
                  {product.options.map((opt, idx) => (
                    <div key={idx}>
                      <span className="text-xs font-semibold text-[#4a2e3a] block mb-1.5">
                        {opt.label}:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {opt.choices.map((choice, cIdx) => {
                          const isSelected = selectedChoices[opt.label] === choice;
                          return (
                            <button
                              key={cIdx}
                              type="button"
                              onClick={() => handleSelectChoice(opt.label, choice)}
                              className={`px-2.5 py-1 rounded-xl text-xs font-medium border transition-all cursor-pointer flex items-center gap-1 ${
                                isSelected
                                  ? 'bg-[#df829b] text-white border-[#df829b] shadow-xs'
                                  : 'bg-white text-[#5e414d] border-[#ebdcd5] hover:border-[#df829b]/50 hover:bg-[#fdf0f3]'
                              }`}
                            >
                              {isSelected && (
                                <Icon icon="solar:check-read-linear" className="w-3 h-3" />
                              )}
                              <span>{choice}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Inclusions */}
              {product.includedItems && product.includedItems.length > 0 && (
                <div className="mb-5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#2e1c24] mb-2">
                    Paket Sudah Termasuk:
                  </h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-[#4a2e3a]">
                    {product.includedItems.map((inc, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <Icon
                          icon="solar:verified-check-bold-duotone"
                          className="w-4 h-4 text-[#4d8b74] shrink-0"
                        />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-3.5 border-t border-[#f3d7df] flex flex-col sm:flex-row gap-2.5">
              <a
                href={getWaOrderLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:flex-1 min-h-[46px] py-3 px-4 rounded-xl bg-[#25D366] text-white font-bold text-xs sm:text-sm hover:bg-[#20bd5a] shadow-md shadow-[#25D366]/25 flex items-center justify-center gap-2 transition-all cursor-pointer hover:scale-[1.01]"
              >
                <Icon icon="solar:chat-round-call-bold-duotone" className="w-4 h-4 text-white" />
                <span>Pesan Custom via WhatsApp</span>
              </a>

              {product.shopeeUrl && (
                <a
                  href={product.shopeeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto min-h-[46px] py-3 px-4 rounded-xl bg-[#ee4d2d] text-white font-bold text-xs sm:text-sm hover:bg-[#d73211] flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm hover:scale-[1.01]"
                >
                  <Icon icon="solar:bag-heart-bold-duotone" className="w-4 h-4 text-white" />
                  <span>Beli di Shopee</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
