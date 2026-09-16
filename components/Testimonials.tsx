'use client';

import React from 'react';
import { Icon } from '@iconify/react';

interface TestimonialItem {
  id: string;
  name: string;
  event: string;
  location: string;
  rating: number;
  date: string;
  quote: string;
  productName: string;
  verifiedBuyer?: boolean;
}

const testimonialsData: TestimonialItem[] = [
  {
    id: '1',
    name: 'Anisa & Dimas',
    event: 'Souvenir Pernikahan',
    location: 'Surabaya',
    rating: 5,
    date: 'Januari 2026',
    quote:
      'Pesan 350 pcs lilin aromaterapi aroma Vanilla Rose. Tamu undangan banyak banget yang memuji kemasan rustic-nya yang cantik dan wanginya tahan lama. Kak Hanifa ramah banget bantu mockup kartu ucapannya sampai pas!',
    productName: 'Lilin Aromaterapi Jar Custom Ribbon',
    verifiedBuyer: true,
  },
  {
    id: '2',
    name: 'Riana Putri',
    event: 'Hampers Bridesmaid',
    location: 'Solo',
    rating: 5,
    date: 'Februari 2026',
    quote:
      'Gantungan kunci resin bunganya bener-bener estetik dan bening kristal! Teman-teman bridesmaid suka banget, sampai dipasang di tas harian mereka. Kualitas pengerjaannya rapi banget untuk harga yang terjangkau.',
    productName: 'Gantungan Kunci Resin Floral Inisial',
    verifiedBuyer: true,
  },
  {
    id: '3',
    name: 'Panitia Seminar Nasional FKIP',
    event: 'Merchandise Seminar',
    location: 'Madiun',
    rating: 5,
    date: 'Maret 2026',
    quote:
      'Pouch blacu sablon 500 pcs selesai tepat waktu dan jahitannya kuat rapi. Kualitas sablon logo instansi tajam. Packing pengiriman ke kampus sangat aman berlapis bubble wrap. Sangat direkomendasikan!',
    productName: 'Pouch Blacu Custom Sablon Logo',
    verifiedBuyer: true,
  },
  {
    id: '4',
    name: 'Citra & Kevin',
    event: 'Souvenir Resepsi',
    location: 'Jakarta Selatan',
    rating: 5,
    date: 'April 2026',
    quote:
      'Awalnya sempat was-was kirim lilin dari Magetan ke Jakarta, tapi begitu sampai barang mulus tidak ada yang pecah satupun. Pengemasannya sangat profesional dan aroma Lavender-nya bener-bener calming.',
    productName: 'Lilin Kaleng Travel Tin Aromaterapi',
    verifiedBuyer: true,
  },
];

export default function Testimonials() {
  return (
    <section
      id="testimoni"
      className="py-16 md:py-24 bg-white border-t border-zinc-200/60 relative"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs uppercase tracking-widest text-zinc-400 font-medium mb-2">
            Ulasan Klien
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight mb-2.5">
            Cerita Hangat dari Klien Kami
          </h2>
          <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed">
            Kepuasan calon pengantin, panitia seminar, dan klien korporat adalah kebanggaan terbesar
            kami bersama <strong>CraftByHanifa</strong>.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mb-12">
          {testimonialsData.map((item) => (
            <div
              key={item.id}
              className="bg-[#fbfbfd] p-6 sm:p-7 rounded-2xl border border-zinc-200/80 hover:bg-white hover:shadow-xs transition-all flex flex-col justify-between relative"
            >
              <div>
                {/* Header: Stars & Date */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(item.rating)].map((_, i) => (
                      <Icon key={i} icon="solar:star-bold" className="w-4 h-4 text-amber-400" />
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                    <Icon
                      icon="solar:calendar-date-bold-duotone"
                      className="w-4 h-4 text-zinc-400"
                    />
                    <span>{item.date}</span>
                  </div>
                </div>

                {/* Quote Body */}
                <p className="text-sm text-zinc-700 leading-relaxed mb-6 font-normal">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-3.5 border-t border-zinc-200/60 flex items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-semibold text-sm text-zinc-900">{item.name}</h4>
                    {item.verifiedBuyer && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/50">
                        <Icon
                          icon="solar:verified-check-bold-duotone"
                          className="w-3.5 h-3.5 text-emerald-600"
                        />
                        <span>Terverifikasi</span>
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-zinc-500 mt-0.5">
                    <span>
                      {item.event} • {item.location}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-medium text-zinc-600 bg-white border border-zinc-200/70 px-2.5 py-1 rounded-full shrink-0">
                  {item.productName}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Shopee Review Badge Banner */}
        <div className="text-center bg-[#faf4ef] border border-[#ebdcd5] rounded-2xl p-6 max-w-2xl mx-auto shadow-2xs">
          <div className="flex items-center justify-center gap-1.5 mb-1 text-xs text-[#2a2123]">
            <Icon
              icon="solar:medal-ribbons-star-bold-duotone"
              className="w-4 h-4 text-amber-500 shrink-0"
            />
            <span>
              <strong>4.85 / 5.0</strong> dari 1.500+ Ulasan Star+ Seller di Shopee
            </span>
          </div>
          <p className="text-xs text-[#736064]">
            Semua ulasan asli dari pembeli di seluruh nusantara yang telah merasakan kehangatan
            lilin dan kerajinan CraftByHanifa.
          </p>
        </div>
      </div>
    </section>
  );
}
