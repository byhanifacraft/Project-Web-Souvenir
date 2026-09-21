import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FloatingButtons from '@/components/FloatingButtons';
import { getStoreData } from '@/lib/getStoreData';

export const revalidate = 300; // ISR 5 menit (di-revalidate instan saat admin simpan perubahan)

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const storeData = await getStoreData();
  const siteConfig = storeData?.siteConfig || {
    name: storeData?.contactInfo?.name || 'CraftByHanifa',
    whatsapp: storeData?.contactInfo?.whatsapp || '6281234567890',
    whatsappDisplay: storeData?.contactInfo?.whatsapp_display || '+62 812-3456-7890',
    shopeeUrl: storeData?.contactInfo?.shopee_url || 'https://shopee.co.id/hanifakumala',
    instagramUrl: storeData?.contactInfo?.instagram_url || 'https://instagram.com/craftbyhanifa',
    email: storeData?.contactInfo?.email || 'craftbyhanifa@gmail.com',
    fullAddress: storeData?.contactInfo?.address || 'Studio CraftByHanifa, Magetan, Jawa Timur',
    operationalHours:
      storeData?.contactInfo?.operational_hours || 'Senin - Sabtu: 08.00 - 17.00 WIB',
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf6f3] selection:bg-[#c8476c]/20 selection:text-[#c8476c]">
      {/* Shared Global Sticky Navbar */}
      <Navbar config={siteConfig} />

      {/* Public Page View */}
      <div className="flex-1">{children}</div>

      {/* Shared Global Footer */}
      <Footer config={siteConfig} />

      {/* Shared Floating WhatsApp & Shopee CTA */}
      <FloatingButtons config={siteConfig} />
    </div>
  );
}
