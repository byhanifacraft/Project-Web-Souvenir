import { z } from 'zod';

export const ProductVariantSchema = z.object({
  id: z.string().min(1, 'ID varian wajib ada'),
  name: z.string().min(1, 'Nama varian wajib diisi'),
  price: z.number().min(0, 'Harga varian tidak boleh negatif'),
  original_price: z.number().nullable().optional(),
  image_url: z.string().nullable().optional(),
  stock: z.number().int().min(0).optional().default(100),
});

export const ProductOptionChoiceSchema = z.object({
  label: z.string().min(1, 'Label opsi kustom wajib diisi'),
  choices: z.array(z.string()).min(1, 'Minimal satu pilihan variasi'),
});

export const ProductSchema = z.object({
  id: z.string().min(1, 'ID produk wajib ada'),
  name: z.string().min(2, 'Nama produk minimal 2 karakter'),
  description: z.string().optional().default(''),
  price: z.number().min(0, 'Harga produk tidak boleh negatif'),
  original_price: z.number().nullable().optional(),
  stock: z.number().int().min(0, 'Stok tidak boleh negatif').optional().default(100),
  image_url: z.string().optional().default(''),
  images: z.array(z.string()).nullable().optional().default([]),
  variants: z.array(ProductVariantSchema).nullable().optional().default([]),
  is_active: z.boolean().optional().default(true),
  category: z.string().default('candle'),
  category_label: z.string().nullable().optional(),
  min_order: z.number().int().min(1, 'Minimal order minimal 1').optional().default(1),
  lead_time: z.string().nullable().optional(),
  material: z.string().nullable().optional(),
  size: z.string().nullable().optional(),
  options: z.array(ProductOptionChoiceSchema).nullable().optional().default([]),
  included_items: z.array(z.string()).nullable().optional(),
  shopee_url: z.string().nullable().optional(),
  rating: z.number().optional().default(5.0),
  sold_count: z.number().optional().default(0),
});

export type ProductInput = z.infer<typeof ProductSchema>;
