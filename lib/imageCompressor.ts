/**
 * Kompresor Gambar Otomatis (Client-side Canvas WebP/JPEG)
 *
 * Mengompresi file foto resolusi besar (misal dari kamera HP 4MB - 15MB)
 * secara otomatis menjadi format WebP berkualitas tinggi dengan ukuran sangat kecil (~150KB - 350KB).
 *
 * Keuntungan:
 * 1. Upload instan (hemat kuota & waktu).
 * 2. Mencegah error Vercel 413 (Payload Too Large limit 4.5MB).
 * 3. Menghemat kuota storage Supabase hingga 90%.
 * 4. Halaman website publik memuat foto jauh lebih cepat.
 */

export interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  targetFormat?: 'image/webp' | 'image/jpeg';
}

export async function compressImage(file: File, options?: CompressOptions): Promise<File> {
  // Jika bukan file gambar atau format GIF (animasi), jangan kompres
  if (!file.type.startsWith('image/') || file.type === 'image/gif') {
    return file;
  }

  const maxWidth = options?.maxWidth || 1600;
  const maxHeight = options?.maxHeight || 1600;
  const quality = options?.quality ?? 0.82;
  const targetFormat = options?.targetFormat || 'image/webp';

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        let { width, height } = img;

        // Skala proporsional mempertahankan aspect ratio
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file); // Fallback ke file asli jika context canvas tidak tersedia
          return;
        }

        // Interpolasi resolusi tinggi
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Ekspor ke Blob WebP / JPEG
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }

            const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
            const ext = targetFormat === 'image/webp' ? 'webp' : 'jpg';
            const compressedFile = new File([blob], `${baseName}.${ext}`, {
              type: targetFormat,
              lastModified: Date.now(),
            });

            // Jika hasil kompresi justru lebih besar dan file awal sudah kecil (< 300KB), pakai file asli
            if (compressedFile.size > file.size && file.size < 300 * 1024) {
              resolve(file);
            } else {
              resolve(compressedFile);
            }
          },
          targetFormat,
          quality
        );
      };

      img.onerror = () => resolve(file);
    };

    reader.onerror = () => resolve(file);
  });
}
