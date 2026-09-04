import { z } from 'zod';

export const BannerSchema = z.object({
  id: z.string().optional(),
  image_url: z.string().min(1, 'Foto banner wajib diisi atau diunggah'),
  title: z.string().min(3, 'Judul banner minimal 3 karakter'),
  subtitle: z.string().min(3, 'Subjudul banner minimal 3 karakter'),
  cta_text: z.string().nullable().optional(),
  cta_link: z.string().nullable().optional(),
  sort_order: z.number().int().default(1),
  is_active: z.boolean().default(true),
});

export type BannerInput = z.infer<typeof BannerSchema>;
