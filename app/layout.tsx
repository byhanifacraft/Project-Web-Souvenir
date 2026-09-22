import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { siteConfig } from '@/data/siteConfig';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
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
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png' },
    ],
    apple: '/apple-icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${inter.variable} scroll-smooth`} data-scroll-behavior="smooth">
      <body className="font-sans antialiased text-[#1d1d1f] bg-[#fbfbfd] selection:bg-[#1d1d1f] selection:text-white">
        {children}
      </body>
    </html>
  );
}
