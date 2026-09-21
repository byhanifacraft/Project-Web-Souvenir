'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  LayoutTemplate,
  Package,
  Images,
  Sparkles,
  Info,
  Phone,
  ArrowRight,
  Database,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import { FullStoreData } from '@/types/store';
import { formatRupiah } from '@/lib/utils';

export default function AdminDashboardPage() {
  const [data, setData] = useState<FullStoreData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/store', { cache: 'no-store' })
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="py-24 text-center">
        <Loader2 className="w-8 h-8 text-[#e05d82] animate-spin mx-auto mb-3" />
        <p className="text-xs text-[#755562] font-semibold">Memuat ringkasan dashboard...</p>
      </div>
    );
  }

  const productsCount = data?.products?.length || 0;
  const activeProductsCount = data?.products?.filter((p) => p.is_active !== false).length || 0;
  const bannersCount = data?.banners?.length || 0;
  const galleryCount = data?.galleryImages?.length || 0;
  const isSupabase = data?.source === 'supabase';

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#2e1c24]">
            Selamat Datang, Admin CraftByHanifa
          </h1>
          <p className="text-xs text-[#755562] mt-1">
            Ringkasan status konten website company profile & toko souvenir lilin Anda.
          </p>
        </div>

        <Link
          href="/"
          target="_blank"
          className="px-4 py-2 rounded-xl bg-white border border-[#f3d7df] text-xs font-bold text-[#e05d82] hover:bg-[#fff0f4] flex items-center gap-1.5 shadow-2xs self-start sm:self-auto"
        >
          <span>Lihat Web Publik</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-[#f3d7df] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#fde8ee] text-[#e05d82] flex items-center justify-center shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-[#755562] font-semibold block">Total Produk</span>
            <span className="text-xl font-bold text-[#2e1c24] font-serif">
              {productsCount}{' '}
              <span className="text-xs font-normal text-[#9d7c8b]">
                ({activeProductsCount} aktif)
              </span>
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#f3d7df] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#fff0f4] text-[#ff7e67] flex items-center justify-center shrink-0">
            <LayoutTemplate className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-[#755562] font-semibold block">Banner Hero</span>
            <span className="text-xl font-bold text-[#2e1c24] font-serif">
              {bannersCount} <span className="text-xs font-normal text-[#9d7c8b]">slides</span>
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#f3d7df] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#f0f9ff] text-[#0284c7] flex items-center justify-center shrink-0">
            <Images className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-[#755562] font-semibold block">Foto Galeri</span>
            <span className="text-xl font-bold text-[#2e1c24] font-serif">
              {galleryCount} <span className="text-xs font-normal text-[#9d7c8b]">foto</span>
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-[#f3d7df] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#ecfdf5] text-[#059669] flex items-center justify-center shrink-0">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-[#755562] font-semibold block">Status Database</span>
            <span className="text-sm font-bold text-emerald-700 block">
              {isSupabase ? 'Supabase Cloud' : 'Local Storage'}
            </span>
          </div>
        </div>
      </div>

      {/* Module Navigation Grid */}
      <div>
        <h2 className="text-base font-serif font-bold text-[#2e1c24] mb-4">
          Modul Pengelolaan Konten (CMS)
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <Link
            href="/admin/beranda"
            className="bg-white p-6 rounded-3xl border border-[#f3d7df] hover:border-[#e05d82]/40 hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#fde8ee] text-[#e05d82] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <LayoutTemplate className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-sm text-[#2e1c24] mb-1 group-hover:text-[#e05d82] transition-colors">
                1. Kelola Beranda & Banner
              </h3>
              <p className="text-xs text-[#755562] leading-relaxed">
                Edit banner hero slider, ganti gambar banner, ubah judul headline, dan tagline
                beranda.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#fce7ed] flex items-center justify-between text-xs font-bold text-[#e05d82]">
              <span>Buka Modul</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/admin/produk"
            className="bg-white p-6 rounded-3xl border border-[#f3d7df] hover:border-[#e05d82]/40 hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#fde8ee] text-[#e05d82] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Package className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-sm text-[#2e1c24] mb-1 group-hover:text-[#e05d82] transition-colors">
                2. Kelola Produk Lilin ({productsCount})
              </h3>
              <p className="text-xs text-[#755562] leading-relaxed">
                Tambah produk baru, sesuaikan harga, atur stok, upload foto, dan
                sembunyikan/tampilkan produk.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#fce7ed] flex items-center justify-between text-xs font-bold text-[#e05d82]">
              <span>Buka Modul</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/admin/workshop"
            className="bg-white p-6 rounded-3xl border border-[#f3d7df] hover:border-[#e05d82]/40 hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#fde8ee] text-[#e05d82] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-sm text-[#2e1c24] mb-1 group-hover:text-[#e05d82] transition-colors">
                3. Kelola Workshop Studio
              </h3>
              <p className="text-xs text-[#755562] leading-relaxed">
                Edit bebas pilihan paket workshop, materi kurikulum, tahapan alur reservasi, dan
                foto dokumentasi kegiatan studio.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#fce7ed] flex items-center justify-between text-xs font-bold text-[#e05d82]">
              <span>Buka Modul</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/admin/tentang-kami"
            className="bg-white p-6 rounded-3xl border border-[#f3d7df] hover:border-[#e05d82]/40 hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#fde8ee] text-[#e05d82] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Info className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-sm text-[#2e1c24] mb-1 group-hover:text-[#e05d82] transition-colors">
                4. Tentang Kami & Visi Misi
              </h3>
              <p className="text-xs text-[#755562] leading-relaxed">
                Edit narasi kisah pendirian studio, dedikasi soy wax, dan rumusan visi & misi
                perusahaan.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#fce7ed] flex items-center justify-between text-xs font-bold text-[#e05d82]">
              <span>Buka Modul</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/admin/kontak"
            className="bg-white p-6 rounded-3xl border border-[#f3d7df] hover:border-[#e05d82]/40 hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#fde8ee] text-[#e05d82] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-sm text-[#2e1c24] mb-1 group-hover:text-[#e05d82] transition-colors">
                5. Kontak & Sosial Media
              </h3>
              <p className="text-xs text-[#755562] leading-relaxed">
                Perbarui alamat fisik studio, nomor WhatsApp konsultasi, email, link Shopee,
                Instagram, dan Maps.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#fce7ed] flex items-center justify-between text-xs font-bold text-[#e05d82]">
              <span>Buka Modul</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Products List */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#f3d7df] shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-serif font-bold text-[#2e1c24]">Pratinjau Produk Aktif</h2>
          <Link
            href="/admin/produk"
            className="text-xs font-bold text-[#e05d82] hover:underline flex items-center gap-1"
          >
            <span>Kelola Semua Produk &rarr;</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {(data?.products || []).slice(0, 3).map((p) => (
            <div
              key={p.id}
              className="p-3.5 rounded-2xl bg-[#fff7f9] border border-[#f3d7df] flex items-center gap-3"
            >
              <div className="w-12 h-12 rounded-xl bg-[#fde8ee] relative overflow-hidden shrink-0">
                <Image src={p.image_url} alt={p.name} fill sizes="48px" className="object-cover" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-[#2e1c24] truncate">{p.name}</h4>
                <p className="text-[11px] text-[#e05d82] font-bold mt-0.5">
                  {formatRupiah(p.price)}
                </p>
                <span className="text-[10px] text-[#755562]">Stok: {p.stock ?? 100}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
