import { Product, Testimonial, FAQItem, PackagingOption, GreetingCardOption } from '@/types';

export const siteConfig = {
  name: 'CraftByHanifa',
  tagline: 'Handmade Souvenirs & Thoughtful Gifts',
  description:
    'Spesialis souvenir handmade eksklusif: gantungan kunci resin floral, lilin aromaterapi premium, pouch sablon, totebag custom, dan hampers kerajinan tangan berkualitas untuk pernikahan, seminar, corporate event, dan momen spesial.',
  owner: 'Hanifa Kumala',
  location: 'Kab. Magetan, Jawa Timur, Indonesia',
  fullAddress: 'Studio CraftByHanifa, Magetan, Jawa Timur, 63319',
  contact: {
    whatsapp: '6281234567890', // Ganti dengan nomor WhatsApp aktif CraftByHanifa
    whatsappDisplay: '+62 812-3456-7890',
    instagram: 'craftbyhanifa',
    instagramUrl: 'https://instagram.com/craftbyhanifa',
    shopeeUrl: 'https://shopee.co.id/hanifakumala',
    shopeeShortUrl: 'https://id.shp.ee/LPAdp9RR',
    email: 'craftbyhanifa@gmail.com',
    operationalHours: 'Senin - Sabtu: 08.00 - 17.00 WIB',
  },
  stats: {
    rating: 4.85,
    ratingCount: '1.500+',
    orderCompleted: '50.000+ pcs',
    experienceYears: '5+ Tahun',
    repeatOrderRate: '98%',
  },
};

