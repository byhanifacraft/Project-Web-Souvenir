'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { ProductItem } from '@/types/store';
import { Product } from '@/types';
import { formatRupiah, calculateDiscount } from '@/lib/utils';
import { Icon } from '@iconify/react';
import ProductModal from '@/components/ProductModal';

interface ProductCatalogProps {
  products?: ProductItem[];
  initialProducts?: ProductItem[];
  whatsapp?: string;
  brandName?: string;
}

const PRESET_CATEGORIES = [
  { id: 'all', label: 'Semua Produk' },
  { id: 'candle', label: 'Lilin Aromaterapi' },
  { id: 'resin', label: 'Resin & Akrilik' },
  { id: 'pouch', label: 'Pouch & Kain' },
  { id: 'hampers', label: 'Hampers & Gift Box' },
];

export default function ProductCatalog({
  products: propProducts,
  initialProducts,
  whatsapp = '6281234567890',
  brandName = 'CraftByHanifa',
}: ProductCatalogProps) {
  const products = useMemo(
    () => propProducts || initialProducts || [],
    [propProducts, initialProducts]
  );
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModalProduct, setSelectedModalProduct] = useState<Product | null>(null);

  // Derivasi kategori dinamis dari produk
  const categories = useMemo(() => {
    const categorySet = new Set<string>();
    products.forEach((p) => {
      if (p.category) categorySet.add(p.category);
    });

    const dynamicCats = [
      { id: 'all', label: 'Semua Produk' },
      ...Array.from(categorySet).map((catKey) => {
        const preset = PRESET_CATEGORIES.find((pr) => pr.id === catKey);
        if (preset) return preset;
        const matchingProd = products.find((p) => p.category === catKey);
        return {
          id: catKey,
          label: matchingProd?.category_label || catKey.charAt(0).toUpperCase() + catKey.slice(1),
        };
      }),
    ];

    return dynamicCats;
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
      const desc = p.description || '';
      const matchSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        desc.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const getWaLink = (product: ProductItem) => {
    const minOrder = product.min_order ?? 1;
    const text = encodeURIComponent(
      `Halo Kak Hanifa (${brandName}), saya tertarik pesan souvenir "${product.name}". Minimal pesanan ${minOrder} pcs. Boleh minta info penawaran harga & kustomisasinya?`
    );
    return `https://wa.me/${whatsapp}?text=${text}`;
  };

  return (
    <section
      id="produk"
      className="py-12 md:py-16 bg-white border-t border-zinc-200/60 relative scroll-mt-14"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs uppercase tracking-widest text-zinc-400 font-medium mb-2">
            Koleksi Handmade
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 tracking-tight mb-3">
            Katalog Souvenir Pilihan
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed">
            Dibuat secara custom dengan bahan ramah lingkungan. Setiap souvenir sudah termasuk
            pengemasan rapi dan gratis kartu ucapan personal siap bagikan.
          </p>
        </div>

        {/* Categories & Search */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3.5 mb-9">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none">
            {categories.map((c) => {
              const isSelected = selectedCategory === c.id;
              const count =
                c.id === 'all'
                  ? products.length
                  : products.filter(
                      (p) =>
                        p.category === c.id ||
                        (c.id === 'hampers' &&
                          (p.category === 'hampers' || p.category === 'bouquet'))
                    ).length;

              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#1d1d1f] text-white shadow-xs'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900'
                  }`}
                >
                  <span>{c.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-white text-zinc-500'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative w-full md:w-64">
            <Icon
              icon="solar:magnifer-linear"
              className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
            />
            <input
              type="text"
              placeholder="Cari jenis souvenir..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-1.5 text-xs bg-white border border-zinc-200 rounded-full focus:outline-none focus:ring-1 focus:ring-[#df829b] text-zinc-900 placeholder-zinc-400"
            />
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {filteredProducts.map((p) => {
            const imageUrl = p.image_url || '/images/products/aromatherapy-candle.jpg';
            const galleryImages = p.images && p.images.length > 0 ? p.images : [imageUrl];
            const hasMultipleImages = galleryImages.length > 1;
            const secondaryImage = hasMultipleImages ? galleryImages[1] : imageUrl;

            const variants = p.variants || [];
            let priceMin = Number(p.price || 15000);
            let priceMax = priceMin;
            if (variants.length > 0) {
              const variantPrices = variants
                .map((v) => Number(v.price))
                .filter((n) => !isNaN(n) && n > 0);
              if (variantPrices.length > 0) {
                priceMin = Math.min(...variantPrices);
                priceMax = Math.max(...variantPrices);
              }
            }

            const originalPrice = p.original_price ? Number(p.original_price) : null;
            const { hasDiscount, discountPercent } = calculateDiscount(originalPrice, priceMin);
            const minOrder = p.min_order ?? 1;
            const hasCustomOptions = Boolean(p.options && p.options.length > 0);

            const handleOpenModal = () => {
              const validCat: Product['category'] =
                p.category &&
                ['resin', 'candle', 'pouch', 'totebag', 'bouquet', 'hampers'].includes(p.category)
                  ? (p.category as Product['category'])
                  : 'candle';

              setSelectedModalProduct({
                id: p.id,
                name: p.name,
                category: validCat,
                categoryLabel: p.category_label || p.category || 'Lilin Aromaterapi',
                image: imageUrl,
                images: galleryImages,
                variants: variants,
                priceMin: priceMin,
                priceMax: priceMax,
                originalPrice: originalPrice,
                minOrder: minOrder,
                leadTime: p.lead_time || '5 - 10 Hari Kerja',
                material: p.material || 'Material Grade A',
                size: p.size || 'Ukuran Standar',
                shortDesc: p.description,
                description: p.description,
                options: p.options || [],
                shopeeUrl: p.shopee_url || 'https://shopee.co.id/hanifakumala',
                rating: p.rating || 4.9,
                soldCount: p.sold_count || 1000,
                includedItems: p.included_items || [
                  'Souvenir custom pilihan',
                  'Kemasan rapi berpita satin',
                  'Free kartu ucapan custom',
                ],
              });
            };

            return (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-zinc-200/80 overflow-hidden shadow-2xs hover:shadow-sm hover:border-zinc-300 transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  {/* Product Image Box */}
                  <div
                    className="relative aspect-[4/3] bg-zinc-100 overflow-hidden cursor-pointer"
                    onClick={handleOpenModal}
                  >
                    <Image
                      src={imageUrl}
                      alt={p.name}
                      fill
                      className={`object-cover transition-all duration-500 group-hover:scale-105 ${
                        hasMultipleImages ? 'group-hover:opacity-0' : ''
                      }`}
                    />
                    {hasMultipleImages && (
                      <Image
                        src={secondaryImage}
                        alt={`${p.name} - Galeri`}
                        fill
                        className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                      <span className="px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-xs text-xs font-semibold text-zinc-900 flex items-center gap-1.5 shadow-sm transform translate-y-1 group-hover:translate-y-0 transition-transform">
                        <Icon icon="solar:eye-bold-duotone" className="w-4 h-4 text-[#df829b]" />
                        <span>Lihat Detail & Varian</span>
                      </span>
                    </div>

                    <span className="absolute top-3 left-3 text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-[#fdf0f3] text-[#c45a76] shadow-2xs z-10">
                      {p.category_label || p.category}
                    </span>

                    <div className="absolute top-3 right-3 flex items-center gap-1 z-10">
                      {hasDiscount && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#ee4d2d] text-white shadow-xs tracking-tight">
                          -{discountPercent}%
                        </span>
                      )}
                    </div>

                    {hasMultipleImages && (
                      <span className="absolute bottom-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-xs flex items-center gap-1 z-10">
                        <Icon icon="solar:gallery-wide-bold" className="w-3 h-3" />
                        <span>{galleryImages.length} Foto</span>
                      </span>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-5">
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-400">
                        {p.category_label || p.category}
                      </span>
                      <span className="text-xs text-zinc-500 font-medium">★ {p.rating || 4.9}</span>
                    </div>

                    <h3
                      className="font-semibold text-base text-zinc-900 mb-1.5 group-hover:text-zinc-600 transition-colors cursor-pointer"
                      onClick={handleOpenModal}
                    >
                      {p.name}
                    </h3>

                    <p className="text-xs text-zinc-500 line-clamp-2 mb-3 leading-relaxed">
                      {p.description}
                    </p>

                    <div className="flex items-center justify-between gap-1 text-xs text-zinc-500 mb-2">
                      <div className="flex items-center gap-1.5">
                        <Icon
                          icon="solar:box-minimalistic-bold-duotone"
                          className="w-4 h-4 text-zinc-400 shrink-0"
                        />
                        <span>
                          Min: <strong>{minOrder} pcs</strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {variants.length > 0 && (
                          <span className="text-[10px] font-bold text-[#c45a76] bg-[#fde8ee] px-2 py-0.5 rounded-full">
                            {variants.length} Varian
                          </span>
                        )}
                        {hasCustomOptions && variants.length === 0 && (
                          <span className="text-[10px] font-medium text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded-full">
                            Bisa Custom
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price & Action Buttons */}
                <div className="p-5 pt-0">
                  <div className="pt-3 border-t border-zinc-100 mb-3 flex items-center justify-between">
                    <span className="text-xs text-zinc-400">
                      {variants.length > 0 && priceMin !== priceMax
                        ? 'Rentang Harga:'
                        : 'Harga Satuan:'}
                    </span>
                    <div className="text-right">
                      {hasDiscount && (
                        <div className="flex items-center justify-end gap-1.5 leading-none mb-0.5">
                          <span className="text-xs text-zinc-400 line-through">
                            {formatRupiah(originalPrice!)}
                          </span>
                          <span className="text-[9px] font-bold text-[#ee4d2d] bg-[#fef0ed] px-1.5 py-0.2 rounded">
                            -{discountPercent}%
                          </span>
                        </div>
                      )}
                      <div className="flex items-baseline justify-end gap-1">
                        <span className="text-base sm:text-lg font-bold text-zinc-900">
                          {priceMin === priceMax
                            ? formatRupiah(priceMin)
                            : `${formatRupiah(priceMin)} - ${formatRupiah(priceMax)}`}
                        </span>
                        <span className="text-[11px] text-zinc-400">/ pcs</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleOpenModal}
                      className="flex-1 py-2.5 rounded-full bg-[#1d1d1f] text-white font-medium text-xs text-center hover:bg-zinc-800 transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer min-h-[40px]"
                    >
                      <Icon icon="solar:eye-bold-duotone" className="w-4 h-4" />
                      <span>Detail & Custom</span>
                    </button>

                    <a
                      href={getWaLink(p)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2.5 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-medium text-xs text-center transition-all flex items-center justify-center gap-1 shadow-sm shadow-[#25D366]/25 hover:scale-105 min-h-[40px]"
                      title="Pesan Langsung via WhatsApp"
                    >
                      <Icon
                        icon="solar:chat-round-call-bold-duotone"
                        className="w-4 h-4 text-white"
                      />
                    </a>

                    {p.shopee_url && (
                      <a
                        href={p.shopee_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-2.5 rounded-full bg-[#ee4d2d] text-white font-medium text-xs text-center hover:bg-[#d73211] transition-all flex items-center justify-center gap-1 shadow-sm shadow-[#ee4d2d]/25 hover:scale-105 min-h-[40px]"
                        title="Beli Sampel di Shopee"
                      >
                        <Icon icon="solar:bag-heart-bold-duotone" className="w-4 h-4 text-white" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Shopee Sample Banner Helper */}
        <div className="mt-12 p-6 rounded-2xl bg-[#faf9f6] border border-zinc-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-2xs">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200 text-zinc-800 flex items-center justify-center shrink-0 shadow-2xs">
              <Icon icon="solar:shop-2-bold-duotone" className="w-5 h-5 text-zinc-800" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-zinc-900">
                Ingin Lihat Kualitas Fisik? Beli Sampel 1 Pcs Dulu di Shopee
              </h4>
              <p className="text-xs text-zinc-500 mt-0.5">
                Coba aroma lilin dan rasakan kehalusan kemasan sebelum memutuskan order kuantiti
                untuk souvenir pernikahan Anda.
              </p>
            </div>
          </div>
          <a
            href="https://shopee.co.id/hanifakumala"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-full bg-[#ee4d2d] text-white font-medium text-xs hover:bg-[#d73211] transition-colors shrink-0 shadow-sm flex items-center gap-1.5"
          >
            <Icon icon="solar:bag-heart-bold-duotone" className="w-4 h-4 text-white" />
            <span>Toko Shopee Resmi</span>
          </a>
        </div>
      </div>

      {/* Detail Modal Component */}
      {selectedModalProduct && (
        <ProductModal
          key={selectedModalProduct.id}
          product={selectedModalProduct}
          whatsapp={whatsapp}
          brandName={brandName}
          onClose={() => setSelectedModalProduct(null)}
        />
      )}
    </section>
  );
}
