'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { WorkshopNewsItem, WorkshopNewsStatus } from '@/types/store';
import { compressImage } from '@/lib/imageCompressor';
import { Megaphone, X, Upload, Loader2, Save } from 'lucide-react';

interface WorkshopNewsEditorModalProps {
  initialData: WorkshopNewsItem;
  isAdding: boolean;
  onClose: () => void;
  onSave: (newsItem: WorkshopNewsItem) => void;
}

export default function WorkshopNewsEditorModal({
  initialData,
  isAdding,
  onClose,
  onSave,
}: WorkshopNewsEditorModalProps) {
  const [formData, setFormData] = useState<WorkshopNewsItem>(initialData);
  const [uploadingNewsPhoto, setUploadingNewsPhoto] = useState(false);

  const handleUploadNewsImage = async (file: File) => {
    try {
      setUploadingNewsPhoto(true);
      const compressed = await compressImage(file, {
        maxWidth: 1600,
        maxHeight: 1600,
        quality: 0.85,
      });
      const data = new FormData();
      data.append('file', compressed);
      data.append('bucket', 'gallery');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });

      const json = await res.json();
      if (res.ok && json.url) {
        setFormData((prev) => ({ ...prev, image_url: json.url }));
      } else {
        alert(json.error || 'Gagal mengunggah foto.');
      }
    } catch {
      alert('Terjadi kesalahan jaringan saat upload foto.');
    } finally {
      setUploadingNewsPhoto(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-4 sm:p-8 shadow-2xl border border-[#ebdcd5] my-auto max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-zinc-100 mb-4 sm:mb-6">
          <h3 className="font-serif font-bold text-base sm:text-lg text-zinc-900 pr-2 flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-[#e05d82]" />
            <span>
              {isAdding ? 'Tambah Berita & Event Baru' : `Edit Berita: ${formData.title}`}
            </span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 flex items-center justify-center cursor-pointer transition-colors shrink-0"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-zinc-700 mb-1">Judul Berita / Event:</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#ebdcd5] focus:outline-hidden focus:border-[#c45a76] font-semibold"
              placeholder="Contoh: Coming Soon: Kelas Spesial Pembuatan Lilin Aromaterapi"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-zinc-700 mb-1">Status Acara:</label>
              <select
                value={formData.status}
                onChange={(e) => {
                  const val = e.target.value as WorkshopNewsStatus;
                  const labelMap: Record<WorkshopNewsStatus, string> = {
                    coming_soon: 'Segera Hadir',
                    open_registration: 'Pendaftaran Dibuka',
                    completed: 'Dokumentasi',
                    special_event: 'Event Spesial',
                  };
                  setFormData({
                    ...formData,
                    status: val,
                    status_label: labelMap[val] || 'Info Acara',
                  });
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#ebdcd5] focus:outline-hidden focus:border-[#c45a76] bg-white font-medium"
              >
                <option value="coming_soon">⏳ Coming Soon (Segera Hadir)</option>
                <option value="open_registration">✅ Pendaftaran Dibuka (Open Registration)</option>
                <option value="completed">📸 Dokumentasi Acara Selesai</option>
                <option value="special_event">✨ Event Spesial / Kolaborasi</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-zinc-700 mb-1">Label Status Kustom:</label>
              <input
                type="text"
                value={formData.status_label}
                onChange={(e) => setFormData({ ...formData, status_label: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#ebdcd5] focus:outline-hidden focus:border-[#c45a76]"
                placeholder="Contoh: Segera Hadir, Slot Terbatas"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-zinc-700 mb-1">
                Jadwal / Waktu Pelaksanaan:
              </label>
              <input
                type="text"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#ebdcd5] focus:outline-hidden focus:border-[#c45a76]"
                placeholder="Contoh: Minggu, 28 Oktober 2026 • 10.00 WIB"
              />
            </div>

            <div>
              <label className="block font-bold text-zinc-700 mb-1">Lokasi / Venue Studio:</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#ebdcd5] focus:outline-hidden focus:border-[#c45a76]"
                placeholder="Contoh: Studio CraftByHanifa, Magetan"
              />
            </div>
          </div>

          {/* Image upload & preview */}
          <div>
            <label className="block font-bold text-zinc-700 mb-1">
              Foto Banner / Poster Berita:
            </label>
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <div className="relative aspect-[16/9] w-36 bg-zinc-100 rounded-xl overflow-hidden border border-[#ebdcd5] shrink-0">
                <Image
                  src={formData.image_url || '/images/products/studio-workshop.jpg'}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-2 flex-1 w-full">
                <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#c45a76] hover:bg-[#a8445e] text-white text-xs font-bold cursor-pointer transition-colors shadow-xs">
                  {uploadingNewsPhoto ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Upload className="w-3.5 h-3.5" />
                  )}
                  <span>{uploadingNewsPhoto ? 'Mengunggah...' : 'Upload Foto Baru'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingNewsPhoto}
                    onClick={(e) => {
                      (e.currentTarget as HTMLInputElement).value = '';
                    }}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleUploadNewsImage(e.target.files[0]);
                      }
                    }}
                  />
                </label>
                <input
                  type="text"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-[#ebdcd5] text-[11px] text-zinc-600 focus:outline-hidden focus:border-[#c45a76]"
                  placeholder="Atau masukkan URL gambar..."
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-bold text-zinc-700 mb-1">
              Ringkasan Berita (Tampil di Slider & Cuplikan):
            </label>
            <textarea
              rows={2}
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#ebdcd5] focus:outline-hidden focus:border-[#c45a76] leading-relaxed"
              placeholder="Ringkasan singkat 1-2 kalimat..."
            />
          </div>

          <div>
            <label className="block font-bold text-zinc-700 mb-1">
              Isi Lengkap Berita & Pengumuman:
            </label>
            <textarea
              rows={6}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#ebdcd5] focus:outline-hidden focus:border-[#c45a76] leading-relaxed"
              placeholder="Tuliskan isi berita selengkapnya, penjelasan materi, benefit, dsb (dukung multi paragraf)..."
            />
          </div>

          <div>
            <label className="block font-bold text-zinc-700 mb-1">
              Template Pesan WhatsApp Otomatis:
            </label>
            <textarea
              rows={2}
              value={formData.wa_message || ''}
              onChange={(e) => setFormData({ ...formData, wa_message: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#ebdcd5] focus:outline-hidden focus:border-[#c45a76]"
              placeholder="Halo Kak Hanifa, saya tertarik mendaftar workshop ini..."
            />
          </div>

          <div className="flex items-center gap-6 pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4 rounded text-[#c45a76] focus:ring-[#c45a76] accent-[#c45a76]"
              />
              <span className="font-bold text-zinc-700">Tampilkan di Website (Aktif)</span>
            </label>
          </div>
        </div>

        <div className="pt-6 mt-6 border-t border-zinc-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-zinc-200 text-zinc-600 font-semibold hover:bg-zinc-50 cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => onSave(formData)}
            className="px-6 py-2.5 rounded-xl bg-[#c45a76] hover:bg-[#a8445e] text-white font-bold transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Berita</span>
          </button>
        </div>
      </div>
    </div>
  );
}