export const productsData: Product[] = [
  {
    id: 'gantungan-kunci-resin',
    name: 'Gantungan Kunci Resin Floral Inisial',
    category: 'resin',
    categoryLabel: 'Gantungan Kunci Resin',
    shortDesc:
      'Gantungan kunci inisial huruf dengan bunga kering asli dan sentuhan gold flakes mewah.',
    description:
      'Souvenir best seller terfavorit untuk pesta pernikahan, pertunangan, dan wisuda. Terbuat dari epoxy resin crystal clear grade A dengan kombinasi dried flowers asli pilihan dan aksen foil emas 24k imitation. Tahan banting, anti menguning, dan dilengkapi ring gantungan warna emas anti karat.',
    image: '/images/products/resin-keychain.jpg',
    badge: 'Paling Laris ★ 4.9',
    priceMin: 6500,
    priceMax: 15000,
    minOrder: 20,
    leadTime: '5 - 10 Hari Kerja',
    material: 'Epoxy Resin Crystal Clear, Real Dried Flowers, Gold/Silver Flakes',
    size: 'Tinggi huruf ~4 cm, Tebal ~0.8 cm',
    options: [
      {
        label: 'Aksen Warna Bunga',
        choices: [
          'Rose Pink',
          'Baby Blue',
          'Emerald Green',
          'Lilac Purple',
          'Earthy Terracotta',
          'Pure White',
        ],
      },
      {
        label: 'Finishing Ring',
        choices: ['Gold Ring Clasp', 'Silver Ring Clasp', 'Rose Gold Ring Clasp'],
      },
    ],
    shopeeUrl: 'https://shopee.co.id/hanifakumala',
    rating: 4.9,
    soldCount: 4200,
    includedItems: [
      'Gantungan kunci resin custom huruf',
      'Free kemasan plastik seal bening + backing card',
      'Free pita satin rustic',
      'Free cetak nama pengantin/acara (min. order 50 pcs)',
    ],
  },
  {
    id: 'lilin-aromaterapi-amber',
    name: 'Lilin Aromaterapi Soy Wax Amber Jar',
    category: 'candle',
    categoryLabel: 'Lilin Aromaterapi',
    shortDesc:
      'Scented soy candle ramah lingkungan beraroma menenangkan dengan hiasan kelopak bunga kering.',
    description:
      'Lilin aromaterapi handmade premium terbuat dari 100% natural soy wax nabati ramah lingkungan dengan sumbu kayu/kapas murni. Dituang ke dalam jar kaca amber estetik dengan taburan dried botanicals alami di atasnya. Menghadirkan suasana relaksasi wangi yang hangat dan tidak berasap pekat.',
    image: '/images/products/aromatherapy-candle.jpg',
    badge: 'Favorit Klien',
    priceMin: 12000,
    priceMax: 35000,
    minOrder: 20,
    leadTime: '7 - 14 Hari Kerja',
    material: '100% Natural Soy Wax, Premium Fragrance Oil, Amber Glass Jar, Cork/Metal Lid',
    size: 'Volume 60ml & 100ml (Diameter 5.5 cm, Tinggi 6.5 cm)',
    options: [
      {
        label: 'Pilihan Varian Aroma',
        choices: [
          'Lavender Dream (Menenangkan tidur)',
          'Vanilla Warmth (Manis & cozy)',
          'Sandalwood & Amber (Mewah & hangat)',
          'Fresh Peppermint & Citrus (Segar berenergi)',
          'English Pear & Freesia (Floral mewah)',
        ],
      },
      {
        label: 'Tipe Tutup Jar',
        choices: ['Gabus Kayu Alami (Cork Lid)', 'Tutup Ulir Metal Rustic'],
      },
    ],
    shopeeUrl: 'https://shopee.co.id/hanifakumala',
    rating: 4.9,
    soldCount: 2850,
    includedItems: [
      'Lilin aromaterapi dalam amber glass jar',
      'Label botol stiker custom tema acara & nama',
      'Tali rami rustic + hang tag ucapan',
      'Instruksi aman pemakaian lilin (candle care card)',
    ],
  },
  {
    id: 'pouch-blacu-sablon',
    name: 'Pouch Blacu & Kanvas Sablon Custom',
    category: 'pouch',
    categoryLabel: 'Pouch Sablon',
    shortDesc:
      'Pouch serbaguna bahan blacu/kanvas lembut dengan sablon ilustrasi custom & resleting rapi.',
    description:
      'Souvenir fungsional ramah lingkungan yang pasti terpakai oleh para tamu! Dibuat dari kain blacu katun tebal grade A atau kanvas premium, dijahit rapi dengan resleting lancar atau model serut tali rami. Desain sablon bebas custom grafis minimalis, inisial nama, atau kutipan hangat pengantin.',
    image: '/images/products/pouch-sablon.jpg',
    badge: 'Fungsional & Elegan',
    priceMin: 4500,
    priceMax: 12000,
    minOrder: 50,
    leadTime: '7 - 12 Hari Kerja',
    material: 'Kain Blacu Katun Grade A / Kanvas Twill Halus',
    size: '15 x 20 cm, 18 x 22 cm, atau custom ukuran',
    options: [
      {
        label: 'Model Penutup',
        choices: ['Resleting Zipper Brass/Plastik', 'Serut Tali Katun/Rami (Drawstring)'],
      },
      {
        label: 'Warna Sablon',
        choices: ['Hitam Bold', 'Terracotta Brown', 'Sage Green', 'Gold Elegant', 'Navy Blue'],
      },
    ],
    shopeeUrl: 'https://shopee.co.id/hanifakumala',
    rating: 4.8,
    soldCount: 5100,
    includedItems: [
      'Pouch kain jahit obras dalam rapi',
      'Sablon custom 1 sisi desain bebas',
      'Free kemasan plastik kaca + ikat pita/tali rami',
      'Free kartu ucapan terima kasih custom',
    ],
  },
  {
    id: 'totebag-kanvas-custom',
    name: 'Totebag Kanvas Katun Sablon Estetik',
    category: 'totebag',
    categoryLabel: 'Totebag Handmade',
    shortDesc:
      'Totebag ramah lingkungan yang kuat, muat laptop & buku, dengan sablon karya line-art minimalis.',
    description:
      'Pilihan souvenir berkelas untuk seminar kampus, perayaan wisuda, maupun pernikahan bergaya rustic modern. Menggunakan kanvas katun tebal berserat natural, jahitan ganda di bagian tali sehingga kokoh menahan beban hingga 7 kg.',
    image: '/images/products/totebag-kanvas.jpg',
    badge: 'Eco Friendly',
    priceMin: 14000,
    priceMax: 28000,
    minOrder: 30,
    leadTime: '7 - 14 Hari Kerja',
    material: 'Kanvas Katun Organik / Kanvas Twill Natural (Off-White)',
    size: '30 x 40 cm (Tali 60 cm nyaman di bahu)',
    options: [
      {
        label: 'Tipe Penutup',
        choices: ['Polos Tanpa Penutup', 'Kancing Magnet Rahasia', 'Resleting Resleting Atas'],
      },
      {
        label: 'Gaya Desain',
        choices: ['Minimalist Botanical Line Art', 'Typography Quote', 'Custom Logo Event'],
      },
    ],
    shopeeUrl: 'https://shopee.co.id/hanifakumala',
    rating: 4.9,
    soldCount: 1950,
    includedItems: [
      'Totebag kanvas jahitan dobel kuat',
      'Sablon awet tidak mudah pecah',
      'Rolled pack dengan pita goni rustic & label',
      'Free custom thank you card',
    ],
  },
  {
    id: 'buket-bunga-mini-kering',
    name: 'Karangan Bunga & Buket Kering Mini',
    category: 'bouquet',
    categoryLabel: 'Buket Mini & Botol',
    shortDesc:
      'Buket mini bunga abadi (dried flowers) dengan pembungkus kertas kraft rustic yang manis.',
    description:
      'Souvenir bernuansa vintage dan puitis. Mengombinasikan bunga edelweiss budidaya, gandum liar, lagurus (kelinci), dan baby breath kering yang awet bertahun-tahun tanpa perlu air. Cocok untuk pelengkap souvenir, selipan undangan pernikahan, atau hadiah kenang-kenangan.',
    image: '/images/products/mini-bouquet.jpg',
    badge: 'Abadi & Manis',
    priceMin: 5000,
    priceMax: 12500,
    minOrder: 25,
    leadTime: '5 - 10 Hari Kerja',
    material:
      'Natural Dried Flowers (Lagurus, Baby Breath, Gomphrena, Caspea), Kraft Paper, Jute Twine',
    size: 'Panjang 12 - 15 cm',
    options: [
      {
        label: 'Nuansa Warna Bunga',
        choices: [
          'Warm Autumn Brown',
          'Pastel Pink & Cream',
          'Earthy Sage Green',
          'Soft Lavender Purple',
        ],
      },
      {
        label: 'Varian Kemasan',
        choices: ['Kertas Kraft Wrap Rustic', 'Botol Kaca Tabung Transparan (Glass Tube)'],
      },
    ],
    shopeeUrl: 'https://shopee.co.id/hanifakumala',
    rating: 4.8,
    soldCount: 3100,
    includedItems: [
      'Mini bouquet bunga kering asli awet',
      'Bungkus kraft paper rapi',
      'Tali rami + kartu nama/ucapan mini',
    ],
  },
  {
    id: 'exclusive-giftbox-hampers',
    name: 'Exclusive Souvenir Gift Box Set',
    category: 'hampers',
    categoryLabel: 'Exclusive Gift Box',
    shortDesc:
      'Paket hampers souvenir eksklusif berisi lilin aromaterapi, gantungan kunci resin, dan pouch.',
    description:
      'Solusi souvenir kelas VIP untuk bridesmaid, panitia inti, VIP wedding guests, maupun hampers korporat perusahaan. Dikemas rapi dalam hardbox / kraft box rustic berpita satin dengan shredded paper, segel lilin wax stamp, serta kartu ucapan foil emas personal.',
    image: '/images/products/gift-box.jpg',
    badge: 'Souvenir VIP & Bridesmaid',
    priceMin: 35000,
    priceMax: 95000,
    minOrder: 10,
    leadTime: '10 - 20 Hari Kerja',
    material: 'Hardbox Rigid / Kraft Box Corrugated Tebal, Silk Ribbon, Paper Shredder',
    size: '18 x 18 x 8 cm atau 20 x 25 x 10 cm',
    options: [
      {
        label: 'Kombinasi Isi Paket',
        choices: [
          'Paket A: Lilin 60ml + Gantungan Kunci Resin + Mini Bouquet',
          'Paket B: Lilin 60ml + Pouch Sablon + Thank You Card',
          'Paket C: Lilin 100ml + Totebag Kanvas + Resin Keychain',
          'Paket Custom: Sesuai Request Konsultasi',
        ],
      },
      {
        label: 'Warna Pita Box',
        choices: ['Champagne Gold', 'Dusty Rose', 'Forest Green', 'Mocha Brown', 'Midnight Navy'],
      },
    ],
    shopeeUrl: 'https://shopee.co.id/hanifakumala',
    rating: 5.0,
    soldCount: 850,
    includedItems: [
      'Gift box rustic premium tebal',
      'Shredded paper pengaman estetik',
      'Kombinasi 2 - 3 produk handmade pilihan',
      'Pita satin mewah + wax stamp seal',
      'Kartu ucapan custom nama penerima',
    ],
  },
  {
    id: 'resin-casing-phone',
    name: 'Casing Handphone Resin Custom Bunga Asli',
    category: 'resin',
    categoryLabel: 'Aksesoris Resin',
    shortDesc:
      'Casing HP bening estetik berhiaskan bunga kering alami dan foil emas, dilapisi resin bening mengilap.',
    description:
      'Aksesoris handmade personal untuk berbagai tipe ponsel (iPhone, Samsung, Xiaomi, Oppo, Vivo). Dibuat satu per satu dengan ketelitian tinggi menyusun kelopak bunga kering asli dan gold leaf sebelum dilaminasi resin keras anti lecet.',
    image: '/images/products/resin-casing.jpg',
    badge: 'Artisan Custom',
    priceMin: 35000,
    priceMax: 65000,
    minOrder: 1,
    leadTime: '3 - 7 Hari Kerja',
    material: 'Hybrid TPU Soft Edge + Acrylic Hard Back, Epoxy Resin, Real Pressed Flowers',
    size: 'Tersedia untuk semua tipe HP populer',
    options: [
      {
        label: 'Komposisi Bunga',
        choices: ['Full Flower Cascade', 'Minimalist Centerpiece', 'Initial Name + Gold Leaf'],
      },
    ],
    shopeeUrl: 'https://shopee.co.id/hanifakumala',
    rating: 4.8,
    soldCount: 920,
    includedItems: [
      'Casing HP resin bening presisi',
      'Box kemasan craft pelindung',
      'Free sticker pack & kain pembersih',
    ],
  },
];

