'use client';

import React, { useState } from 'react';
import { faqData, siteConfig } from '@/data/siteConfig';
import { HelpCircle, ChevronDown, MessageCircle } from 'lucide-react';

export default function FAQ() {
  const [openId, setOpenId] = useState<string | null>(faqData[0]?.id || null);

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="py-16 md:py-24 bg-white relative border-t border-zinc-200/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-100 text-zinc-700 text-xs font-medium mb-3">
            <HelpCircle className="w-3.5 h-3.5" /> Tanya Jawab Pemesanan
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 tracking-tight mb-3">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-zinc-500 text-xs sm:text-sm leading-relaxed">
            Temukan jawaban cepat seputar minimal order, durasi pengerjaan handmade, keamanan
            packing, hingga cara pesan sampel satuan di Shopee.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3 mb-12">
          {faqData.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className="bg-[#fbfbfd] rounded-2xl border border-zinc-200/80 overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(item.id)}
                  className="w-full px-6 py-4.5 text-left flex items-center justify-between gap-4 font-semibold text-zinc-900 hover:text-zinc-600 transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-medium">{item.question}</span>
                  <div
                    className={`w-7 h-7 rounded-full bg-white border border-zinc-200/80 flex items-center justify-center shrink-0 text-zinc-500 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-zinc-900 bg-zinc-100' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-zinc-600 leading-relaxed border-t border-zinc-200/60 animate-fadeIn">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Quick Question WhatsApp Box */}
        <div className="text-center p-8 sm:p-10 rounded-3xl bg-[#fbfbfd] border border-zinc-200/80 shadow-2xs">
          <div className="w-11 h-11 rounded-full bg-zinc-100 text-zinc-800 flex items-center justify-center mx-auto mb-3.5">
            <MessageCircle className="w-5 h-5 text-zinc-700" />
          </div>
          <h4 className="text-lg font-semibold text-zinc-900 mb-1">
            Masih Ada Pertanyaan atau Request Khusus?
          </h4>
          <p className="text-xs sm:text-sm text-zinc-500 max-w-md mx-auto mb-5 leading-relaxed">
            Kak Hanifa dan tim admin siap membantu memberikan rekomendasi souvenir terbaik sesuai
            tema warna dan anggaran acara Anda.
          </p>
          <a
            href={`https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent('Halo CraftByHanifa, saya ingin bertanya seputar pemesanan souvenir.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1d1d1f] text-white font-medium text-xs sm:text-sm hover:bg-zinc-800 shadow-xs transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>Tanya Admin via WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
}
