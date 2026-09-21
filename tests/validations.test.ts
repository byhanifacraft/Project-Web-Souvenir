import { describe, it, expect } from 'vitest';
import { ProductSchema } from '../lib/validations/product.schema';
import { BannerSchema } from '../lib/validations/banner.schema';
import { ContactSchema } from '../lib/validations/contact.schema';
import { SiteContentSchema } from '../lib/validations/content.schema';

describe('Zod Validation Schemas', () => {
  describe('ProductSchema', () => {
    it('accepts a valid product with default fields', () => {
      const validProduct = {
        id: 'prod-001',
        name: 'Lilin Aromaterapi Lavender',
        price: 45000,
      };
      const result = ProductSchema.safeParse(validProduct);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.stock).toBe(100);
        expect(result.data.is_active).toBe(true);
        expect(result.data.category).toBe('candle');
      }
    });

    it('rejects product with negative price', () => {
      const invalidProduct = {
        id: 'prod-002',
        name: 'Invalid Price Product',
        price: -5000,
      };
      const result = ProductSchema.safeParse(invalidProduct);
      expect(result.success).toBe(false);
    });

    it('rejects product with name shorter than 2 characters', () => {
      const invalidProduct = {
        id: 'prod-003',
        name: 'A',
        price: 20000,
      };
      const result = ProductSchema.safeParse(invalidProduct);
      expect(result.success).toBe(false);
    });

    it('validates product variants correctly', () => {
      const productWithVariants = {
        id: 'prod-004',
        name: 'Lilin Multi Varian',
        price: 50000,
        variants: [
          {
            id: 'var-1',
            name: 'Ukuran 100gr',
            price: 50000,
          },
          {
            id: 'var-2',
            name: 'Ukuran 200gr',
            price: 85000,
          },
        ],
      };
      const result = ProductSchema.safeParse(productWithVariants);
      expect(result.success).toBe(true);
    });
  });

  describe('BannerSchema', () => {
    it('accepts a valid banner payload', () => {
      const validBanner = {
        title: 'Promo Spesial Lebaran',
        subtitle: 'Diskon souvenir pernikahan elegan',
        image_url: 'https://example.com/banner.jpg',
      };
      const result = BannerSchema.safeParse(validBanner);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.is_active).toBe(true);
        expect(result.data.sort_order).toBe(1);
      }
    });

    it('rejects banner with missing image_url', () => {
      const invalidBanner = {
        title: 'Promo Spesial',
        subtitle: 'Subjudul promo',
        image_url: '',
      };
      const result = BannerSchema.safeParse(invalidBanner);
      expect(result.success).toBe(false);
    });
  });

  describe('ContactSchema', () => {
    it('accepts valid contact information', () => {
      const validContact = {
        name: 'CraftByHanifa',
        address: 'Jl. Raya Magetan No. 12, Jawa Timur',
        phone: '081234567890',
        whatsapp: '6281234567890',
        whatsapp_display: '+62 812-3456-7890',
        email: 'craftbyhanifa@gmail.com',
      };
      const result = ContactSchema.safeParse(validContact);
      expect(result.success).toBe(true);
    });

    it('rejects invalid email format', () => {
      const invalidContact = {
        name: 'CraftByHanifa',
        address: 'Jl. Raya Magetan No. 12, Jawa Timur',
        phone: '081234567890',
        whatsapp: '6281234567890',
        whatsapp_display: '+62 812-3456-7890',
        email: 'bukan-email-valid',
      };
      const result = ContactSchema.safeParse(invalidContact);
      expect(result.success).toBe(false);
    });
  });

  describe('SiteContentSchema', () => {
    it('accepts valid site content item', () => {
      const validContent = {
        section_key: 'hero_announcement',
        title: 'Pengumuman Workshop',
        content: 'Jadwal workshop lilin aromaterapi bulan depan telah dibuka.',
      };
      const result = SiteContentSchema.safeParse(validContent);
      expect(result.success).toBe(true);
    });

    it('rejects empty section_key', () => {
      const invalidContent = {
        section_key: '',
        title: 'Pengumuman',
        content: 'Isi teks...',
      };
      const result = SiteContentSchema.safeParse(invalidContent);
      expect(result.success).toBe(false);
    });
  });
});
