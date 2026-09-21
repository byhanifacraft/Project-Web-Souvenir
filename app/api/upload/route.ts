import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';
import { verifyAdminSessionToken, COOKIE_NAME, isValidOrigin } from '@/lib/auth/session';
import { createServerClient } from '@/lib/supabase/server';

// Format gambar raster yang diizinkan (SVG dilarang keras untuk mencegah Stored XSS)
const ALLOWED_EXTENSIONS: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  jfif: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
  avif: 'image/avif',
};

function isValidImageMagicBytes(buffer: Buffer, ext: string): boolean {
  if (buffer.length < 12) return false;

  if (ext === 'jpg' || ext === 'jpeg' || ext === 'jfif') {
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }
  if (ext === 'png') {
    return buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47;
  }
  if (ext === 'gif') {
    return buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46; // "GIF"
  }
  if (ext === 'webp') {
    return (
      buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
      buffer.subarray(8, 12).toString('ascii') === 'WEBP'
    );
  }
  if (ext === 'avif') {
    return buffer.subarray(4, 8).toString('ascii') === 'ftyp';
  }

  return false;
}

export async function POST(request: Request) {
  // 0. Validasi Origin untuk mencegah Cross-Site Request Forgery (CSRF)
  if (!isValidOrigin(request)) {
    return NextResponse.json({ error: 'Forbidden: Invalid request origin.' }, { status: 403 });
  }

  // 1. Verifikasi Autentikasi Admin
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  const session = verifyAdminSessionToken(token);

  if (!session) {
    return NextResponse.json(
      {
        error:
          'Unauthorized: Akses ditolak. Hanya admin terautentikasi yang dapat mengunggah file.',
      },
      { status: 401 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const bucket = (formData.get('bucket') as string) || 'souvenir-images';

    if (!file) {
      return NextResponse.json({ error: 'Tidak ada file yang diunggah.' }, { status: 400 });
    }

    // 2. Validasi ukuran maksimal (15MB)
    const maxSizeBytes = 15 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return NextResponse.json(
        { error: 'Ukuran file terlalu besar. Maksimal 15MB.' },
        { status: 400 }
      );
    }

    // 3. Validasi ekstensi ketat (Anti SVG / Stored XSS)
    const originalName = file.name || 'image.jpg';
    const rawExt = originalName.split('.').pop()?.toLowerCase() || '';

    if (!ALLOWED_EXTENSIONS[rawExt]) {
      return NextResponse.json(
        {
          error:
            'Format file tidak didukung atau dilarang. Hanya file gambar raster (JPG, PNG, WEBP, GIF, AVIF) yang diizinkan.',
        },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 4. Validasi Magic Bytes (mencegah penyamaran ekstensi)
    if (!isValidImageMagicBytes(buffer, rawExt)) {
      return NextResponse.json(
        {
          error:
            'Konten file tidak valid atau rusak. Pastikan file merupakan gambar asli bukan file eksekutabel yang diubah ekstensinya.',
        },
        { status: 400 }
      );
    }

    const contentType = ALLOWED_EXTENSIONS[rawExt];
    const sanitizedBucket = bucket.replace(/[^a-z0-9-_]/gi, '').toLowerCase() || 'souvenir-images';
    const fileName = `${sanitizedBucket}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${rawExt}`;

    // 5. Unggah ke Supabase Storage via Service Role Client
    const supabaseServer = createServerClient();
    if (supabaseServer) {
      try {
        const targetBucket = ['banners', 'products', 'gallery', 'site', 'souvenir-images'].includes(
          sanitizedBucket
        )
          ? sanitizedBucket
          : 'souvenir-images';

        const { error: uploadError } = await supabaseServer.storage
          .from(targetBucket)
          .upload(fileName, buffer, {
            contentType,
            upsert: true,
          });

        if (!uploadError) {
          const { data: publicUrlData } = supabaseServer.storage
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
            `Supabase storage upload to bucket ${targetBucket} failed, trying local fallback:`,
            uploadError.message
          );
        }
      } catch (sbError) {
        console.warn('Supabase upload exception, falling back to local:', sbError);
      }
    }

    // 6. Fallback lokal ke public/uploads/ (jika serverless filesystem mengizinkan atau di local dev)
    try {
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
    } catch (fsErr) {
      console.error('Local filesystem write failed:', fsErr);
      return NextResponse.json(
        { error: 'Gagal menyimpan file ke penyimpanan lokal maupun cloud.' },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Gagal mengunggah file';
    console.error('Error saving upload:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
