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

  if (!product) return null;

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

  const getWaOrderLink = () => {
    let customText = '';
    if (Object.keys(selectedChoices).length > 0) {
      customText = Object.entries(selectedChoices)
        .map(([k, v]) => `• ${k}: ${v}`)
        .join('\n');
    }

    const message =
      `Halo Kak Hanifa (${brandName}), saya tertarik untuk pesan souvenir custom:\n\n` +
      `📌 *Produk:* ${product.name}\n` +
      `📌 *Jumlah Min. Pesanan:* ${product.minOrder} pcs\n` +
      (customText ? `📌 *Pilihan Kustomisasi:*\n${customText}\n\n` : '\n') +
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
          {/* Product Image Side */}
          <div className="md:col-span-5 relative bg-[#fff7f9] min-h-[260px] md:min-h-full flex flex-col">
            <div className="relative flex-1 w-full min-h-[240px]">
              <Image src={product.image} alt={product.name} fill className="object-cover" />
              {product.badge && (
                <span className="absolute top-4 left-4 z-10 text-xs font-bold px-3 py-1 rounded-full bg-[#df829b] text-white shadow-md">
                  {product.badge}
                </span>
              )}
              {product.originalPrice && product.originalPrice > product.priceMin && (
                <span className="absolute top-4 right-4 z-10 text-xs font-bold px-2.5 py-1 rounded-full bg-[#ee4d2d] text-white shadow-md">
                  -
                  {Math.round(
                    ((product.originalPrice - product.priceMin) / product.originalPrice) * 100
                  )}
                  %
                </span>
              )}
            </div>

            {/* Micro Benefit Banner on Left */}
            <div className="p-4 bg-gradient-to-r from-[#fde8ee] to-[#fff0f4] border-t border-[#f3d7df] text-xs text-[#5e414d] space-y-1.5">
              <div className="font-bold text-[#a85267] text-[11px] uppercase tracking-wider">
                Kelebihan Kerajinan Studio:
              </div>
              <p className="text-[11px] leading-relaxed">
                ✓ Dikerjakan manual oleh pengrajin lokal di Magetan.
                <br />✓ Bahan premium ramah lingkungan, wangi tahan lama, & awet bertahun-tahun.
              </p>
            </div>
          </div>

          {/* Product Information Details Side */}
          <div className="md:col-span-7 p-6 sm:p-7 flex flex-col justify-between">
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

              {/* Pricing Range with Strikethrough Discount */}
              <div className="mb-4 pb-3.5 border-b border-[#f3d7df]">
                <span className="text-[11px] text-[#755562] block mb-0.5">Harga Souvenir:</span>
                {product.originalPrice && product.originalPrice > product.priceMin && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-zinc-400 line-through">
                      {formatRupiah(product.originalPrice)}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#fef0ed] text-[#ee4d2d] border border-[#fcd5cd]">
                      Hemat{' '}
                      {Math.round(
                        ((product.originalPrice - product.priceMin) / product.originalPrice) * 100
                      )}
                      %
                    </span>
                  </div>
                )}
                <div className="text-xl sm:text-2xl font-extrabold text-[#c45a76]">
                  {formatRupiah(product.priceMin)}
                  {product.priceMax > product.priceMin && (
                    <span className="text-sm font-normal text-[#755562]">
                      {' '}
                      - {formatRupiah(product.priceMax)}
                    </span>
                  )}
                  <span className="text-xs font-normal text-zinc-500"> / pcs</span>
                </div>
                <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-[#4d8b74] font-semibold">
                  <Icon
                    icon="solar:sale-bold-duotone"
                    className="w-4 h-4 shrink-0 text-[#4d8b74]"
                  />
                  <span>Diskon kuantiti tambahan hingga 15% untuk pemesanan partai besar</span>
                </div>
              </div>

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

              {/* Options / Customization choices */}
              {product.options && product.options.length > 0 && (
                <div className="mb-4 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#2e1c24] flex items-center gap-1">
                    <span>Pilih Variasi & Kustomisasi:</span>
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
