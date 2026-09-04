import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Playfair_Display } from 'next/font/google';
import './globals.css';
import { siteConfig } from '@/data/siteConfig';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://craftbyhanifa.com'),
  title: 'CraftByHanifa | Souvenir Kerajinan Tangan Handmade Magetan & Custom Gift',
  description:
    'CraftByHanifa spesialis souvenir kerajinan tangan: gantungan kunci resin floral, lilin aromaterapi soy wax, pouch sablon blacu/kanvas, totebag, dan hampers pernikahan eksklusif. Dibuat dengan penuh cinta dari Magetan, Jawa Timur.',
  keywords: [
    'souvenir pernikahan',
    'gantungan kunci resin',
    'lilin aromatherapy',
    'pouch sablon',
    'totebag kanvas custom',
    'souvenir magetan',
    'hampers bridesmaid',
    'kerajinan tangan handmade',
    'craftbyhanifa',
    'hanifakumala',
  ],
  authors: [{ name: siteConfig.owner }],
  creator: siteConfig.name,
  openGraph: {
    title: 'CraftByHanifa - Souvenir Kerajinan Tangan Handmade Berkualitas',
    description:
      'Sentuhan hangat kerajinan tangan untuk momen pernikahan, seminar, dan acara spesial Anda. Star+ Seller Shopee dengan 1.500+ ulasan positif.',
    url: 'https://craftbyhanifa.com',
    siteName: siteConfig.name,
    locale: 'id_ID',
    type: 'website',
    images: [
      {
        url: '/images/products/hero-banner.jpg',
        width: 1200,
        height: 630,
        alt: 'CraftByHanifa Handmade Souvenirs',
      },
    ],
  },
  icons: {
    icon: '/images/products/avatar.jpg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${jakarta.variable} ${playfair.variable} scroll-smooth`}>
      <body className="font-sans antialiased text-[#2e1c24] bg-[#fff7f9] selection:bg-[#e05d82]/20 selection:text-[#e05d82]">
        {children}
      </body>
    </html>
  );
}
