'use client';

import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2, Loader2 } from 'lucide-react';
import { ContactInfoItem } from '@/types/store';
import { ContactSchema } from '@/lib/validations/contact.schema';

export default function AdminKontakPage() {
  const [contactInfo, setContactInfo] = useState<ContactInfoItem>({
    name: 'CraftByHanifa',
    tagline: 'Handmade Scented Candles & Thoughtful Souvenirs',
    address: 'Studio CraftByHanifa, Magetan, Jawa Timur, 63319',
    phone: '+62 812-3456-7890',
    whatsapp: '6281234567890',
    whatsapp_display: '+62 812-3456-7890',
    email: 'craftbyhanifa@gmail.com',
    instagram_url: 'https://instagram.com/craftbyhanifa',
    shopee_url: 'https://shopee.co.id/hanifakumala',
    map_embed_url: 'https://maps.google.com/?q=Magetan,+Jawa+Timur',
    operational_hours: 'Senin - Sabtu: 08.00 - 17.00 WIB',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/store', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.contactInfo) setContactInfo(data.contactInfo);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const showNotification = (msg: string) => {
    setSaveSuccess(msg);
    setTimeout(() => setSaveSuccess(null), 4000);
  };

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate with Zod
    const validation = ContactSchema.safeParse(contactInfo);
    if (!validation.success) {
      alert(validation.error.issues[0]?.message || 'Data kontak tidak valid.');
      return;
    }

    try {
      setSaving(true);
      const res = await fetch('/api/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contactInfo }),
      });

      if (res.ok) {
        showNotification('Informasi Kontak & Sosial Media berhasil diperbarui!');
      } else {
        alert('Gagal menyimpan kontak.');
      }
    } catch {
      alert('Terjadi kesalahan saat menyimpan.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <Loader2 className="w-8 h-8 text-[#e05d82] animate-spin mx-auto mb-3" />
        <p className="text-xs text-[#755562] font-semibold">Memuat informasi kontak...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {saveSuccess && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#2e1c24] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-scaleUp border border-[#f3d7df]">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{saveSuccess}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-serif font-bold text-[#2e1c24]">
          Kelola Kontak & Sosial Media Studio
        </h1>
        <p className="text-xs text-[#755562] mt-1">
          Tabel Supabase:{' '}
          <code className="bg-[#fde8ee] px-1.5 py-0.5 rounded text-[#e05d82]">contact_info</code>
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#f3d7df] shadow-xs">
        <form onSubmit={handleSaveContact} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#2e1c24] mb-1.5">
                Nama Perusahaan / Brand
              </label>
              <input
                type="text"
                required
                value={contactInfo.name || ''}
                onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#f3d7df] bg-[#fff7f9] text-sm text-[#2e1c24] focus:outline-none focus:ring-2 focus:ring-[#e05d82]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2e1c24] mb-1.5">
                Tagline Singkat
              </label>
              <input
                type="text"
                value={contactInfo.tagline || ''}
                onChange={(e) => setContactInfo({ ...contactInfo, tagline: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#f3d7df] bg-[#fff7f9] text-sm text-[#2e1c24] focus:outline-none focus:ring-2 focus:ring-[#e05d82]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2e1c24] mb-1.5">
              Alamat Lengkap Workshop
            </label>
            <input
              type="text"
              required
              value={contactInfo.address || ''}
              onChange={(e) => setContactInfo({ ...contactInfo, address: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-[#f3d7df] bg-[#fff7f9] text-sm text-[#2e1c24] focus:outline-none focus:ring-2 focus:ring-[#e05d82]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#2e1c24] mb-1.5">
                Nomor WhatsApp (Angka saja, e.g. 6281234567890)
              </label>
              <input
                type="text"
                required
                value={contactInfo.whatsapp || ''}
                onChange={(e) => setContactInfo({ ...contactInfo, whatsapp: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#f3d7df] bg-[#fff7f9] text-sm text-[#2e1c24] focus:outline-none focus:ring-2 focus:ring-[#e05d82]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2e1c24] mb-1.5">
                Tampilan WhatsApp (e.g. +62 812-3456-7890)
              </label>
              <input
                type="text"
                required
                value={contactInfo.whatsapp_display || ''}
                onChange={(e) =>
                  setContactInfo({ ...contactInfo, whatsapp_display: e.target.value })
                }
                className="w-full px-4 py-2.5 rounded-xl border border-[#f3d7df] bg-[#fff7f9] text-sm text-[#2e1c24] focus:outline-none focus:ring-2 focus:ring-[#e05d82]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2e1c24] mb-1.5">Email Resmi</label>
              <input
                type="email"
                required
                value={contactInfo.email || ''}
                onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#f3d7df] bg-[#fff7f9] text-sm text-[#2e1c24] focus:outline-none focus:ring-2 focus:ring-[#e05d82]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#2e1c24] mb-1.5">
                Link Toko Shopee
              </label>
              <input
                type="text"
                value={contactInfo.shopee_url || ''}
                onChange={(e) => setContactInfo({ ...contactInfo, shopee_url: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#f3d7df] bg-[#fff7f9] text-sm text-[#2e1c24] focus:outline-none focus:ring-2 focus:ring-[#e05d82]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#2e1c24] mb-1.5">
                Link Profil Instagram
              </label>
              <input
                type="text"
                value={contactInfo.instagram_url || ''}
                onChange={(e) => setContactInfo({ ...contactInfo, instagram_url: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[#f3d7df] bg-[#fff7f9] text-sm text-[#2e1c24] focus:outline-none focus:ring-2 focus:ring-[#e05d82]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2e1c24] mb-1.5">
              Jam Layanan Studio
            </label>
            <input
              type="text"
              value={contactInfo.operational_hours || ''}
              onChange={(e) =>
                setContactInfo({ ...contactInfo, operational_hours: e.target.value })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-[#f3d7df] bg-[#fff7f9] text-sm text-[#2e1c24] focus:outline-none focus:ring-2 focus:ring-[#e05d82]"
            />
          </div>

          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-[#e05d82] text-white text-xs font-bold hover:bg-[#c8476c] transition-colors shadow-md shadow-[#e05d82]/20 flex items-center gap-2 cursor-pointer"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Simpan Kontak & Sosmed</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
