import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';
import {
  FullStoreData,
  SiteContentItem,
  BannerItem,
  ProductItem,
  ContactInfoItem,
  GalleryImageItem,
} from '@/types/store';

const dataFilePath = path.join(process.cwd(), 'data', 'storeData.json');

const defaultFallbackContact: ContactInfoItem = {
  id: 'default',
  name: 'CraftByHanifa',
  tagline: 'Handmade Scented Candles & Thoughtful Souvenirs',
  address: 'Studio CraftByHanifa, Magetan, Jawa Timur',
  phone: '+62 812-3456-7890',
  whatsapp: '6281234567890',
  whatsapp_display: '+62 812-3456-7890',
  email: 'craftbyhanifa@gmail.com',
  instagram_url: 'https://instagram.com/craftbyhanifa',
  shopee_url: 'https://shopee.co.id/hanifakumala',
  map_embed_url: 'https://maps.google.com/?q=Magetan,+Jawa+Timur',
  operational_hours: 'Senin - Sabtu: 08.00 - 17.00 WIB',
};

function getLocalStoreData(): FullStoreData | null {
  try {
    if (fs.existsSync(dataFilePath)) {
      const fileContent = fs.readFileSync(dataFilePath, 'utf-8');
      return JSON.parse(fileContent);
    }
  } catch (error) {
    console.error('Error reading local store data:', error);
  }
  return null;
}

