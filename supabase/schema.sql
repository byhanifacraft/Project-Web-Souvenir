-- ================================================================
-- SKEMA DATABASE SUPABASE: WEBSITE COMPANY PROFILE CANDLE BRAND
-- Jalankan query ini di: Supabase Dashboard -> SQL Editor -> New Query
-- ================================================================

-- 1. Tabel Banners (Hero / Slider Beranda)
CREATE TABLE IF NOT EXISTS public.banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url TEXT NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    cta_text TEXT,
    cta_link TEXT,
    sort_order INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabel Site Content (Konten Teks Fleksibel: Tagline Beranda, Visi Misi, Tentang Kami)
CREATE TABLE IF NOT EXISTS public.site_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_key TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabel Products (Daftar Produk Lilin & Souvenir)
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC NOT NULL,
    original_price NUMERIC,
    stock INTEGER DEFAULT 100,
    image_url TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    category TEXT DEFAULT 'candle',
    category_label TEXT DEFAULT 'Lilin Aromaterapi',
    min_order INTEGER DEFAULT 1,
    lead_time TEXT DEFAULT '3 - 7 Hari Kerja',
    material TEXT,
    size TEXT,
    options JSONB DEFAULT '[]'::jsonb,
    shopee_url TEXT,
    rating NUMERIC(3, 2) DEFAULT 5.0,
    sold_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Tabel Gallery Images (Grid Foto Galeri & Behind The Scenes)
CREATE TABLE IF NOT EXISTS public.gallery_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url TEXT NOT NULL,
    caption TEXT,
    sort_order INTEGER DEFAULT 1,
    category TEXT DEFAULT 'all',
    category_label TEXT DEFAULT 'Karya Studio',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Tabel Contact Info (Alamat, WhatsApp, Email, Sosial Media, Maps)