export const packagingOptions: PackagingOption[] = [
  {
    id: 'standar-plastik',
    name: 'Plastik Seal Tebal + Backing Card + Pita Satin',
    additionalCost: 0,
    description: 'Kemasan standar rapi, bersih, sudah termasuk kartu ucapan dan pita simpul.',
  },
  {
    id: 'kantung-tile',
    name: 'Kantung Tile Jaring Transparan Elegan',
    additionalCost: 1000,
    description: 'Kain tile lembut transparan dengan tali serut, memberikan kesan anggun.',
  },
  {
    id: 'box-mika-bening',
    name: 'Box Mika Bening Tebal + Tatakan & Pita',
    additionalCost: 2500,
    description: 'Box mika kaku transparan, souvenir terlihat mewah 360 derajat.',
  },
  {
    id: 'hardbox-rustic',
    name: 'Box Kraft Rustic + Tali Goni + Dried Leaf',
    additionalCost: 4000,
    description: 'Kotak karton kraft estetik ramah lingkungan bernuansa rustic vintage.',
  },
];

export const greetingCardOptions: GreetingCardOption[] = [
  {
    id: 'card-standar',
    name: 'Thank You Card Art Paper Standar (Free)',
    cost: 0,
    description: 'Cetak full color kertas art paper 260gsm dengan nama mempelai/event.',
  },
  {
    id: 'card-rustic-linen',
    name: 'Kartu Tekstur Linen / Kertas Daur Ulang Rustic',
    cost: 500,
    description: 'Kertas bertekstur mewah dengan tepi sobek natural (deckled edge).',
  },
  {
    id: 'card-gold-foil',
    name: 'Kartu Foil Emas / Hotprint Emboss Mewah',
    cost: 1200,
    description: 'Huruf nama berkilau emas mewah (hotprint gold foil).',
  },
];

