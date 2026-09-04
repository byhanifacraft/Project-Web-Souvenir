import { z } from 'zod';

export const SiteContentSchema = z.object({
  id: z.string().optional(),
  section_key: z.string().min(1, 'Section key wajib ada'),
  title: z.string().min(3, 'Judul minimal 3 karakter'),
  content: z.string().min(10, 'Konten minimal 10 karakter'),
  image_url: z.string().nullable().optional(),
  updated_at: z.string().optional(),
});

export type SiteContentInput = z.infer<typeof SiteContentSchema>;
