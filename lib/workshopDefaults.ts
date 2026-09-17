import { WorkshopPackage, CurriculumStep, ReservationStep } from '@/types/workshop';
import { GalleryImageItem } from '@/types/store';

export const DEFAULT_WORKSHOP_GALLERY: GalleryImageItem[] = [
  {
    id: 'wg-1',
    image_url: '/images/products/studio-workshop.jpg',
    caption: 'Suasana meja kerja & perlengkapan studio saat sesi pembuatan lilin aromaterapi',
    sort_order: 1,
    category: 'workshop',
    category_label: 'Suasana Studio',
  },
  {
    id: 'wg-2',
    image_url: '/images/products/aromatherapy-candle.jpg',
    caption:
      'Hasil kreasi lilin aromaterapi jar amber dengan dried botanical flowers karya peserta',
    sort_order: 2,
    category: 'workshop',
    category_label: 'Karya Peserta',
  },
  {
    id: 'wg-3',
    image_url: '/images/products/hero-banner.jpg',
    caption: 'Praktik pouring dan peracikan fragrance oil signature bersama pengrajin studio',
    sort_order: 3,
    category: 'workshop',
    category_label: 'Praktik Workshop',
  },
  {
    id: 'wg-4',
    image_url: '/images/products/gift-box.jpg',
    caption: 'Kemasan hardbox estetik berpita satin & sertifikat resmi yang siap dibawa pulang',
    sort_order: 4,
    category: 'workshop',
    category_label: 'Packaging & Sertifikat',
  },
  {
    id: 'wg-5',
    image_url: '/images/products/shop-cover.jpg',
    caption: 'Koleksi lilin aromaterapi ramah lingkungan dan souvenir buatan pengrajin Magetan',
    sort_order: 5,
    category: 'workshop',
    category_label: 'Koleksi Studio',
  },
];

export const DEFAULT_WORKSHOP_PACKAGES: WorkshopPackage[] = [
  {
    id: 'basic',
    name: 'Paket Basic (Intro to Candle Making)',
    tagline: 'Sempurna untuk pemula, self-healing, atau me-time akhir pekan',
    price: 'Rp 150.000',
    duration: '1.5 - 2 Jam',
    capacity: '1 - 8 Orang / Sesi',
    isPopular: false,
    description:
      'Pelajari dasar-dasar meracik lilin beraroma ramah lingkungan. Didesain ramah untuk pemula tanpa latar belakang kerajinan tangan sama sekali.',
    features: [
      '100% natural soy wax nabati murni ramah lingkungan',
      'Pilihan jenis sumbu (cotton & wood wick)',
      'Eksplorasi 6 aroma signature CraftByHanifa',
      'Praktik menuang lilin (pouring) dengan suhu presisi',
      'Styling dried botanical flowers & topping estetik',
      'Peminjaman seluruh tools & apron studio',
      'Free Welcome Drink & camilan santai',
    ],
    takeHome: [
      {
        title: '1 Jar Lilin Aromaterapi Soy Wax (100g)',
        image_url: '/images/products/bubble-candle.jpg',
        description: 'Lilin racikan sendiri dengan pilihan 6 aroma & botanical styling',
      },
      {
        title: 'Box Kemasan Cantik & Care Card',
        image_url: '/images/products/pouch-blacu.jpg',
        description: 'Kemasan estetik siap pajang atau hadiah + petunjuk perawatan',
      },
      {
        title: 'Sertifikat Resmi Keikutsertaan',
        image_url: '/images/products/totebag-kanvas.jpg',
        description: 'Sertifikat fisik bertandatangan Artisan CraftByHanifa',
      },
    ],
    buttonLabel: 'Daftar Paket Basic',
    waMessage:
      'Halo Kak Hanifa, saya ingin mendaftar Paket Workshop Basic (Rp 150.000). Bisakah saya info jadwal sesi yang masih tersedia?',
  },
  {
    id: 'premium',
    name: 'Paket Premium (Advanced Blending & Duo Creations)',
    badge: 'Paling Populer',
    tagline: 'Cocok untuk couple date, bestie hang-out, hobi serius, & calon entrepreneur',
    price: 'Rp 325.000',
    duration: '2.5 - 3 Jam',
    capacity: '1 - 6 Orang / Sesi',
    isPopular: true,
    description:
      'Eksplorasi mendalam seni perfumery lilin aromaterapi. Buat 2 kreasi sekaligus: lilin jar kaca eksklusif dan botanical wax sachet gantung beraroma mewah.',
    features: [
      'Teori piramida aroma (top, heart/middle, dan base notes)',
      'Teknik formulasi custom fragrance throw agar wangi tahan lama',
      'Akses ke 12+ premium essential & fragrance oils studio',
      'Teknik crackling double wooden wick untuk suasana hangat',
      'Dekorasi botanical mewah: bunga edelweiss & kristal alam',
      'Peminjaman seluruh tools & apron kanvas studio',
      'Welcome Drink spesial & Artisan Snack Box',
    ],
    takeHome: [
      {
        title: '2 Karya: Lilin Jar 150g + Botanical Sachet',
        image_url: '/images/products/resin-keychain.jpg',
        description: 'Lilin jar kaca amber & botanical wax sachet gantung beraroma mewah',
      },
      {
        title: 'Luxury Hardbox Hampers Pita Rose Gold',
        image_url: '/images/products/hampers-wedding.jpg',
        description: 'Gift box eksklusif dengan lining satin dan greeting card kustom',
      },
      {
        title: 'Sertifikat Resmi Kelulusan Workshop',
        image_url: '/images/products/totebag-kanvas.jpg',
        description: 'Sertifikat kompetensi dasar candle making & perfumery',
      },
    ],
    buttonLabel: 'Daftar Paket Premium',
    waMessage:
      'Halo Kak Hanifa, saya ingin mendaftar Paket Workshop Premium (Rp 325.000). Boleh tahu slot jadwal weekend terdekat?',
  },
  {
    id: 'group',
    name: 'Paket Group / Corporate / Private Event',
    badge: 'Custom Sesi',
    tagline: 'Ideal untuk bridesmaid party, arisan, team building kantor, & gathering',
    price: 'Mulai Rp 220.000',
    duration: '2.5 - 3.5 Jam',
    capacity: 'Min. 5 hingga 30+ Peserta',
    isPopular: false,
    description:
      'Sesi privat eksklusif untuk grup Anda. Bisa diadakan di studio kami di Magetan atau kami hadir ke kantor, hotel, maupun kafe pilihan Anda di wilayah Magetan, Madiun, Solo, dan sekitarnya.',
    features: [
      'Sesi kelas privat eksklusif (tidak digabung peserta lain)',
      'Custom stiker label lilin sesuai tema acara / logo perusahaan',
      'Mentor dedicated & tim fasilitator pendamping',
      'Bahan baku premium lengkap dibawa langsung ke lokasi',
      'Booklet modul panduan materi pembuatan lilin',
      'Dokumentasi foto high-resolution selama kegiatan',
      'Jadwal, waktu, dan konsep acara dapat disesuaikan fleksibel',
    ],
    takeHome: [
      {
        title: 'Lilin Aromaterapi Custom Souvenir',
        image_url: '/images/products/bubble-candle.jpg',
        description: 'Lilin buatan tiap peserta dengan stiker label custom nama/event',
      },
      {
        title: 'Packaging Box Eksklusif Tema Acara',
        image_url: '/images/products/hampers-wedding.jpg',
        description: 'Kemasan disesuaikan dengan warna dan identitas acara',
      },
      {
        title: 'Goodie Bag & Sertifikat Peserta',
        image_url: '/images/products/pouch-blacu.jpg',
        description: 'Merchandise kit lengkap untuk setiap peserta workshop',
      },
    ],
    buttonLabel: 'Konsultasi Paket Group',
    waMessage:
      'Halo Kak Hanifa, saya tertarik untuk mengadakan Workshop Lilin Aromaterapi untuk Group / Kantor / Event. Boleh minta info proposal & penawaran harganya?',
  },
];