export const testimonialsData: Testimonial[] = [
  {
    id: 'testi-1',
    name: 'Dinda & Arya Prasetyo',
    role: 'Pengantin',
    event: 'Souvenir Pernikahan (350 pcs)',
    city: 'Surabaya, Jawa Timur',
    quote:
      'Pesan gantungan kunci resin inisial 350 pcs untuk souvenir pernikahan kami. Hasilnya masyaAllah rapi banget, bunganya cantik dan bening ga ada gelembung! Tamu-tamu banyak yang muji dan langsung dipasang di kunci motor/mobil mereka. Terima kasih CraftByHanifa!',
    productOrdered: 'Gantungan Kunci Resin Inisial',
    rating: 5,
    date: '14 Agustus 2026',
    verifiedBuyer: true,
  },
  {
    id: 'testi-2',
    name: 'Rian Hidayat',
    role: 'Ketua Panitia Seminar Nasional',
    event: 'Merchandise Seminar & Goodie Bag (200 pcs)',
    city: 'Yogyakarta',
    quote:
      'Order totebag kanvas dan pouch blacu sablon untuk seminar nasional kampus. Pengerjaannya tepat waktu bahkan lebih cepat 3 hari dari deadline. Kualitas jahitannya kuat, sablonnya rapi tajam. Adminnya juga ramah banget diajak diskusi desain.',
    productOrdered: 'Pouch Sablon & Totebag Kanvas',
    rating: 5,
    date: '28 Juli 2026',
    verifiedBuyer: true,
  },
  {
    id: 'testi-3',
    name: 'Nadia Salsabila',
    role: 'Bridesmaid Coordinator',
    event: 'Hampers Bridesmaid (18 Box)',
    city: 'Jakarta Selatan',
    quote:
      'Beli paket gift box hampers lilin aromaterapi + resin keychain untuk sahabat-sahabat bridesmaid. Wangi lilin lavender vanillanya enak banget tahan lama, boxnya rustic mewah persis foto di katalog. Temen-temenku terharu pas unboxing!',
    productOrdered: 'Exclusive Souvenir Gift Box Set',
    rating: 5,
    date: '2 Mei 2026',
    verifiedBuyer: true,
  },
  {
    id: 'testi-4',
    name: 'dr. Farah Maulida',
    role: 'Acara Khitanan & Tasyakuran',
    event: 'Souvenir Tasyakuran (150 pcs)',
    city: 'Madiun, Jawa Timur',
    quote:
      'Lokasi workshopnya dekat di Magetan jadi bisa koordinasi langsung. Lilin aromaterapi mini amber jarnya sangat berkesan dan berguna, bukan souvenir yang cuma jadi pajangan atau dibuang. Pengemasan super aman!',
    productOrdered: 'Lilin Aromaterapi Amber Jar',
    rating: 5,
    date: '19 Juni 2026',
    verifiedBuyer: true,
  },
];

