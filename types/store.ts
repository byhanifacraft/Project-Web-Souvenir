export interface BannerItem {
  id: string;
  image_url: string;
  title: string;
  subtitle: string;
  cta_text?: string | null;
  cta_link?: string | null;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
}

export interface SiteContentItem {
  id?: string;
  section_key: string;
  title: string;
  content: string;
  image_url?: string | null;
  updated_at?: string;
}

export interface ProductOption {
  label: string;
  choices: string[];
}

export interface ProductItem {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price?: number | null;
  stock: number;
  image_url: string;
  is_active: boolean;
  category?: string;
  category_label?: string;
  min_order?: number;
  lead_time?: string;
  material?: string;
  size?: string;
  options?: ProductOption[] | null;
  included_items?: string[] | null;
  shopee_url?: string;
  rating?: number;
  sold_count?: number;
  created_at?: string;
}

export interface GalleryImageItem {
  id: string;
  image_url: string;
  caption?: string | null;
  sort_order: number;
  category?: string;
  category_label?: string;
  created_at?: string;
}

export interface ContactInfoItem {
  id?: string;
  name: string;
  tagline?: string;
  address: string;
  phone: string;
  whatsapp: string;
  whatsapp_display: string;
  email: string;
  instagram_url?: string | null;
  shopee_url?: string | null;
  map_embed_url?: string | null;
  operational_hours?: string;
  updated_at?: string;
}

export interface SiteConfig {
  name: string;
  whatsapp: string;
  whatsappDisplay: string;
  shopeeUrl: string;
  instagramUrl: string;
  email: string;
  fullAddress: string;
  operationalHours: string;
  owner?: string;
  tagline?: string;
  description?: string;
  location?: string;
  instagram?: string;
  stats?: {
    rating: number;
    ratingCount: string;
    orderCompleted: string;
  };
}

export interface HeroSlide {
  image: string;
  title: string;
  subtitle: string;
  cta_text?: string | null;
  cta_link?: string | null;
}

export interface HeroData {
  badge: string;
  title: string;
  description: string;
  slides: HeroSlide[];
}

export interface FullStoreData {
  banners: BannerItem[];
  siteContent: Record<string, SiteContentItem>;
  products: ProductItem[];
  galleryImages: GalleryImageItem[];
  contactInfo: ContactInfoItem;
  siteConfig?: Partial<SiteConfig>;
  hero?: HeroData;
  source?: 'supabase' | 'local';
}