export async function GET() {
  // 1. Coba baca dari Supabase jika env sudah dikonfigurasi
  if (isSupabaseConfigured && supabase) {
    try {
      const [bannersRes, contentRes, productsRes, galleryRes, contactRes] = await Promise.all([
        supabase.from('banners').select('*').order('sort_order', { ascending: true }),
        supabase.from('site_content').select('*'),
        supabase.from('products').select('*').order('created_at', { ascending: true }),
        supabase.from('gallery_images').select('*').order('sort_order', { ascending: true }),
        supabase.from('contact_info').select('*').eq('id', 'default').single(),
      ]);

      if (!bannersRes.error && !contentRes.error && !productsRes.error && !galleryRes.error) {
        // Map site_content to key-value record
        const siteContentRecord: Record<string, SiteContentItem> = {};
        ((contentRes.data as SiteContentItem[]) || []).forEach((item) => {
          siteContentRecord[item.section_key] = item;
        });

        // Map contact info
        const contactInfo: ContactInfoItem =
          (contactRes.data as ContactInfoItem) || defaultFallbackContact;

        // Backward compatibility wrappers for siteConfig & hero
        const siteConfig = {
          name: contactInfo.name || 'CraftByHanifa',
          tagline: contactInfo.tagline || 'Handmade Scented Candles & Thoughtful Gifts',
          description:
            siteContentRecord['tentang_kami']?.content ||
            siteContentRecord['deskripsi_beranda']?.content ||
            '',
          owner: 'Hanifa Kumala',
          location: 'Kab. Magetan, Jawa Timur, Indonesia',
          fullAddress: contactInfo.address,
          whatsapp: contactInfo.whatsapp,
          whatsappDisplay: contactInfo.whatsapp_display,
          instagram: 'craftbyhanifa',
          instagramUrl: contactInfo.instagram_url || 'https://instagram.com/craftbyhanifa',
          shopeeUrl: contactInfo.shopee_url || 'https://shopee.co.id/hanifakumala',
          email: contactInfo.email,
          operationalHours: contactInfo.operational_hours || 'Senin - Sabtu: 08.00 - 17.00 WIB',
          stats: {
            rating: 4.85,
            ratingCount: '1.500+',
            orderCompleted: '50.000+ pcs',
          },
        };

        const hero = {
          badge: '★ 4.85 / 5.0 • Star+ Shopee (1.500+ Ulasan) • Magetan, Jatim',
          title:
            siteContentRecord['deskripsi_beranda']?.title ||
            'Sentuhan Hangat Kerajinan Tangan untuk Setiap Momen',
          description: siteContentRecord['deskripsi_beranda']?.content || '',
          slides: ((bannersRes.data as BannerItem[]) || []).map((b) => ({
            image: b.image_url,
            title: b.title,
            subtitle: b.subtitle,
          })),
        };

        const localProductsMap = new Map<string, ProductItem>(
          ((getLocalStoreData()?.products as ProductItem[]) || []).map((p) => [p.id, p])
        );
        const mergedProducts: ProductItem[] = ((productsRes.data as ProductItem[]) || []).map(
          (sp) => {
            const local = localProductsMap.get(sp.id);
            return {
              ...sp,
              original_price:
                sp.original_price !== undefined
                  ? sp.original_price
                  : (local?.original_price ?? null),
              options:
                sp.options && Array.isArray(sp.options) && sp.options.length > 0
                  ? sp.options
                  : local?.options || [],
            };
          }
        );

        return NextResponse.json(
          {
            banners: (bannersRes.data as BannerItem[]) || [],
            siteContent: siteContentRecord,
            products: mergedProducts,
            galleryImages: (galleryRes.data as GalleryImageItem[]) || [],
            contactInfo,
            siteConfig,
            hero,
            source: 'supabase',
          },
          {
            headers: {
              'Cache-Control': 'no-store, max-age=0',
            },
          }
        );
      }
    } catch (err) {
      console.warn('Gagal membaca Supabase, beralih ke lokal:', err);
    }
  }

  // 2. Fallback baca dari lokal storeData.json jika Supabase gagal/belum diset
  const localData = getLocalStoreData();
  if (localData) {
    return NextResponse.json(
      { ...localData, source: 'local' },
      {
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
  }

  return NextResponse.json(
    {
      banners: [],
      siteContent: {},
      products: [],
      galleryImages: [],
      contactInfo: defaultFallbackContact,
      source: 'local',
    },
    {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    }
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { banners, siteContent, products, galleryImages, contactInfo, siteConfig, hero } = body;

    // Baca data lokal saat ini
    const currentData = getLocalStoreData() || {
      banners: [],
      siteContent: {},
      products: [],
      galleryImages: [],
      contactInfo: defaultFallbackContact,
    };

    const updatedLocalData: FullStoreData = {
      ...currentData,
      ...(banners ? { banners } : {}),
      ...(siteContent ? { siteContent } : {}),
      ...(products ? { products } : {}),
      ...(galleryImages ? { galleryImages } : {}),
      ...(contactInfo ? { contactInfo } : {}),
    };

    // Sinkronkan backward compatibility object jika ada
    const fullLocalPayload = {
      ...updatedLocalData,
      ...(siteConfig ? { siteConfig } : {}),
      ...(hero ? { hero } : {}),
    };

    fs.writeFileSync(dataFilePath, JSON.stringify(fullLocalPayload, null, 2), 'utf-8');

    // Jika Supabase aktif, simpan juga ke Supabase PostgreSQL
    if (isSupabaseConfigured && supabase) {
      try {
        // 1. Simpan Banners
        if (banners && Array.isArray(banners)) {
          for (const b of banners as BannerItem[]) {
            await supabase.from('banners').upsert({
              id: b.id && b.id.length === 36 ? b.id : undefined,
              image_url: b.image_url,
              title: b.title,
              subtitle: b.subtitle,
              cta_text: b.cta_text || null,
              cta_link: b.cta_link || null,
              sort_order: b.sort_order,
              is_active: b.is_active ?? true,
            });
          }
        }

        // 2. Simpan Site Content
        if (siteContent && typeof siteContent === 'object') {
          for (const key of Object.keys(siteContent)) {
            const item: SiteContentItem = siteContent[key];
            await supabase.from('site_content').upsert(
              {
                section_key: item.section_key || key,
                title: item.title,
                content: item.content,
                image_url: item.image_url,
                updated_at: new Date().toISOString(),
              },
              { onConflict: 'section_key' }
            );
          }
        }

        // 3. Simpan Products
        if (products && Array.isArray(products)) {
          const prodList = products as ProductItem[];
          const currentIds = prodList.map((p) => p.id);
          if (currentIds.length > 0) {
            const { data: existingProds } = await supabase.from('products').select('id');
            if (existingProds && Array.isArray(existingProds)) {
              const toDelete = (existingProds as { id: string }[])
                .filter((ep) => !currentIds.includes(ep.id))
                .map((ep) => ep.id);
              if (toDelete.length > 0) {
                await supabase.from('products').delete().in('id', toDelete);
              }
            }
          }

          for (const p of prodList) {
            const basePayload: Record<string, unknown> = {
              id: p.id,
              name: p.name,
              description: p.description,
              price: p.price,
              stock: p.stock ?? 100,
              image_url: p.image_url,
              is_active: p.is_active ?? true,
              category: p.category || 'candle',
              category_label: p.category_label || 'Lilin Aromaterapi',
              min_order: p.min_order ?? 1,
              lead_time: p.lead_time || '5 - 10 Hari Kerja',
              material: p.material,
              size: p.size,
              shopee_url: p.shopee_url,
              rating: p.rating ?? 5.0,
              sold_count: p.sold_count ?? 0,
            };

            const fullPayload = {
              ...basePayload,
              original_price: p.original_price ?? null,
              options: p.options || [],
            };

            const { error: upsertErr } = await supabase.from('products').upsert(fullPayload);
            if (upsertErr) {
              if (upsertErr.code === 'PGRST204') {
                console.warn(
                  'Kolom baru belum dibuat di Supabase, menyimpan dengan skema dasar:',
                  upsertErr.message
                );
                const { error: fallbackErr } = await supabase.from('products').upsert(basePayload);
                if (fallbackErr) {
                  console.error('Fallback upsert gagal:', fallbackErr);
                }
              } else {
                console.error(`Gagal menyimpan produk ${p.id} ke Supabase:`, upsertErr);
              }
            }
          }
        }

        // 4. Simpan Gallery Images
        if (galleryImages && Array.isArray(galleryImages)) {
          for (const g of galleryImages as GalleryImageItem[]) {
            await supabase.from('gallery_images').upsert({
              id: g.id && g.id.length === 36 ? g.id : undefined,
              image_url: g.image_url,
              caption: g.caption,
              sort_order: g.sort_order,
              category: g.category || 'all',
              category_label: g.category_label || 'Karya Studio',
            });
          }
        }

        // 5. Simpan Contact Info
        if (contactInfo && typeof contactInfo === 'object') {
          const c = contactInfo as ContactInfoItem;
          await supabase.from('contact_info').upsert({
            id: 'default',
            name: c.name || 'CraftByHanifa',
            tagline: c.tagline,
            address: c.address,
            phone: c.phone,
            whatsapp: c.whatsapp,
            whatsapp_display: c.whatsapp_display,
            email: c.email,
            instagram_url: c.instagram_url,
            shopee_url: c.shopee_url,
            map_embed_url: c.map_embed_url,
            operational_hours: c.operational_hours,
            updated_at: new Date().toISOString(),
          });
        }
      } catch (sbErr) {
        console.warn('Gagal menyimpan ke Supabase, backup lokal tersimpan:', sbErr);
      }
    }

    return NextResponse.json({ success: true, data: fullLocalPayload });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal menyimpan data';
    console.error('Error saving store data:', error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
