import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabase, isSupabaseConfigured } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const bucket = (formData.get('bucket') as string) || 'souvenir-images';

    if (!file) {
      return NextResponse.json({ error: 'Tidak ada file yang diunggah' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const originalName = file.name || 'image.jpg';
    const ext = originalName.split('.').pop()?.toLowerCase() || 'jpg';
    const validExt = ['jpg', 'jpeg', 'png', 'webp'].includes(ext) ? ext : 'jpg';
    const fileName = `${bucket}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${validExt}`;

    // 1. Jika Supabase sudah dikonfigurasi, simpan ke Supabase Storage
    if (isSupabaseConfigured && supabase) {
      try {
        const targetBucket = ['banners', 'products', 'gallery', 'site', 'souvenir-images'].includes(
          bucket
        )
          ? bucket
          : 'souvenir-images';

        const contentType =
          validExt === 'jpg' || validExt === 'jpeg' ? 'image/jpeg' : `image/${validExt}`;
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
