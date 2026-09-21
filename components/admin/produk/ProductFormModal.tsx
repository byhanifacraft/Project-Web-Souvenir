'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ProductItem } from '@/types/store';
import ProductVariantManager from './ProductVariantManager';
import { X, Trash2, Images, ImagePlus, Loader2, Tag, Star } from 'lucide-react';

interface ProductFormModalProps {
  product: ProductItem;
  isNew: boolean;
  presetCategories: { id: string; label: string }[];
  onClose: () => void;
  onSave: (product: ProductItem) => void;
  onUploadMultipleFiles: (files: FileList | File[]) => void;
  onUploadVariantFile: (variantIndex: number, file: File) => void;
  uploadingImages: boolean;
}

export default function ProductFormModal({
  product: initialProduct,
  isNew,
  presetCategories,
  onClose,
  onSave,
  onUploadMultipleFiles,
  onUploadVariantFile,
  uploadingImages,
}: ProductFormModalProps) {
  const [formData, setFormData] = useState<ProductItem>({ ...initialProduct });
  const [isCustomCategory, setIsCustomCategory] = useState(
    !presetCategories.some((c) => c.id === initialProduct.category)
  );
  const [newManualImageUrl, setNewManualImageUrl] = useState('');
  const [newChoiceInputs, setNewChoiceInputs] = useState<{ [index: number]: string }>({});

  const handleSetCoverImage = (index: number) => {
    const currentImages =
      formData.images && formData.images.length > 0
        ? [...formData.images]
        : formData.image_url
          ? [formData.image_url]
          : [];
    if (index >= currentImages.length) return;
    const selected = currentImages.splice(index, 1)[0];
    const reordered = [selected, ...currentImages];
    setFormData({
      ...formData,
      image_url: selected,
      images: reordered,
    });
  };

  const handleRemoveImage = (index: number) => {
    const currentImages =
      formData.images && formData.images.length > 0
        ? [...formData.images]
        : formData.image_url
          ? [formData.image_url]
          : [];
    currentImages.splice(index, 1);
    setFormData({
      ...formData,
      image_url: currentImages[0] || '',
      images: currentImages,
    });
  };

  const handleAddManualImage = () => {
    if (!newManualImageUrl.trim()) return;
    const currentImages = formData.images || (formData.image_url ? [formData.image_url] : []);
    const updated = [...currentImages, newManualImageUrl.trim()];
    setFormData({
      ...formData,
      image_url: updated[0] || '',
      images: updated,
    });
    setNewManualImageUrl('');
  };

  const handleAddOptionGroup = () => {
    const currentOptions = formData.options || [];
    setFormData({
      ...formData,
      options: [
        ...currentOptions,
        { label: 'Opsi Kustom Baru', choices: ['Pilihan A', 'Pilihan B'] },
      ],
    });
  };

  const handleRemoveOptionGroup = (index: number) => {
    const currentOptions = [...(formData.options || [])];
    currentOptions.splice(index, 1);
    setFormData({ ...formData, options: currentOptions });
  };

  const handleUpdateOptionLabel = (index: number, newLabel: string) => {
    const currentOptions = [...(formData.options || [])];
    currentOptions[index] = { ...currentOptions[index], label: newLabel };
    setFormData({ ...formData, options: currentOptions });
  };

  const handleAddChoice = (optionIndex: number, text: string) => {
    if (!text.trim()) return;
    const currentOptions = [...(formData.options || [])];
    const target = currentOptions[optionIndex];
    if (!target || target.choices.includes(text.trim())) return;
    currentOptions[optionIndex] = {
      ...target,
      choices: [...target.choices, text.trim()],
    };
    setFormData({ ...formData, options: currentOptions });
    setNewChoiceInputs({ ...newChoiceInputs, [optionIndex]: '' });
  };

  const handleRemoveChoice = (optionIndex: number, choiceIndex: number) => {
    const currentOptions = [...(formData.options || [])];
    const target = currentOptions[optionIndex];
    if (!target) return;
    const newChoices = [...target.choices];
    newChoices.splice(choiceIndex, 1);
    currentOptions[optionIndex] = { ...target, choices: newChoices };
    setFormData({ ...formData, options: currentOptions });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const currentImages =
    formData.images && formData.images.length > 0
      ? formData.images
      : formData.image_url
        ? [formData.image_url]
        : [];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-4 sm:p-8 shadow-2xl border border-[#f3d7df] my-auto animate-scaleUp max-h-[92vh] overflow-y-auto">
        {/* Header Modal */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-[#f3d7df] mb-4 sm:mb-6">
          <div className="pr-2 min-w-0">
            <h3 className="font-serif font-bold text-base sm:text-lg text-[#2e1c24] truncate">
              {isNew ? 'Tambah Produk Baru' : `Edit: ${formData.name}`}
            </h3>
            <p className="text-[11px] sm:text-xs text-[#755562] mt-0.5">
              Atur detail produk, foto galeri, diskon coret, dan variasi pilihan custom.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#fde8ee] text-[#755562] hover:bg-[#e05d82] hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          {/* Nama & Kategori */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#2e1c24] mb-1">
                Nama Produk <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-[#f3d7df] bg-[#fff7f9] text-sm text-[#2e1c24] focus:outline-none focus:ring-2 focus:ring-[#e05d82]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-[#2e1c24]">Kategori Produk</label>
                <button
                  type="button"
                  onClick={() => setIsCustomCategory(!isCustomCategory)}
                  className="text-[11px] text-[#e05d82] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Tag className="w-3 h-3" />
                  <span>{isCustomCategory ? 'Pilih dari Preset' : '+ Kategori Kustom'}</span>
                </button>
              </div>

              {!isCustomCategory ? (
                <select
                  value={formData.category || 'candle'}
                  onChange={(e) => {
                    const found = presetCategories.find((c) => c.id === e.target.value);
                    setFormData({
                      ...formData,
                      category: e.target.value,
                      category_label: found?.label || e.target.value,
                    });
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-[#f3d7df] bg-[#fff7f9] text-sm text-[#2e1c24] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#e05d82]"
                >
                  {presetCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  required
                  placeholder="Ketik nama kategori kustom..."
                  value={formData.category_label || formData.category}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      category: e.target.value.toLowerCase().replace(/\s+/g, '-'),
                      category_label: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-[#f3d7df] bg-[#fff7f9] text-sm text-[#2e1c24] focus:outline-none focus:ring-2 focus:ring-[#e05d82]"
                />
              )}
            </div>
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block font-bold text-[#2e1c24] mb-1">Deskripsi Produk</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-[#f3d7df] bg-[#fff7f9] text-sm text-[#2e1c24] focus:outline-none focus:ring-2 focus:ring-[#e05d82]"
            />
          </div>

          {/* Galeri Multi-Foto Produk */}
          <div className="bg-[#fff7f9] p-4 sm:p-5 rounded-2xl border border-[#f3d7df] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="font-bold text-[#2e1c24] flex items-center gap-1.5 text-xs sm:text-sm">
                  <Images className="w-4 h-4 text-[#e05d82]" />
                  <span>Galeri Foto ({currentImages.length} Foto)</span>
                </h4>
                <p className="text-[11px] text-[#755562] mt-0.5">
                  Foto pertama bertanda <strong className="text-[#e05d82]">⭐ Cover Utama</strong>{' '}
                  akan ditampilkan di etalase depan.
                </p>
              </div>

              <label
                className={`px-3.5 py-2 rounded-xl font-bold cursor-pointer transition-colors flex items-center justify-center gap-1.5 shrink-0 min-h-[36px] ${
                  uploadingImages
                    ? 'bg-zinc-200 text-zinc-500 cursor-not-allowed pointer-events-none'
                    : 'bg-[#e05d82] text-white hover:bg-[#c8476c] shadow-xs'
                }`}
              >
                {uploadingImages ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <ImagePlus className="w-3.5 h-3.5" />
                )}
                <span>{uploadingImages ? 'Mengompres & Upload...' : '+ Unggah Foto'}</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  disabled={uploadingImages}
                  className="hidden"
                  onClick={(e) => {
                    (e.currentTarget as HTMLInputElement).value = '';
                  }}
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      onUploadMultipleFiles(e.target.files);
                    }
                  }}
                />
              </label>
            </div>

            {/* Input URL Gambar Manual */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                placeholder="Atau tempel URL gambar (https://...)"
                value={newManualImageUrl}
                onChange={(e) => setNewManualImageUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddManualImage();
                  }
                }}
                className="flex-1 px-3 py-1.5 rounded-xl border border-[#f3d7df] bg-white text-xs text-[#2e1c24] focus:outline-none focus:ring-1 focus:ring-[#e05d82]"
              />
              <button
                type="button"
                onClick={handleAddManualImage}
                className="px-3 py-1.5 rounded-xl bg-white border border-[#f3d7df] text-xs font-bold text-[#755562] hover:bg-[#fde8ee] hover:text-[#e05d82] transition-colors cursor-pointer shrink-0"
              >
                + Tambah URL
              </button>
            </div>

            {/* Grid Thumbnail Foto */}
            {currentImages.length === 0 ? (
              <div className="p-4 rounded-xl bg-white border border-dashed border-[#f3d7df] text-center text-xs text-[#755562]">
                Belum ada foto produk. Silakan unggah atau tambahkan link foto.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 pt-2">
                {currentImages.map((imgUrl, idx) => (
                  <div
                    key={`${imgUrl}-${idx}`}
                    className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 bg-white shadow-2xs group transition-all ${
                      idx === 0 ? 'border-[#e05d82] ring-2 ring-[#e05d82]/20' : 'border-[#f3d7df]'
                    }`}
                  >
                    <Image
                      src={imgUrl}
                      alt={`Foto Produk ${idx + 1}`}
                      fill
                      sizes="(max-width: 640px) 50vw, 120px"
                      className="object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          '/images/products/aromatherapy-candle.jpg';
                      }}
                    />

                    {idx === 0 ? (
                      <span className="absolute top-1.5 left-1.5 bg-[#e05d82] text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                        <Star className="w-2.5 h-2.5 fill-white" />
                        <span>Cover</span>
                      </span>
                    ) : (
                      <span className="absolute top-1.5 left-1.5 bg-black/60 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded-md backdrop-blur-xs">
                        #{idx + 1}
                      </span>
                    )}

                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="p-1 rounded-lg bg-rose-600/90 text-white hover:bg-rose-700 transition-colors cursor-pointer"
                          title="Hapus foto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {idx !== 0 && (
                        <button
                          type="button"
                          onClick={() => handleSetCoverImage(idx)}
                          className="w-full py-1 rounded bg-[#e05d82] text-white text-[10px] font-bold hover:bg-[#c8476c] transition-colors cursor-pointer text-center flex items-center justify-center gap-1"
                        >
                          <Star className="w-3 h-3 fill-white" />
                          <span>Jadikan Cover</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sub-Komponen Varian Manager */}
          <ProductVariantManager
            product={formData}
            onChange={(updated) => setFormData(updated)}
            onUploadVariantFile={onUploadVariantFile}
            uploadingImages={uploadingImages}
          />

          {/* Harga Tunggal, Diskon Coret, Stok, Min Order */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block font-bold text-[#2e1c24] mb-1">Harga Utama (Rp)</label>
              <input
                type="number"
                min={0}
                required
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: Math.max(0, Number(e.target.value) || 0) })
                }
                className="w-full px-3.5 py-2 rounded-xl border border-[#f3d7df] bg-[#fff7f9] text-sm text-[#2e1c24] font-bold focus:outline-none focus:ring-2 focus:ring-[#e05d82]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#2e1c24] mb-1">Harga Coret (Promo)</label>
              <input
                type="number"
                min={0}
                placeholder="Kosongkan jika tak promo"
                value={formData.original_price ?? ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    original_price: e.target.value ? Number(e.target.value) : null,
                  })
                }
                className="w-full px-3.5 py-2 rounded-xl border border-[#f3d7df] bg-[#fff7f9] text-sm text-[#2e1c24] focus:outline-none focus:ring-2 focus:ring-[#e05d82]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#2e1c24] mb-1">Min. Pesanan (pcs)</label>
              <input
                type="number"
                min={1}
                required
                value={formData.min_order ?? 1}
                onChange={(e) =>
                  setFormData({ ...formData, min_order: Math.max(1, Number(e.target.value) || 1) })
                }
                className="w-full px-3.5 py-2 rounded-xl border border-[#f3d7df] bg-[#fff7f9] text-sm text-[#2e1c24] focus:outline-none focus:ring-2 focus:ring-[#e05d82]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#2e1c24] mb-1">Stok Gudang</label>
              <input
                type="number"
                min={0}
                required
                value={formData.stock ?? 100}
                onChange={(e) =>
                  setFormData({ ...formData, stock: Math.max(0, Number(e.target.value) || 0) })
                }
                className="w-full px-3.5 py-2 rounded-xl border border-[#f3d7df] bg-[#fff7f9] text-sm text-[#2e1c24] focus:outline-none focus:ring-2 focus:ring-[#e05d82]"
              />
            </div>
          </div>

          {/* Spesifikasi Teknis */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-[#2e1c24] mb-1">Bahan Material</label>
              <input
                type="text"
                placeholder="e.g. 100% Natural Soy Wax"
                value={formData.material || ''}
                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-[#f3d7df] bg-[#fff7f9] text-xs text-[#2e1c24]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#2e1c24] mb-1">Dimensi / Ukuran</label>
              <input
                type="text"
                placeholder="e.g. 60ml & 100ml (Dia 5.5cm)"
                value={formData.size || ''}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-[#f3d7df] bg-[#fff7f9] text-xs text-[#2e1c24]"
              />
            </div>

            <div>
              <label className="block font-bold text-[#2e1c24] mb-1">Estimasi Pengerjaan</label>
              <input
                type="text"
                placeholder="e.g. 5 - 10 Hari Kerja"
                value={formData.lead_time || ''}
                onChange={(e) => setFormData({ ...formData, lead_time: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-[#f3d7df] bg-[#fff7f9] text-xs text-[#2e1c24]"
              />
            </div>
          </div>

          {/* Opsi Kustomisasi Tambahan (Pilihan Aroma / Warna) */}
          <div className="bg-[#fff7f9] p-4 sm:p-5 rounded-2xl border border-[#f3d7df] space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-[#2e1c24] text-xs sm:text-sm">
                  Grup Pilihan Kustomisasi Tambahan
                </h4>
                <p className="text-[11px] text-[#755562]">
                  Pilihan non-harga seperti pilihan aroma atau warna pita untuk pembeli.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddOptionGroup}
                className="px-3 py-1.5 rounded-xl bg-white border border-[#f3d7df] text-xs font-bold text-[#e05d82] hover:bg-[#fde8ee] cursor-pointer"
              >
                + Tambah Grup
              </button>
            </div>

            {(formData.options || []).map((opt, optI) => (
              <div
                key={optI}
                className="p-3.5 rounded-xl bg-white border border-[#f3d7df] space-y-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="text"
                    value={opt.label}
                    onChange={(e) => handleUpdateOptionLabel(optI, e.target.value)}
                    className="flex-1 font-bold text-xs text-[#2e1c24] px-2 py-1 border border-[#f3d7df] rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveOptionGroup(optI)}
                    className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {opt.choices.map((c, cI) => (
                    <span
                      key={cI}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#fde8ee] text-[#e05d82] text-[11px] font-semibold"
                    >
                      <span>{c}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveChoice(optI, cI)}
                        className="hover:text-rose-700 cursor-pointer"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="+ Tambah pilihan baru..."
                    value={newChoiceInputs[optI] || ''}
                    onChange={(e) =>
                      setNewChoiceInputs({ ...newChoiceInputs, [optI]: e.target.value })
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddChoice(optI, newChoiceInputs[optI] || '');
                      }
                    }}
                    className="flex-1 px-2.5 py-1 text-xs border border-[#f3d7df] rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddChoice(optI, newChoiceInputs[optI] || '')}
                    className="px-2.5 py-1 rounded-lg bg-[#e05d82] text-white text-xs font-bold cursor-pointer"
                  >
                    + Tambah
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Modal Action Buttons */}
          <div className="pt-4 border-t border-[#f3d7df] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-[#f3d7df] bg-white text-xs font-bold text-[#755562] hover:bg-[#fde8ee] cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#e05d82] text-white text-xs font-bold hover:bg-[#c8476c] shadow-md shadow-[#e05d82]/20 cursor-pointer"
            >
              Simpan Produk ke Database
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
