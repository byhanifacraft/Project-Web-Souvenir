'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Plus,
  Pencil,
  Trash2,
  Save,
  CheckCircle2,
  X,
  Upload,
  Loader2,
  Eye,
  EyeOff,
  Sparkles,
  Check,
  Layers,
} from 'lucide-react';
import { BannerItem, SiteContentItem } from '@/types/store';
import { BannerSchema } from '@/lib/validations/banner.schema';
import { FeatureItem } from '@/components/Features';
import { compressImage } from '@/lib/imageCompressor';

const AVAILABLE_ICONS = [
  { id: 'Sparkles', label: 'Sparkles (Sentuhan Tangan / Estetik)' },
  { id: 'Palette', label: 'Palette (Desain & Mockup)' },
  { id: 'ShieldCheck', label: 'ShieldCheck (Quality Control)' },
  { id: 'BadgeCheck', label: 'BadgeCheck (Harga Produsen / Resmi)' },
  { id: 'Gift', label: 'Gift (Kado & Siap Bagikan)' },
  { id: 'Truck', label: 'Truck (Pengiriman Aman RI)' },
  { id: 'Heart', label: 'Heart (Penuh Cinta)' },
  { id: 'Leaf', label: 'Leaf (Bahan Alami Nabati)' },
  { id: 'Award', label: 'Award (Standar Terbaik)' },
  { id: 'Clock', label: 'Clock (Tepat Waktu)' },
  { id: 'CheckCircle2', label: 'CheckCircle (Lengkap & Rapi)' },
  { id: 'Flame', label: 'Flame (Lilin Aromaterapi)' },
  { id: 'Star', label: 'Star (Bintang Favorit)' },
];

const DEFAULT_4_FEATURES: FeatureItem[] = [
  {
    icon: 'Sparkles',
    title: '100% Sentuhan Tangan Pengrajin',
    desc: 'Dikerjakan manual dengan teliti oleh pengrajin lokal di Magetan, menghasilkan karya souvenir bernilai personal tinggi.',
    linkText: 'Standar Pengrajin Magetan',
  },
  {
    icon: 'Palette',
    title: 'Free Desain & Mockup Digital',
    desc: 'Bebas konsultasi tema warna acara, font inisial nama, hingga penyesuaian packaging sampai Anda merasa puas.',
    linkText: 'Standar Pengrajin Magetan',
  },
  {
    icon: 'BadgeCheck',
    title: 'Harga Produsen Tangan Pertama',
    desc: 'Dapatkan penawaran harga terbaik langsung dari workshop tanpa perantara, dengan diskon kuantiti bertingkat.',
    linkText: 'Standar Pengrajin Magetan',
  },
  {
    icon: 'Truck',
    title: 'Garansi Pengiriman Aman Seluruh RI',
    desc: 'Standar packing tebal anti-pecah dengan garansi ganti produk jika terdapat kerusakan saat pengiriman ekspedisi.',
    linkText: 'Standar Pengrajin Magetan',
  },
];

