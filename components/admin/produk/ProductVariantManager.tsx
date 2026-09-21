'use client';

import React from 'react';
import Image from 'next/image';
import { ProductItem, ProductVariant } from '@/types/store';
import { formatRupiah } from '@/lib/utils';
import { Trash2, Plus, Sparkles, ImagePlus } from 'lucide-react';

interface ProductVariantManagerProps {
  product: ProductItem;
  onChange: (updatedProduct: ProductItem) => void;
  onUploadVariantFile: (variantIndex: number, file: File) => void;
  uploadingImages: boolean;
}

export default function ProductVariantManager({
  product,
  onChange,
  onUploadVariantFile,
  uploadingImages: _uploadingImages,
}: ProductVariantManagerProps) {
  const variants = product.variants || [];
  const galleryImages =
    product.images && product.images.length > 0
      ? product.images
      : product.image_url
        ? [product.image_url]
        : [];

  const handleUpdateVariant = (index: number, fields: Partial<ProductVariant>) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], ...fields };
    onChange({ ...product, variants: updated });
  };

  const handleRemoveVariant = (index: number) => {
    const updated = variants.filter((_, idx) => idx !== index);
    onChange({ ...product, variants: updated });
  };

  const handleAddVariant = () => {
    const newVar: ProductVariant = {
      id: `var-${Date.now()}-${variants.length + 1}`,
      name: '',
      price: product.price || 15000,
      original_price: product.original_price ?? null,
      image_url: '',
      stock: 100,
    };
    onChange({ ...product, variants: [...variants, newVar] });
  };

  const handleApplyVariantPreset = (type: 'resin' | 'candle' | 'hampers') => {
    let presetVariants: ProductVariant[] = [];
    if (type === 'resin') {
      presetVariants = [
        { id: `var-${Date.now()}-1`, name: 'Huruf Inisial Saja', price: 6500, stock: 100 },
        { id: `var-${Date.now()}-2`, name: 'Huruf + Pita Rustic', price: 8500, stock: 100 },
        { id: `var-${Date.now()}-3`, name: 'Huruf + Hardbox Exclusive', price: 15000, stock: 100 },
      ];
    } else if (type === 'candle') {
      presetVariants = [
        { id: `var-${Date.now()}-1`, name: 'Jar Kaca 60ml', price: 15000, stock: 100 },
        { id: `var-${Date.now()}-2`, name: 'Jar Kaca 100ml', price: 25000, stock: 100 },
        { id: `var-${Date.now()}-3`, name: 'Jar Kaca 100ml + Gift Box', price: 35000, stock: 100 },
      ];
    } else if (type === 'hampers') {
      presetVariants = [
        { id: `var-${Date.now()}-1`, name: 'Paket Basic (2 Items)', price: 45000, stock: 50 },
        {
          id: `var-${Date.now()}-2`,
          name: 'Paket Deluxe (3 Items + Box)',
          price: 75000,
          stock: 50,
        },
        { id: `var-${Date.now()}-3`, name: 'Paket Luxury VIP', price: 120000, stock: 30 },
      ];
    }
    onChange({ ...product, variants: presetVariants });
  };

  return (
    <div className="bg-[#fff7f9] p-4 sm:p-5 rounded-2xl border border-[#f3d7df] space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h4 className="font-bold text-[#2e1c24] flex items-center gap-1.5 text-xs sm:text-sm">
            <Sparkles className="w-4 h-4 text-[#e05d82]" />
            <span>Variasi Produk & Harga Bertingkat</span>
          </h4>
          <p className="text-[11px] text-[#755562] mt-0.5 leading-relaxed">
            Buat opsi varian produk dengan harga dan foto berbeda. Jika tanpa varian, harga
            menggunakan harga tunggal di atas.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddVariant}
          className="px-3.5 py-1.5 rounded-xl bg-[#e05d82] text-white text-xs font-bold hover:bg-[#c8476c] transition-colors flex items-center justify-center gap-1.5 shadow-xs shrink-0 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ Tambah Varian Baru</span>
        </button>
      </div>

      {/* Preset Buttons */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        <span className="text-[10px] text-[#755562] font-semibold">Template Cepat:</span>
        <button
          type="button"
          onClick={() => handleApplyVariantPreset('resin')}
          className="px-2.5 py-1 rounded-lg bg-white border border-[#f3d7df] text-[10px] font-semibold text-[#755562] hover:bg-[#fde8ee] hover:text-[#e05d82] transition-colors cursor-pointer"
        >
          + Gantungan Resin
        </button>
        <button
          type="button"
          onClick={() => handleApplyVariantPreset('candle')}
          className="px-2.5 py-1 rounded-lg bg-white border border-[#f3d7df] text-[10px] font-semibold text-[#755562] hover:bg-[#fde8ee] hover:text-[#e05d82] transition-colors cursor-pointer"
        >
          + Lilin Jar
        </button>
        <button
          type="button"
          onClick={() => handleApplyVariantPreset('hampers')}
          className="px-2.5 py-1 rounded-lg bg-white border border-[#f3d7df] text-[10px] font-semibold text-[#755562] hover:bg-[#fde8ee] hover:text-[#e05d82] transition-colors cursor-pointer"
        >
          + Paket Hampers
        </button>
      </div>

      {/* Variants List */}
      {variants.length === 0 ? (
        <div className="p-4 rounded-xl bg-white border border-dashed border-[#f3d7df] text-center">
          <p className="text-xs text-[#755562]">
            Produk ini saat ini menggunakan{' '}
            <strong>Harga Tunggal ({formatRupiah(product.price)})</strong>. Klik tombol di atas jika
            ingin menambahkan varian model/kemasan dengan harga berbeda.
          </p>
        </div>
      ) : (
        <div className="space-y-3 pt-1">
          {variants.map((variant, vIdx) => (
            <div
              key={variant.id || vIdx}
              className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#f3d7df] shadow-2xs space-y-3"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#f3d7df]/60">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#fde8ee] text-[#e05d82] text-[10px] font-bold flex items-center justify-center shrink-0">
                    {vIdx + 1}
                  </span>
                  <span className="font-bold text-xs text-[#2e1c24]">
                    {variant.name || `Varian #${vIdx + 1}`}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveVariant(vIdx)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                  title="Hapus varian"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                {/* Variant Image Selector */}
                <div className="sm:col-span-3 flex sm:flex-col items-center gap-2">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-[#f3d7df] bg-[#fff7f9] shrink-0 flex items-center justify-center">
                    {variant.image_url ? (
                      <Image
                        src={variant.image_url}
                        alt={variant.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            '/images/products/aromatherapy-candle.jpg';
                        }}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-zinc-400 p-1 text-center">
                        <ImagePlus className="w-5 h-5 text-zinc-300" />
                        <span className="text-[9px] text-zinc-400 leading-tight mt-0.5">
                          Tanpa foto
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 w-full text-center sm:text-left">
                    <select
                      value={variant.image_url || ''}
                      onChange={(e) => handleUpdateVariant(vIdx, { image_url: e.target.value })}
                      className="w-full text-[10px] px-2 py-1 rounded-lg border border-[#f3d7df] bg-[#fff7f9] text-[#2e1c24] truncate cursor-pointer"
                    >
                      <option value="">Tanpa Foto Khusus</option>
                      {galleryImages.filter(Boolean).map((img, imgI) => (
                        <option key={imgI} value={img}>
                          {imgI === 0 ? '⭐ Foto Cover' : `Foto Galeri #${imgI + 1}`}
                        </option>
                      ))}
                    </select>
                    <div className="flex items-center justify-center sm:justify-start gap-2 mt-0.5">
                      <label className="text-[10px] text-[#e05d82] hover:underline cursor-pointer font-semibold">
                        + Upload
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) onUploadVariantFile(vIdx, f);
                          }}
                        />
                      </label>
                      {variant.image_url && (
                        <button
                          type="button"
                          onClick={() => handleUpdateVariant(vIdx, { image_url: '' })}
                          className="text-[10px] text-zinc-400 hover:text-rose-600 cursor-pointer"
                        >
                          Hapus
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Variant Name */}
                <div className="sm:col-span-4">
                  <label className="block text-[11px] font-bold text-[#2e1c24] mb-1">
                    Nama Varian <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jar 60ml / Huruf + Pita"
                    value={variant.name}
                    onChange={(e) => handleUpdateVariant(vIdx, { name: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-xl border border-[#f3d7df] bg-[#fff7f9] text-xs text-[#2e1c24] focus:outline-none focus:ring-1 focus:ring-[#e05d82]"
                  />
                </div>

                {/* Price */}
                <div className="sm:col-span-3">
                  <label className="block text-[11px] font-bold text-[#2e1c24] mb-1">
                    Harga (Rp) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={variant.price}
                    onChange={(e) =>
                      handleUpdateVariant(vIdx, { price: Math.max(0, Number(e.target.value) || 0) })
                    }
                    className="w-full px-3 py-1.5 rounded-xl border border-[#f3d7df] bg-[#fff7f9] text-xs text-[#2e1c24] font-bold focus:outline-none focus:ring-1 focus:ring-[#e05d82]"
                  />
                </div>

                {/* Stock */}
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-[#2e1c24] mb-1">Stok</label>
                  <input
                    type="number"
                    min={0}
                    value={variant.stock ?? 100}
                    onChange={(e) =>
                      handleUpdateVariant(vIdx, { stock: Math.max(0, Number(e.target.value) || 0) })
                    }
                    className="w-full px-2.5 py-1.5 rounded-xl border border-[#f3d7df] bg-[#fff7f9] text-xs text-[#2e1c24] focus:outline-none focus:ring-1 focus:ring-[#e05d82]"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