export const faqData: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'order',
    question: 'Berapa minimal pemesanan (minimum order) untuk souvenir?',
    answer:
      'Minimal order bervariasi sesuai jenis produk. Untuk gantungan kunci resin dan lilin aromaterapi minimal 20 pcs. Pouch sablon minimal 50 pcs, totebag kanvas minimal 30 pcs, dan gift box hampers mulai dari 10 pcs. Namun jika Anda ingin membeli satuan untuk sampel atau pemakaian pribadi, Anda bisa memesan langsung melalui toko resmi Shopee kami!',
  },
  {
    id: 'faq-2',
    category: 'order',
    question: 'Berapa lama proses pembuatan souvenir custom?',
    answer:
      'Waktu pengerjaan standar berkisar antara 5 hingga 14 hari kerja tergantung jumlah pesanan dan tingkat kerumitan desain. Untuk pesanan mendesak (express order), silakan konsultasikan langsung dengan admin WhatsApp kami agar kami dapat menjadwalkan produksi prioritas sesuai tanggal acara Anda.',
  },
  {
    id: 'faq-3',
    category: 'custom',
    question: 'Apakah bisa request custom desain, tulisan nama, dan warna tema acara?',
    answer:
      'Tentu saja! Kami memberikan GRATIS revisi mockup desain kartu ucapan, sablon pouch, maupun label stiker lilin hingga cocok dengan tema warna pesta pernikahan atau logo event Anda.',
  },
  {
    id: 'faq-4',
    category: 'shipping',
    question: 'Apakah melayani pengiriman ke luar kota dan luar pulau Jawa?',
    answer:
      'Ya, kami berpengalaman mengirim souvenir ke seluruh wilayah Indonesia (Sumatera, Kalimantan, Sulawesi, Bali, hingga Papua). Kami menggunakan standar packing berlapis: bubble wrap tebal di setiap pcs, sekat kardus, dan opsi packing kayu untuk pengiriman jarak jauh produk kaca/lilin agar sampai dengan aman tanpa pecah.',
  },
  {
    id: 'faq-5',
    category: 'payment',
    question: 'Bagaimana sistem pembayaran untuk pesanan custom partai besar?',
    answer:
      'Untuk pesanan custom, kami menerapkan sistem DP (Down Payment) sebesar 50% untuk memulai proses produksi, dan pelunasan 50% setelah pesanan selesai diproduksi serta melalui tahapan Quality Control (foto dan video hasil jadi akan kami kirimkan sebelum paket dikirim).',
  },
  {
    id: 'faq-6',
    category: 'order',
    question: 'Apakah bisa request sampel fisik sebelum memesan dalam jumlah banyak?',
    answer:
      'Bisa! Anda dapat memesan 1-2 pcs sampel terlebih dahulu melalui WhatsApp kami atau langsung checkout produk satuan di toko Shopee resmi kami (Craftbyhanifa / @hanifakumala) untuk melihat langsung kualitas bahan dan kerapian produk.',
  },
];

