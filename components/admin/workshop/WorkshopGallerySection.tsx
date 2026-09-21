'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { GalleryImageItem } from '@/types/store';
import { compressImage } from '@/lib/imageCompressor';
import { Upload, Loader2, Edit2, Trash2, Images, X, Save } from 'lucide-react';

interface WorkshopGallerySectionProps {
  images: GalleryImageItem[];
  onChange: (images: GalleryImageItem[]) => void;
  showNotification: (msg: string) => void;
}

export default function WorkshopGallerySection({
  images,
  onChange,
  showNotification,
}: WorkshopGallerySectionProps) {
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [newCaption, setNewCaption] = useState('');
  const [newCategoryLabel, setNewCategoryLabel] = useState('Workshop Studio');
  const [editingItem, setEditingItem] = useState<GalleryImageItem | null>(null);

  const handleUploadPhoto = async (file: File) => {
    try {
      setUploadingGallery(true);
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
        const newItem: GalleryImageItem = {
          id: `gal-${Date.now()}`,
          image_url: json.url,
          caption: newCaption || 'Suasana kegiatan workshop studio CraftByHanifa',
          sort_order: images.length + 1,
          category: 'workshop',
          category_label: newCategoryLabel || 'Workshop Studio',
        };
        const updated = [...images, newItem];
        onChange(updated);
        setNewCaption('');
        showNotification('Foto dokumentasi studio berhasil diunggah!');
      } else {
        alert(json.error || 'Gagal mengunggah foto.');
      }
    } catch {
      alert('Terjadi kesalahan jaringan saat upload foto.');
    } finally {
      setUploadingGallery(false);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Hapus foto ini dari galeri dokumentasi workshop?')) {
      onChange(images.filter((g) => g.id !== id));
    }
  };

  const handleSaveEdit = () => {
    if (!editingItem) return;
    const updated = images.map((g) => (g.id === editingItem.id ? editingItem : g));
    onChange(updated);
    setEditingItem(null);
    showNotification('Keterangan foto dokumentasi berhasil diperbarui!');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-[#ebdcd5] shadow-2xs space-y-4">
        <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
          <Images className="w-5 h-5 text-[#c45a76]" />
          <span>Upload Foto Dokumentasi Studio Baru</span>
        </h2>
        <p className="text-xs text-zinc-500">
          Upload foto kegiatan workshop lilin aromaterapi, hasil karya, atau meja kerja studio
          (disimpan ke Supabase storage bucket <code>gallery</code>).
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1">
              Caption / Keterangan Foto:
            </label>
            <input
              type="text"
              value={newCaption}
              onChange={(e) => setNewCaption(e.target.value)}
              placeholder="Contoh: Sesi penuangan lilin soy wax oleh peserta"
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#ebdcd5] focus:outline-hidden focus:border-[#c45a76]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1">Label Tag Foto:</label>
            <input
              type="text"
              value={newCategoryLabel}
              onChange={(e) => setNewCategoryLabel(e.target.value)}
              placeholder="Contoh: Workshop Studio, Hasil Karya, Group Session"
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#ebdcd5] focus:outline-hidden focus:border-[#c45a76]"
            />
          </div>
        </div>

        <div>
          <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#c45a76] hover:bg-[#a8445e] text-white text-xs font-bold cursor-pointer transition-colors shadow-xs">
            {uploadingGallery ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            <span>{uploadingGallery ? 'Mengunggah ke Supabase...' : 'Pilih File Gambar'}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploadingGallery}
              onClick={(e) => {
                (e.currentTarget as HTMLInputElement).value = '';
              }}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleUploadPhoto(e.target.files[0]);
                }
              }}
            />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl overflow-hidden border border-[#ebdcd5] shadow-2xs group relative flex flex-col justify-between"
          >
            <div className="relative aspect-[4/3] w-full bg-zinc-100">
              <Image
                src={item.image_url}
                alt={item.caption || 'Foto'}
                fill
                className="object-cover"
              />
              <div className="absolute top-2 right-2 flex items-center gap-1.5 z-10">
                <button
                  type="button"
                  onClick={() => setEditingItem({ ...item })}
                  className="w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-[#c45a76] transition-colors cursor-pointer shadow-xs"
                  title="Edit keterangan foto"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-rose-600 transition-colors cursor-pointer shadow-xs"
                  title="Hapus foto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="p-3">
              <span className="inline-block text-[10px] font-bold text-[#c45a76] bg-[#fde8ee] px-2 py-0.5 rounded-full mb-1">
                {item.category_label || 'Workshop'}
              </span>
              <p className="text-xs text-zinc-700 line-clamp-2 leading-relaxed font-medium">
                {item.caption || 'Tanpa keterangan'}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL EDIT FOTO DOKUMENTASI */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-[#ebdcd5] my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100 mb-4">
              <h3 className="font-serif font-bold text-base text-zinc-900 flex items-center gap-2">
                <Images className="w-4 h-4 text-[#e05d82]" />
                <span>Edit Keterangan Foto Dokumentasi</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 flex items-center justify-center cursor-pointer transition-colors"
                aria-label="Tutup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-zinc-100 mb-3 border border-[#ebdcd5]">
                <Image
                  src={editingItem.image_url}
                  alt={editingItem.caption || 'Foto'}
                  fill
                  className="object-cover"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">
                  Caption / Keterangan Foto:
                </label>
                <textarea
                  rows={3}
                  value={editingItem.caption || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, caption: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#ebdcd5] focus:outline-hidden focus:border-[#c45a76]"
                  placeholder="Keterangan foto suasana atau hasil karya studio..."
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Label Tag Kategori:</label>
                <input
                  type="text"
                  value={editingItem.category_label || ''}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      category_label: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-[#ebdcd5] focus:outline-hidden focus:border-[#c45a76]"
                  placeholder="Contoh: Suasana Studio, Hasil Karya Peserta"
                />
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-zinc-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 rounded-xl border border-zinc-200 text-zinc-600 font-semibold hover:bg-zinc-50 cursor-pointer text-xs"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="px-5 py-2 rounded-xl bg-[#c45a76] hover:bg-[#a8445e] text-white font-bold transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer text-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Perubahan</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
