'use client';

import React from 'react';
import Image from 'next/image';
import { siteConfig } from '@/data/siteConfig';
import { Icon } from '@iconify/react';
import { getWhatsAppLink } from '@/lib/utils';

interface AboutProps {
  content?: {
    tentang_kami?: { title?: string; content?: string; image_url?: string };
    visi_misi?: { title?: string; content?: string; image_url?: string };
    profil_owner?: { title?: string; content?: string; image_url?: string };
  };
  config?: {
    owner?: string;
    location?: string;
    fullAddress?: string;
    whatsapp?: string;
  };
}

export default function About({ content, config }: AboutProps) {
  const brandOwner = config?.owner || siteConfig.owner || 'Hanifa Kumala';
  const whatsappNum = config?.whatsapp || '6281234567890';

  const storyTitle =
    content?.tentang_kami?.title || 'Menghadirkan Kehangatan di Setiap Sudut Momen Bahagia';
  const storyContent =
    content?.tentang_kami?.content ||
    'CraftByHanifa lahir dari sebuah kecintaan mendalam pada aroma lilin alami dan keindahan kerajinan tangan. Di studio workshop kami di Magetan, Jawa Timur, setiap lilin aromaterapi diracik menggunakan 100% soy wax nabati murni dan minyak wewangian terpilih, dituangkan secara manual satu demi satu untuk memastikan kualitas pembakaran yang bersih dan menenangkan.';
  const unescapeText = (text: string) => {
    if (!text) return '';
    return text.replace(/\\n/g, '\n');
  };

  const rawImage = content?.tentang_kami?.image_url;
  const storyImage =
    !rawImage || rawImage === '/images/products/shop-cover.jpg'
      ? '/images/products/studio-workshop.jpg'
      : rawImage;

  const visionMissionTitle = content?.visi_misi?.title || 'Visi & Komitmen Kami';
  const visionMissionContent =
    content?.visi_misi?.content ||
    'Menciptakan souvenir pernikahan dan perayaan yang bermakna, berguna, dan ramah lingkungan. Bukan sekadar benda pelengkap pesta, melainkan ungkapan terima kasih yang tulus dan berkesan mendalam bagi para tamu undangan.';

  const ownerTitle = content?.profil_owner?.title || `${brandOwner} — Founder & Lead Artisan`;
  const ownerBio =
    content?.profil_owner?.content ||
    `Saya memulai CraftByHanifa dengan satu tujuan sederhana: menghadirkan karya kerajinan tangan yang jujur, estetik, dan menenangkan. Setiap racikan aroma lilin, penataan kelopak bunga abadi di dalam resin, hingga simpul pita kemasan dikerjakan dengan cinta oleh tim pengrajin lokal kami di Magetan. Bagi kami, kebahagiaan Anda saat membagikan souvenir ini adalah penghargaan tertinggi.`;
  const ownerImage = content?.profil_owner?.image_url || '/images/products/avatar.jpg';

  const formattedStory = unescapeText(storyContent);
  const formattedVisionMission = unescapeText(visionMissionContent);
  const formattedBio = unescapeText(ownerBio);

  const values = [
    {
      num: '01',
      icon: 'solar:leaf-bold-duotone',
      color: 'text-emerald-600 bg-emerald-500/10 border-emerald-200/80',
      title: '100% Natural Soy Wax',
      desc: 'Bebas racun parafin, lilin kedelai nabati kami menghasilkan pembakaran bersih, tidak berasap hitam, dan aman bagi pernapasan keluarga.',
    },
    {
      num: '02',
      icon: 'solar:hand-stars-bold-duotone',
      color: 'text-amber-600 bg-amber-500/10 border-amber-200/80',
      title: 'Hand-Poured in Magetan',
      desc: 'Setiap produk dikerjakan manual oleh pengrajin lokal berbakat di Magetan, Jawa Timur dengan dedikasi dan standar ketelitian tinggi.',
    },
    {
      num: '03',
      icon: 'solar:gift-bold-duotone',
      color: 'text-rose-600 bg-rose-500/10 border-rose-200/80',
      title: 'Thoughtful Presentation',
      desc: 'Lengkap dengan kemasan rustic elegan, pita satin pilihan, dan kartu ucapan kustom bertuliskan nama serta tanggal momen istimewa Anda.',
    },
  ];

  return (
    <div className="space-y-20 md:space-y-28">
      {/* 1. Main Brand Story - Two Column Editorial Layout (Brooklyn Candle Style) */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left: Studio Image */}
          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#f0e8e2] border border-[#e6d9d1] shadow-sm">
              <Image
                src={storyImage}
                alt="Workshop CraftByHanifa Magetan"
                fill
                sizes="(max-width: 1024px) 100vw, 550px"
                className="object-cover"
                priority
              />
            </div>
            <p className="text-[11px] uppercase tracking-widest text-[#8c7873] mt-3 text-center lg:text-left">
              Studio Workshop • Magetan, Jawa Timur
            </p>
          </div>

          {/* Right: Story Text */}
          <div className="lg:col-span-6 space-y-5">
            <p className="text-xs uppercase tracking-widest text-zinc-400 font-medium">
              Our Studio & Craft
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-zinc-900 tracking-tight leading-[1.2]">
              {storyTitle}
            </h2>
            <div className="text-sm sm:text-base text-zinc-600 leading-relaxed space-y-4 font-normal">
              {formattedStory.split('\n\n').map((paragraph, pIdx) => (
                <p key={pIdx} className="leading-relaxed">
                  {paragraph.trim()}
                </p>
              ))}
              {formattedVisionMission && (
                <div className="pt-4 border-t border-zinc-200/70 space-y-2">
                  <p className="text-xs uppercase tracking-wider font-semibold text-zinc-900">
                    {visionMissionTitle}
                  </p>
                  {formattedVisionMission.split('\n\n').map((vPara, vIdx) => (
                    <p
                      key={vIdx}
                      className="text-xs sm:text-sm text-zinc-500 leading-relaxed whitespace-pre-line"
                    >
                      {vPara.trim()}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Values / Commitments - Clean Apple 3 Columns */}
      <section className="border-y border-zinc-200/60 py-16 md:py-22 bg-[#f5f5f7]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <p className="text-xs uppercase tracking-widest text-zinc-400 font-medium mb-2">
              Our Commitments
            </p>
            <h3 className="text-2xl sm:text-3xl font-bold text-zinc-900 tracking-tight">
              Nilai di Balik Setiap Karya
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {values.map((v) => (
              <div
                key={v.num}
                className="bg-white p-6 sm:p-7 rounded-3xl border border-zinc-200/80 shadow-2xs hover:shadow-md transition-all space-y-3.5 group"
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center border shadow-xs group-hover:scale-110 transition-transform ${v.color}`}
                  >
                    <Icon icon={v.icon} className="w-6 h-6" />
                  </div>
                  <span className="text-xl text-zinc-300 font-bold tracking-tight font-serif">
                    {v.num}
                  </span>
                </div>
                <h4 className="font-semibold text-base text-zinc-900 leading-snug">{v.title}</h4>
                <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Meet the Founder - Clean Minimalist Studio Profile */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-zinc-200/80 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-center">
            {/* Founder Portrait */}
            <div className="md:col-span-4 flex flex-col items-center text-center">
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden relative border border-zinc-200/80 bg-zinc-100 mb-3.5 shadow-2xs">
                <Image
                  src={ownerImage}
                  alt={brandOwner}
                  fill
                  sizes="(max-width: 640px) 144px, 176px"
                  className="object-cover"
                />
              </div>
              <h4 className="font-semibold text-lg text-zinc-900">{brandOwner}</h4>
              <p className="text-xs text-zinc-500 mt-0.5">{ownerTitle}</p>
            </div>

            {/* Founder Note */}
            <div className="md:col-span-8 space-y-4 text-center md:text-left">
              <p className="text-xs uppercase tracking-widest text-zinc-400 font-medium">
                A Note From The Founder
              </p>
              <blockquote className="text-base sm:text-lg text-zinc-700 leading-relaxed border-l-0 md:border-l-2 md:border-zinc-300 md:pl-5 whitespace-pre-line font-normal">
                &ldquo;{formattedBio}&rdquo;
              </blockquote>
              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
                <a
                  href={getWhatsAppLink(
                    whatsappNum,
                    `Halo Kak ${brandOwner}, saya ingin konsultasi seputar souvenir CraftByHanifa.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-[#25D366]/25 flex items-center gap-2 hover:scale-105 cursor-pointer"
                >
                  <Icon icon="solar:chat-round-call-bold-duotone" className="w-4 h-4 text-white" />
                  <span>Kirim Pesan ke Founder</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
