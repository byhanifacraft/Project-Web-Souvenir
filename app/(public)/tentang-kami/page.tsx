import React from 'react';
import { getStoreData } from '@/lib/getStoreData';
import About from '@/components/About';
import OrderProcess from '@/components/OrderProcess';
import Testimonials from '@/components/Testimonials';

export const revalidate = 300; // ISR 5 menit (di-revalidate instan saat admin simpan perubahan)

export default async function TentangKamiPage() {
  const storeData = await getStoreData();
  const siteContent = storeData?.siteContent || {};
  const siteConfig = storeData?.siteConfig;

  return (
    <div className="py-8 md:py-12 space-y-14">
      {/* 1. Header Banner */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#a85267] mb-2.5">
            About CraftByHanifa
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#2a2123] tracking-tight mb-4">
            Studio Lilin & Kriya Magetan
          </h1>
          <p className="text-sm sm:text-base text-[#5e4e52] leading-relaxed">
            Perjalanan dedikasi menghadirkan kehangatan seni lilin aromaterapi ramah lingkungan dan
            kerajinan tangan bermakna langsung dari workshop pengrajin lokal di Magetan, Jawa Timur.
          </p>
        </div>
      </section>

      {/* 2. Main About & Visi Misi Component */}
      <About content={siteContent} config={siteConfig} />

      {/* 3. 4-Step Order Workflow */}
      <OrderProcess />

      {/* 4. Client Testimonials & Social Proof */}
      <Testimonials />
    </div>
  );
}
