-- ================================================================
-- MIGRATION: Menambahkan kolom 'options' dan 'original_price' ke tabel products
-- Jalankan query ini di Supabase Dashboard -> SQL Editor -> Run
-- ================================================================

-- 1. Tambahkan kolom options untuk variasi kustom souvenir (misal: Warna Pita, Model Huruf Resin)
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS options JSONB DEFAULT '[]'::jsonb;

-- 2. Tambahkan kolom original_price untuk harga coret / diskon produk promo
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS original_price NUMERIC;

-- Konfirmasi bahwa kolom berhasil ditambahkan:
COMMENT ON COLUMN public.products.options IS 'Daftar opsi kustomisasi produk souvenir (JSON array)';
COMMENT ON COLUMN public.products.original_price IS 'Harga awal sebelum diskon/promo';
