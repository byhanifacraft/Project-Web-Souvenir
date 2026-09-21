'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Loader2, CheckCircle2 } from 'lucide-react';
import { ProductItem } from '@/types/store';
import { compressImage } from '@/lib/imageCompressor';
import ProductCardItem from '@/components/admin/produk/ProductCardItem';
import ProductFormModal from '@/components/admin/produk/ProductFormModal';

const PRESET_CATEGORIES = [
  { id: 'candle', label: 'Lilin Aromaterapi' },
  { id: 'resin', label: 'Gantungan Kunci Resin' },
  { id: 'pouch', label: 'Pouch Sablon' },
  { id: 'totebag', label: 'Totebag Kanvas' },
  { id: 'bouquet', label: 'Buket Mini & Botol' },
  { id: 'hampers', label: 'Hampers & Gift Box' },
];

export default function AdminProdukPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [_saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  // Filter & Search
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');

  // Modal State
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [isNewProduct, setIsNewProduct] = useState<boolean>(false);
  const [uploadingImages, setUploadingImages] = useState<boolean>(false);

  useEffect(() => {
    fetch('/api/store', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.products) setProducts(data.products);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const showNotification = (msg: string) => {
    setSaveSuccess(msg);
    setTimeout(() => setSaveSuccess(null), 4000);
  };

  const allCategories = useMemo(() => {
    const map = new Map<string, string>();
    PRESET_CATEGORIES.forEach((c) => map.set(c.id, c.label));
    products.forEach((p) => {
      if (p.category) {
        map.set(p.category, p.category_label || p.category);
      }
    });
    return Array.from(map.entries()).map(([id, label]) => ({ id, label }));
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.description || '').toLowerCase().includes(search.toLowerCase());
      const matchCat = selectedCat === 'all' || p.category === selectedCat;
      return matchSearch && matchCat;
    });
  }, [products, search, selectedCat]);

  // Upload Multi File Foto
  const handleUploadMultipleFiles = async (files: FileList | File[]) => {
    if (!editingProduct) return;
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    try {
      setUploadingImages(true);
      const uploadedUrls: string[] = [];

      for (const file of fileArray) {
        const compressedFile = await compressImage(file, {
          maxWidth: 1600,
          maxHeight: 1600,
          quality: 0.85,
        });
        const formData = new FormData();
        formData.append('file', compressedFile);
        formData.append('bucket', 'products');

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (res.ok && data.url) {
          uploadedUrls.push(data.url);
        }
      }

      if (uploadedUrls.length > 0) {
        const existing =
          editingProduct.images && editingProduct.images.length > 0
            ? editingProduct.images
            : editingProduct.image_url
              ? [editingProduct.image_url]
              : [];
        const merged = [...existing, ...uploadedUrls];
        setEditingProduct({
          ...editingProduct,
          image_url: merged[0] || '',
          images: merged,
        });
        showNotification(`${uploadedUrls.length} foto berhasil diunggah!`);
      }
    } catch {
      alert('Gagal mengunggah beberapa foto.');
    } finally {
      setUploadingImages(false);
    }
  };

  // Upload Single File Foto Varian
  const handleUploadVariantFile = async (variantIndex: number, file: File) => {
    if (!editingProduct) return;
    try {
      setUploadingImages(true);
      const compressed = await compressImage(file, {
        maxWidth: 1600,
        maxHeight: 1600,
        quality: 0.85,
      });
      const formData = new FormData();
      formData.append('file', compressed);
      formData.append('bucket', 'products');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        const currentVariants = [...(editingProduct.variants || [])];
        if (currentVariants[variantIndex]) {
          currentVariants[variantIndex] = {
            ...currentVariants[variantIndex],
            image_url: data.url,
          };
          setEditingProduct({ ...editingProduct, variants: currentVariants });
          showNotification('Foto varian berhasil diperbarui!');
        }
      }
    } catch {
      alert('Gagal mengunggah foto varian.');
    } finally {
      setUploadingImages(false);
    }
  };

  // Simpan List Produk ke Server
  const handleSaveProductsList = async (updatedProducts: ProductItem[]) => {
    try {
      setSaving(true);
      const res = await fetch('/api/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: updatedProducts }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        if (data.data?.products && Array.isArray(data.data.products)) {
          setProducts(data.data.products);
        } else {
          setProducts(updatedProducts);
        }
        showNotification('Data produk berhasil disimpan ke Supabase!');
      } else {
        alert(data.error || 'Gagal menyimpan produk.');
      }
    } catch {
      alert('Terjadi kesalahan koneksi saat menyimpan.');
    } finally {
      setSaving(false);
    }
  };

  // Simpan Dari Modal Form
  const handleSaveProductModal = async (productToSave: ProductItem) => {
    const cleanCategory = (productToSave.category || 'candle')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-');
    const cleanLabel =
      productToSave.category_label || productToSave.category || 'Lilin Aromaterapi';

    const normalizedOriginalPrice =
      productToSave.original_price && productToSave.original_price > 0
        ? Number(productToSave.original_price)
        : null;

    const currentImages =
      productToSave.images && productToSave.images.length > 0
        ? productToSave.images
        : productToSave.image_url
          ? [productToSave.image_url]
          : ['/images/products/aromatherapy-candle.jpg'];

    const sanitizedProduct: ProductItem = {
      ...productToSave,
      category: cleanCategory,
      category_label: cleanLabel,
      original_price: normalizedOriginalPrice,
      image_url: currentImages[0] || '/images/products/aromatherapy-candle.jpg',
      images: currentImages,
      stock: Number(productToSave.stock) || 100,
      min_order: Number(productToSave.min_order) || 1,
    };

    let updatedList: ProductItem[];
    if (isNewProduct) {
      updatedList = [sanitizedProduct, ...products];
    } else {
      updatedList = products.map((p) => (p.id === sanitizedProduct.id ? sanitizedProduct : p));
    }

    setEditingProduct(null);
    await handleSaveProductsList(updatedList);
  };

  // Hapus Produk
  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Hapus produk "${name}"? Tindakan ini akan menghapus data dari Supabase.`)) {
      return;
    }

    try {
      setSaving(true);
      const res = await fetch('/api/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deletedProductIds: [id] }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        if (data.data?.products && Array.isArray(data.data.products)) {
          setProducts(data.data.products);
        } else {
          setProducts((prev) => prev.filter((p) => p.id !== id));
        }
        showNotification(`Produk "${name}" berhasil dihapus.`);
      } else {
        alert(data.error || 'Gagal menghapus produk.');
      }
    } catch {
      alert('Terjadi kesalahan jaringan.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <Loader2 className="w-8 h-8 text-[#e05d82] animate-spin mx-auto mb-3" />
        <p className="text-xs text-[#755562] font-semibold">Memuat katalog produk...</p>
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#2e1c24]">
            Kelola Produk Lilin & Souvenir
          </h1>
          <p className="text-xs text-[#755562] mt-1">
            Total {products.length} produk • Disinkronkan dengan tabel Supabase{' '}
            <code className="bg-[#fde8ee] px-1.5 py-0.5 rounded text-[#e05d82]">products</code>
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingProduct({
              id: `prod-${Date.now()}`,
              name: '',
              description: '',
              price: 15000,
              original_price: null,
              stock: 100,
              image_url: '',
              images: [],
              variants: [],
              is_active: true,
              category: 'candle',
              category_label: 'Lilin Aromaterapi',
              min_order: 20,
              lead_time: '5 - 10 Hari Kerja',
              material: '100% Natural Soy Wax',
              size: '60ml & 100ml',
              options: [{ label: 'Pilihan Aroma', choices: ['Lavender Dream', 'Vanilla Warmth'] }],
              shopee_url: 'https://shopee.co.id/hanifakumala',
              rating: 5.0,
              sold_count: 0,
            });
            setIsNewProduct(true);
          }}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#e05d82] text-white text-xs font-bold hover:bg-[#c8476c] transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-[#e05d82]/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Produk Baru</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#f3d7df] shadow-xs flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#9d7c8b] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama produk..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-[#f3d7df] bg-[#fff7f9] text-xs text-[#2e1c24] focus:outline-none focus:ring-2 focus:ring-[#e05d82]"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto w-full sm:w-auto scrollbar-none py-1">
          <button
            onClick={() => setSelectedCat('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 min-h-[36px] transition-all cursor-pointer ${
              selectedCat === 'all'
                ? 'bg-[#e05d82] text-white shadow-xs'
                : 'bg-[#fff7f9] text-[#755562] hover:bg-[#fde8ee]'
            }`}
          >
            Semua ({products.length})
          </button>
          {allCategories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCat(c.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 min-h-[36px] transition-all cursor-pointer ${
                selectedCat === c.id
                  ? 'bg-[#e05d82] text-white shadow-xs'
                  : 'bg-[#fff7f9] text-[#755562] hover:bg-[#fde8ee]'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid Menggunakan Komponen Modular ProductCardItem */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredProducts.map((p) => (
          <ProductCardItem
            key={p.id}
            product={p}
            onEdit={(prod) => {
              setEditingProduct({ ...prod });
              setIsNewProduct(false);
            }}
            onDelete={handleDeleteProduct}
            onToggleActive={(prod) => {
              const updated = products.map((item) =>
                item.id === prod.id ? { ...item, is_active: !item.is_active } : item
              );
              handleSaveProductsList(updated);
            }}
          />
        ))}
      </div>

      {/* Modal Edit / Tambah Produk Menggunakan Komponen Modular ProductFormModal */}
      {editingProduct && (
        <ProductFormModal
          product={editingProduct}
          isNew={isNewProduct}
          presetCategories={PRESET_CATEGORIES}
          onClose={() => setEditingProduct(null)}
          onSave={handleSaveProductModal}
          onUploadMultipleFiles={handleUploadMultipleFiles}
          onUploadVariantFile={handleUploadVariantFile}
          uploadingImages={uploadingImages}
        />
      )}
    </div>
  );
}
