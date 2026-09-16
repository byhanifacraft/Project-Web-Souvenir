'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Info, Sparkles, Save, CheckCircle2, Loader2, User, Upload } from 'lucide-react';
import { SiteContentItem } from '@/types/store';

export default function AdminTentangKamiPage() {
  const [siteContent, setSiteContent] = useState<Record<string, SiteContentItem>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadingStory, setUploadingStory] = useState(false);

  useEffect(() => {
    fetch('/api/store', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.siteContent) setSiteContent(data.siteContent);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const showNotification = (msg: string) => {
    setSaveSuccess(msg);
    setTimeout(() => setSaveSuccess(null), 4000);
  };

  const handleUploadOwnerPhoto = async (file: File) => {
    try {
      if (file.size > 10 * 1024 * 1024) {
        alert('Ukuran foto terlalu besar. Maksimal 10MB.');
        return;
      }

      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', 'site');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setSiteContent((prev) => ({
          ...prev,
          profil_owner: {
            ...prev['profil_owner'],
            section_key: 'profil_owner',
            title: prev['profil_owner']?.title || 'Hanifa Kumala — Founder & Lead Artisan',
            content: prev['profil_owner']?.content || '',
            image_url: data.url,
          },
        }));
        showNotification('Foto owner berhasil diunggah! Jangan lupa klik Simpan.');
      } else {
        alert(data.error || 'Gagal mengunggah foto');
      }
    } catch {
      alert('Terjadi kesalahan jaringan saat mengunggah foto.');
    } finally {
      setUploading(false);
    }
  };

  const handleUploadStoryPhoto = async (file: File) => {
    try {
      if (file.size > 10 * 1024 * 1024) {
        alert('Ukuran foto terlalu besar. Maksimal 10MB.');
        return;
      }

      setUploadingStory(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', 'site');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setSiteContent((prev) => ({
          ...prev,
          tentang_kami: {
            ...prev['tentang_kami'],
            section_key: 'tentang_kami',
            title: prev['tentang_kami']?.title || '',
            content: prev['tentang_kami']?.content || '',
            image_url: data.url,
          },
        }));
        showNotification('Foto banner studio berhasil diunggah! Jangan lupa klik Simpan.');
      } else {
        alert(data.error || 'Gagal mengunggah foto banner studio');
      }
    } catch {
      alert('Terjadi kesalahan jaringan saat mengunggah foto.');
    } finally {
      setUploadingStory(false);
    }
  };

  const handleSaveAbout = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await fetch('/api/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteContent }),
      });

      if (res.ok) {
        showNotification('Cerita Brand, Visi Misi & Profil Owner berhasil disimpan!');
      } else {
        alert('Gagal menyimpan.');
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
        <p className="text-xs text-[#755562] font-semibold">
          Memuat cerita brand, visi misi & profil owner...
        </p>
      </div>
    );
  }

  const ownerPhotoUrl = siteContent['profil_owner']?.image_url || '/images/products/avatar.jpg';

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
          Kelola Tentang Kami, Visi Misi & Profil Owner
        </h1>
        <p className="text-xs text-[#755562] mt-1">
          Tabel Supabase:{' '}
          <code className="bg-[#fde8ee] px-1.5 py-0.5 rounded text-[#e05d82]">
            site_content (tentang_kami, visi_misi, profil_owner)
          </code>
        </p>
      </div>

      <form onSubmit={handleSaveAbout} className="space-y-6">
        {/* 1. Seksi Profil Owner & Lead Artisan */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#f3d7df] shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#fce7ed]">
            <User className="w-5 h-5 text-[#e05d82]" />
            <div>
              <h2 className="text-base font-serif font-bold text-[#2e1c24]">
                1. Profil Owner & Lead Artisan (profil_owner)
              </h2>
              <p className="text-[11px] text-[#755562]">
                Tampil di halaman /tentang-kami lengkap dengan foto profil, nama/jabatan, dan
                sepatah kata sambutan owner.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Foto Owner Preview & Upload */}
            <div className="md:col-span-4 space-y-3">
              <label className="block text-xs font-bold text-[#2e1c24]">Foto Profil Owner</label>
              <div className="w-32 h-32 rounded-2xl overflow-hidden relative border-2 border-[#fce7ed] bg-[#fde8ee] shadow-sm">
                <Image src={ownerPhotoUrl} alt="Foto Owner" fill className="object-cover" />
              </div>
              <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#e05d82]/10 text-[#e05d82] hover:bg-[#e05d82]/20 text-xs font-bold cursor-pointer transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>{uploading ? 'Mengunggah...' : 'Ganti Foto Owner'}</span>
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploading}
                  className="hidden"
                  onClick={(e) => {
                    (e.currentTarget as HTMLInputElement).value = '';
                  }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUploadOwnerPhoto(file);
                  }}
                />
              </label>
            </div>

            {/* Nama & Pesan Owner */}
            <div className="md:col-span-8 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#2e1c24] mb-1.5">
                  Nama & Jabatan Owner
                </label>
                <input
                  type="text"
                  required
                  value={
                    siteContent['profil_owner']?.title || 'Hanifa Kumala — Founder & Lead Artisan'
                  }
                  onChange={(e) =>
                    setSiteContent({
                      ...siteContent,
                      profil_owner: {
                        ...siteContent['profil_owner'],
                        section_key: 'profil_owner',
                        title: e.target.value,
                        content: siteContent['profil_owner']?.content || '',
                        image_url:
                          siteContent['profil_owner']?.image_url || '/images/products/avatar.jpg',
                      },
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-[#f3d7df] bg-[#fff7f9] text-sm text-[#2e1c24] focus:outline-none focus:ring-2 focus:ring-[#e05d82]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2e1c24] mb-1.5">
                  Sepatah Kata / Pesan & Dedikasi Owner
                </label>
                <textarea
                  rows={4}
                  required
                  value={
                    siteContent['profil_owner']?.content ||
                    'Halo! Saya Hanifa Kumala, perajin dan penggagas di balik CraftByHanifa. Sejak awal berdiri di Magetan, saya mendedikasikan studio ini untuk meracik lilin aromaterapi 100% soy wax nabati alami yang menenangkan dan kerajinan souvenir estetik bermakna. Setiap detail karya lilin, resin, hingga jahitan pouch kami kerjakan secara handmade dengan penuh cinta dan ketelitian tinggi.'
                  }
                  onChange={(e) =>
                    setSiteContent({
                      ...siteContent,
                      profil_owner: {
                        ...siteContent['profil_owner'],
                        section_key: 'profil_owner',
                        title:
                          siteContent['profil_owner']?.title ||
                          'Hanifa Kumala — Founder & Lead Artisan',
                        content: e.target.value,
                        image_url:
                          siteContent['profil_owner']?.image_url || '/images/products/avatar.jpg',
                      },
                    })
                  }
                  className="w-full px-4 py-2.5 rounded-xl border border-[#f3d7df] bg-[#fff7f9] text-sm text-[#2e1c24] focus:outline-none focus:ring-2 focus:ring-[#e05d82]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2. Seksi Cerita Brand */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#f3d7df] shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#fce7ed]">
            <Info className="w-5 h-5 text-[#e05d82]" />
            <div>
              <h2 className="text-base font-serif font-bold text-[#2e1c24]">
                2. Kisah & Dedikasi Studio (tentang_kami)
              </h2>
              <p className="text-[11px] text-[#755562]">
                Tampil di halaman /tentang-kami sebagai narasi perjalanan studio CraftByHanifa.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2e1c24] mb-1.5">Judul Cerita</label>
            <input
              type="text"
              required
              value={siteContent['tentang_kami']?.title || ''}
              onChange={(e) =>
                setSiteContent({
                  ...siteContent,
                  tentang_kami: {
                    ...siteContent['tentang_kami'],
                    section_key: 'tentang_kami',
                    title: e.target.value,
                    content: siteContent['tentang_kami']?.content || '',
                    image_url:
                      siteContent['tentang_kami']?.image_url || '/images/products/shop-cover.jpg',
                  },
                })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-[#f3d7df] bg-[#fff7f9] text-sm text-[#2e1c24] focus:outline-none focus:ring-2 focus:ring-[#e05d82]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2e1c24] mb-1.5">
              Isi Cerita & Dedikasi Pengrajin
            </label>
            <textarea
              rows={5}
              required
              value={siteContent['tentang_kami']?.content || ''}
              onChange={(e) =>
                setSiteContent({
                  ...siteContent,
                  tentang_kami: {
                    ...siteContent['tentang_kami'],
                    section_key: 'tentang_kami',
                    title: siteContent['tentang_kami']?.title || '',
                    content: e.target.value,
                    image_url:
                      siteContent['tentang_kami']?.image_url ||
                      '/images/products/studio-workshop.jpg',
                  },
                })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-[#f3d7df] bg-[#fff7f9] text-sm text-[#2e1c24] focus:outline-none focus:ring-2 focus:ring-[#e05d82]"
            />
          </div>

          {/* Foto Banner Studio Preview & Upload */}
          <div className="pt-3 border-t border-[#fce7ed]">
            <label className="block text-xs font-bold text-[#2e1c24] mb-2">
              Foto Banner Studio / Workshop
            </label>
            <div className="flex flex-col sm:flex-row gap-5 items-start">
              <div className="w-full sm:w-60 aspect-[4/3] rounded-2xl overflow-hidden relative border-2 border-[#fce7ed] bg-[#fde8ee] shadow-sm shrink-0">
                <Image
                  src={
                    siteContent['tentang_kami']?.image_url || '/images/products/studio-workshop.jpg'
                  }
                  alt="Foto Banner Studio"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-3 flex-1 w-full">
                <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#df829b] text-white hover:bg-[#c96c85] text-xs font-bold cursor-pointer transition-colors shadow-2xs">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingStory ? 'Mengunggah...' : 'Ganti Foto Banner Studio'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={uploadingStory}
                    className="hidden"
                    onClick={(e) => {
                      (e.currentTarget as HTMLInputElement).value = '';
                    }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUploadStoryPhoto(file);
                    }}
                  />
                </label>
                <div>
                  <label className="block text-[11px] text-[#755562] mb-1">
                    Atau gunakan URL / File path:
                  </label>
                  <input
                    type="text"
                    value={siteContent['tentang_kami']?.image_url || ''}
                    placeholder="/images/products/studio-workshop.jpg atau URL online"
                    onChange={(e) =>
                      setSiteContent({
                        ...siteContent,
                        tentang_kami: {
                          ...siteContent['tentang_kami'],
                          section_key: 'tentang_kami',
                          title: siteContent['tentang_kami']?.title || '',
                          content: siteContent['tentang_kami']?.content || '',
                          image_url: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-[#f3d7df] bg-[#fff7f9] text-xs text-[#2e1c24] focus:outline-none focus:ring-2 focus:ring-[#df829b]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Seksi Visi & Misi */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#f3d7df] shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#fce7ed]">
            <Sparkles className="w-5 h-5 text-[#e05d82]" />
            <div>
              <h2 className="text-base font-serif font-bold text-[#2e1c24]">
                3. Visi & Misi Perusahaan (visi_misi)
              </h2>
              <p className="text-[11px] text-[#755562]">
                Tampil di bagian komitmen kualitas studio.
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2e1c24] mb-1.5">
              Judul Visi & Misi
            </label>
            <input
              type="text"
              required
              value={siteContent['visi_misi']?.title || ''}
              onChange={(e) =>
                setSiteContent({
                  ...siteContent,
                  visi_misi: {
                    ...siteContent['visi_misi'],
                    section_key: 'visi_misi',
                    title: e.target.value,
                    content: siteContent['visi_misi']?.content || '',
                  },
                })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-[#f3d7df] bg-[#fff7f9] text-sm text-[#2e1c24] focus:outline-none focus:ring-2 focus:ring-[#e05d82]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2e1c24] mb-1.5">
              Teks Visi & Misi Lengkap
            </label>
            <textarea
              rows={5}
              required
              value={siteContent['visi_misi']?.content || ''}
              onChange={(e) =>
                setSiteContent({
                  ...siteContent,
                  visi_misi: {
                    ...siteContent['visi_misi'],
                    section_key: 'visi_misi',
                    title: siteContent['visi_misi']?.title || '',
                    content: e.target.value,
                  },
                })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-[#f3d7df] bg-[#fff7f9] text-sm text-[#2e1c24] focus:outline-none focus:ring-2 focus:ring-[#e05d82]"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={saving || uploading}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#e05d82] text-white text-xs font-bold hover:bg-[#c8476c] transition-colors shadow-md shadow-[#e05d82]/20 flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
          >
            {saving || uploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Simpan Perubahan Tentang Kami</span>
          </button>
        </div>
      </form>
    </div>
  );
}
