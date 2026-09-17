import fs from 'fs';
import path from 'path';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import {
  FullStoreData,
  SiteContentItem,
  BannerItem,
  ProductItem,
  ContactInfoItem,
  GalleryImageItem,
  WorkshopNewsItem,
} from '@/types/store';
import { DEFAULT_WORKSHOP_NEWS } from '@/lib/defaultWorkshopNews';
import { DEFAULT_WORKSHOP_GALLERY } from '@/lib/workshopDefaults';

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
      const [bannersRes, contentRes, productsRes, contactRes] = await Promise.all([
        supabase.from('banners').select('*').order('sort_order', { ascending: true }),
        supabase.from('site_content').select('*'),
        supabase.from('products').select('*').order('created_at', { ascending: true }),
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

        const mergedProducts: ProductItem[] = (
          (productsRes.data as unknown as Record<string, unknown>[]) || []
        ).map((sp) => {
          let variants: import('@/types/store').ProductVariant[] = [];
          let images: string[] = [];
          let options: import('@/types/store').ProductOption[] = [];

          if (Array.isArray(sp.options)) {
            options = sp.options as import('@/types/store').ProductOption[];
          } else if (sp.options && typeof sp.options === 'object') {
            const optObj = sp.options as Record<string, unknown>;
            variants = (optObj.variants as import('@/types/store').ProductVariant[]) || [];
            images = (optObj.gallery as string[]) || (optObj.images as string[]) || [];
            options =
              (optObj.custom_options as import('@/types/store').ProductOption[]) ||
              (optObj.options as import('@/types/store').ProductOption[]) ||
              [];
          }

          const mainImageUrl = (sp.image_url as string) || '';
          if (images.length === 0 && mainImageUrl) {
            images = [mainImageUrl];
          }

          return {
            ...(sp as unknown as ProductItem),
            image_url: mainImageUrl,
            original_price: (sp.original_price as number) ?? null,
            options,
            variants,
            images,
          };
        });

        // Ambil data foto dokumentasi workshop (Single source of truth: site_content['workshop_gallery'] -> default)
        let galleryImagesList: GalleryImageItem[] = [];
        if (siteContentRecord['workshop_gallery']?.content) {
          try {
            const parsed = JSON.parse(siteContentRecord['workshop_gallery'].content);
            if (Array.isArray(parsed) && parsed.length > 0) {
              galleryImagesList = parsed;
            }
          } catch (e) {
            console.warn('Error parsing workshop_gallery in getStoreData:', e);
          }
        }
        if (galleryImagesList.length === 0) {
          galleryImagesList = DEFAULT_WORKSHOP_GALLERY;
        }

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
          galleryImages: galleryImagesList,
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
        galleryImages:
          parsed.galleryImages && parsed.galleryImages.length > 0
            ? parsed.galleryImages
            : DEFAULT_WORKSHOP_GALLERY,
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
    galleryImages: DEFAULT_WORKSHOP_GALLERY,
    workshopNews: DEFAULT_WORKSHOP_NEWS,
    contactInfo: defaultContactInfo,
    source: 'local',
  };
}