export const DEFAULT_CURRICULUM_STEPS: CurriculumStep[] = [
  {
    step: '01',
    title: 'Mengenal Wax Alami & Alat',
    desc: 'Memahami karakter 100% soy wax nabati murni yang aman dihirup tanpa jelaga hitam, perbedaannya dengan parafin, serta pengenalan titik leleh (melting point).',
  },
  {
    step: '02',
    title: 'Seni Blending Fragrance Oil',
    desc: 'Mengeksplorasi piramida aroma wewangian, takaran fragrance oil yang ideal, serta rahasia agar aroma menyebar semerbak (hot & cold throw) saat dibakar.',
  },
  {
    step: '03',
    title: 'Teknik Centering & Penuangan',
    desc: 'Praktik memasang sumbu kayu/kapas di titik tengah presisi dan menuangkan wax cair pada suhu optimal agar permukaan lilin mulus tanpa cekungan (cracking).',
  },
  {
    step: '04',
    title: 'Dekorasi Bunga & Finishing',
    desc: 'Menata kelopak mawar kering, lavender, kayu manis, dan kristal alami di atas lilin yang mulai mengeras, diakhiri pengemasan ke dalam gift box berpita cantik.',
  },
];

export const DEFAULT_RESERVATION_STEPS: ReservationStep[] = [
  {
    step: '1',
    title: 'Pilih Paket & Tanggal',
    desc: 'Tentukan paket yang diinginkan (Basic, Premium, atau Group) beserta estimasi tanggal sesi.',
  },
  {
    step: '2',
    title: 'Chat WhatsApp Admin',
    desc: 'Kirim pesan WhatsApp ke kami untuk mencocokkan ketersediaan kursi & jam sesi studio.',
  },
  {
    step: '3',
    title: 'Konfirmasi Pembayaran DP',
    desc: 'Selesaikan pembayaran uang muka (DP 50%) untuk mengunci kursi jadwal workshop Anda.',
  },
  {
    step: '4',
    title: 'Hadir & Nikmati Sesi',
    desc: 'Datang ke studio di Magetan, nikmati proses meracik lilin, dan bawa pulang karya Anda!',
  },
];
