import React from 'react';
import { getStoreData } from '@/lib/getStoreData';
import ContactSection from '@/components/ContactSection';
import FAQ from '@/components/FAQ';
import { MapPin, Mail, ShoppingBag, Clock } from 'lucide-react';

function InstagramIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export const dynamic = 'force-dynamic';

export default async function KontakPage() {
  const storeData = await getStoreData();
  const contactInfo = storeData?.contactInfo;
  const siteConfig = storeData?.siteConfig;

  const address =
    contactInfo?.address ||
    siteConfig?.fullAddress ||
    'Studio CraftByHanifa, Magetan, Jawa Timur, 63319';
  const email = contactInfo?.email || siteConfig?.email || 'craftbyhanifa@gmail.com';
  const shopeeUrl =
    contactInfo?.shopee_url || siteConfig?.shopeeUrl || 'https://shopee.co.id/hanifakumala';
  const instagramUrl =
    contactInfo?.instagram_url || siteConfig?.instagramUrl || 'https://instagram.com/craftbyhanifa';
  const operationalHours =
    contactInfo?.operational_hours ||
    siteConfig?.operationalHours ||
    'Senin - Sabtu: 08.00 - 17.00 WIB';

  return (
    <div className="py-8 md:py-12 space-y-14">
      {/* 1. Header Banner */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-2">
          <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#a85267] mb-2.5">
            Contact & Location
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#2a2123] tracking-tight mb-3">
            Hubungi Studio CraftByHanifa
          </h1>
          <p className="text-sm sm:text-base text-[#5e4e52] leading-relaxed">
            Konsultasikan ide souvenir acara Anda bersama kami. Kami siap melayani pemesanan skala
            kecil hingga partai besar untuk seluruh wilayah Indonesia.
          </p>
        </div>
      </section>

      {/* 2. Main Contact Cards */}
      <ContactSection contactInfo={contactInfo} config={siteConfig} />

      {/* 3. Location & Studio Details */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl border border-[#ebdcd5] p-6 sm:p-8 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-4">
            <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-[#a85267]">
              Workshop Studio
            </p>
            <h2 className="text-2xl font-serif font-bold text-[#2a2123]">
              Studio Pengrajin di Magetan, Jawa Timur
            </h2>
            <p className="text-xs sm:text-sm text-[#5e414d] leading-relaxed">
              Seluruh proses peracikan lilin aromaterapi soy wax, pencetakan resin floral,
              penjahitan pouch, dan packing berpita dikerjakan langsung di studio kami dengan
              standar mutu tinggi.
            </p>

            <div className="space-y-3 text-xs pt-2">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#e05d82] shrink-0 mt-0.5" />
                <span className="text-[#2e1c24] font-medium">{address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-[#e05d82] shrink-0" />
                <span className="text-[#755562]">{operationalHours}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#e05d82] shrink-0" />
                <span className="text-[#755562]">{email}</span>
              </div>
            </div>

            <div className="pt-3 flex flex-wrap gap-2.5">
              <a
                href={shopeeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-[#ee4d2d] text-white text-xs font-bold hover:bg-[#d83f20] transition-colors flex items-center justify-center gap-1.5 shadow-2xs min-h-[44px]"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Shopee Star+</span>
              </a>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-[#e1306c] text-white text-xs font-bold hover:bg-[#c8245c] transition-colors flex items-center justify-center gap-1.5 shadow-2xs min-h-[44px]"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
                <span>Instagram</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-2xl overflow-hidden border border-[#f3d7df] aspect-[16/10] bg-[#fde8ee] relative shadow-inner">
              <iframe
                title="Google Maps Location Studio CraftByHanifa Magetan"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126500.51867909335!2d111.25828236718752!3d-7.65219999999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e79920150937b2d%3A0xb3551571556886e0!2sKabupaten%20Magetan%2C%20Jawa%20Timur!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. FAQ Accordion */}
      <FAQ />
    </div>
  );
}
