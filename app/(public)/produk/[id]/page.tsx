import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getStoreData } from '@/lib/getStoreData';
import { Icon } from '@iconify/react';
import ProductDetailClient from './ProductDetailClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const storeData = await getStoreData();
  const product = (storeData?.products || []).find(
    (p) => p.id === id || encodeURIComponent(p.id) === id
  );

  if (!product) {
    return {
      title: 'Produk Tidak Ditemukan | CraftByHanifa',
      description: 'Produk souvenir kerajinan tangan CraftByHanifa Magetan.',
    };
  }

  const title = `${product.name} | Souvenir Handmade CraftByHanifa Magetan`;
  const description =
    product.description ||
    `Pesan ${product.name} custom handmade berkualitas dari studio CraftByHanifa Magetan. Minimal pesanan ${product.min_order ?? 1} pcs.`;
  const imageUrl = product.image_url || '/images/products/aromatherapy-candle.jpg';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://craftbyhanifa.com/produk/${encodeURIComponent(product.id)}`,
      siteName: 'CraftByHanifa',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
      locale: 'id_ID',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const storeData = await getStoreData();
  const product = (storeData?.products || []).find(
    (p) => p.id === id || encodeURIComponent(p.id) === id
  );

  if (!product || product.is_active === false) {
    notFound();
  }

  const siteConfig = storeData?.siteConfig;
  const brandName = siteConfig?.name || 'CraftByHanifa';
  const whatsappNum = siteConfig?.whatsapp || '6281234567890';

  // JSON-LD Structured Data untuk Google Search Rich Snippet
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.images && product.images.length > 0 ? product.images : [product.image_url],
    description: product.description,
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: brandName,
    },
    offers: {
      '@type': 'Offer',
      url: `https://craftbyhanifa.com/produk/${encodeURIComponent(product.id)}`,
      priceCurrency: 'IDR',
      price: product.price,
      priceValidUntil: '2027-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating || '4.9',
      reviewCount: product.sold_count || '1500',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-14 animate-fadeIn">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-zinc-400 mb-6 sm:mb-8 overflow-x-auto">
          <Link href="/" className="hover:text-[#c45a76] transition-colors flex items-center gap-1">
            <Icon icon="solar:home-2-bold-duotone" className="w-3.5 h-3.5" />
            <span>Beranda</span>
          </Link>
          <span>/</span>
          <Link href="/produk" className="hover:text-[#c45a76] transition-colors">
            Katalog Souvenir
          </Link>
          <span>/</span>
          <span className="text-zinc-800 font-medium truncate max-w-[200px] sm:max-w-none">
            {product.name}
          </span>
        </nav>

        {/* Client Interactive Detail Component */}
        <ProductDetailClient product={product} brandName={brandName} whatsapp={whatsappNum} />
      </div>
    </>
  );
}