CREATE TABLE IF NOT EXISTS public.contact_info (
    id TEXT PRIMARY KEY DEFAULT 'default',
    name TEXT NOT NULL DEFAULT 'CraftByHanifa',
    tagline TEXT DEFAULT 'Handmade Scented Candles & Thoughtful Gifts',
    address TEXT NOT NULL,
    phone TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    whatsapp_display TEXT NOT NULL,
    email TEXT NOT NULL,
    instagram_url TEXT,
    shopee_url TEXT,
    map_embed_url TEXT,
    operational_hours TEXT DEFAULT 'Senin - Sabtu: 08.00 - 17.00 WIB',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ================================================================

ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_info ENABLE ROW LEVEL SECURITY;

-- Izinkan Publik Membaca Semua Tabel (Public Read)
CREATE POLICY "Public read banners" ON public.banners FOR SELECT USING (true);
CREATE POLICY "Public read site_content" ON public.site_content FOR SELECT USING (true);
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public read gallery_images" ON public.gallery_images FOR SELECT USING (true);
CREATE POLICY "Public read contact_info" ON public.contact_info FOR SELECT USING (true);

-- Izinkan Aksi Write/Update/Delete untuk Pengelolaan CMS
CREATE POLICY "Allow all banners" ON public.banners FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all site_content" ON public.site_content FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all products" ON public.products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all gallery_images" ON public.gallery_images FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all contact_info" ON public.contact_info FOR ALL USING (true) WITH CHECK (true);

-- ================================================================
-- SUPABASE STORAGE BUCKETS
-- ================================================================

INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('banners', 'banners', true),
  ('products', 'products', true),
  ('gallery', 'gallery', true),
  ('site', 'site', true),
  ('souvenir-images', 'souvenir-images', true)
ON CONFLICT (id) DO NOTHING;

-- Izinkan Public Read pada Semua Buckets
CREATE POLICY "Public read banners bucket" ON storage.objects FOR SELECT USING (bucket_id = 'banners');
CREATE POLICY "Public read products bucket" ON storage.objects FOR SELECT USING (bucket_id = 'products');
CREATE POLICY "Public read gallery bucket" ON storage.objects FOR SELECT USING (bucket_id = 'gallery');
CREATE POLICY "Public read site bucket" ON storage.objects FOR SELECT USING (bucket_id = 'site');
CREATE POLICY "Public read souvenir images bucket" ON storage.objects FOR SELECT USING (bucket_id = 'souvenir-images');

-- Izinkan Write pada Buckets
CREATE POLICY "Allow upload to storage" ON storage.objects FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update to storage" ON storage.objects FOR UPDATE USING (true);
CREATE POLICY "Allow delete from storage" ON storage.objects FOR DELETE USING (true);

-- ================================================================
-- SEED DATA AWAL (CANDLE & ARTISAN PROFILE)
-- ================================================================

-- Seed Banners
INSERT INTO public.banners (image_url, title, subtitle, cta_text, cta_link, sort_order, is_active)
VALUES
('/images/products/hero-banner.jpg', 'CraftByHanifa Studio Workshop', 'Kerajinan Lilin Aromaterapi & Souvenir Magetan', 'Lihat Koleksi Lilin', '/produk', 1, true),
('/images/products/gift-box.jpg', 'Exclusive Hampers & Gift Box Set', 'Kemasan Rustic Cantik Berpita Siap Dibagikan', 'Jelajahi Produk', '/produk', 2, true),
('/images/products/resin-keychain.jpg', 'Gantungan Kunci Resin & Lilin Botol', 'Koleksi Terlaris 50.000+ Pcs Terkirim', 'Tentang Kami', '/tentang-kami', 3, true);

-- Seed Site Content
INSERT INTO public.site_content (section_key, title, content, image_url)
VALUES
(
  'tagline_beranda',
  'Sentuhan Hangat Kerajinan Tangan untuk Setiap Momen',
  'Studio kerajinan lilin aromaterapi soy wax murni dan souvenir handmade estetik dari pengrajin Magetan, Jawa Timur untuk pernikahan, seminar, dan acara spesial Anda.',
  '/images/products/shop-cover.jpg'
),
(
  'visi_misi',
  'Visi & Misi Studio Kami',
  'Visi:\nMenjadi studio kerajinan tangan dan lilin aromaterapi terpercaya di Indonesia yang menghadirkan keindahan estetik ramah lingkungan di setiap momen berharga.\n\nMisi:\n1. Menggunakan 100% bahan alami soy wax nabati yang aman dan bebas racun parafin.\n2. Memberdayakan pengrajin lokal berbakat di Kabupaten Magetan, Jawa Timur.\n3. Memberikan layanan kustomisasi dan mockup desain gratis untuk setiap pelanggan.',
  '/images/products/avatar.jpg'
),
(
  'tentang_kami',
  'Dedikasi Menghadirkan Makna di Setiap Sentuhan Lilin & Kerajinan',
  'Berawal dari kecintaan pada seni kerajinan lilin aromaterapi dan dried flowers, CraftByHanifa hadir mendampingi ribuan momen bahagia pernikahan, wisuda, dan corporate gift di seluruh penjuru Indonesia. Kami percaya bahwa souvenir bukan sekadar pajangan, melainkan kenangan hangat yang membawa aroma ketenangan dan kegunaan nyata bagi penerimanya.\n\nSetiap lilin aromaterapi kami dibuat secara handmade dengan 100% natural soy wax nabati dan perpaduan minyak esensial terapeutik berkualitas. Kami melayani pengiriman bergaransi aman ke seluruh wilayah Nusantara.',
  '/images/products/shop-cover.jpg'
),
(
  'profil_owner',
  'Hanifa Kumala — Founder & Lead Artisan',
  'Halo! Saya Hanifa Kumala, perajin dan penggagas di balik CraftByHanifa. Sejak awal berdiri di Magetan, saya mendedikasikan studio ini untuk meracik lilin aromaterapi 100% soy wax nabati alami yang menenangkan dan kerajinan souvenir estetik bermakna. Setiap detail karya lilin, resin, hingga jahitan pouch kami kerjakan secara handmade dengan penuh cinta dan ketelitian tinggi.',
  '/images/products/avatar.jpg'
),
(
  'keunggulan_features',
  'Mengapa Souvenir CraftByHanifa Selalu Berkesan?',
  '[{"icon":"Sparkles","title":"100% Sentuhan Tangan Berkelanjutan","desc":"Setiap karya dibuat manual dengan penuh ketelitian oleh pengrajin lokal berbakat di Magetan, Jawa Timur, bukan produk cetakan massal pabrik biasa.","linkText":"Standar Pengrajin Magetan"},{"icon":"Palette","title":"Free Desain & Mockup Digital","desc":"Bebas konsultasi tema warna acara, font inisial nama, hingga penyesuaian packaging sampai Anda merasa puas sebelum proses produksi dimulai.","linkText":"Standar Pengrajin Magetan"},{"icon":"ShieldCheck","title":"Quality Control Berlapis & Rapi","desc":"Setiap produk dicek ketat: kejernihan resin tanpa gelembung berlebih, aroma lilin pekat merata, dan kerapian jahitan pouch.","linkText":"Standar Pengrajin Magetan"},{"icon":"BadgeCheck","title":"Harga Produsen Tangan Pertama","desc":"Dapatkan penawaran harga terbaik langsung dari pengrajin tanpa perantara, dengan diskon kuantiti bertingkat untuk pesanan jumlah besar.","linkText":"Standar Pengrajin Magetan"},{"icon":"Gift","title":"Siap Dibagikan Tanpa Repot","desc":"Seluruh souvenir sudah kami kemas cantik lengkap dengan pita dan kartu ucapan terima kasih personal. Begitu sampai, langsung siap dibagikan ke tamu.","linkText":"Standar Pengrajin Magetan"},{"icon":"Truck","title":"Garansi Pengiriman Aman Seluruh RI","desc":"Standar packing tebal dan aman anti-pecah. Kami memberikan garansi ganti produk jika terdapat kerusakan saat pengiriman ekspedisi.","linkText":"Standar Pengrajin Magetan"}]',
  'Setiap karya dibuat manual dengan ketelitian tinggi oleh pengrajin lokal di Magetan, menghasilkan souvenir bermakna yang berguna dan membahagiakan para tamu.'
)
ON CONFLICT (section_key) DO UPDATE
SET title = EXCLUDED.title, content = EXCLUDED.content, image_url = EXCLUDED.image_url, updated_at = now();

-- Seed Products
INSERT INTO public.products (id, name, description, price, stock, image_url, is_active, category, category_label, min_order, lead_time, material, size, shopee_url, rating, sold_count)
VALUES
(
  'lilin-aromaterapi-amber',
  'Lilin Aromaterapi Soy Wax Amber Jar',
  'Lilin aromaterapi handmade premium terbuat dari 100% natural soy wax nabati ramah lingkungan dengan sumbu kayu/kapas murni. Dituang ke dalam jar kaca amber estetik dengan taburan dried botanicals alami.',
  15000,
  250,
  '/images/products/aromatherapy-candle.jpg',
  true,
  'candle',
  'Lilin Aromaterapi',
  20,
  '5 - 10 Hari Kerja',
  '100% Natural Soy Wax, Amber Glass Jar, Cork Lid',
  'Volume 60ml & 100ml',
  'https://shopee.co.id/hanifakumala',
  4.9,
  2850
),
(
  'gantungan-kunci-resin',
  'Gantungan Kunci Resin Floral Inisial',
  'Souvenir best seller terfavorit untuk pesta pernikahan dan wisuda. Terbuat dari epoxy resin crystal clear grade A dengan kombinasi dried flowers asli dan aksen foil emas mewah.',
  8500,
  500,
  '/images/products/resin-keychain.jpg',
  true,
  'resin',
  'Gantungan Kunci Resin',
  20,
  '5 - 10 Hari Kerja',
  'Epoxy Resin Crystal Clear, Real Dried Flowers, Gold Flakes',
  'Tinggi huruf ~4 cm',
  'https://shopee.co.id/hanifakumala',
  4.9,
  4200
),
(
  'exclusive-giftbox-hampers',
  'Exclusive Bridesmaid Candle Gift Box Set',
  'Paket hampers souvenir eksklusif berisi lilin aromaterapi soy wax amber, gantungan kunci resin floral, dan pouch blacu cantik dalam kemasan hardbox rigid berpita satin.',
  45000,
  120,
  '/images/products/gift-box.jpg',
  true,
  'hampers',
  'Hampers & Gift Box',
  10,
  '7 - 14 Hari Kerja',
  'Hardbox Rigid, Silk Ribbon, Wax Stamp Seal',
  '18 x 18 x 8 cm',
  'https://shopee.co.id/hanifakumala',
  5.0,
  850
),
(
  'pouch-blacu-sablon',
  'Pouch Blacu & Kanvas Sablon Custom',
  'Pouch serbaguna bahan blacu katun lembut dengan sablon ilustrasi nama custom & resleting rapi. Sangat fungsional dan ramah lingkungan.',
  6500,
  400,
  '/images/products/pouch-sablon.jpg',
  true,
  'pouch',
  'Pouch Sablon',
  50,
  '7 - 12 Hari Kerja',
  'Kain Blacu Katun Grade A / Kanvas Twill Halus',
  '15 x 20 cm',
  'https://shopee.co.id/hanifakumala',
  4.8,
  5100
),
(
  'totebag-kanvas-custom',
  'Totebag Kanvas Katun Sablon Estetik',
  'Totebag ramah lingkungan yang kuat, muat laptop & buku, dengan sablon karya line-art minimalis. Pilihan souvenir berkelas untuk seminar dan pesta.',
  18000,
  180,
  '/images/products/totebag-kanvas.jpg',
  true,
  'totebag',
  'Totebag Kanvas',
  30,
  '7 - 14 Hari Kerja',
  'Kanvas Katun Organik',
  '30 x 40 cm',
  'https://shopee.co.id/hanifakumala',
  4.9,
  1950
),
(
  'buket-bunga-mini-kering',
  'Karangan Bunga & Buket Kering Mini Rustic',
  'Buket mini bunga abadi (dried flowers) dengan pembungkus kertas kraft rustic yang manis mengombinasikan edelweiss dan baby breath kering.',
  7500,
  300,
  '/images/products/mini-bouquet.jpg',
  true,
  'bouquet',
  'Buket Mini & Botol',
  25,
  '5 - 10 Hari Kerja',
  'Natural Dried Flowers, Kraft Paper, Jute Twine',
  'Panjang 12 - 15 cm',
  'https://shopee.co.id/hanifakumala',
  4.8,
  3100
)
ON CONFLICT (id) DO NOTHING;

-- Seed Gallery Images
INSERT INTO public.gallery_images (image_url, caption, sort_order, category, category_label)
VALUES
('/images/products/aromatherapy-candle.jpg', 'Lilin aromaterapi soy wax aroma lavender & vanilla', 1, 'candle', 'Lilin Aromaterapi'),
('/images/products/resin-keychain.jpg', 'Gantungan kunci inisial resin bunga edelweiss & mawar', 2, 'resin', 'Resin Floral'),
('/images/products/gift-box.jpg', 'Kemasan hampers bridesmaid hardbox dengan pita satin rose', 3, 'packaging', 'Hampers VIP'),
('/images/products/pouch-sablon.jpg', 'Pouch katun blacu sablon inisial pengantin', 4, 'fabric', 'Pouch Kain'),
('/images/products/totebag-kanvas.jpg', 'Totebag kanvas tebal untuk souvenir corporate & kampus', 5, 'fabric', 'Totebag'),
('/images/products/mini-bouquet.jpg', 'Buket mini bunga kering abadi rustic wedding', 6, 'packaging', 'Buket Mini'),
('/images/products/resin-casing.jpg', 'Casing smartphone resin custom bunga asli', 7, 'resin', 'Aksesoris Resin'),
('/images/products/shop-cover.jpg', 'Suasana workshop studio CraftByHanifa di Magetan', 8, 'packaging', 'Studio Magetan');

-- Seed Contact Info
INSERT INTO public.contact_info (id, name, tagline, address, phone, whatsapp, whatsapp_display, email, instagram_url, shopee_url, map_embed_url, operational_hours)
VALUES (
  'default',
  'CraftByHanifa',
  'Handmade Scented Candles & Thoughtful Souvenirs',
  'Studio CraftByHanifa, Jl. Diponegoro, Magetan, Jawa Timur, 63319',
  '+62 812-3456-7890',
  '6281234567890',
  '+62 812-3456-7890',
  'craftbyhanifa@gmail.com',
  'https://instagram.com/craftbyhanifa',
  'https://shopee.co.id/hanifakumala',
  'https://maps.google.com/?q=Magetan,+Jawa+Timur',
  'Senin - Sabtu: 08.00 - 17.00 WIB'
)
ON CONFLICT (id) DO UPDATE
SET name = EXCLUDED.name, address = EXCLUDED.address, phone = EXCLUDED.phone, whatsapp = EXCLUDED.whatsapp, email = EXCLUDED.email, instagram_url = EXCLUDED.instagram_url, shopee_url = EXCLUDED.shopee_url, updated_at = now();

-- ================================================================
-- MIGRATION HELPER (Jalankan jika tabel products sudah ada sebelumnya):
-- ALTER TABLE public.products ADD COLUMN IF NOT EXISTS original_price NUMERIC;
-- ALTER TABLE public.products ADD COLUMN IF NOT EXISTS options JSONB DEFAULT '[]'::jsonb;
-- ================================================================
