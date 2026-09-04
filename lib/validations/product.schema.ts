import { z } from 'zod';

export const ProductSchema = z.object({
  id: z.string().min(1, 'ID produk wajib ada'),
  name: z.string().min(3, 'Nama produk minimal 3 karakter'),
  description: z.string().min(10, 'Deskripsi produk minimal 10 karakter'),
  price: z.number().min(500, 'Harga minimal Rp 500'),
  original_price: z.number().nullable().optional(),
  stock: z.number().int().min(0, 'Stok tidak boleh negatif'),
  image_url: z.string().min(1, 'Foto produk wajib diisi atau diunggah'),
  is_active: z.boolean().default(true),
  category: z.string().default('candle'),
  category_label: z.string().optional(),
  min_order: z.number().int().min(1, 'Minimal order minimal 1').default(1),
  lead_time: z.string().optional(),
  material: z.string().optional(),
  size: z.string().optional(),
  options: z
    .array(
      z.object({
        label: z.string().min(1, 'Label opsi kustom wajib diisi'),
        choices: z.array(z.string()).min(1, 'Minimal satu pilihan variasi'),
      })
    )
    .nullable()
    .optional(),
  included_items: z.array(z.string()).nullable().optional(),
  shopee_url: z.string().optional(),
  rating: z.number().optional(),
  sold_count: z.number().optional(),
});

export type ProductInput = z.infer<typeof ProductSchema>;
