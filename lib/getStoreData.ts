import fs from 'fs';
import path from 'path';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import {
  FullStoreData,
  SiteContentItem,
  BannerItem,
  ProductItem,
  ContactInfoItem,
  WorkshopNewsItem,
} from '@/types/store';
import { DEFAULT_WORKSHOP_NEWS } from '@/lib/defaultWorkshopNews';

const defaultContactInfo: ContactInfoItem = {
  name: 'CraftByHanifa',
  phone: '081234567890',
  whatsapp: '6281234567890',
  whatsapp_display: '+62 812-3456-7890',
  shopee_url: 'https://shopee.co.id/hanifakumala',
  instagram_url: 'https://instagram.com/craftbyhanifa',
  email: 'craftbyhanifa@gmail.com',
  address: 'Studio CraftByHanifa, Magetan, Jawa Timur',
  operational_hours: 'Senin - Sabtu: 08.00 - 17.00 WIB',
};

export async function getStoreData(): Promise<FullStoreData> {
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

      if (!bannersRes.error && !contentRes.error && !productsRes.error) {
        const siteContentRecord: Record<string, SiteContentItem> = {};
        ((contentRes.data as SiteContentItem[]) || []).forEach((item) => {
          siteContentRecord[item.section_key] = item;
        });

        const contactInfo: ContactInfoItem =
          (contactRes.data as ContactInfoItem) || defaultContactInfo;

        const siteConfig = {
          name: contactInfo.name || 'CraftByHanifa',
          whatsapp: contactInfo.whatsapp || '6281234567890',
          whatsappDisplay: contactInfo.whatsapp_display || '+62 812-3456-7890',
          shopeeUrl: contactInfo.shopee_url || 'https://shopee.co.id/hanifakumala',
          instagramUrl: contactInfo.instagram_url || 'https://instagram.com/craftbyhanifa',
          email: contactInfo.email || 'craftbyhanifa@gmail.com',
          fullAddress: contactInfo.address || 'Studio CraftByHanifa, Magetan, Jawa Timur',
          operationalHours: contactInfo.operational_hours || 'Senin - Sabtu: 08.00 - 17.00 WIB',
        };

        const hero = {
          badge: '★ 4.85 / 5.0 • Star+ Shopee (1.500+ Ulasan) • Magetan, Jatim',
          title:
            siteContentRecord['tagline_beranda']?.title ||
            'Sentuhan Hangat Kerajinan Tangan untuk Setiap Momen',
          description: siteContentRecord['tagline_beranda']?.content || '',
          slides: ((bannersRes.data as BannerItem[]) || []).map((b) => ({
            image: b.image_url,
            title: b.title,
            subtitle: b.subtitle,
            cta_text: b.cta_text,
            cta_link: b.cta_link,
          })),
        };

        // Ambil data lokal untuk melengkapi field baru (original_price & options) jika tabel Supabase belum dimigrasi
        const localProductsMap = new Map<string, ProductItem>();
        try {
          const filePath = path.join(process.cwd(), 'data', 'storeData.json');
          if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf-8');
            const parsed = JSON.parse(content);
            ((parsed.products as ProductItem[]) || []).forEach((lp) =>
              localProductsMap.set(lp.id, lp)
            );
          }
        } catch (e) {
          console.warn('Error reading local backup in getStoreData:', e);
        }

        const mergedProducts: ProductItem[] = ((productsRes.data as ProductItem[]) || []).map(
          (sp) => {
            const local = localProductsMap.get(sp.id);
            return {
              ...sp,
              original_price:
                sp.original_price !== undefined && sp.original_price !== null
                  ? sp.original_price
                  : (local?.original_price ?? null),
              options:
                sp.options && Array.isArray(sp.options) && sp.options.length > 0
                  ? sp.options
                  : local?.options || [],
            };
          }
        );

        // Ambil data berita & event workshop
        let workshopNews: WorkshopNewsItem[] = DEFAULT_WORKSHOP_NEWS;
        if (siteContentRecord['workshop_news']?.content) {
          try {
            const parsed = JSON.parse(siteContentRecord['workshop_news'].content);
            if (Array.isArray(parsed) && parsed.length > 0) {
              workshopNews = parsed;
            }
          } catch (e) {
            console.warn('Error parsing workshop_news in getStoreData:', e);
          }
        }

        return {
          banners: (bannersRes.data as BannerItem[]) || [],
          siteContent: siteContentRecord,
          products: mergedProducts,
          galleryImages: galleryRes.data || [],
          workshopNews,
          contactInfo,
          siteConfig,
          hero,
          source: 'supabase',
        };
      }
    } catch (err) {
      console.warn('Supabase fetch error in getStoreData, fallback to local:', err);
    }
  }

  // 2. Fallback lokal ke data/storeData.json
  try {
    const filePath = path.join(process.cwd(), 'data', 'storeData.json');
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(content);
      return {
        ...parsed,
        workshopNews: parsed.workshopNews || DEFAULT_WORKSHOP_NEWS,
        source: 'local',
      };
    }
  } catch (error) {
    console.error('Error reading storeData.json in getStoreData:', error);
  }

  return {
    banners: [],
    siteContent: {},
    products: [],
    galleryImages: [],
    workshopNews: DEFAULT_WORKSHOP_NEWS,
    contactInfo: defaultContactInfo,
    source: 'local',
  };
}
