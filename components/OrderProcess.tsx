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
      className="py-16 md:py-22 bg-[#faf4ef] border-t border-[#ebdcd5] relative"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-12">
          <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#a85267] mb-2">
            The Process
          </p>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#2a2123] tracking-tight mb-2.5">
            Tahapan Pemesanan Souvenir
          </h2>
          <p className="text-xs sm:text-sm text-[#736064] leading-relaxed">
            4 tahapan nyaman mewujudkan souvenir impian Anda langsung dari studio workshop pengrajin
            tangan pertama.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, idx) => (
            <div
              key={s.num}
              className="bg-white p-6 sm:p-7 rounded-2xl border border-[#ebdcd5] shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-serif text-2xl text-[#c26d83] font-bold">{s.num}</span>
                  <span className="text-[10px] font-semibold text-[#8c7873] uppercase tracking-widest">
                    Tahap {idx + 1}
                  </span>
                </div>
                <h3 className="font-serif font-bold text-base text-[#2a2123] mb-2">{s.title}</h3>
                <p className="text-xs text-[#5e4e52] leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
