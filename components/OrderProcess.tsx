'use client';

import React from 'react';
import { Icon } from '@iconify/react';

export default function OrderProcess() {
  const steps = [
    {
      num: '01',
      icon: 'solar:chat-round-dots-bold-duotone',
      color: 'text-emerald-600',
      bg: 'bg-emerald-500/10 border-emerald-200/80',
      title: 'Pilih & Konsultasi Ide',
      desc: 'Pilih produk favorit dari katalog. Diskusikan perkiraan kuantiti, tema warna pesta, aroma lilin, dan budget via WhatsApp.',
    },
    {
      num: '02',
      icon: 'solar:magic-stick-3-bold-duotone',
      color: 'text-purple-600',
      bg: 'bg-purple-500/10 border-purple-200/80',
      title: 'Free Mockup Digital',
      desc: 'Kami buatkan sampel preview digital kartu ucapan, sablon kemasan, atau label nama Anda secara gratis sampai cocok.',
    },
    {
      num: '03',
      icon: 'solar:hand-stars-bold-duotone',
      color: 'text-amber-600',
      bg: 'bg-amber-500/10 border-amber-200/80',
      title: 'Produksi Teliti & QC',
      desc: 'Setelah konfirmasi, pesanan dikerjakan secara teliti oleh perajin Magetan dengan pengecekan mutu setiap pcs.',
    },
    {
      num: '04',
      icon: 'solar:box-minimalistic-bold-duotone',
      color: 'text-blue-600',
      bg: 'bg-blue-500/10 border-blue-200/80',
      title: 'Kemas Cantik & Kirim Aman',
      desc: 'Souvenir dikemas rapi lengkap dengan pita satin, dibungkus bubble wrap berlapis tebal, dan dikirim bergaransi.',
    },
  ];

  return (
    <section
      id="cara-pesan"
      className="py-16 md:py-24 bg-[#f5f5f7] border-t border-zinc-200/60 relative"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-200/60 text-zinc-700 text-xs font-medium mb-3">
            <Icon icon="solar:route-bold-duotone" className="w-3.5 h-3.5 text-zinc-600" />
            <span>Alur Pemesanan</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight mb-2.5">
            Tahapan Pemesanan Souvenir
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed">
            4 tahapan nyaman mewujudkan souvenir impian Anda langsung dari studio workshop pengrajin
            tangan pertama.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {steps.map((s) => (
            <div
              key={s.num}
              className="bg-white p-6 sm:p-7 rounded-3xl border border-zinc-200/80 shadow-2xs hover:shadow-lg hover:shadow-black/[0.03] transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-11 h-11 rounded-2xl ${s.bg} border flex items-center justify-center group-hover:scale-110 transition-transform`}
                  >
                    <Icon icon={s.icon} className={`w-5 h-5 ${s.color}`} />
                  </div>
                  <span className="text-xl text-zinc-400 font-bold tracking-tight">{s.num}</span>
                </div>
                <h3 className="font-semibold text-base text-zinc-900 mb-1.5">{s.title}</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
