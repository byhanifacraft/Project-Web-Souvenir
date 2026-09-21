import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import { verifyAdminSessionToken, COOKIE_NAME, isValidOrigin } from '@/lib/auth/session';
import { createServerClient } from '@/lib/supabase/server';
import { getStoreData } from '@/lib/getStoreData';
import { BannerSchema } from '@/lib/validations/banner.schema';
import { ProductSchema } from '@/lib/validations/product.schema';
import { ContactSchema } from '@/lib/validations/contact.schema';
import { SiteContentSchema } from '@/lib/validations/content.schema';
import {
  FullStoreData,
  SiteContentItem,
  BannerItem,
  ProductItem,
  ContactInfoItem,
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

// 2. POST Handler - Terproteksi Sesi Admin, Zod Validated, & Menggunakan Bulk Upsert + ISR Revalidation
export async function POST(request: Request) {
  // 0. Validasi Origin untuk mencegah Cross-Site Request Forgery (CSRF)
  if (!isValidOrigin(request)) {
    return NextResponse.json(
      { success: false, error: 'Forbidden: Invalid request origin.' },
      { status: 403 }
    );
  }

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
      deletedBannerIds,
      deletedProductIds,
    } = body;

    // --- B. VALIDASI INPUT ZOD (FAIL-FAST SEBELUM MENULIS KE DB) ---
    if (banners !== undefined && Array.isArray(banners)) {
      const parseBanners = BannerSchema.array().safeParse(banners);
      if (!parseBanners.success) {
        return NextResponse.json(
          {
            success: false,
            error:
              'Validasi data banner gagal: ' +
              (parseBanners.error.issues[0]?.message || 'Data tidak sesuai format'),
            details: parseBanners.error.flatten(),
          },
          { status: 400 }
        );
      }
    }

    if (products !== undefined && Array.isArray(products)) {
      const parseProducts = ProductSchema.array().safeParse(products);
      if (!parseProducts.success) {
        return NextResponse.json(
          {
            success: false,
            error:
              'Validasi data produk gagal: ' +
              (parseProducts.error.issues[0]?.message || 'Data tidak sesuai format'),
            details: parseProducts.error.flatten(),
          },
          { status: 400 }
        );
      }
    }

    if (contactInfo !== undefined && contactInfo !== null && typeof contactInfo === 'object') {
      const parseContact = ContactSchema.safeParse(contactInfo);
      if (!parseContact.success) {
        return NextResponse.json(
          {
            success: false,
            error:
              'Validasi kontak gagal: ' +
              (parseContact.error.issues[0]?.message || 'Data tidak sesuai format'),
            details: parseContact.error.flatten(),
          },
          { status: 400 }
        );
      }
    }

    if (siteContent !== undefined && typeof siteContent === 'object' && siteContent !== null) {
      for (const [key, item] of Object.entries(siteContent)) {
        if (item && typeof item === 'object') {
          const parseContent = SiteContentSchema.safeParse(item);
          if (!parseContent.success) {
            return NextResponse.json(
              {
                success: false,
                error:
                  `Validasi konten (${key}) gagal: ` +
                  (parseContent.error.issues[0]?.message || 'Data tidak sesuai format'),
                details: parseContent.error.flatten(),
              },
              { status: 400 }
            );
          }
        }
      }
    }

    // Baca data lokal saat ini
    const currentData = getLocalStoreData() || {
      banners: [],
      siteContent: {},
      products: [],
      galleryImages: [],
      workshopNews: [],
      contactInfo: defaultFallbackContact,
    };

    // Sinkronkan workshopNews & workshop_gallery ke siteContent jika diberikan
    const mergedSiteContent: Record<string, SiteContentItem> = {
      ...(siteContent || {}),
      ...(workshopNews !== undefined
        ? {
            workshop_news: {
              section_key: 'workshop_news',
              title: 'Berita & Event Promosi Workshop',
              content: JSON.stringify(workshopNews),
              updated_at: new Date().toISOString(),
            },
          }
        : {}),
      ...(galleryImages !== undefined
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

    // 1. Update Produk Lokal (Non-destruktif: Upsert & Explicit Delete)
    let updatedProducts = currentData.products || [];
    if (deletedProductIds && Array.isArray(deletedProductIds) && deletedProductIds.length > 0) {
      updatedProducts = updatedProducts.filter((p) => !deletedProductIds.includes(p.id));
    }
    if (products && Array.isArray(products)) {
      const incomingMap = new Map((products as ProductItem[]).map((p) => [p.id, p]));
      updatedProducts = updatedProducts.map((p) => incomingMap.get(p.id) || p);
      for (const p of products as ProductItem[]) {
        if (!updatedProducts.some((item) => item.id === p.id)) {
          updatedProducts.push(p);
        }
      }
    }

    // 2. Update Banners Lokal (Non-destruktif: Upsert & Explicit Delete)
    let updatedBanners = currentData.banners || [];
    if (deletedBannerIds && Array.isArray(deletedBannerIds) && deletedBannerIds.length > 0) {
      updatedBanners = updatedBanners.filter((b) => !deletedBannerIds.includes(b.id));
    }
    if (banners && Array.isArray(banners)) {
      const incomingMap = new Map((banners as BannerItem[]).map((b) => [b.id, b]));
      updatedBanners = updatedBanners.map((b) => incomingMap.get(b.id) || b);
      for (const b of banners as BannerItem[]) {
        if (!updatedBanners.some((item) => item.id === b.id)) {
          updatedBanners.push(b);
        }
      }
    }

    const updatedLocalData: FullStoreData = {
      ...currentData,
      banners: updatedBanners,
      ...(Object.keys(mergedSiteContent).length > 0 ? { siteContent: mergedSiteContent } : {}),
      products: updatedProducts,
      ...(galleryImages !== undefined ? { galleryImages } : {}),
      ...(workshopNews !== undefined ? { workshopNews } : {}),
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

    // B. Simpan ke Supabase PostgreSQL via Server Client
    const supabaseServer = createServerClient();
    if (supabaseServer) {
      const errors: string[] = [];
      try {
        // Siapkan payload terformat untuk semua entitas
        const bannerList = (banners && Array.isArray(banners) ? banners : []) as BannerItem[];
        const bannerPayloads = bannerList.map((b) => {
          const isUUID =
            b.id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(b.id);
          const validId = isUUID ? b.id : randomUUID();
          b.id = validId;
          return {
            id: validId,
            image_url: b.image_url,
            title: b.title,
            subtitle: b.subtitle,
            cta_text: b.cta_text || null,
            cta_link: b.cta_link || null,
            sort_order: b.sort_order,
            is_active: b.is_active ?? true,
          };
        });

        const contentPayloads =
          Object.keys(mergedSiteContent).length > 0
            ? Object.keys(mergedSiteContent).map((key) => {
                const item: SiteContentItem = mergedSiteContent[key];
                return {
                  section_key: item.section_key || key,
                  title: item.title,
                  content: item.content,
                  image_url: item.image_url || null,
                  updated_at: new Date().toISOString(),
                };
              })
            : [];

        const prodList = (products && Array.isArray(products) ? products : []) as ProductItem[];
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

        const c =
          contactInfo && typeof contactInfo === 'object' ? (contactInfo as ContactInfoItem) : null;
        const contactPayload = c
          ? {
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
            }
          : null;

        const hasDeletes =
          (deletedBannerIds && deletedBannerIds.length > 0) ||
          (deletedProductIds && deletedProductIds.length > 0);

        const hasWrites =
          bannerPayloads.length > 0 ||
          contentPayloads.length > 0 ||
          productPayloads.length > 0 ||
          contactPayload !== null ||
          hasDeletes;

        if (hasWrites) {
          // TAHAP 1: Coba Transaksi Atomik Menggunakan PostgreSQL RPC Stored Procedure
          const { error: rpcErr } = await supabaseServer.rpc('save_store_data_atomic', {
            p_banners: bannerPayloads.length > 0 ? bannerPayloads : null,
            p_content: contentPayloads.length > 0 ? contentPayloads : null,
            p_products: productPayloads.length > 0 ? productPayloads : null,
            p_contact: contactPayload,
            p_deleted_banner_ids:
              deletedBannerIds && deletedBannerIds.length > 0 ? deletedBannerIds : null,
            p_deleted_product_ids:
              deletedProductIds && deletedProductIds.length > 0 ? deletedProductIds : null,
          });

          if (!rpcErr) {
            console.log(
              '✅ Transaksi penyimpanan multi-entitas atomik berhasil via RPC save_store_data_atomic.'
            );
          } else if (rpcErr.code === 'PGRST202' || rpcErr.message?.includes('not found')) {
            // TAHAP 2: Graceful fallback jika migrasi RPC belum dieksekusi di Supabase Dashboard
            console.warn(
              '⚠️ RPC save_store_data_atomic belum terpasang di Supabase. Menjalankan fallback batch upsert. ' +
                'Jalankan "supabase/migration_atomic_store_transaction.sql" untuk mengaktifkan 100% ACID transaction.'
            );

            try {
              // 1. Simpan Banners
              if (bannerPayloads.length > 0) {
                const { error: bannerErr } = await supabaseServer
                  .from('banners')
                  .upsert(bannerPayloads, { onConflict: 'id' });
                if (bannerErr) {
                  console.error('Bulk upsert banners error:', bannerErr);
                  errors.push(`Banners: ${bannerErr.message}`);
                }
              }

              // 2. Simpan Site Content
              if (contentPayloads.length > 0 && errors.length === 0) {
                const { error: contentErr } = await supabaseServer
                  .from('site_content')
                  .upsert(contentPayloads, { onConflict: 'section_key' });
                if (contentErr) {
                  console.error('Bulk upsert site_content error:', contentErr);
                  errors.push(`Site Content: ${contentErr.message}`);
                }
              }

              // 3. Simpan Products
              if (productPayloads.length > 0 && errors.length === 0) {
                let { error: prodErr } = await supabaseServer
                  .from('products')
                  .upsert(productPayloads, { onConflict: 'id' });

                if (prodErr && prodErr.message && prodErr.message.includes('schema cache')) {
                  const fallbackPayloads = productPayloads.map(
                    ({ options: _options, original_price: _original_price, ...rest }) => rest
                  );
                  const { error: retryErr } = await supabaseServer
                    .from('products')
                    .upsert(fallbackPayloads, { onConflict: 'id' });
                  prodErr = retryErr;
                }

                if (prodErr) {
                  console.error('Bulk upsert products error:', prodErr);
                  errors.push(`Products: ${prodErr.message}`);
                }
              }

              // 4. Simpan Contact Info
              if (contactPayload && errors.length === 0) {
                const { error: contactErr } = await supabaseServer
                  .from('contact_info')
                  .upsert(contactPayload);
                if (contactErr) {
                  console.error('Upsert contact_info error:', contactErr);
                  errors.push(`Contact Info: ${contactErr.message}`);
                }
              }

              // 5. Explicit Deletions (hanya dieksekusi jika tidak ada error sebelumnya)
              if (errors.length === 0) {
                if (deletedBannerIds && deletedBannerIds.length > 0) {
                  const { error: delBannerErr } = await supabaseServer
                    .from('banners')
                    .delete()
                    .in('id', deletedBannerIds);
                  if (delBannerErr) errors.push(`Delete Banners: ${delBannerErr.message}`);
                }

                if (deletedProductIds && deletedProductIds.length > 0) {
                  const { error: delProdErr } = await supabaseServer
                    .from('products')
                    .delete()
                    .in('id', deletedProductIds);
                  if (delProdErr) errors.push(`Delete Products: ${delProdErr.message}`);
                }
              }
            } catch (err: unknown) {
              console.error('Fatal fallback error:', err);
              errors.push(err instanceof Error ? err.message : 'Kesalahan internal database.');
            }
          } else {
            // RPC gagal karena validasi / constraint PostgreSQL -> Seluruh transaksi otomatis di-rollback!
            console.error('PostgreSQL RPC transaction error (rolled back):', rpcErr);
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

    // Ambil data kanonikal terbaru dari sumber data utama untuk disinkronkan ke React state admin
    const canonicalData = await getStoreData();

    return NextResponse.json({ success: true, data: canonicalData });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal menyimpan data';
    console.error('Error saving store data:', error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
