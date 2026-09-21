'use client';

import React from 'react';
import Image from 'next/image';
import { ProductItem } from '@/types/store';
import { formatRupiah } from '@/lib/utils';
import { Pencil, Trash2, Eye, EyeOff, Images } from 'lucide-react';

interface ProductCardItemProps {
  product: ProductItem;
  onEdit: (product: ProductItem) => void;
  onDelete: (id: string, name: string) => void;
  onToggleActive: (product: ProductItem) => void;
}

export default function ProductCardItem({
  product: p,
  onEdit,
  onDelete,
  onToggleActive,
}: ProductCardItemProps) {
  const originalPrice = p.original_price ? Number(p.original_price) : null;
  const hasDiscount = Boolean(originalPrice && originalPrice > p.price);
  const discountPercent =
    hasDiscount && originalPrice
      ? Math.round(((originalPrice - p.price) / originalPrice) * 100)
      : 0;
  const customOptionsCount = p.options?.length || 0;
  const variantsCount = p.variants?.length || 0;
  const imagesCount = p.images?.length || (p.image_url ? 1 : 0);

  const hasVariants = Boolean(p.variants && p.variants.length > 0);
  const minVariantPrice = hasVariants ? Math.min(...p.variants!.map((v) => v.price)) : p.price;
  const maxVariantPrice = hasVariants ? Math.max(...p.variants!.map((v) => v.price)) : p.price;
  const displayPriceText = hasVariants
    ? minVariantPrice === maxVariantPrice
      ? formatRupiah(minVariantPrice)
      : `${formatRupiah(minVariantPrice)} - ${formatRupiah(maxVariantPrice)}`
    : formatRupiah(p.price);

  return (
    <div className="bg-white rounded-3xl border border-[#f3d7df] overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow">
      <div>
        {/* Foto Produk Cover */}
        <div className="relative aspect-[4/3] w-full bg-[#fde8ee]">
          <Image
            src={p.image_url || '/images/products/aromatherapy-candle.jpg'}
            alt={p.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/products/aromatherapy-candle.jpg';
            }}
          />
          <span className="absolute top-2.5 left-2.5 text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/90 text-[#e05d82]">
            {p.category_label || p.category}
          </span>

          <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
            {hasDiscount && (
              <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#ee4d2d] text-white shadow-xs">
                -{discountPercent}%
              </span>
            )}
            <span
              className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                p.is_active !== false
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-zinc-200 text-zinc-600'
              }`}
            >
              {p.is_active !== false ? 'Aktif' : 'Nonaktif'}
            </span>
          </div>

          {imagesCount > 1 && (
            <span className="absolute bottom-2.5 left-2.5 text-[9px] font-bold px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-xs flex items-center gap-1">
              <Images className="w-3 h-3" />
              <span>{imagesCount} Foto</span>
            </span>
          )}
        </div>

        {/* Info Produk */}
        <div className="p-4">
          <h3 className="font-serif font-bold text-sm text-[#2e1c24] line-clamp-1 mb-1">
            {p.name}
          </h3>

          <div className="flex items-center justify-between text-xs mb-2">
            <div>
              {hasDiscount && (
                <div className="flex items-center gap-1 leading-none mb-0.5">
                  <span className="text-[10px] text-zinc-400 line-through">
                    {formatRupiah(originalPrice!)}
                  </span>
                  <span className="text-[9px] font-bold text-[#ee4d2d] bg-[#fef0ed] px-1 py-0.2 rounded">
                    -{discountPercent}%
                  </span>
                </div>
              )}
              <span className="font-bold text-[#e05d82] text-sm">{displayPriceText}</span>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-[#755562] bg-[#fff7f9] px-2 py-0.5 rounded-md border border-[#f3d7df] block">
                Stok: {p.stock ?? 100} pcs
              </span>
              {variantsCount > 0 && (
                <span className="text-[10px] text-[#e05d82] font-bold mt-0.5 block">
                  🛍️ {variantsCount} Varian Harga
                </span>
              )}
              {customOptionsCount > 0 && (
                <span className="text-[10px] text-[#a85267] font-semibold mt-0.5 block">
                  🎨 {customOptionsCount} Opsi Custom
                </span>
              )}
            </div>
          </div>

          <p className="text-[11px] text-[#755562] line-clamp-2">{p.description}</p>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-3 bg-[#fff7f9] border-t border-[#f3d7df] flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onToggleActive(p)}
          className="text-xs font-semibold text-[#755562] hover:text-[#e05d82] flex items-center gap-1 cursor-pointer shrink-0"
        >
          {p.is_active !== false ? (
            <EyeOff className="w-3.5 h-3.5" />
          ) : (
            <Eye className="w-3.5 h-3.5" />
          )}
          <span>{p.is_active !== false ? 'Nonaktifkan' : 'Aktifkan'}</span>
        </button>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onEdit(p)}
            className="p-1.5 rounded-lg bg-[#fde8ee] text-[#e05d82] hover:bg-[#e05d82] hover:text-white transition-colors cursor-pointer"
            title="Edit Produk"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(p.id, p.name)}
            className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer"
            title="Hapus Produk"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
