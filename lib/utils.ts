/**
 * Helper formatting dan utility umum
 */

export function formatRupiah(num: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatDateIndo(dateStr?: string): string {
  if (!dateStr) return '-';
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(d);
  } catch {
    return dateStr;
  }
}

/**
 * Membentuk URL WhatsApp resmi dengan nomor terformat dan pesan encoded
 */
export function getWhatsAppLink(phone: string, message: string): string {
  const cleanPhone = phone.replace(/\D/g, '');
  const formattedPhone = cleanPhone.startsWith('0') ? `62${cleanPhone.slice(1)}` : cleanPhone;
  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Menghitung persentase diskon dari harga normal dan harga promo
 */
export function calculateDiscount(
  originalPrice?: number | null,
  currentPrice?: number
): { hasDiscount: boolean; discountPercent: number } {
  if (!originalPrice || !currentPrice || originalPrice <= currentPrice) {
    return { hasDiscount: false, discountPercent: 0 };
  }
  const percent = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  return { hasDiscount: percent > 0, discountPercent: percent };
}
