import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';

const MIME_MAP: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  jfif: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
  svg: 'image/svg+xml',
  avif: 'image/avif',
  bmp: 'image/bmp',
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const bucket = (formData.get('bucket') as string) || 'souvenir-images';

    if (!file) {
      return NextResponse.json({ error: 'Tidak ada file yang diunggah' }, { status: 400 });
    }

    // Validasi ukuran maksimal (15MB)
    const maxSizeBytes = 15 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return NextResponse.json(
        { error: 'Ukuran file terlalu besar. Maksimal 15MB.' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const originalName = file.name || 'image.jpg';
    const rawExt = originalName.split('.').pop()?.toLowerCase() || 'jpg';
    const validExt = MIME_MAP[rawExt] ? rawExt : 'jpg';
    const contentType = file.type || MIME_MAP[validExt] || 'image/jpeg';
    const sanitizedBucket = bucket.replace(/[^a-z0-9-_]/gi, '').toLowerCase() || 'souvenir-images';
    const fileName = `${sanitizedBucket}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${validExt}`;

    // 1. Jika Supabase sudah dikonfigurasi, simpan ke Supabase Storage
    if (isSupabaseConfigured && supabase) {
      try {
        const targetBucket = ['banners', 'products', 'gallery', 'site', 'souvenir-images'].includes(
          sanitizedBucket
        )
          ? sanitizedBucket
          : 'souvenir-images';

        const { error: uploadError } = await supabase.storage
          .from(targetBucket)
          .upload(fileName, buffer, {
            contentType,
            upsert: true,
          });

        if (!uploadError) {
          const { data: publicUrlData } = supabase.storage
            .from(targetBucket)
            .getPublicUrl(fileName);

          return NextResponse.json({
            success: true,
            url: publicUrlData.publicUrl,
            size: buffer.byteLength,
            storage: 'supabase',
            bucket: targetBucket,
          });
        } else {
          console.warn(
            `Supabase storage upload to bucket ${targetBucket} failed, trying fallback:`,
            uploadError.message
          );
        }
      } catch (sbError) {
        console.warn('Supabase upload exception, falling back to local:', sbError);
      }
    }

    // 2. Fallback: Simpan ke folder lokal public/uploads/
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, fileName);
    fs.writeFileSync(filePath, buffer);

    return NextResponse.json({
      success: true,
      url: `/uploads/${fileName}`,
      size: buffer.byteLength,
      storage: 'local',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal mengunggah file';
    console.error('Error saving upload:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
