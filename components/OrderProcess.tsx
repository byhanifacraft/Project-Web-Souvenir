'use client';

import React from 'react';

export default function OrderProcess() {
  const steps = [
    {
      num: '01',
      title: 'Pilih & Konsultasi Ide',
      desc: 'Pilih produk favorit dari katalog. Diskusikan perkiraan kuantiti, tema warna pesta, aroma lilin, dan budget via WhatsApp.',
    },
    {
      num: '02',
      title: 'Free Mockup Digital',
      desc: 'Kami buatkan sampel preview digital kartu ucapan, sablon kemasan, atau label nama Anda secara gratis sampai cocok.',
    },
    {
      num: '03',
      title: 'Produksi Teliti & QC',
      desc: 'Setelah konfirmasi, pesanan dikerjakan secara teliti oleh perajin Magetan dengan pengecekan mutu setiap pcs.',
    },
    {
      num: '04',
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
          <p className="text-xs uppercase tracking-widest text-zinc-400 font-medium mb-2">
            The Process
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight mb-2.5">
            Tahapan Pemesanan Souvenir
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed">
            4 tahapan nyaman mewujudkan souvenir impian Anda langsung dari studio workshop pengrajin
            tangan pertama.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {steps.map((s, idx) => (
            <div
              key={s.num}
              className="bg-white p-6 sm:p-7 rounded-2xl border border-zinc-200/80 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl text-zinc-900 font-bold tracking-tight">{s.num}</span>
                  <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest">
                    Tahap {idx + 1}
                  </span>
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
