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
    <section id="faq" className="py-16 md:py-24 bg-[#fff7f9] relative border-t border-[#f3d7df]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e05d82]/10 text-[#e05d82] text-xs font-bold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5" /> Tanya Jawab Pemesanan
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2e1c24] tracking-tight mb-3">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-[#5e414d] text-xs sm:text-sm leading-relaxed">
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
                className="bg-white rounded-2xl border border-[#f3d7df] overflow-hidden shadow-xs transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(item.id)}
                  className="w-full px-6 py-4.5 text-left flex items-center justify-between gap-4 font-semibold text-[#2e1c24] hover:text-[#e05d82] transition-colors cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-serif">{item.question}</span>
                  <div
                    className={`w-7 h-7 rounded-full bg-[#fff7f9] border border-[#f3d7df] flex items-center justify-center shrink-0 text-[#9d7c8b] transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-[#e05d82] bg-[#fde8ee]' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-[#5e414d] leading-relaxed border-t border-[#fce7ed] animate-fadeIn">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Quick Question WhatsApp Box */}
        <div className="text-center p-8 rounded-3xl bg-white border border-[#f3d7df] shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-[#fde8ee] text-[#e05d82] flex items-center justify-center mx-auto mb-3.5">
            <MessageCircle className="w-6 h-6" />
          </div>
          <h4 className="text-lg font-bold text-[#2e1c24] font-serif mb-1">
            Masih Ada Pertanyaan atau Request Khusus?
          </h4>
          <p className="text-xs sm:text-sm text-[#755562] max-w-md mx-auto mb-5">
            Kak Hanifa dan tim admin siap membantu memberikan rekomendasi souvenir terbaik sesuai
            tema warna dan anggaran acara Anda.
          </p>
          <a
            href={`https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent('Halo CraftByHanifa, saya ingin bertanya seputar pemesanan souvenir.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#128c7e] text-white font-bold text-xs sm:text-sm hover:bg-[#0e7065] shadow-md shadow-[#128c7e]/20 transition-all cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Tanya Admin via WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
}
