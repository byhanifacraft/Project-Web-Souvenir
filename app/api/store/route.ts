import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import { verifyAdminSessionToken, COOKIE_NAME } from '@/lib/auth/session';
import { createServerClient } from '@/lib/supabase/server';
import { getStoreData } from '@/lib/getStoreData';
import {
  FullStoreData,
  SiteContentItem,
  BannerItem,
  ProductItem,
  ContactInfoItem,
  GalleryImageItem,
} from '@/types/store';
import { DEFAULT_WORKSHOP_NEWS } from '@/lib/defaultWorkshopNews';

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

// 1. GET Handler - Menggunakan getStoreData sebagai Single Source of Truth
export async function GET() {
  try {
    const data = await getStoreData();
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('Error in GET /api/store:', error);
    return NextResponse.json({ error: 'Gagal mengambil data toko' }, { status: 500 });
  }
}

// 2. POST Handler - Terproteksi Sesi Admin & Menggunakan Bulk Upsert + ISR Revalidation
export async function POST(request: Request) {
  // A. Verifikasi Autentikasi Admin
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const session = verifyAdminSessionToken(token);

  if (!session) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Sesi admin tidak valid atau telah berakhir.' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const {
      banners,
      siteContent,
      products,
      galleryImages,
      workshopNews,
      contactInfo,
      siteConfig,
      hero,
    } = body;

    // Baca data lokal saat ini
    const currentData = getLocalStoreData() || {
      banners: [],
      siteContent: {},
      products: [],
      galleryImages: [],
      workshopNews: DEFAULT_WORKSHOP_NEWS,
      contactInfo: defaultFallbackContact,
    };

    // Sinkronkan workshopNews & workshop_gallery ke siteContent jika diberikan
    const mergedSiteContent: Record<string, SiteContentItem> = {
      ...(siteContent || {}),
      ...(workshopNews
        ? {
            workshop_news: {
              section_key: 'workshop_news',
              title: 'Berita & Event Promosi Workshop',
              content: JSON.stringify(workshopNews),
              updated_at: new Date().toISOString(),
            },
          }
        : {}),
      ...(galleryImages
        ? {
            workshop_gallery: {
              section_key: 'workshop_gallery',
              title: 'Foto Dokumentasi Workshop Studio',
              content: JSON.stringify(galleryImages),
              updated_at: new Date().toISOString(),
            },
          }
        : {}),
    };

    const updatedLocalData: FullStoreData = {
      ...currentData,
      ...(banners ? { banners } : {}),
      ...(Object.keys(mergedSiteContent).length > 0 ? { siteContent: mergedSiteContent } : {}),
      ...(products ? { products } : {}),
      ...(galleryImages ? { galleryImages } : {}),
      ...(workshopNews ? { workshopNews } : {}),
      ...(contactInfo ? { contactInfo } : {}),
    };

    // Sinkronkan backward compatibility object jika ada
    const fullLocalPayload = {
      ...updatedLocalData,
      ...(siteConfig ? { siteConfig } : {}),
      ...(hero ? { hero } : {}),
    };

    // Backup ke file lokal (akan di-skip secara aman jika di serverless read-only filesystem)
    try {
      fs.writeFileSync(dataFilePath, JSON.stringify(fullLocalPayload, null, 2), 'utf-8');
    } catch (fsErr) {
      console.warn('Local fs write skipped (serverless filesystem):', fsErr);
    }

    // B. Simpan ke Supabase PostgreSQL via Server Client (Bulk Upsert)
    const supabaseServer = createServerClient();
    if (supabaseServer) {
      const errors: string[] = [];
      try {
        // 1. Simpan Banners (Bulk Upsert)
        if (banners && Array.isArray(banners)) {
          const bannerList = banners as BannerItem[];
          const currentIds = bannerList.map((b) => b.id).filter(Boolean);
          if (currentIds.length > 0) {
            const { data: existingBanners } = await supabaseServer.from('banners').select('id');
            if (existingBanners && Array.isArray(existingBanners)) {
              const toDelete = existingBanners
                .map((eb) => eb.id)
                .filter((id) => !currentIds.includes(id));
              if (toDelete.length > 0) {
                await supabaseServer.from('banners').delete().in('id', toDelete);
              }
            }
          }

          const bannerPayloads = bannerList.map((b) => {
            const isUUID =
              b.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(b.id);
            const payload: Record<string, unknown> = {
              image_url: b.image_url,
              title: b.title,
              subtitle: b.subtitle,
              cta_text: b.cta_text || null,
              cta_link: b.cta_link || null,
              sort_order: b.sort_order,
              is_active: b.is_active ?? true,
            };
            if (isUUID) {
              payload.id = b.id;
            }
            return payload;
          });

          if (bannerPayloads.length > 0) {
            const { error: bannerErr } = await supabaseServer
              .from('banners')
              .upsert(bannerPayloads);
            if (bannerErr) {
              console.error('Bulk upsert banners error:', bannerErr);
              errors.push(`Banners: ${bannerErr.message}`);
            }
          }
        }

        // 2. Simpan Site Content (Bulk Upsert)
        if (Object.keys(mergedSiteContent).length > 0) {
          const contentPayloads = Object.keys(mergedSiteContent).map((key) => {
            const item: SiteContentItem = mergedSiteContent[key];
            return {
              section_key: item.section_key || key,
              title: item.title,
              content: item.content,
              image_url: item.image_url || null,
              updated_at: new Date().toISOString(),
            };
          });

          const { error: contentErr } = await supabaseServer
            .from('site_content')
            .upsert(contentPayloads, { onConflict: 'section_key' });
          if (contentErr) {
            console.error('Bulk upsert site_content error:', contentErr);
            errors.push(`Site Content: ${contentErr.message}`);
          }
        }

        // 3. Simpan Products (Bulk Upsert)
        if (products && Array.isArray(products)) {
          const prodList = products as ProductItem[];
          const currentIds = prodList.map((p) => p.id);
          if (currentIds.length > 0) {
            const { data: existingProds } = await supabaseServer.from('products').select('id');
            if (existingProds && Array.isArray(existingProds)) {
              const toDelete = existingProds
                .map((ep) => ep.id)
                .filter((id) => !currentIds.includes(id));
              if (toDelete.length > 0) {
                await supabaseServer.from('products').delete().in('id', toDelete);
              }
            }
          }

          const productPayloads = prodList.map((p) => {
            const gallery =
              p.images && p.images.length > 0 ? p.images : p.image_url ? [p.image_url] : [];
            const optionsPayload = {
              variants: p.variants || [],
              gallery,
              custom_options: p.options || [],
            };

            return {
              id: p.id,
              name: p.name,
              description: p.description,
              price: p.price,
              original_price: p.original_price ?? null,
              stock: p.stock ?? 100,
              image_url: p.image_url,
              is_active: p.is_active ?? true,
              category: p.category || 'candle',
              category_label: p.category_label || 'Lilin Aromaterapi',
              min_order: p.min_order ?? 1,
              lead_time: p.lead_time || '5 - 10 Hari Kerja',
              material: p.material || null,
              size: p.size || null,
              options: optionsPayload,
              shopee_url: p.shopee_url || null,
              rating: p.rating ?? 5.0,
              sold_count: p.sold_count ?? 0,
            };
          });

          if (productPayloads.length > 0) {
            let { error: prodErr } = await supabaseServer
              .from('products')
              .upsert(productPayloads, { onConflict: 'id' });

            // Graceful fallback: Jika kolom baru seperti 'options' atau 'original_price' belum ditambahkan di tabel Supabase
            if (prodErr && prodErr.message && prodErr.message.includes('schema cache')) {
              console.warn(
                'Supabase products table schema mismatch (kolom options/original_price belum ada). Melakukan fallback tanpa kolom baru:',
                prodErr.message
              );
              const fallbackPayloads = productPayloads.map(
                ({ options: _options, original_price: _original_price, ...rest }) => rest
              );
              const { error: retryErr } = await supabaseServer
                .from('products')
                .upsert(fallbackPayloads, { onConflict: 'id' });

              if (!retryErr) {
                console.log('Berhasil menyimpan produk ke Supabase via legacy schema fallback.');
                prodErr = null;
              } else {
                prodErr = retryErr;
              }
            }

            if (prodErr) {
              console.error('Bulk upsert products error:', prodErr);
              errors.push(`Products: ${prodErr.message}`);
            }
          }
        }

        // 4. Simpan Gallery Images (Bulk Upsert)
        if (galleryImages && Array.isArray(galleryImages)) {
          const galList = galleryImages as GalleryImageItem[];
          const galPayloads = galList.map((g) => {
            const isUUID =
              g.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(g.id);
            return {
              id: isUUID ? g.id : randomUUID(),
              image_url: g.image_url,
              caption: g.caption || null,
              sort_order: g.sort_order || 1,
              category: g.category || 'workshop',
              category_label: g.category_label || 'Workshop Studio',
            };
          });

          if (galPayloads.length > 0) {
            const { error: galErr } = await supabaseServer
              .from('gallery_images')
              .upsert(galPayloads, { onConflict: 'id' });
            if (galErr) {
              console.error('Bulk upsert gallery_images error:', galErr);
              errors.push(`Gallery Images: ${galErr.message}`);
            }
          }
        }

        // 5. Simpan Contact Info
        if (contactInfo && typeof contactInfo === 'object') {
          const c = contactInfo as ContactInfoItem;
          const { error: contactErr } = await supabaseServer.from('contact_info').upsert({
            id: 'default',
            name: c.name || 'CraftByHanifa',
            tagline: c.tagline || null,
            address: c.address,
            phone: c.phone,
            whatsapp: c.whatsapp,
            whatsapp_display: c.whatsapp_display,
            email: c.email,
            instagram_url: c.instagram_url || null,
            shopee_url: c.shopee_url || null,
            map_embed_url: c.map_embed_url || null,
            operational_hours: c.operational_hours || null,
            updated_at: new Date().toISOString(),
          });
          if (contactErr) {
            console.error('Upsert contact_info error:', contactErr);
            errors.push(`Contact Info: ${contactErr.message}`);
          }
        }

        // Jika ada kegagalan query pada Supabase, kembalikan response error agar admin tahu
        if (errors.length > 0) {
          const combinedMsg = errors.join('; ');
          const isRlsViolation = combinedMsg.toLowerCase().includes('row-level security');
          const rlsHint = isRlsViolation
            ? ' (Penyebab: SUPABASE_SERVICE_ROLE_KEY belum dipasang di .env.local atau dev server belum di-restart sehingga ditolak oleh RLS Supabase)'
            : '';
          return NextResponse.json(
            {
              success: false,
              error: `Gagal menyimpan ke Supabase: ${combinedMsg}${rlsHint}`,
            },
            { status: 500 }
          );
        }
      } catch (sbErr) {
        console.error('Gagal menyimpan ke Supabase:', sbErr);
        const errMsg = sbErr instanceof Error ? sbErr.message : 'Kesalahan internal database';
        return NextResponse.json(
          { success: false, error: `Gagal menyimpan ke Supabase: ${errMsg}` },
          { status: 500 }
        );
      }
    }

    // C. Revalidasi Cache Halaman Publik secara On-Demand (Instant Update)
    try {
      revalidatePath('/', 'layout');
      revalidatePath('/');
      revalidatePath('/produk');
      revalidatePath('/workshop');
      revalidatePath('/tentang-kami');
      revalidatePath('/kontak');
    } catch (revalErr) {
      console.warn('Next.js revalidatePath warning:', revalErr);
    }

    return NextResponse.json({ success: true, data: fullLocalPayload });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal menyimpan data';
    console.error('Error saving store data:', error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
