import React from 'react';
import type { Metadata } from 'next';
import { getStoreData } from '@/lib/getStoreData';
import WorkshopPageContent from '@/components/WorkshopPageContent';
import { WorkshopPackage, CurriculumStep, ReservationStep } from '@/types/workshop';
import { WorkshopNewsItem } from '@/types/store';

export const revalidate = 300; // ISR 5 menit (di-revalidate instan saat admin simpan perubahan)

interface PageProps {
  searchParams: Promise<{ event?: string }>;
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;
  const eventId = resolvedSearchParams?.event;

  const defaultTitle = 'Workshop Lilin Aromaterapi & Kerajinan Studio | CraftByHanifa Magetan';
  const defaultDesc =
    'Belajar meracik lilin aromaterapi murni 100% soy wax nabati, blending essential oil mewah, dan botanical dried flower styling di Studio CraftByHanifa Magetan, Jawa Timur. Kelas pemula, couple, dan private group.';
  const defaultImage = 'https://craftbyhanifa.com/images/products/studio-workshop.jpg';

  if (!eventId) {
    return {
      title: defaultTitle,
      description: defaultDesc,
      keywords: [
        'workshop lilin aromaterapi',
        'kelas candle making',
        'workshop lilin magetan',
        'workshop lilin madiun',
        'belajar membuat lilin aromaterapi',
        'candle making class indonesia',
        'craftbyhanifa workshop',
      ],
      openGraph: {
        title: defaultTitle,
        description: defaultDesc,
        url: 'https://craftbyhanifa.com/workshop',
        siteName: 'CraftByHanifa',
        images: [
          {
            url: defaultImage,
            width: 1200,
            height: 630,
            alt: 'Studio Workshop CraftByHanifa Magetan',
          },
        ],
        locale: 'id_ID',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: defaultTitle,
        description: defaultDesc,
        images: [defaultImage],
      },
    };
  }

  const storeData = await getStoreData();
  const siteContent = storeData?.siteContent || {};
  let workshopNews: WorkshopNewsItem[] = storeData?.workshopNews || [];
  if (siteContent['workshop_news']?.content) {
    try {
      const parsed = JSON.parse(siteContent['workshop_news'].content);
      if (Array.isArray(parsed)) {
        workshopNews = parsed;
      }
    } catch {
      // keep fallback
    }
  }

  const matchedEvent = workshopNews.find(
    (item) => String(item.id).trim().toLowerCase() === String(eventId).trim().toLowerCase()
  );

  if (!matchedEvent) {
    return {
      title: defaultTitle,
      description: defaultDesc,
      openGraph: {
        title: defaultTitle,
        description: defaultDesc,
        url: 'https://craftbyhanifa.com/workshop',
        siteName: 'CraftByHanifa',
        images: [
          {
            url: defaultImage,
            width: 1200,
            height: 630,
            alt: 'Studio Workshop CraftByHanifa Magetan',
          },
        ],
        locale: 'id_ID',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: defaultTitle,
        description: defaultDesc,
        images: [defaultImage],
      },
    };
  }

  const title = `${matchedEvent.title} | Workshop Lilin Aromaterapi CraftByHanifa Magetan`;
  const description =
    matchedEvent.summary ||
    (matchedEvent.content
      ? matchedEvent.content.slice(0, 160) + '...'
      : 'Ikuti agenda workshop lilin aromaterapi eksklusif bersama CraftByHanifa Studio Magetan.');

  let imageUrl = matchedEvent.image_url || '/images/products/studio-workshop.jpg';
  if (imageUrl.startsWith('/')) {
    imageUrl = `https://craftbyhanifa.com${imageUrl}`;
  }

  const eventUrl = `https://craftbyhanifa.com/workshop?event=${encodeURIComponent(matchedEvent.id)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: eventUrl,
      siteName: 'CraftByHanifa',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: matchedEvent.title,
        },
      ],
      locale: 'id_ID',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function WorkshopPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const initialEventId = resolvedSearchParams?.event;

  const storeData = await getStoreData();
  const contactInfo = storeData?.contactInfo;
  const siteConfig = storeData?.siteConfig;
  const siteContent = storeData?.siteContent || {};
  let galleryImages = storeData?.galleryImages || [];
  if (siteContent['workshop_gallery']?.content) {
    try {
      const parsed = JSON.parse(siteContent['workshop_gallery'].content);
      if (Array.isArray(parsed)) {
        galleryImages = parsed;
      }
    } catch {
      // keep fallback
    }
  }

  let workshopNews = storeData?.workshopNews || [];
  if (siteContent['workshop_news']?.content) {
    try {
      const parsed = JSON.parse(siteContent['workshop_news'].content);
      if (Array.isArray(parsed)) {
        workshopNews = parsed;
      }
    } catch {
      // keep fallback
    }
  }

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
        key={initialEventId || 'workshop'}
        whatsappNum={whatsappNum}
        brandName={brandName}
        galleryImages={galleryImages}
        initialPackages={packages}
        initialCurriculum={curriculum}
        initialReservationSteps={reservationSteps}
        initialWorkshopNews={workshopNews}
        initialEventId={initialEventId}
      />
    </main>
  );
}
