import { z } from 'zod';

export const ContactSchema = z.object({
  id: z.string().default('default'),
  name: z.string().min(2, 'Nama brand minimal 2 karakter'),
  tagline: z.string().optional(),
  address: z.string().min(5, 'Alamat minimal 5 karakter'),
  phone: z.string().min(6, 'Nomor telepon minimal 6 karakter'),
  whatsapp: z.string().min(8, 'Nomor WhatsApp minimal 8 digit'),
  whatsapp_display: z.string().min(8, 'Teks WhatsApp minimal 8 karakter'),
  email: z.string().email('Format email tidak valid'),
  instagram_url: z.string().nullable().optional(),
  shopee_url: z.string().nullable().optional(),
  map_embed_url: z.string().nullable().optional(),
  operational_hours: z.string().optional(),
});

export type ContactInput = z.infer<typeof ContactSchema>;
