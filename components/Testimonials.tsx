'use client';

import React from 'react';
import { Star, Calendar, CheckCircle } from 'lucide-react';

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
      className="py-16 md:py-24 bg-transparent border-t border-[#ebdcd5] relative"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#a85267] mb-2">
            Kind Words
          </p>
          <h2 className="text-2xl sm:text-3xl font-serif text-[#2a2123] tracking-tight mb-2.5">
            Cerita Hangat dari Klien Kami
          </h2>
          <p className="text-xs sm:text-sm text-[#736064] leading-relaxed">
            Kepuasan calon pengantin, panitia seminar, dan klien korporat adalah kebanggaan terbesar
            kami. Berikut sebagian ulasan mereka bersama <strong>CraftByHanifa</strong>.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7 mb-12">
          {testimonialsData.map((item) => (
            <div
              key={item.id}
              className="bg-white p-6 sm:p-7 rounded-2xl border border-[#ebdcd5] shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between relative"
            >
              <div>
                {/* Header: Stars & Date */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-[#eab308]">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-[#eab308]" />
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-[#8c7873]">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{item.date}</span>
                  </div>
                </div>

                {/* Quote Body */}
                <p className="font-serif italic text-sm text-[#423337] leading-relaxed mb-6">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-4 border-t border-[#f0e4df] flex items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-serif font-bold text-sm text-[#2a2123]">{item.name}</h4>
                    {item.verifiedBuyer && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-[#3f7a63] bg-[#edf6f2] px-2 py-0.5 rounded-full">
                        <CheckCircle className="w-3 h-3" /> Terverifikasi
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-[#736064] mt-0.5">
                    <span>
                      {item.event} • {item.location}
                    </span>
                  </div>
                </div>

                <div className="text-right hidden sm:block">
                  <span className="text-[11px] text-[#8c7873] block">Pesanan:</span>
                  <span className="text-xs font-medium text-[#2a2123] line-clamp-1 max-w-[170px]">
                    {item.productName}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Shopee Review Badge Banner */}
        <div className="text-center bg-[#faf4ef] border border-[#ebdcd5] rounded-2xl p-6 max-w-2xl mx-auto shadow-2xs">
          <p className="text-xs font-serif text-[#2a2123] mb-1">
            ★ <strong>4.85 / 5.0</strong> dari 1.500+ Ulasan Star+ Seller di Shopee
          </p>
          <p className="text-xs text-[#736064]">
            Semua ulasan asli dari pembeli di seluruh nusantara yang telah merasakan kehangatan
            lilin dan kerajinan CraftByHanifa.
          </p>
        </div>
      </div>
    </section>
  );
}