export default function AdminBerandaPage() {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [siteContent, setSiteContent] = useState<Record<string, SiteContentItem>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingFeatures, setSavingFeatures] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  // Features state (default 4 box keunggulan)
  const [featuresTitle, setFeaturesTitle] = useState(
    'Mengapa Souvenir CraftByHanifa Selalu Berkesan?'
  );
  const [featuresSubtitle, setFeaturesSubtitle] = useState(
    'Setiap karya dibuat manual dengan ketelitian tinggi oleh pengrajin lokal di Magetan, menghasilkan souvenir bermakna yang berguna dan membahagiakan para tamu.'
  );
  const [featuresList, setFeaturesList] = useState<FeatureItem[]>(DEFAULT_4_FEATURES);

  // Modal / Form state for Banners
  const [editingBanner, setEditingBanner] = useState<BannerItem | null>(null);
  const [isNewBanner, setIsNewBanner] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);

  useEffect(() => {
    fetch('/api/store', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.banners) setBanners(data.banners);
        if (data.siteContent) {
          setSiteContent(data.siteContent);

          // Inisialisasi 4 box keunggulan jika ada di database
          if (data.siteContent['keunggulan_features']) {
            const kf = data.siteContent['keunggulan_features'];
            if (kf.title) setFeaturesTitle(kf.title);
            if (kf.image_url) setFeaturesSubtitle(kf.image_url);
            if (kf.content) {
              try {
                const parsed = JSON.parse(kf.content);
                if (Array.isArray(parsed) && parsed.length > 0) {
                  setFeaturesList(parsed);
                }
              } catch {
                // fallback
              }
            }
          }
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const showNotification = (msg: string) => {
    setSaveSuccess(msg);
    setTimeout(() => setSaveSuccess(null), 4000);
  };

  const handleUploadFile = async (file: File, onSuccess: (url: string) => void) => {
    try {
      setUploading(true);
      // Auto-kompres foto resolusi tinggi ke WebP ringan (~150KB-300KB)
      const compressedFile = await compressImage(file, {
        maxWidth: 1920,
        maxHeight: 1080,
        quality: 0.85,
      });
      const formData = new FormData();
      formData.append('file', compressedFile);
      formData.append('bucket', 'banners');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        onSuccess(data.url);
        showNotification('Foto banner berhasil diunggah! Klik "Simpan Banner" di bawah.');
      } else {
        alert(data.error || 'Gagal mengunggah foto');
      }
    } catch {
      alert('Terjadi kesalahan jaringan saat mengunggah foto.');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveBannerList = async (updatedBanners: BannerItem[]) => {
    try {
      setSaving(true);
      const res = await fetch('/api/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ banners: updatedBanners }),
      });

      if (res.ok) {
        setBanners(updatedBanners);
        showNotification('Daftar banner berhasil diperbarui!');
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || 'Gagal menyimpan banner.');
      }
    } catch {
      alert('Terjadi kesalahan koneksi saat menyimpan.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveBannerModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBanner) return;

    // Validate with Zod
    const validation = BannerSchema.safeParse(editingBanner);
    if (!validation.success) {
      alert(validation.error.issues[0]?.message || 'Data banner tidak valid.');
      return;
    }

    let updated = [...banners];
    if (isNewBanner) {
      updated.push(editingBanner);
    } else {
      updated = updated.map((b) => (b.id === editingBanner.id ? editingBanner : b));
    }

    await handleSaveBannerList(updated);
    setEditingBanner(null);
  };

  const handleSaveTagline = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const res = await fetch('/api/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteContent }),
      });

      if (res.ok) {
        showNotification('Headline Hero Beranda berhasil disimpan!');
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || 'Gagal menyimpan headline.');
      }
    } catch {
      alert('Terjadi kesalahan koneksi.');
    } finally {
      setSaving(false);
    }
  };

  // Simpan Box Standar Mutu Kerajinan ke database Supabase site_content
  const handleSaveFeatures = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingFeatures(true);
      const updatedSiteContent = {
        ...siteContent,
        keunggulan_features: {
          section_key: 'keunggulan_features',
          title: featuresTitle,
          content: JSON.stringify(featuresList),
          image_url: featuresSubtitle,
        },
      };

      const res = await fetch('/api/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteContent: updatedSiteContent }),
      });

      if (res.ok) {
        setSiteContent(updatedSiteContent);
        showNotification(`${featuresList.length} Box Standar Mutu Kerajinan berhasil disimpan!`);
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error || 'Gagal menyimpan keunggulan.');
      }
    } catch {
      alert('Terjadi kesalahan koneksi saat menyimpan.');
    } finally {
      setSavingFeatures(false);
    }
  };

  const updateFeatureItem = (index: number, field: keyof FeatureItem, value: string) => {
    const updated = [...featuresList];
    updated[index] = { ...updated[index], [field]: value };
    setFeaturesList(updated);
  };

  const handleAddFeatureBox = () => {
    if (featuresList.length >= 6) {
      alert('Maksimal 6 box agar tampilan tetap rapi.');
      return;
    }
    setFeaturesList([
      ...featuresList,
      {
        icon: 'Sparkles',
        title: 'Keunggulan Baru',
        desc: 'Deskripsi keunggulan produk dan pengerjaan studio CraftByHanifa.',
        linkText: 'Standar Pengrajin Magetan',
      },
    ]);
  };

  const handleDeleteFeatureBox = (index: number) => {
    if (featuresList.length <= 2) {
      alert('Minimal harus ada 2 box keunggulan.');
      return;
    }
    const updated = featuresList.filter((_, idx) => idx !== index);
    setFeaturesList(updated);
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <Loader2 className="w-8 h-8 text-[#e05d82] animate-spin mx-auto mb-3" />
        <p className="text-xs text-[#755562] font-semibold">Memuat data beranda...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fadeIn">
      {saveSuccess && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#2e1c24] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-scaleUp border border-[#f3d7df]">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{saveSuccess}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#2e1c24]">Kelola Halaman Beranda</h1>
          <p className="text-xs text-[#755562] mt-1">
            Atur Banner Slider Hero, Tagline Utama, dan Box Standar Mutu Kerajinan
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingBanner({
              id: `banner-${Date.now()}`,
              image_url: '/images/products/hero-banner.jpg',
              title: '',
              subtitle: '',
              sort_order: banners.length + 1,
              is_active: true,
            });
            setIsNewBanner(true);
          }}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#e05d82] text-white text-xs font-bold hover:bg-[#c8476c] transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-[#e05d82]/20 cursor-pointer min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Banner Baru</span>
        </button>
      </div>

      {/* 1. List Banner Slider */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#f3d7df] shadow-xs">
        <h2 className="text-base font-serif font-bold text-[#2e1c24] mb-1">
          1. Slider Hero Banner (banners)
        </h2>
        <p className="text-xs text-[#755562] mb-6">
          Tabel Supabase:{' '}
          <code className="bg-[#fde8ee] px-1.5 py-0.5 rounded text-[#e05d82]">banners</code> •
          Tampil bergantian di bagian paling atas Beranda
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {banners.map((b) => (
            <div
              key={b.id}
              className="bg-[#fff7f9] rounded-2xl border border-[#f3d7df] overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/9] w-full bg-[#fde8ee]">
                  <Image src={b.image_url} alt={b.title} fill className="object-cover" />
                  <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-xs">
                    Urutan #{b.sort_order}
                  </span>
                  <span
                    className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      b.is_active ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-200 text-zinc-600'
                    }`}
                  >
                    {b.is_active ? 'Aktif' : 'Nonaktif'}
                  </span>
                </div>

                <div className="p-4">
                  <h3 className="font-serif font-bold text-sm text-[#2e1c24] line-clamp-1 mb-1">
                    {b.title}
                  </h3>
                  <p className="text-xs text-[#755562] line-clamp-2">{b.subtitle}</p>
                </div>
              </div>

              <div className="p-3 bg-white border-t border-[#f3d7df] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    const updated = banners.map((item) =>
                      item.id === b.id ? { ...item, is_active: !item.is_active } : item
                    );
                    handleSaveBannerList(updated);
                  }}
                  className="text-xs font-semibold text-[#755562] hover:text-[#e05d82] flex items-center gap-1 cursor-pointer"
                >
                  {b.is_active ? (
                    <EyeOff className="w-3.5 h-3.5" />
                  ) : (
                    <Eye className="w-3.5 h-3.5" />
                  )}
                  <span>{b.is_active ? 'Nonaktifkan' : 'Aktifkan'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingBanner(b);
                      setIsNewBanner(false);
                    }}
                    className="p-1.5 rounded-lg bg-[#fde8ee] text-[#e05d82] hover:bg-[#e05d82] hover:text-white transition-colors cursor-pointer"
                    title="Edit Banner"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (banners.length <= 1) {
                        alert('Minimal harus ada 1 banner.');
                        return;
                      }
                      if (confirm('Hapus banner ini?')) {
                        const updated = banners.filter((item) => item.id !== b.id);
                        handleSaveBannerList(updated);
                      }
                    }}
                    className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer"
                    title="Hapus Banner"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Kelola Box Standar Mutu Kerajinan (Features) */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#f3d7df] shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#fce7ed] mb-6">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#e05d82]" />
            <div>
              <h2 className="text-base font-serif font-bold text-[#2e1c24]">
                2. Kelola Box Standar Mutu Kerajinan ({featuresList.length} Box)
              </h2>
              <p className="text-[11px] text-[#755562]">
                Tabel Supabase:{' '}
                <code className="bg-[#fde8ee] px-1.5 py-0.5 rounded text-[#e05d82]">
                  site_content (keunggulan_features)
                </code>{' '}
                • Ubah logo/ikon, judul, dan deskripsi setiap kartu
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddFeatureBox}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#fde8ee] text-[#e05d82] hover:bg-[#e05d82] hover:text-white transition-colors text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer min-h-[40px]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Box</span>
          </button>
        </div>

        <form onSubmit={handleSaveFeatures} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#2e1c24] mb-1.5">
                Judul Seksi Keunggulan
              </label>
              <input
                type="text"
                required
                value={featuresTitle}
                onChange={(e) => setFeaturesTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#f3d7df] bg-[#fff7f9] text-sm text-[#2e1c24] focus:outline-none focus:ring-2 focus:ring-[#e05d82]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#2e1c24] mb-1.5">
                Subjudul / Deskripsi Singkat Seksi
              </label>
              <input
                type="text"
                required
                value={featuresSubtitle}
                onChange={(e) => setFeaturesSubtitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#f3d7df] bg-[#fff7f9] text-sm text-[#2e1c24] focus:outline-none focus:ring-2 focus:ring-[#e05d82]"
              />
            </div>
          </div>

          {/* Grid Box Editors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuresList.map((box, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#fff7f9] border border-[#f3d7df] space-y-3 relative flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#fce7ed]">
                    <span className="text-xs font-bold text-[#e05d82] flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Box #{idx + 1}</span>
                    </span>
                    {featuresList.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteFeatureBox(idx)}
                        className="p-1 rounded-lg text-rose-500 hover:bg-rose-100 transition-colors"
                        title="Hapus Box Ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Pilih Ikon */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#2e1c24] mb-1">
                      Pilih Ikon / Logo
                    </label>
                    <select
                      value={AVAILABLE_ICONS.some((ic) => ic.id === box.icon) ? box.icon : 'custom'}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val !== 'custom') {
                          updateFeatureItem(idx, 'icon', val);
                        }
                      }}
                      className="w-full px-2.5 py-1.5 rounded-xl border border-[#f3d7df] bg-white text-xs text-[#2e1c24] focus:outline-none focus:ring-2 focus:ring-[#e05d82]"
                    >
                      {AVAILABLE_ICONS.map((ic) => (
                        <option key={ic.id} value={ic.id}>
                          {ic.label}
                        </option>
                      ))}
                      <option value="custom">+ URL Logo Gambar Kustom...</option>
                    </select>

                    {/* Input URL Kustom jika di luar daftar */}
                    {(!AVAILABLE_ICONS.some((ic) => ic.id === box.icon) ||
                      box.icon.startsWith('http') ||
                      box.icon.startsWith('/')) && (
                      <input
                        type="text"
                        placeholder="/images/products/avatar.jpg"
                        value={box.icon}
                        onChange={(e) => updateFeatureItem(idx, 'icon', e.target.value)}
                        className="w-full mt-1.5 px-2.5 py-1 rounded-lg border border-[#f3d7df] bg-white text-xs text-[#2e1c24]"
                      />
                    )}
                  </div>

                  {/* Judul Box */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#2e1c24] mb-1">
                      Judul Box
                    </label>
                    <input
                      type="text"
                      required
                      value={box.title}
                      onChange={(e) => updateFeatureItem(idx, 'title', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-xl border border-[#f3d7df] bg-white text-xs text-[#2e1c24] font-semibold focus:outline-none focus:ring-2 focus:ring-[#e05d82]"
                    />
                  </div>

                  {/* Deskripsi Box */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#2e1c24] mb-1">
                      Deskripsi Box
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={box.desc}
                      onChange={(e) => updateFeatureItem(idx, 'desc', e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-xl border border-[#f3d7df] bg-white text-xs text-[#5e414d] focus:outline-none focus:ring-2 focus:ring-[#e05d82]"
                    />
                  </div>

                  {/* Teks Link Bawah */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#2e1c24] mb-1">
                      Teks Link Bawah
                    </label>
                    <input
                      type="text"
                      value={box.linkText || 'Standar Pengrajin Magetan'}
                      onChange={(e) => updateFeatureItem(idx, 'linkText', e.target.value)}
                      className="w-full px-2.5 py-1 rounded-xl border border-[#f3d7df] bg-white text-[10px] text-[#755562] focus:outline-none focus:ring-2 focus:ring-[#e05d82]"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={savingFeatures}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#e05d82] text-white text-xs font-bold hover:bg-[#c8476c] transition-colors shadow-md shadow-[#e05d82]/20 flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
            >
              {savingFeatures ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>Simpan {featuresList.length} Box Standar Mutu Kerajinan</span>
            </button>
          </div>
        </form>
      </div>

      {/* 3. Kelola Headline & Tagline Beranda */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#f3d7df] shadow-xs">
        <h2 className="text-base font-serif font-bold text-[#2e1c24] mb-1">
          3. Headline & Tagline Utama Beranda (tagline_beranda)
        </h2>
        <p className="text-xs text-[#755562] mb-6">
          Tabel Supabase:{' '}
          <code className="bg-[#fde8ee] px-1.5 py-0.5 rounded text-[#e05d82]">
            site_content (tagline_beranda)
          </code>{' '}
          • Ubah kalimat promosi utama yang menyapa pengunjung di bawah navbar
        </p>

        <form onSubmit={handleSaveTagline} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#2e1c24] mb-1.5">
              Judul Utama Hero (Headline)
            </label>
            <input
              type="text"
              value={siteContent['tagline_beranda']?.title || ''}
              onChange={(e) =>
                setSiteContent({
                  ...siteContent,
                  tagline_beranda: {
                    ...siteContent['tagline_beranda'],
                    section_key: 'tagline_beranda',
                    title: e.target.value,
                    content: siteContent['tagline_beranda']?.content || '',
                  },
                })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-[#f3d7df] bg-[#fff7f9] text-sm text-[#2e1c24] focus:outline-none focus:ring-2 focus:ring-[#e05d82]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2e1c24] mb-1.5">
              Deskripsi Singkat Hero
            </label>
            <textarea
              rows={3}
              value={siteContent['tagline_beranda']?.content || ''}
              onChange={(e) =>
                setSiteContent({
                  ...siteContent,
                  tagline_beranda: {
                    ...siteContent['tagline_beranda'],
                    section_key: 'tagline_beranda',
                    title: siteContent['tagline_beranda']?.title || '',
                    content: e.target.value,
                  },
                })
              }
              className="w-full px-4 py-2.5 rounded-xl border border-[#f3d7df] bg-[#fff7f9] text-sm text-[#2e1c24] focus:outline-none focus:ring-2 focus:ring-[#e05d82]"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#e05d82] text-white text-xs font-bold hover:bg-[#c8476c] transition-colors shadow-md shadow-[#e05d82]/20 flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Simpan Headline Hero</span>
            </button>
          </div>
        </form>
      </div>

      {/* Modal Edit / Tambah Banner */}
      {editingBanner && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-4 sm:p-8 shadow-2xl border border-[#f3d7df] my-auto sm:my-8 max-h-[92vh] overflow-y-auto animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-[#f3d7df] mb-5">
              <h3 className="font-serif font-bold text-base sm:text-lg text-[#2e1c24]">
                {isNewBanner ? 'Tambah Banner Baru' : 'Edit Banner Slider'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingBanner(null)}
                className="w-10 h-10 rounded-full bg-[#fde8ee] text-[#755562] hover:bg-[#e05d82] hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                aria-label="Tutup Modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveBannerModal} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#2e1c24] mb-1">Judul Banner</label>
                <input
                  type="text"
                  required
                  value={editingBanner.title}
                  onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                  placeholder="e.g. CraftByHanifa Studio Workshop"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#f3d7df] bg-[#fff7f9] text-sm text-[#2e1c24]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#2e1c24] mb-1">Subjudul Banner</label>
                <input
                  type="text"
                  required
                  value={editingBanner.subtitle}
                  onChange={(e) => setEditingBanner({ ...editingBanner, subtitle: e.target.value })}
                  placeholder="e.g. Kerajinan Lilin Aromaterapi & Souvenir Magetan"
                  className="w-full px-3.5 py-2 rounded-xl border border-[#f3d7df] bg-[#fff7f9] text-sm text-[#2e1c24]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#2e1c24] mb-1">
                  Foto Banner (Storage Bucket: banners)
                </label>
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                  <input
                    type="text"
                    required
                    value={editingBanner.image_url}
                    onChange={(e) =>
                      setEditingBanner((prev) =>
                        prev ? { ...prev, image_url: e.target.value } : null
                      )
                    }
                    placeholder="https://... atau /images/products/..."
                    className="flex-1 min-w-0 px-3.5 py-2 rounded-xl border border-[#f3d7df] bg-[#fff7f9] text-sm text-[#2e1c24] focus:outline-none focus:ring-2 focus:ring-[#e05d82]"
                  />
                  <label
                    className={`px-3 sm:px-4 py-2 rounded-xl font-bold cursor-pointer transition-colors flex items-center gap-1.5 shrink-0 min-h-[40px] ${
                      uploading
                        ? 'bg-zinc-200 text-zinc-500 cursor-not-allowed pointer-events-none'
                        : 'bg-[#e05d82]/10 text-[#e05d82] hover:bg-[#e05d82]/20'
                    }`}
                  >
                    {uploading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                    <span>{uploading ? 'Mengunggah...' : 'Upload'}</span>
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
                        if (file) {
                          handleUploadFile(file, (url) => {
                            setEditingBanner((prev) => (prev ? { ...prev, image_url: url } : null));
                          });
                        }
                      }}
                    />
                  </label>
                </div>

                {/* Preview Thumbnail Foto Banner */}
                {editingBanner.image_url && (
                  <div className="relative aspect-[16/9] w-full max-w-xs rounded-xl border border-[#f3d7df] overflow-hidden bg-[#fff7f9] shadow-2xs mt-2">
                    <Image
                      src={editingBanner.image_url}
                      alt="Preview Banner Slider"
                      fill
                      className="object-cover"
                    />
                    <span className="absolute bottom-1.5 left-1.5 text-[10px] font-bold bg-black/65 text-white rounded-md px-2 py-0.5 backdrop-blur-xs">
                      Preview Slider 16:9
                    </span>
                  </div>
                )}
                <p className="text-[11px] text-[#755562] mt-1">
                  Format gambar JPG, PNG, WEBP (maks. 10MB). Tersimpan otomatis ke Supabase Storage.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block font-bold text-[#2e1c24] mb-1">Urutan Tampil</label>
                  <input
                    type="number"
                    value={editingBanner.sort_order}
                    onChange={(e) =>
                      setEditingBanner({ ...editingBanner, sort_order: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-[#f3d7df] bg-[#fff7f9] text-sm text-[#2e1c24]"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1 sm:pt-6">
                  <input
                    type="checkbox"
                    id="bannerActiveCheck"
                    checked={editingBanner.is_active}
                    onChange={(e) =>
                      setEditingBanner({ ...editingBanner, is_active: e.target.checked })
                    }
                    className="w-4 h-4 accent-[#e05d82] cursor-pointer"
                  />
                  <label
                    htmlFor="bannerActiveCheck"
                    className="font-bold text-[#2e1c24] cursor-pointer"
                  >
                    Aktif Tampil
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-[#f3d7df] flex flex-col-reverse sm:flex-row justify-end gap-2.5 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setEditingBanner(null)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-[#f3d7df] text-xs font-bold text-[#755562] hover:bg-[#fff0f4] cursor-pointer min-h-[44px] flex items-center justify-center"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#e05d82] text-white text-xs font-bold hover:bg-[#c8476c] shadow-md shadow-[#e05d82]/20 flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
                >
                  {saving || uploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  <span>Simpan Banner</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
