'use client';

import React from 'react';
import Image from 'next/image';
import { siteConfig } from '@/data/siteConfig';
import { MessageCircle } from 'lucide-react';
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
      title: '100% Natural Soy Wax',
      desc: 'Bebas racun parafin, lilin kedelai nabati kami menghasilkan pembakaran bersih, tidak berasap hitam, dan aman bagi pernapasan keluarga.',
    },
    {
      num: '02',
      title: 'Hand-Poured in Magetan',
      desc: 'Setiap produk dikerjakan manual oleh pengrajin lokal berbakat di Magetan, Jawa Timur dengan dedikasi dan standar ketelitian tinggi.',
    },
    {
      num: '03',
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
            <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#a85267]">
              Our Studio & Craft
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#2a2123] tracking-tight leading-[1.2]">
              {storyTitle}
            </h2>
            <div className="text-sm sm:text-base text-[#5e4e52] leading-relaxed space-y-4 font-normal">
              {formattedStory.split('\n\n').map((paragraph, pIdx) => (
                <p key={pIdx} className="leading-relaxed">
                  {paragraph.trim()}
                </p>
              ))}
              {formattedVisionMission && (
                <div className="pt-4 border-t border-[#ebdcd5] space-y-2">
                  <p className="text-xs uppercase tracking-wider font-semibold text-[#2a2123]">
                    {visionMissionTitle}
                  </p>
                  {formattedVisionMission.split('\n\n').map((vPara, vIdx) => (
                    <p
                      key={vIdx}
                      className="text-xs sm:text-sm text-[#736064] leading-relaxed whitespace-pre-line"
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

      {/* 2. Values / Commitments - Clean Editorial 3 Columns (NO AI Gimmicks) */}
      <section className="border-y border-[#ebdcd5] py-14 md:py-18 bg-[#faf4ef]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#a85267] mb-2">
              Our Commitments
            </p>
            <h3 className="text-2xl sm:text-3xl font-serif text-[#2a2123]">
              Nilai di Balik Setiap Karya
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
            {values.map((v) => (
              <div key={v.num} className="space-y-3">
                <span className="font-serif text-2xl text-[#c26d83] block leading-none">
                  {v.num}
                </span>
                <h4 className="font-serif font-bold text-lg text-[#2a2123] leading-snug">
                  {v.title}
                </h4>
                <p className="text-xs sm:text-sm text-[#5e4e52] leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Meet the Founder - Warm Intimate Studio Profile */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#ebdcd5] shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-center">
            {/* Founder Portrait */}
            <div className="md:col-span-4 flex flex-col items-center text-center">
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden relative border-2 border-[#ebdcd5] bg-[#f5ece6] mb-3.5 shadow-xs">
                <Image src={ownerImage} alt={brandOwner} fill className="object-cover" />
              </div>
              <h4 className="font-serif font-bold text-lg text-[#2a2123]">{brandOwner}</h4>
              <p className="text-[11px] uppercase tracking-widest text-[#8c7873] mt-0.5">
                {ownerTitle}
              </p>
            </div>

            {/* Founder Note */}
            <div className="md:col-span-8 space-y-4 text-center md:text-left">
              <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#a85267]">
                A Note From The Founder
              </p>
              <blockquote className="font-serif italic text-base sm:text-lg text-[#33282b] leading-relaxed border-l-0 md:border-l-2 md:border-[#c26d83] md:pl-5 whitespace-pre-line">
                &ldquo;{formattedBio}&rdquo;
              </blockquote>
              <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
                <a
                  href={getWhatsAppLink(
                    whatsappNum,
                    'Halo Kak Hanifa, saya membaca profil studio dan ingin konsultasi seputar souvenir.'
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#128c7e] text-white text-xs font-medium hover:bg-[#0e7065] transition-all shadow-2xs min-h-[44px]"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Diskusi Langsung dengan Kak Hanifa</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