export const whyChooseUs = [
  {
    icon: 'Sparkles',
    title: '100% Sentuhan Tangan Berkelanjutan',
    desc: 'Setiap karya dibuat manual dengan penuh ketelitian oleh pengrajin lokal berbakat di Magetan, Jawa Timur, bukan produk cetakan massal pabrik biasa.',
  },
  {
    icon: 'Palette',
    title: 'Free Desain & Mockup Digital',
    desc: 'Bebas konsultasi tema warna acara, font inisial nama, hingga penyesuaian packaging sampai Anda merasa puas sebelum proses produksi dimulai.',
  },
  {
    icon: 'ShieldCheck',
    title: 'Quality Control Berlapis & Rapi',
    desc: 'Setiap produk dicek ketat: kejernihan resin tanpa gelembung berlebih, aroma lilin pekat merata, dan kerapian jahitan pouch.',
  },
  {
    icon: 'BadgeCheck',
    title: 'Harga Produsen Tangan Pertama',
    desc: 'Dapatkan penawaran harga terbaik langsung dari pengrajin tanpa perantara, dengan diskon kuantiti bertingkat untuk pesanan jumlah besar.',
  },
  {
    icon: 'Gift',
    title: 'Siap Dibagikan Tanpa Repot',
    desc: 'Seluruh souvenir sudah kami kemas cantik lengkap dengan pita dan kartu ucapan terima kasih personal. Begitu sampai, langsung siap dibagikan ke tamu.',
  },
  {
    icon: 'Truck',
    title: 'Garansi Pengiriman Aman Seluruh RI',
    desc: 'Standar packing tebal dan aman anti-pecah. Kami memberikan garansi ganti produk jika terdapat kerusakan saat pengiriman ekspedisi.',
  },
];

export const orderSteps = [
  {
    step: '01',
    title: 'Konsultasi & Pilih Produk',
    desc: 'Pilih produk souvenir impian Anda dari katalog, diskusikan jumlah pcs, tema warna acara, dan budget via WhatsApp.',
  },
  {
    step: '02',
    title: 'Pembuatan Mockup Desain',
    desc: 'Tim kami membuatkan sampel digital kartu ucapan, sablon, atau label dengan nama Anda secara gratis.',
  },
  {
    step: '03',
    title: 'Konfirmasi DP & Produksi',
    desc: 'Setelah desain disetujui dan DP 50% terkonfirmasi, proses pembuatan kerajinan tangan dimulai dengan teliti.',
  },
  {
    step: '04',
    title: 'Quality Check & Packing Cantik',
    desc: 'Produk dicek satu per satu, dikemas rapi dengan pita, dan kami fotokan hasilnya kepada Anda sebelum pelunasan.',
  },
  {
    step: '05',
    title: 'Pengiriman Cepat & Bergaransi',
    desc: 'Pesanan dikirim menggunakan ekspedisi terpercaya dengan nomor resi yang dapat dilacak hingga tiba di alamat Anda.',
  },
];
