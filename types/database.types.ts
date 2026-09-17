export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      banners: {
        Row: {
          id: string;
          image_url: string;
          title: string;
          subtitle: string;
          cta_text: string | null;
          cta_link: string | null;
          sort_order: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          image_url: string;
          title: string;
          subtitle: string;
          cta_text?: string | null;
          cta_link?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          image_url?: string;
          title?: string;
          subtitle?: string;
          cta_text?: string | null;
          cta_link?: string | null;
          sort_order?: number;
          is_active?: boolean;
          created_at?: string;
        };
      };
      site_content: {
        Row: {
          id: string;
          section_key: string;
          title: string;
          content: string;
          image_url: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          section_key: string;
          title: string;
          content: string;
          image_url?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          section_key?: string;
          title?: string;
          content?: string;
          image_url?: string | null;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number;
          stock: number;
          image_url: string;
          is_active: boolean;
          category: string;
          category_label: string | null;
          min_order: number;
          lead_time: string | null;
          material: string | null;
          size: string | null;
          shopee_url: string | null;
          rating: number | null;
          sold_count: number | null;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          description: string;
          price: number;
          stock?: number;
          image_url: string;
          is_active?: boolean;
          category?: string;
          category_label?: string | null;
          min_order?: number;
          lead_time?: string | null;
          material?: string | null;
          size?: string | null;
          shopee_url?: string | null;
          rating?: number | null;
          sold_count?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          price?: number;
          stock?: number;
          image_url?: string;
          is_active?: boolean;
          category?: string;
          category_label?: string | null;
          min_order?: number;
          lead_time?: string | null;
          material?: string | null;
          size?: string | null;
          shopee_url?: string | null;
          rating?: number | null;
          sold_count?: number | null;
          created_at?: string;
        };
      };
      /**
       * @deprecated Tabel gallery_images sudah tidak digunakan oleh kode aktif.
       * Galeri workshop studio kini menggunakan site_content (section_key: 'workshop_gallery')
       * sebagai single source of truth. Tabel ini dapat di-DROP di Supabase jika diinginkan.
       */
      gallery_images: {
        Row: {
          id: string;
          image_url: string;
          caption: string | null;
          sort_order: number;
          category: string | null;
          category_label: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          image_url: string;
          caption?: string | null;
          sort_order?: number;
          category?: string | null;
          category_label?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          image_url?: string;
          caption?: string | null;
          sort_order?: number;
          category?: string | null;
          category_label?: string | null;
          created_at?: string;
        };
      };
      contact_info: {
        Row: {
          id: string;
          name: string;
          tagline: string | null;
          address: string;
          phone: string;
          whatsapp: string;
          whatsapp_display: string;
          email: string;
          instagram_url: string | null;
          shopee_url: string | null;
          map_embed_url: string | null;
          operational_hours: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          tagline?: string | null;
          address: string;
          phone: string;
          whatsapp: string;
          whatsapp_display: string;
          email: string;
          instagram_url?: string | null;
          shopee_url?: string | null;
          map_embed_url?: string | null;
          operational_hours?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          tagline?: string | null;
          address?: string;
          phone?: string;
          whatsapp?: string;
          whatsapp_display?: string;
          email?: string;
          instagram_url?: string | null;
          shopee_url?: string | null;
          map_embed_url?: string | null;
          operational_hours?: string | null;
          updated_at?: string;
        };
      };
    };
  };
}
