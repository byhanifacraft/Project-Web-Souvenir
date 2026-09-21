'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { WorkshopPackage, normalizeTakeHomeItem } from '@/types/workshop';
import { compressImage } from '@/lib/imageCompressor';
import { X, Plus, Trash2, Upload, Loader2, Save } from 'lucide-react';

interface PackageFormModalProps {
  initialData: WorkshopPackage;
  isAdding: boolean;
  onClose: () => void;
  onSave: (pkg: WorkshopPackage) => void;
}

export default function PackageFormModal({
  initialData,
  isAdding,
  onClose,
  onSave,
}: PackageFormModalProps) {
  const [formData, setFormData] = useState<WorkshopPackage>(initialData);
  const [uploadingTakeHomeIndex, setUploadingTakeHomeIndex] = useState<number | null>(null);

  const handleUploadTakeHomePhoto = async (index: number, file: File) => {
    try {
      setUploadingTakeHomeIndex(index);
      const compressed = await compressImage(file, {
        maxWidth: 1200,
        maxHeight: 1200,
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
        const current = formData.takeHome.map(normalizeTakeHomeItem);
        current[index] = {
          ...current[index],
          image_url: json.url,
        };
        setFormData({ ...formData, takeHome: current });
      } else {
        alert(json.error || 'Gagal mengunggah foto karya');
      }
    } catch {
      alert('Terjadi kesalahan jaringan saat upload foto');
    } finally {
      setUploadingTakeHomeIndex(null);
    }
  };

  const handleUpdateTakeHomeItem = (
    index: number,
    field: 'title' | 'description' | 'image_url',
    val: string
  ) => {
    const current = formData.takeHome.map(normalizeTakeHomeItem);
    current[index] = {
      ...current[index],
      [field]: val,
    };
    setFormData({ ...formData, takeHome: current });
  };

  const handleRemoveTakeHomeItem = (index: number) => {
    const current = formData.takeHome.map(normalizeTakeHomeItem);
    current.splice(index, 1);
    setFormData({ ...formData, takeHome: current });
  };

  const handleAddTakeHomeItem = () => {
    const current = formData.takeHome.map(normalizeTakeHomeItem);
    setFormData({
      ...formData,
      takeHome: [
        ...current,
        {
          title: 'Karya Bawa Pulang Baru',
          description: '',
          image_url: '',
        },
      ],
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-4 sm:p-8 shadow-2xl border border-[#ebdcd5] my-auto max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-zinc-100 mb-4 sm:mb-6">
          <h3 className="font-serif font-bold text-base sm:text-lg text-zinc-900 pr-2">
            {isAdding ? 'Tambah Paket Workshop Baru' : `Edit ${formData.name}`}
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
            <label className="block font-bold text-zinc-700 mb-1">Nama Paket:</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#ebdcd5] focus:outline-hidden focus:border-[#c45a76] font-semibold"
              placeholder="Contoh: Paket Basic (Intro to Candle Making)"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-zinc-700 mb-1">Harga Tampil:</label>
              <input
                type="text"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#ebdcd5] focus:outline-hidden focus:border-[#c45a76]"
                placeholder="Rp 150.000"
              />
            </div>
            <div>
              <label className="block font-bold text-zinc-700 mb-1">Durasi Sesi:</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#ebdcd5] focus:outline-hidden focus:border-[#c45a76]"
                placeholder="1.5 - 2 Jam"
              />
            </div>
            <div>
              <label className="block font-bold text-zinc-700 mb-1">Kapasitas Peserta:</label>
              <input
                type="text"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#ebdcd5] focus:outline-hidden focus:border-[#c45a76]"
                placeholder="1 - 8 Orang"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-zinc-700 mb-1">Badge Atas (Opsional):</label>
              <input
                type="text"
                value={formData.badge || ''}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#ebdcd5] focus:outline-hidden focus:border-[#c45a76]"
                placeholder="Contoh: Paling Populer, Custom Sesi"
              />
            </div>
            <div>
              <label className="block font-bold text-zinc-700 mb-1">Teks Tombol Reservasi:</label>
              <input
                type="text"
                value={formData.buttonLabel}
                onChange={(e) => setFormData({ ...formData, buttonLabel: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#ebdcd5] focus:outline-hidden focus:border-[#c45a76]"
                placeholder="Contoh: Daftar Paket Basic"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-zinc-700 mb-1">Tagline Ringkas:</label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#ebdcd5] focus:outline-hidden focus:border-[#c45a76]"
              placeholder="Sempurna untuk pemula, self-healing, atau me-time akhir pekan"
            />
          </div>

          <div>
            <label className="block font-bold text-zinc-700 mb-1">
              Materi & Fasilitas (1 Poin per Baris):
            </label>
            <textarea
              rows={5}
              value={formData.features.join('\n')}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  features: e.target.value.split('\n').filter((f) => f.trim().length > 0),
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#ebdcd5] focus:outline-hidden focus:border-[#c45a76] leading-relaxed"
              placeholder="100% natural soy wax nabati murni&#10;Pilihan jenis sumbu&#10;Eksplorasi 6 aroma signature..."
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <label className="block font-bold text-zinc-700">
                  Karya Dibawa Pulang (Dengan Foto Visual):
                </label>
                <p className="text-[11px] text-zinc-500">
                  Tambahkan foto visual dan deskripsi singkat karya yang akan dibawa pulang peserta.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddTakeHomeItem}
                className="px-3 py-1.5 rounded-lg bg-[#fde8ee] hover:bg-[#fbd1dd] text-[#c45a76] text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Karya</span>
              </button>
            </div>

            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {formData.takeHome.map((rawTh, thIdx) => {
                const th = normalizeTakeHomeItem(rawTh);
                const isUploadingThis = uploadingTakeHomeIndex === thIdx;

                return (
                  <div
                    key={thIdx}
                    className="p-3 rounded-2xl border border-[#ebdcd5] bg-[#fffaf8] flex items-start gap-3 relative hover:border-[#c45a76]/40 transition-colors"
                  >
                    {/* Thumbnail / Upload Trigger */}
                    {th.image_url ? (
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-[#ebdcd5] bg-white shrink-0 group">
                        <Image src={th.image_url} alt="" fill className="object-cover" />
                        <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer text-white transition-opacity text-[10px] font-bold">
                          {isUploadingThis ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <>
                              <Upload className="w-3.5 h-3.5" />
                              <span>Ganti</span>
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={isUploadingThis}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleUploadTakeHomePhoto(thIdx, file);
                            }}
                          />
                        </label>
                      </div>
                    ) : (
                      <label className="w-14 h-14 rounded-xl border-2 border-dashed border-[#ebdcd5] hover:border-[#c45a76] bg-white flex flex-col items-center justify-center shrink-0 cursor-pointer text-zinc-400 hover:text-[#c45a76] transition-colors">
                        {isUploadingThis ? (
                          <Loader2 className="w-4 h-4 animate-spin text-[#c45a76]" />
                        ) : (
                          <>
                            <Upload className="w-4 h-4" />
                            <span className="text-[9px] font-bold mt-0.5">+ Foto</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={isUploadingThis}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleUploadTakeHomePhoto(thIdx, file);
                          }}
                        />
                      </label>
                    )}

                    {/* Title & Description Inputs */}
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <input
                        type="text"
                        value={th.title}
                        onChange={(e) => handleUpdateTakeHomeItem(thIdx, 'title', e.target.value)}
                        placeholder="Nama karya (misal: 1 Jar Lilin Aromaterapi Soy Wax)"
                        className="w-full px-3 py-1.5 rounded-lg border border-[#ebdcd5] text-xs font-semibold focus:outline-hidden focus:border-[#c45a76] bg-white"
                      />
                      <input
                        type="text"
                        value={th.description || ''}
                        onChange={(e) =>
                          handleUpdateTakeHomeItem(thIdx, 'description', e.target.value)
                        }
                        placeholder="Keterangan singkat (opsional, misal: Pilihan 6 aroma signature)"
                        className="w-full px-3 py-1 rounded-lg border border-[#ebdcd5] text-[11px] text-zinc-600 focus:outline-hidden focus:border-[#c45a76] bg-white"
                      />
                    </div>

                    {/* Delete Item */}
                    <button
                      type="button"
                      onClick={() => handleRemoveTakeHomeItem(thIdx)}
                      className="w-7 h-7 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center shrink-0 transition-colors cursor-pointer mt-1"
                      title="Hapus item karya ini"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}

              {formData.takeHome.length === 0 && (
                <div className="p-4 rounded-xl border border-dashed border-zinc-200 text-center text-xs text-zinc-400">
                  Belum ada karya bawa pulang. Klik tombol &quot;+ Tambah Karya&quot; di atas.
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block font-bold text-zinc-700 mb-1">
              Template Pesan WhatsApp Otomatis:
            </label>
            <textarea
              rows={2}
              value={formData.waMessage}
              onChange={(e) => setFormData({ ...formData, waMessage: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#ebdcd5] focus:outline-hidden focus:border-[#c45a76]"
              placeholder="Halo Kak Hanifa, saya ingin mendaftar..."
            />
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
            <span>Simpan Paket</span>
          </button>
        </div>
      </div>
    </div>
  );
}
