-- ================================================================
-- MIGRASI SUPABASE: TRANSAKSI ATOMIK SIMPAN DATA TOKO (/api/store)
-- Jalankan query ini di: Supabase Dashboard -> SQL Editor -> New Query
-- ================================================================
-- Fungsi ini menjamin seluruh operasi tulis (Banners, Content, Products, Contact,
-- dan penghapusan data) dieksekusi dalam SATU transaksi ACID tunggal di PostgreSQL.
-- Jika salah satu langkah gagal, PostgreSQL otomatis me-ROLLBACK seluruh perubahan
-- sehingga tidak akan pernah terjadi partial-save (data tersimpan setengah-setengah).

CREATE OR REPLACE FUNCTION public.save_store_data_atomic(
    p_banners JSONB DEFAULT NULL,
    p_content JSONB DEFAULT NULL,
    p_products JSONB DEFAULT NULL,
    p_contact JSONB DEFAULT NULL,
    p_deleted_banner_ids TEXT[] DEFAULT NULL,
    p_deleted_product_ids TEXT[] DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    banner_record JSONB;
    content_record JSONB;
    product_record JSONB;
BEGIN
    -- 1. Explicit Delete Banners jika ada
    IF p_deleted_banner_ids IS NOT NULL AND array_length(p_deleted_banner_ids, 1) > 0 THEN
        DELETE FROM public.banners WHERE id::text = ANY(p_deleted_banner_ids);
    END IF;

    -- 2. Explicit Delete Products jika ada
    IF p_deleted_product_ids IS NOT NULL AND array_length(p_deleted_product_ids, 1) > 0 THEN
        DELETE FROM public.products WHERE id = ANY(p_deleted_product_ids);
    END IF;

    -- 3. Upsert Banners
    IF p_banners IS NOT NULL AND jsonb_typeof(p_banners) = 'array' AND jsonb_array_length(p_banners) > 0 THEN
        FOR banner_record IN SELECT * FROM jsonb_array_elements(p_banners) LOOP
            INSERT INTO public.banners (
                id, image_url, title, subtitle, cta_text, cta_link, sort_order, is_active
            ) VALUES (
                (banner_record->>'id')::uuid,
                banner_record->>'image_url',
                banner_record->>'title',
                banner_record->>'subtitle',
                banner_record->>'cta_text',
                banner_record->>'cta_link',
                COALESCE((banner_record->>'sort_order')::integer, 1),
                COALESCE((banner_record->>'is_active')::boolean, true)
            )
            ON CONFLICT (id) DO UPDATE SET
                image_url = EXCLUDED.image_url,
                title = EXCLUDED.title,
                subtitle = EXCLUDED.subtitle,
                cta_text = EXCLUDED.cta_text,
                cta_link = EXCLUDED.cta_link,
                sort_order = EXCLUDED.sort_order,
                is_active = EXCLUDED.is_active;
        END LOOP;
    END IF;

    -- 4. Upsert Site Content
    IF p_content IS NOT NULL AND jsonb_typeof(p_content) = 'array' AND jsonb_array_length(p_content) > 0 THEN
        FOR content_record IN SELECT * FROM jsonb_array_elements(p_content) LOOP
            INSERT INTO public.site_content (
                section_key, title, content, image_url, updated_at
            ) VALUES (
                content_record->>'section_key',
                content_record->>'title',
                content_record->>'content',
                content_record->>'image_url',
                now()
            )
            ON CONFLICT (section_key) DO UPDATE SET
                title = EXCLUDED.title,
                content = EXCLUDED.content,
                image_url = EXCLUDED.image_url,
                updated_at = now();
        END LOOP;
    END IF;

    -- 5. Upsert Products
    IF p_products IS NOT NULL AND jsonb_typeof(p_products) = 'array' AND jsonb_array_length(p_products) > 0 THEN
        FOR product_record IN SELECT * FROM jsonb_array_elements(p_products) LOOP
            INSERT INTO public.products (
                id, name, description, price, original_price, stock, image_url,
                is_active, category, category_label, min_order, lead_time,
                material, size, options, shopee_url, rating, sold_count
            ) VALUES (
                product_record->>'id',
                product_record->>'name',
                COALESCE(product_record->>'description', ''),
                (product_record->>'price')::numeric,
                (product_record->>'original_price')::numeric,
                COALESCE((product_record->>'stock')::integer, 100),
                COALESCE(product_record->>'image_url', ''),
                COALESCE((product_record->>'is_active')::boolean, true),
                COALESCE(product_record->>'category', 'candle'),
                COALESCE(product_record->>'category_label', 'Lilin Aromaterapi'),
                COALESCE((product_record->>'min_order')::integer, 1),
                COALESCE(product_record->>'lead_time', '3 - 7 Hari Kerja'),
                product_record->>'material',
                product_record->>'size',
                COALESCE(product_record->'options', '[]'::jsonb),
                product_record->>'shopee_url',
                COALESCE((product_record->>'rating')::numeric, 5.0),
                COALESCE((product_record->>'sold_count')::integer, 0)
            )
            ON CONFLICT (id) DO UPDATE SET
                name = EXCLUDED.name,
                description = EXCLUDED.description,
                price = EXCLUDED.price,
                original_price = EXCLUDED.original_price,
                stock = EXCLUDED.stock,
                image_url = EXCLUDED.image_url,
                is_active = EXCLUDED.is_active,
                category = EXCLUDED.category,
                category_label = EXCLUDED.category_label,
                min_order = EXCLUDED.min_order,
                lead_time = EXCLUDED.lead_time,
                material = EXCLUDED.material,
                size = EXCLUDED.size,
                options = EXCLUDED.options,
                shopee_url = EXCLUDED.shopee_url,
                rating = EXCLUDED.rating,
                sold_count = EXCLUDED.sold_count;
        END LOOP;
    END IF;

    -- 6. Upsert Contact Info
    IF p_contact IS NOT NULL AND jsonb_typeof(p_contact) = 'object' THEN
        INSERT INTO public.contact_info (
            id, name, tagline, address, phone, whatsapp, whatsapp_display,
            email, instagram_url, shopee_url, map_embed_url, operational_hours, updated_at
        ) VALUES (
            'default',
            COALESCE(p_contact->>'name', 'CraftByHanifa'),
            p_contact->>'tagline',
            COALESCE(p_contact->>'address', ''),
            COALESCE(p_contact->>'phone', ''),
            COALESCE(p_contact->>'whatsapp', ''),
            COALESCE(p_contact->>'whatsapp_display', ''),
            COALESCE(p_contact->>'email', ''),
            p_contact->>'instagram_url',
            p_contact->>'shopee_url',
            p_contact->>'map_embed_url',
            COALESCE(p_contact->>'operational_hours', 'Senin - Sabtu: 08.00 - 17.00 WIB'),
            now()
        )
        ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            tagline = EXCLUDED.tagline,
            address = EXCLUDED.address,
            phone = EXCLUDED.phone,
            whatsapp = EXCLUDED.whatsapp,
            whatsapp_display = EXCLUDED.whatsapp_display,
            email = EXCLUDED.email,
            instagram_url = EXCLUDED.instagram_url,
            shopee_url = EXCLUDED.shopee_url,
            map_embed_url = EXCLUDED.map_embed_url,
            operational_hours = EXCLUDED.operational_hours,
            updated_at = now();
    END IF;

    RETURN jsonb_build_object('success', true, 'message', 'Transaksi penyimpanan atomik berhasil');
EXCEPTION WHEN OTHERS THEN
    -- Rollback otomatis oleh PostgreSQL, kirim pesan error yang jelas
    RAISE EXCEPTION 'Gagal menjalankan transaksi atomik toko: % (SQLSTATE: %)', SQLERRM, SQLSTATE;
END;
$$;

-- Berikan hak eksekusi ke role service_role
GRANT EXECUTE ON FUNCTION public.save_store_data_atomic TO service_role;
