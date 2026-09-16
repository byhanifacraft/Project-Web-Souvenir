import { WorkshopNewsItem } from '@/types/store';

export const DEFAULT_WORKSHOP_NEWS: WorkshopNewsItem[] = [
  {
    id: 'news-1',
    title: 'Coming Soon: Intimate Scented Candle & Botanical Blending Workshop',
    image_url: '/images/products/studio-workshop.jpg',
    summary:
      'Sesi workshop privat meracik lilin aromaterapi 100% natural soy wax alami bersama Founder CraftByHanifa akan segera hadir dalam waktu dekat!',
    content:
      'Kabar gembira untuk teman-teman pencinta aroma dan kerajinan tangan! Studio CraftByHanifa akan segera membuka sesi intimate workshop terbaru untuk batch terdekat.\n\nDalam sesi ini, peserta akan diajak secara langsung mempelajari rahasia formulasi aroma minyak esensial terapeutik, teknik penuangan soy wax bebas asap, hingga dekorasi dried botanical flowers khas Magetan. Sangat cocok untuk pemula, healing santai akhir pekan, maupun persiapan usaha souvenir.\n\nKuota peserta dibatasi maksimal 8 orang per sesi agar pendampingan berlangsung intensif dan mendalam. Nantikan pengumuman jadwal resmi pembukaan registrasi!',
    date: 'Coming Soon - November 2026',
    location: 'Studio CraftByHanifa, Magetan',
    status: 'coming_soon',
    status_label: 'Segera Hadir',
    category_label: 'Agenda Workshop',
    wa_message:
      'Halo Kak Hanifa, saya ingin info pendaftaran Coming Soon Workshop Lilin Aromaterapi Batch November.',
    sort_order: 1,
    is_active: true,
  },
  {
    id: 'news-2',
    title: 'Pendaftaran Dibuka: Kelas Meracik Lilin Aromaterapi Pemula & Suvenir',
    image_url: '/images/products/hero-banner.jpg',
    summary:
      'Pendaftaran dibuka untuk kelas tatap muka akhir pekan. Kuota terbatas 10 kursi per sesi dengan fasilitas lengkap dan bahan ramah lingkungan.',
    content:
      'Sesi reguler belajar membuat lilin aromaterapi jar kaca dan hiasan botanical kini resmi dibuka untuk pendaftaran.\n\nSetiap peserta akan mendapatkan kit lengkap termasuk apron, natural soy wax, wadah jar amber, 3 pilihan minyak aromaterapi premium, serta sertifikat keikutsertaan. Hasil karya lilin buatan sendiri langsung bisa dibawa pulang!\n\nJadwal Sesi: Setiap Sabtu, Pukul 13.00 - 16.00 WIB di Studio CraftByHanifa Magetan. Segera amankan kursi Anda sebelum kuota terpenuhi.',
    date: 'Setiap Sabtu • 13.00 - 16.00 WIB',
    location: 'Studio CraftByHanifa, Magetan',
    status: 'open_registration',
    status_label: 'Pendaftaran Dibuka',
    category_label: 'Kelas Reguler',
    wa_message:
      'Halo Kak Hanifa, saya ingin mendaftar Kelas Reguler Meracik Lilin Akhir Pekan di Studio.',
    sort_order: 2,
    is_active: true,
  },
  {
    id: 'news-3',
    title: 'Dokumentasi: Keseruan Corporate Workshop & Suvenir Ramah Lingkungan',
    image_url: '/images/products/gift-box.jpg',
    summary:
      'Dokumentasi kegiatan pelatihan kerajinan lilin aromaterapi bersama komunitas dan instansi di Jawa Timur.',
    content:
      'Terima kasih kepada seluruh peserta yang telah bergabung dalam rangkaian workshop lilin aromaterapi dan perakitan hampers gift box.\n\nSuasana hangat dan antusiasme luar biasa dari para peserta saat meracik aroma favorit dan merangkai packaging rustic khas CraftByHanifa. Kami juga melayani kolaborasi workshop untuk gathering kantor, sekolah, arisan, maupun bridal shower.',
    date: 'Dokumentasi Acara Selesai',
    location: 'Magetan & Sekitarnya',
    status: 'completed',
    status_label: 'Dokumentasi',
    category_label: 'Dokumentasi Studio',
    wa_message:
      'Halo Kak Hanifa, saya tertarik mengundang CraftByHanifa untuk Private / Corporate Workshop.',
    sort_order: 3,
    is_active: true,
  },
];
