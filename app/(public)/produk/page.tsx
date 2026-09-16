import React from 'react';
import { getStoreData } from '@/lib/getStoreData';
import ProductCatalog from '@/components/ProductCatalog';

export const revalidate = 300; // ISR 5 menit (di-revalidate instan saat admin simpan perubahan)

export default async function ProdukPage() {
  const storeData = await getStoreData();
  const siteConfig = storeData?.siteConfig;
  const products = (storeData?.products || []).filter((p) => p.is_active !== false);

  return (
    <div className="py-8 md:py-12 space-y-12">
      {/* 1. Header Banner */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-4">
          <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#a85267] mb-2.5">
            The Complete Collection
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#2a2123] tracking-tight mb-3">
            Koleksi Kerajinan Handmade
          </h1>
          <p className="text-sm sm:text-base text-[#5e4e52] leading-relaxed">
            Pilihan lilin aromaterapi 100% natural soy wax, gantungan kunci resin floral, pouch
            blacu sablon, totebag custom, dan hampers bridesmaid bergaransi aman ke seluruh
            Indonesia.
          </p>
        </div>
      </section>

      {/* 2. Main Product Catalog Component with Modal Detail */}
      <ProductCatalog
        initialProducts={products}
        whatsapp={siteConfig?.whatsapp}
        brandName={siteConfig?.name}
      />
    </div>
  );
}
