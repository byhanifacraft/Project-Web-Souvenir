import React from 'react';
import type { Metadata } from 'next';
import { getStoreData } from '@/lib/getStoreData';
import WorkshopPageContent from '@/components/WorkshopPageContent';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Workshop Lilin Aromaterapi & Kerajinan Studio | CraftByHanifa Magetan',
  description:
    'Belajar meracik lilin aromaterapi murni 100% soy wax nabati, blending essential oil mewah, dan botanical dried flower styling di Studio CraftByHanifa Magetan, Jawa Timur. Kelas pemula, couple, dan private group.',
  keywords: [
    'workshop lilin aromaterapi',
    'kelas candle making',
    'workshop lilin magetan',
    'workshop lilin madiun',
    'belajar membuat lilin aromaterapi',
    'candle making class indonesia',
    'craftbyhanifa workshop',
  ],
};

import { WorkshopPackage, CurriculumStep, ReservationStep } from '@/types/workshop';

export default async function WorkshopPage() {
  const storeData = await getStoreData();
  const contactInfo = storeData?.contactInfo;
  const siteConfig = storeData?.siteConfig;
  const galleryImages = storeData?.galleryImages || [];
  const siteContent = storeData?.siteContent || {};

  let packages: WorkshopPackage[] | undefined;
  if (siteContent['workshop_packages']?.content) {
    try {
      packages = JSON.parse(siteContent['workshop_packages'].content);
    } catch {
      packages = undefined;
    }
  }

  let curriculum: CurriculumStep[] | undefined;
  if (siteContent['workshop_curriculum']?.content) {
    try {
      curriculum = JSON.parse(siteContent['workshop_curriculum'].content);
    } catch {
      curriculum = undefined;
    }
  }

  let reservationSteps: ReservationStep[] | undefined;
  if (siteContent['workshop_reservation_steps']?.content) {
    try {
      reservationSteps = JSON.parse(siteContent['workshop_reservation_steps'].content);
    } catch {
      reservationSteps = undefined;
    }
  }

  const whatsappNum = contactInfo?.whatsapp || siteConfig?.whatsapp || '6281234567890';
  const brandName = siteConfig?.name || contactInfo?.name || 'CraftByHanifa';

  return (
    <main className="min-h-screen bg-[#faf6f2]">
      <WorkshopPageContent
        whatsappNum={whatsappNum}
        brandName={brandName}
        galleryImages={galleryImages}
        initialPackages={packages}
        initialCurriculum={curriculum}
        initialReservationSteps={reservationSteps}
        initialWorkshopNews={storeData?.workshopNews}
      />
    </main>
  );
}
