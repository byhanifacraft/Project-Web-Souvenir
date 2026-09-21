'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import {
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  X,
  Loader2,
  Eye,
  EyeOff,
  Search,
  Check,
  Tag,
  Sparkles,
  Images,
  Star,
  ShoppingBag,
  ImagePlus,
} from 'lucide-react';
import { ProductItem, ProductVariant } from '@/types/store';
import { ProductSchema } from '@/lib/validations/product.schema';
import { formatRupiah } from '@/lib/utils';
import { compressImage } from '@/lib/imageCompressor';

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
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  // Filter & Search
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');

  // Modal / Form state for Products
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [isNewProduct, setIsNewProduct] = useState<boolean>(false);
  const [isCustomCategory, setIsCustomCategory] = useState<boolean>(false);
  const [uploadingImages, setUploadingImages] = useState<boolean>(false);
  const [newManualImageUrl, setNewManualImageUrl] = useState<string>('');
  const [newChoiceInputs, setNewChoiceInputs] = useState<{ [index: number]: string }>({});

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

  // Extract all unique categories for dynamic filter pills
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

  // Multi-Image Upload & Management
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
        const isOnlyDummy =
          existing.length === 1 &&
          existing[0] === '/images/products/aromatherapy-candle.jpg' &&
          isNewProduct;
        const updatedImages = isOnlyDummy ? uploadedUrls : [...existing, ...uploadedUrls];
        setEditingProduct({
          ...editingProduct,
          images: updatedImages,
          image_url: updatedImages[0],
        });
        showNotification(`${uploadedUrls.length} foto berhasil diunggah dan dikompres WebP!`);
      }
    } catch {
      alert('Terjadi kesalahan saat mengunggah foto.');
    } finally {
      setUploadingImages(false);
    }
  };

  const handleSetCoverImage = (index: number) => {
    if (!editingProduct) return;
    const currentImages = [
      ...(editingProduct.images && editingProduct.images.length > 0
        ? editingProduct.images
        : editingProduct.image_url
          ? [editingProduct.image_url]
          : []),
    ];
    if (index < 0 || index >= currentImages.length) return;
    const [selected] = currentImages.splice(index, 1);
    const reordered = [selected, ...currentImages];
    setEditingProduct({
      ...editingProduct,
      images: reordered,
      image_url: reordered[0],
    });
  };

  const handleRemoveImage = (index: number) => {
    if (!editingProduct) return;
    const currentImages = [
      ...(editingProduct.images && editingProduct.images.length > 0
        ? editingProduct.images
        : editingProduct.image_url
          ? [editingProduct.image_url]
          : []),
    ];
    currentImages.splice(index, 1);
    setEditingProduct({
      ...editingProduct,
      images: currentImages,
      image_url: currentImages[0] || '',
    });
  };

  const handleAddManualImage = () => {
    if (!editingProduct || !newManualImageUrl.trim()) return;
    let url = newManualImageUrl.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('/')) {
      url = '/' + url;
    }

    const currentImages = [
      ...(editingProduct.images && editingProduct.images.length > 0
        ? editingProduct.images
        : editingProduct.image_url
          ? [editingProduct.image_url]
          : []),
    ];
    const isOnlyDummy =
      currentImages.length === 1 &&
      currentImages[0] === '/images/products/aromatherapy-candle.jpg' &&
      isNewProduct;
    const updatedImages = isOnlyDummy ? [url] : [...currentImages, url];
    setEditingProduct({
      ...editingProduct,
      images: updatedImages,
      image_url: updatedImages[0],
    });
    setNewManualImageUrl('');
    showNotification('Foto produk berhasil ditambahkan ke galeri!');
  };

  // Shopee-Style Variant Management
  const handleAddVariant = (
    defaultName = '',
    defaultPrice = 0,
    defaultOriginalPrice: number | null = null,
    defaultImg = ''
  ) => {
    if (!editingProduct) return;
    const currentVariants = editingProduct.variants || [];
    const baseImg = defaultImg || editingProduct.images?.[0] || editingProduct.image_url || '';
    const basePrice = defaultPrice > 0 ? defaultPrice : editingProduct.price;

    const newVariant: ProductVariant = {
      id: `var-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: defaultName || `Varian ${currentVariants.length + 1}`,
      price: basePrice,
      original_price: defaultOriginalPrice,
      image_url: baseImg,
      stock: 100,
    };

    setEditingProduct({
      ...editingProduct,
      variants: [...currentVariants, newVariant],
    });
  };

  const handleUpdateVariant = (index: number, updates: Partial<ProductVariant>) => {
    if (!editingProduct) return;
    const currentVariants = [...(editingProduct.variants || [])];
    if (!currentVariants[index]) return;
    currentVariants[index] = { ...currentVariants[index], ...updates };
    setEditingProduct({
      ...editingProduct,
      variants: currentVariants,
    });
  };

  const handleRemoveVariant = (index: number) => {
    if (!editingProduct) return;
    const currentVariants = [...(editingProduct.variants || [])];
    currentVariants.splice(index, 1);
    setEditingProduct({
      ...editingProduct,
      variants: currentVariants,
    });
  };

  const handleApplyVariantPreset = (presetType: 'resin' | 'candle' | 'hampers') => {
    if (!editingProduct) return;
    const currentImg = editingProduct.images?.[0] || editingProduct.image_url || '';

    if (presetType === 'resin') {
      setEditingProduct({
        ...editingProduct,
        variants: [
          {
            id: `var-${Date.now()}-1`,
            name: 'Huruf Saja (Polos)',
            price: 8500,
            original_price: 10000,
            image_url: currentImg,
            stock: 200,
          },
          {
            id: `var-${Date.now()}-2`,
            name: 'Huruf + Pita & Thank You Tag',
            price: 12000,
            original_price: 15000,
            image_url: currentImg,
            stock: 150,
          },
          {
            id: `var-${Date.now()}-3`,
            name: 'Paket Box Mika Eksklusif Berpita',
            price: 16500,
            original_price: 20000,
            image_url: currentImg,
            stock: 100,
          },
        ],
      });
      showNotification('Template Varian Gantungan Kunci Resin berhasil diterapkan!');
    } else if (presetType === 'candle') {
      setEditingProduct({
        ...editingProduct,
        variants: [
          {
            id: `var-${Date.now()}-1`,
            name: 'Jar Amber 60ml (Compact)',
            price: 15000,
            original_price: 25000,
            image_url: currentImg,
            stock: 150,
          },
          {
            id: `var-${Date.now()}-2`,
            name: 'Jar Amber 100ml (Best Value)',
            price: 24000,
            original_price: 32000,
            image_url: currentImg,
            stock: 100,
          },
          {
            id: `var-${Date.now()}-3`,
            name: 'Set Hardbox + Korek Api Kayu',
            price: 35000,
            original_price: 45000,
            image_url: currentImg,
            stock: 50,
          },
        ],
      });
      showNotification('Template Varian Lilin berhasil diterapkan!');
    } else if (presetType === 'hampers') {
      setEditingProduct({
        ...editingProduct,
        variants: [
          {
            id: `var-${Date.now()}-1`,
            name: 'Paket Basic (1 Lilin + Pouch)',
            price: 35000,
            original_price: 45000,
            image_url: currentImg,
            stock: 80,
          },
          {
            id: `var-${Date.now()}-2`,
            name: 'Paket Deluxe (Lilin + Resin + Pouch)',
            price: 55000,
            original_price: 65000,
            image_url: currentImg,
            stock: 60,
          },
          {
            id: `var-${Date.now()}-3`,
            name: 'Paket Luxury Hardbox (Komplit)',
            price: 85000,
            original_price: 100000,
            image_url: currentImg,
            stock: 40,
          },
        ],
      });
      showNotification('Template Varian Hampers berhasil diterapkan!');
    }
  };

  const handleUploadVariantFile = async (variantIndex: number, file: File) => {
    try {
      setUploadingImages(true);
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
        handleUpdateVariant(variantIndex, { image_url: data.url });
        if (editingProduct) {
          const currentImages = editingProduct.images || [];
          const updatedImages = currentImages.includes(data.url)
            ? currentImages
            : [...currentImages, data.url];
          setEditingProduct((prev) => (prev ? { ...prev, images: updatedImages } : null));
        }
        showNotification('Foto varian berhasil diunggah!');
      }
    } catch {
      alert('Gagal mengunggah foto varian.');
    } finally {
      setUploadingImages(false);
    }
  };

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
        showNotification('Data produk berhasil diperbarui!');
      } else {
        alert(data.error || 'Gagal menyimpan produk.');
      }
    } catch {
      alert('Terjadi kesalahan koneksi saat menyimpan.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveProductModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    // Normalize category
    const cleanCategory = (editingProduct.category || 'candle')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-');
    const cleanLabel =
      editingProduct.category_label || editingProduct.category || 'Lilin Aromaterapi';

    // Normalize original_price: if 0 or empty, set to null
    const normalizedOriginalPrice =
      editingProduct.original_price && editingProduct.original_price > 0
        ? Number(editingProduct.original_price)
        : null;

    // Images array: ensure at least 1 image
    const currentImages =
      editingProduct.images && editingProduct.images.length > 0
        ? editingProduct.images
        : editingProduct.image_url
          ? [editingProduct.image_url]
          : ['/images/products/aromatherapy-candle.jpg'];
    const primaryImageUrl =
      currentImages[0] || editingProduct.image_url || '/images/products/aromatherapy-candle.jpg';

    // Clean up variants
    const sanitizedVariants = (editingProduct.variants || [])
      .filter((v) => v.name.trim().length > 0)
      .map((v, idx) => ({
        id: v.id || `var-${Date.now()}-${idx}`,
        name: v.name.trim(),
        price: Number(v.price) || 0,
        original_price:
          v.original_price && Number(v.original_price) > 0 ? Number(v.original_price) : null,
        image_url: v.image_url || primaryImageUrl,
        stock: v.stock !== undefined ? Number(v.stock) : 100,
      }));

    // If variants exist, set base price to the minimum variant price
    const calculatedBasePrice =
      sanitizedVariants.length > 0
        ? Math.min(...sanitizedVariants.map((v) => v.price))
        : Number(editingProduct.price);

    const payload: ProductItem = {
      ...editingProduct,
      price: calculatedBasePrice,
      category: cleanCategory,
      category_label: cleanLabel,
      original_price: normalizedOriginalPrice,
      image_url: primaryImageUrl,
      images: currentImages,
      variants: sanitizedVariants,
      options: editingProduct.options || [],
    };

    // Validate with Zod
    const validation = ProductSchema.safeParse(payload);
    if (!validation.success) {
      alert(validation.error.issues[0]?.message || 'Data produk tidak valid.');
      return;
    }

    let updated = [...products];
    if (isNewProduct) {
      updated.push(payload);
    } else {
      updated = updated.map((p) => (p.id === payload.id ? payload : p));
    }

    await handleSaveProductsList(updated);
    setEditingProduct(null);
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Hapus produk "${name}"? Tindakan ini tidak dapat dibatalkan.`)) return;
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
        showNotification(`Produk "${name}" berhasil dihapus!`);
      } else {
        alert(data.error || 'Gagal menghapus produk.');
      }
    } catch {
      alert('Terjadi kesalahan koneksi saat menghapus produk.');
    } finally {
      setSaving(false);
    }
  };

  // Custom Options Management
  const handleAddOptionGroup = (customLabel = 'Pilihan Kustom') => {
    if (!editingProduct) return;
    const currentOptions = editingProduct.options || [];
    setEditingProduct({
      ...editingProduct,
      options: [
        ...currentOptions,
        {
          label: customLabel,
          choices: ['Pilihan A', 'Pilihan B'],
        },
      ],
    });
  };

  const handleRemoveOptionGroup = (index: number) => {
    if (!editingProduct) return;
    const currentOptions = [...(editingProduct.options || [])];
    currentOptions.splice(index, 1);
    setEditingProduct({
      ...editingProduct,
      options: currentOptions,
    });
  };

  const handleUpdateOptionLabel = (index: number, newLabel: string) => {
    if (!editingProduct) return;
    const currentOptions = [...(editingProduct.options || [])];
    currentOptions[index] = { ...currentOptions[index], label: newLabel };
    setEditingProduct({
      ...editingProduct,
      options: currentOptions,
    });
  };

  const handleAddChoice = (optionIndex: number, choiceText: string) => {
    if (!editingProduct || !choiceText.trim()) return;
    const currentOptions = [...(editingProduct.options || [])];
    const target = currentOptions[optionIndex];
    if (!target) return;
    if (target.choices.includes(choiceText.trim())) return;
    currentOptions[optionIndex] = {
      ...target,
      choices: [...target.choices, choiceText.trim()],
    };
    setEditingProduct({
      ...editingProduct,
      options: currentOptions,
    });
  };

  const handleRemoveChoice = (optionIndex: number, choiceIndex: number) => {
    if (!editingProduct) return;
    const currentOptions = [...(editingProduct.options || [])];
    const target = currentOptions[optionIndex];
    if (!target) return;
    const updatedChoices = target.choices.filter((_, idx) => idx !== choiceIndex);
    currentOptions[optionIndex] = {
      ...target,
      choices: updatedChoices,
    };
    setEditingProduct({
      ...editingProduct,
      options: currentOptions,
    });
  };

  const handleApplyPreset = (presetType: 'aroma' | 'pita' | 'kartu' | 'packaging') => {
    if (!editingProduct) return;
    let newOpt: { label: string; choices: string[] };
    if (presetType === 'aroma') {
      newOpt = {
        label: 'Pilihan Varian Aroma',
        choices: ['Lavender Dream', 'Vanilla Warmth', 'Sandalwood Amber', 'English Pear & Freesia'],
      };
    } else if (presetType === 'pita') {
      newOpt = {
        label: 'Warna Pita Kemasan',
        choices: ['Blush Pink', 'Champagne Gold', 'Sage Green', 'Tali Rami Rustic'],
      };
    } else if (presetType === 'kartu') {
      newOpt = {
        label: 'Tipe Kartu Ucapan',
        choices: ['Custom Nama & Tanggal Acara', 'Standar Thank You Card', 'Tanpa Kartu'],
      };
    } else {
      newOpt = {
        label: 'Model Kemasan Souvenir',
        choices: [
          'Kemasan Plastik Seal + Backing Card',
          'Hardbox Rigid Berpita',
          'Tile Pouch Halus',
        ],
      };
    }
    const currentOptions = editingProduct.options || [];
    setEditingProduct({
      ...editingProduct,
      options: [...currentOptions, newOpt],
    });
  };

  const filteredProducts = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = selectedCat === 'all' || p.category === selectedCat;
    return matchSearch && matchCat;
  });

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
            Tabel Supabase:{' '}
            <code className="bg-[#fde8ee] px-1.5 py-0.5 rounded text-[#e05d82]">products</code> •
            Total {products.length} produk • Mendukung Diskon Coret & Variasi Custom
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
              options: [
                {
                  label: 'Pilihan Varian Aroma',
                  choices: ['Lavender Dream', 'Vanilla Warmth', 'Sandalwood'],
                },
              ],
              shopee_url: 'https://shopee.co.id/hanifakumala',
              rating: 5.0,
              sold_count: 0,
            });
            setIsNewProduct(true);
            setIsCustomCategory(false);
            setNewChoiceInputs({});
            setNewManualImageUrl('');
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

        {/* Dynamic Category Filter Pills */}
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

          {allCategories.map((c) => {
            const count = products.filter((p) => p.category === c.id).length;
            if (count === 0 && selectedCat !== c.id) return null;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCat(c.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedCat === c.id
                    ? 'bg-[#e05d82] text-white'
                    : 'bg-[#fff7f9] text-[#755562] hover:bg-[#fde8ee]'
                }`}
              >
                <span>{c.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${selectedCat === c.id ? 'bg-white/20' : 'bg-[#f3d7df]'}`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {filteredProducts.map((p) => {
          const originalPrice = p.original_price ? Number(p.original_price) : null;
          const hasDiscount = Boolean(originalPrice && originalPrice > p.price);
          const discountPercent =
            hasDiscount && originalPrice
              ? Math.round(((originalPrice - p.price) / originalPrice) * 100)
              : 0;
          const customOptionsCount = p.options?.length || 0;
          const variantsCount = p.variants?.length || 0;
          const imagesCount = p.images?.length || (p.image_url ? 1 : 0);

          const hasVariants = Boolean(p.variants && p.variants.length > 0);
          const minVariantPrice = hasVariants
            ? Math.min(...p.variants!.map((v) => v.price))
            : p.price;
          const maxVariantPrice = hasVariants
            ? Math.max(...p.variants!.map((v) => v.price))
            : p.price;
          const displayPriceText = hasVariants
            ? minVariantPrice === maxVariantPrice
              ? formatRupiah(minVariantPrice)
              : `${formatRupiah(minVariantPrice)} - ${formatRupiah(maxVariantPrice)}`
            : formatRupiah(p.price);

          return (
            <div
              key={p.id}
              className="bg-white rounded-3xl border border-[#f3d7df] overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-shadow"
            >
              <div>
                <div className="relative aspect-[4/3] w-full bg-[#fde8ee]">
                  <Image
                    src={p.image_url || '/images/products/aromatherapy-candle.jpg'}
                    alt={p.name}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        '/images/products/aromatherapy-candle.jpg';
                    }}
                  />
                  <span className="absolute top-2.5 left-2.5 text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/90 text-[#e05d82]">
                    {p.category_label || p.category}
                  </span>

                  <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                    {hasDiscount && (
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#ee4d2d] text-white shadow-xs">
                        -{discountPercent}%
                      </span>
                    )}
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        p.is_active !== false
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-zinc-200 text-zinc-600'
                      }`}
                    >
                      {p.is_active !== false ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </div>

                  {imagesCount > 1 && (
                    <span className="absolute bottom-2.5 left-2.5 text-[9px] font-bold px-2 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-xs flex items-center gap-1">
                      <Images className="w-3 h-3" />
                      <span>{imagesCount} Foto</span>
                    </span>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-serif font-bold text-sm text-[#2e1c24] line-clamp-1 mb-1">
                    {p.name}
                  </h3>

                  <div className="flex items-center justify-between text-xs mb-2">
                    <div>
                      {hasDiscount && (
                        <div className="flex items-center gap-1 leading-none mb-0.5">
                          <span className="text-[10px] text-zinc-400 line-through">
                            {formatRupiah(originalPrice!)}
                          </span>
                          <span className="text-[9px] font-bold text-[#ee4d2d] bg-[#fef0ed] px-1 py-0.2 rounded">
                            -{discountPercent}%
                          </span>
                        </div>
                      )}
                      <span className="font-bold text-[#e05d82] text-sm">{displayPriceText}</span>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] text-[#755562] bg-[#fff7f9] px-2 py-0.5 rounded-md border border-[#f3d7df] block">
                        Stok: {p.stock ?? 100} pcs
                      </span>
                      {variantsCount > 0 && (
                        <span className="text-[10px] text-[#e05d82] font-bold mt-0.5 block">
                          🛍️ {variantsCount} Varian Harga
                        </span>
                      )}
                      {customOptionsCount > 0 && (
                        <span className="text-[10px] text-[#a85267] font-semibold mt-0.5 block">
                          🎨 {customOptionsCount} Opsi Custom
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-[11px] text-[#755562] line-clamp-2">{p.description}</p>
                </div>
              </div>

              <div className="p-3 bg-[#fff7f9] border-t border-[#f3d7df] flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const updated = products.map((item) =>
                      item.id === p.id ? { ...item, is_active: !item.is_active } : item
                    );
                    handleSaveProductsList(updated);
                  }}
                  className="text-xs font-semibold text-[#755562] hover:text-[#e05d82] flex items-center gap-1 cursor-pointer shrink-0"
                >
                  {p.is_active !== false ? (
                    <EyeOff className="w-3.5 h-3.5" />
                  ) : (
                    <Eye className="w-3.5 h-3.5" />
                  )}
                  <span>{p.is_active !== false ? 'Nonaktifkan' : 'Aktifkan'}</span>
                </button>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProduct({
                        ...p,
                        images:
                          p.images && p.images.length > 0
                            ? [...p.images]
                            : p.image_url
                              ? [p.image_url]
                              : [],
                        variants: p.variants ? p.variants.map((v) => ({ ...v })) : [],
                      });
                      setIsNewProduct(false);
                      const isPreset = PRESET_CATEGORIES.some((c) => c.id === p.category);
                      setIsCustomCategory(!isPreset);
                      setNewChoiceInputs({});
                      setNewManualImageUrl('');
                    }}
                    className="p-1.5 rounded-lg bg-[#fde8ee] text-[#e05d82] hover:bg-[#e05d82] hover:text-white transition-colors cursor-pointer"
                    title="Edit Produk"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteProduct(p.id, p.name)}
                    className="p-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer"
                    title="Hapus Produk"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Edit / Tambah Produk */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-4 sm:p-8 shadow-2xl border border-[#f3d7df] my-auto animate-scaleUp max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-[#f3d7df] mb-4 sm:mb-6">
              <div className="pr-2 min-w-0">
                <h3 className="font-serif font-bold text-base sm:text-lg text-[#2e1c24] truncate">
                  {isNewProduct ? 'Tambah Produk Baru' : `Edit: ${editingProduct.name}`}
                </h3>
                <p className="text-[11px] sm:text-xs text-[#755562] mt-0.5">
                  Atur informasi produk, harga promo & coret, serta pilihan kustomisasi yang
                  tersedia.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="w-9 h-9 rounded-full bg-[#fde8ee] text-[#755562] hover:bg-[#e05d82] hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
                aria-label="Tutup"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProductModal} className="space-y-5 text-xs">
              {/* Nama & Kategori */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#2e1c24] mb-1">
                    Nama Produk <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-[#f3d7df] bg-[#fff7f9] text-sm text-[#2e1c24] focus:outline-none focus:ring-2 focus:ring-[#e05d82]"
                  />
                </div>

                {/* Kategori dengan Opsi Pilihan Preset atau Ketik Manual */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-[#2e1c24]">Kategori Produk</label>
                    <button
                      type="button"
                      onClick={() => setIsCustomCategory(!isCustomCategory)}
                      className="text-[11px] text-[#e05d82] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Tag className="w-3 h-3" />
                      <span>
                        {isCustomCategory ? 'Pilih dari Preset' : '+ Ketik Kategori Kustom'}
                      </span>
                    </button>
                  </div>

                  {!isCustomCategory ? (
                    <select
                      value={editingProduct.category || 'candle'}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '__custom__') {
                          setIsCustomCategory(true);
                          return;
                        }
                        const preset = PRESET_CATEGORIES.find((c) => c.id === val);
                        setEditingProduct({
                          ...editingProduct,
                          category: val,
                          category_label: preset ? preset.label : val,
                        });
                      }}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#f3d7df] bg-[#fff7f9] text-sm text-[#2e1c24] focus:outline-none focus:ring-2 focus:ring-[#e05d82]"
                    >
                      {PRESET_CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.label} ({cat.id})
                        </option>
                      ))}
                      <option value="__custom__">+ Ketik Kategori Baru (Kustom)...</option>
                    </select>
                  ) : (
                    <div className="space-y-2 bg-[#fde8ee]/40 p-2.5 rounded-xl border border-[#f3d7df]">
                      <div>
                        <span className="text-[10px] text-[#755562] font-semibold block mb-0.5">
                          Nama Label Kategori (Tampil di Website):
                        </span>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Keramik Lilin, Reed Diffuser, Sabun Alami..."
                          value={editingProduct.category_label || ''}
                          onChange={(e) => {
                            const labelVal = e.target.value;
                            const slug = labelVal.trim().toLowerCase().replace(/\s+/g, '-');
                            setEditingProduct({
                              ...editingProduct,
                              category_label: labelVal,
                              category: slug,
                            });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-[#f3d7df] bg-white text-xs text-[#2e1c24] focus:outline-none focus:ring-2 focus:ring-[#e05d82]"
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-[#9d7c8b]">
                        <span>
                          Kode ID Kategori:{' '}
                          <strong className="text-[#e05d82]">
                            {editingProduct.category || '-'}
                          </strong>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setIsCustomCategory(false);
                            setEditingProduct({
                              ...editingProduct,
                              category: 'candle',
                              category_label: 'Lilin Aromaterapi',
                            });
                          }}
                          className="text-[#e05d82] underline font-semibold"
                        >
                          Batal Kustom
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Harga Jual, Harga Coret Shopee, Stok, & Min Order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-[#fff7f9] p-3.5 rounded-2xl border border-[#f3d7df]">
                <div>
                  <label className="block font-bold text-[#2e1c24] mb-1">
                    Harga Jual Promo (Rp) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, price: Number(e.target.value) })
                    }
                    className="w-full px-3 py-1.5 rounded-xl border border-[#f3d7df] bg-white text-sm font-bold text-[#e05d82] focus:outline-none focus:ring-2 focus:ring-[#e05d82]"
                  />
                  <span className="text-[10px] text-[#755562] block mt-0.5">
                    Harga yang dibayar pembeli
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-[#2e1c24] mb-1">
                    Harga Coret / Asli (Rp)
                  </label>
                  <input
                    type="number"
                    placeholder="Kosongkan jika tak diskon"
                    value={editingProduct.original_price ?? ''}
                    onChange={(e) => {
                      const val = e.target.value === '' ? null : Number(e.target.value);
                      setEditingProduct({ ...editingProduct, original_price: val });
                    }}
                    className="w-full px-3 py-1.5 rounded-xl border border-[#f3d7df] bg-white text-sm text-[#2e1c24] focus:outline-none focus:ring-2 focus:ring-[#e05d82]"
                  />
                  <span className="text-[10px] text-[#755562] block mt-0.5">
                    Harga normal (coret ala Shopee)
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-[#2e1c24] mb-1">Stok Tersedia</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.stock ?? 100}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })
                    }
                    className="w-full px-3 py-1.5 rounded-xl border border-[#f3d7df] bg-white text-sm text-[#2e1c24] focus:outline-none focus:ring-2 focus:ring-[#e05d82]"
                  />
                  <span className="text-[10px] text-[#755562] block mt-0.5">
                    Jumlah kuantitas stok
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-[#2e1c24] mb-1">Min. Order (Pcs)</label>
                  <input
                    type="number"
                    value={editingProduct.min_order ?? 1}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, min_order: Number(e.target.value) })
                    }
                    className="w-full px-3 py-1.5 rounded-xl border border-[#f3d7df] bg-white text-sm text-[#2e1c24] focus:outline-none focus:ring-2 focus:ring-[#e05d82]"
                  />
                  <span className="text-[10px] text-[#755562] block mt-0.5">
                    Minimal order souvenir
                  </span>
                </div>

                {/* Live Preview Diskon Shopee */}
                {editingProduct.original_price &&
                  editingProduct.original_price > editingProduct.price && (
                    <div className="col-span-full bg-[#fef0ed] border border-[#fcd5cd] p-2.5 rounded-xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#ee4d2d] text-white flex items-center justify-center font-bold text-[10px]">
                          %
                        </span>
                        <div>
                          <p className="font-bold text-[#2e1c24]">Simulasi Diskon Coret Aktif</p>
                          <p className="text-[11px] text-[#755562]">
                            Harga Coret:{' '}
                            <span className="line-through">
                              {formatRupiah(editingProduct.original_price)}
                            </span>{' '}
                            →{' '}
                            <strong className="text-[#ee4d2d]">
                              {formatRupiah(editingProduct.price)}
                            </strong>{' '}
                            (Hemat{' '}
                            {formatRupiah(editingProduct.original_price - editingProduct.price)})
                          </p>
                        </div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#ee4d2d] text-white font-bold text-[11px]">
                        -
                        {Math.round(
                          ((editingProduct.original_price - editingProduct.price) /
                            editingProduct.original_price) *
                            100
                        )}
                        %
                      </span>
                    </div>
                  )}
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block font-bold text-[#2e1c24] mb-1">Deskripsi Produk</label>
                <textarea
                  rows={3}
                  required
                  value={editingProduct.description}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, description: e.target.value })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-[#f3d7df] bg-[#fff7f9] text-sm text-[#2e1c24] focus:outline-none focus:ring-2 focus:ring-[#e05d82]"
                />
              </div>

              {/* Galeri Multi-Foto Produk */}
              <div className="bg-[#fff7f9] p-4 sm:p-5 rounded-2xl border border-[#f3d7df] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-[#2e1c24] flex items-center gap-1.5 text-xs sm:text-sm">
                      <Images className="w-4 h-4 text-[#e05d82]" />
                      <span>
                        Galeri Foto Produk (
                        {editingProduct.images?.length || (editingProduct.image_url ? 1 : 0)} Foto)
                      </span>
                    </h4>
                    <p className="text-[11px] text-[#755562] mt-0.5 leading-relaxed">
                      Unggah banyak foto produk sekaligus (auto-kompres WebP). Foto bertanda{' '}
                      <strong className="text-[#e05d82]">⭐ Cover Utama</strong> akan ditampilkan di
                      katalog depan.
                    </p>
                  </div>

                  <label
                    className={`px-3.5 py-2 rounded-xl font-bold cursor-pointer transition-colors flex items-center justify-center gap-1.5 shrink-0 self-start sm:self-auto min-h-[36px] ${
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
                    <span>
                      {uploadingImages ? 'Mengompres & Upload...' : '+ Unggah Banyak Foto'}
                    </span>
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
                          handleUploadMultipleFiles(e.target.files);
                        }
                      }}
                    />
                  </label>
                </div>

                {/* Input URL Gambar Manual */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    placeholder="Atau masukkan tautan URL gambar langsung (https://...)"
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

                {/* Thumbnail Galeri Foto */}
                {(!editingProduct.images || editingProduct.images.length === 0) &&
                !editingProduct.image_url ? (
                  <div className="p-4 rounded-xl bg-white border border-dashed border-[#f3d7df] text-center text-xs text-[#755562]">
                    Belum ada foto produk. Klik <strong>+ Unggah Banyak Foto</strong> untuk memilih
                    foto produk dari perangkat Anda.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 pt-2">
                    {(editingProduct.images && editingProduct.images.length > 0
                      ? editingProduct.images
                      : [editingProduct.image_url]
                    ).map((imgUrl, idx) => (
                      <div
                        key={`${imgUrl}-${idx}`}
                        className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 bg-white shadow-2xs group transition-all ${
                          idx === 0
                            ? 'border-[#e05d82] ring-2 ring-[#e05d82]/20'
                            : 'border-[#f3d7df]'
                        }`}
                      >
                        <Image
                          src={imgUrl}
                          alt={`Foto Produk ${idx + 1}`}
                          fill
                          className="object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              '/images/products/aromatherapy-candle.jpg';
                          }}
                        />

                        {/* Cover Badge */}
                        {idx === 0 ? (
                          <span className="absolute top-1.5 left-1.5 bg-[#e05d82] text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                            <Star className="w-2.5 h-2.5 fill-white" />
                            <span>Cover Utama</span>
                          </span>
                        ) : (
                          <span className="absolute top-1.5 left-1.5 bg-black/60 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded-md backdrop-blur-xs">
                            #{idx + 1}
                          </span>
                        )}

                        {/* Action Overlay on Hover */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                          <div className="flex justify-end">
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="p-1 rounded-lg bg-rose-600/90 text-white hover:bg-rose-700 transition-colors cursor-pointer"
                              title="Hapus foto ini"
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
                <p className="text-[10px] text-[#9d7c8b] pt-1">
                  💡 Tips: Arahkan kursor ke foto untuk melihat tombol <strong>Hapus</strong> atau{' '}
                  <strong>Jadikan Cover</strong>.
                </p>
              </div>

              {/* Varian Produk Bertingkat Harga (Shopee Style) */}
              <div className="bg-[#fff7f9] p-4 sm:p-5 rounded-2xl border border-[#f3d7df] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-[#2e1c24] flex items-center gap-1.5 text-xs sm:text-sm">
                      <ShoppingBag className="w-4 h-4 text-[#e05d82]" />
                      <span>Varian Produk & Harga Bertingkat (Ala Shopee)</span>
                    </h4>
                    <p className="text-[11px] text-[#755562] mt-0.5 leading-relaxed">
                      Atur pilihan variasi dengan foto & harga berbeda (contoh: Huruf Saja Rp 8.500
                      vs Huruf + Pita Rp 12.000 vs Box Mika Rp 16.500).
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddVariant()}
                    className="px-3.5 py-2 rounded-xl bg-[#e05d82] text-white font-bold text-xs hover:bg-[#c8476c] transition-colors flex items-center gap-1 shrink-0 self-start sm:self-auto cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Tambah Varian Baru</span>
                  </button>
                </div>

                {/* Preset Buttons */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-[#755562] font-semibold">
                    Template Varian Shopee:
                  </span>
                  <button
                    type="button"
                    onClick={() => handleApplyVariantPreset('resin')}
                    className="px-2.5 py-1 rounded-lg bg-white border border-[#f3d7df] text-[10px] font-semibold text-[#755562] hover:bg-[#fde8ee] hover:text-[#e05d82] transition-colors cursor-pointer"
                  >
                    + Gantungan Resin (Huruf / Pita / Box)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyVariantPreset('candle')}
                    className="px-2.5 py-1 rounded-lg bg-white border border-[#f3d7df] text-[10px] font-semibold text-[#755562] hover:bg-[#fde8ee] hover:text-[#e05d82] transition-colors cursor-pointer"
                  >
                    + Lilin Jar (60ml / 100ml / Box Gift)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyVariantPreset('hampers')}
                    className="px-2.5 py-1 rounded-lg bg-white border border-[#f3d7df] text-[10px] font-semibold text-[#755562] hover:bg-[#fde8ee] hover:text-[#e05d82] transition-colors cursor-pointer"
                  >
                    + Paket Hampers (Basic / Deluxe / Luxury)
                  </button>
                </div>

                {/* Active Variant Price Range Summary */}
                {editingProduct.variants && editingProduct.variants.length > 0 && (
                  <div className="p-3 bg-white rounded-xl border border-[#f3d7df] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#fde8ee] text-[#e05d82] flex items-center justify-center font-bold text-xs">
                        ✓
                      </span>
                      <div>
                        <span className="font-bold text-[#2e1c24]">
                          Rentang Harga Etalase:{' '}
                          <strong className="text-[#e05d82]">
                            {Math.min(...editingProduct.variants.map((v) => v.price)) ===
                            Math.max(...editingProduct.variants.map((v) => v.price))
                              ? formatRupiah(
                                  Math.min(...editingProduct.variants.map((v) => v.price))
                                )
                              : `${formatRupiah(
                                  Math.min(...editingProduct.variants.map((v) => v.price))
                                )} - ${formatRupiah(
                                  Math.max(...editingProduct.variants.map((v) => v.price))
                                )}`}
                          </strong>
                        </span>
                        <p className="text-[11px] text-[#755562]">
                          Total {editingProduct.variants.length} varian aktif. Di katalog pembeli
                          bisa klik varian dan harga otomatis berganti!
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('Hapus seluruh varian dan kembali ke harga produk tunggal?')) {
                          setEditingProduct({ ...editingProduct, variants: [] });
                        }
                      }}
                      className="text-rose-500 hover:text-rose-700 text-[11px] font-semibold underline cursor-pointer shrink-0"
                    >
                      Reset ke Harga Tunggal
                    </button>
                  </div>
                )}

                {/* Variants List */}
                {!editingProduct.variants || editingProduct.variants.length === 0 ? (
                  <div className="p-4 rounded-xl bg-white border border-dashed border-[#f3d7df] text-center">
                    <p className="text-xs text-[#755562]">
                      Produk ini saat ini menggunakan <strong>Harga Tunggal</strong> (
                      {formatRupiah(editingProduct.price)}). Jika Anda ingin membuat varian dengan
                      harga berbeda seperti Shopee, klik tombol{' '}
                      <strong>+ Tambah Varian Baru</strong> atau gunakan salah satu{' '}
                      <strong>Template Varian Shopee</strong> di atas.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 pt-1">
                    {editingProduct.variants.map((variant, vIdx) => {
                      const galleryImages =
                        editingProduct.images && editingProduct.images.length > 0
                          ? editingProduct.images
                          : [editingProduct.image_url];
                      const currentVariantImg =
                        variant.image_url ||
                        galleryImages[0] ||
                        '/images/products/aromatherapy-candle.jpg';

                      return (
                        <div
                          key={variant.id || vIdx}
                          className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#f3d7df] shadow-2xs space-y-3"
                        >
                          <div className="flex items-center justify-between pb-2 border-b border-[#f3d7df]/60">
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-[#fde8ee] text-[#e05d82] text-[10px] font-bold flex items-center justify-center shrink-0">
                                {vIdx + 1}
                              </span>
                              <span className="font-bold text-xs text-[#2e1c24]">
                                {variant.name || `Varian #${vIdx + 1}`}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveVariant(vIdx)}
                              className="p-1 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                              title="Hapus varian ini"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                            {/* Mini Variant Image Preview & Selector */}
                            <div className="sm:col-span-3 flex sm:flex-col items-center gap-2">
                              <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-[#f3d7df] bg-[#fff7f9] shrink-0">
                                <Image
                                  src={currentVariantImg}
                                  alt={variant.name}
                                  fill
                                  className="object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src =
                                      '/images/products/aromatherapy-candle.jpg';
                                  }}
                                />
                              </div>
                              <div className="flex-1 w-full text-center sm:text-left">
                                <select
                                  value={variant.image_url || galleryImages[0]}
                                  onChange={(e) =>
                                    handleUpdateVariant(vIdx, { image_url: e.target.value })
                                  }
                                  className="w-full text-[10px] px-2 py-1 rounded-lg border border-[#f3d7df] bg-[#fff7f9] text-[#2e1c24] truncate"
                                >
                                  {galleryImages.map((img, imgI) => (
                                    <option key={imgI} value={img}>
                                      {imgI === 0 ? '⭐ Foto Cover' : `Foto Galeri #${imgI + 1}`}
                                    </option>
                                  ))}
                                </select>
                                <label className="text-[10px] text-[#e05d82] hover:underline cursor-pointer block mt-0.5 font-semibold">
                                  + Upload foto varian
                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                      const f = e.target.files?.[0];
                                      if (f) handleUploadVariantFile(vIdx, f);
                                    }}
                                  />
                                </label>
                              </div>
                            </div>

                            {/* Variant Name */}
                            <div className="sm:col-span-4">
                              <label className="block text-[11px] font-bold text-[#2e1c24] mb-1">
                                Nama Varian <span className="text-rose-500">*</span>
                              </label>
                              <input
                                type="text"
                                required
                                placeholder="e.g. Huruf Saja / Huruf + Pita"
                                value={variant.name}
                                onChange={(e) =>
                                  handleUpdateVariant(vIdx, { name: e.target.value })
                                }
                                className="w-full px-3 py-1.5 rounded-xl border border-[#f3d7df] bg-[#fff7f9] text-xs font-semibold text-[#2e1c24] focus:outline-none focus:ring-1 focus:ring-[#e05d82]"
                              />
                            </div>

                            {/* Variant Price */}
                            <div className="sm:col-span-3">
                              <label className="block text-[11px] font-bold text-[#2e1c24] mb-1">
                                Harga Jual (Rp) <span className="text-rose-500">*</span>
                              </label>
                              <input
                                type="number"
                                required
                                value={variant.price}
                                onChange={(e) =>
                                  handleUpdateVariant(vIdx, { price: Number(e.target.value) })
                                }
                                className="w-full px-3 py-1.5 rounded-xl border border-[#f3d7df] bg-[#fff7f9] text-xs font-bold text-[#e05d82] focus:outline-none focus:ring-1 focus:ring-[#e05d82]"
                              />
                            </div>

                            {/* Variant Original Price */}
                            <div className="sm:col-span-2">
                              <label className="block text-[11px] font-bold text-[#2e1c24] mb-1">
                                Harga Coret (Rp)
                              </label>
                              <input
                                type="number"
                                placeholder="Opsional"
                                value={variant.original_price ?? ''}
                                onChange={(e) => {
                                  const val = e.target.value === '' ? null : Number(e.target.value);
                                  handleUpdateVariant(vIdx, { original_price: val });
                                }}
                                className="w-full px-3 py-1.5 rounded-xl border border-[#f3d7df] bg-[#fff7f9] text-xs text-[#2e1c24] focus:outline-none focus:ring-1 focus:ring-[#e05d82]"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Opsi Kustomisasi Produk (Custom Variations) */}
              <div className="bg-[#fff7f9] p-4 sm:p-5 rounded-2xl border border-[#f3d7df] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-[#2e1c24] flex items-center gap-1.5 text-xs sm:text-sm">
                      <Sparkles className="w-4 h-4 text-[#e05d82]" />
                      <span>Opsi Kustomisasi Produk (Pilihan Variasi Custom)</span>
                    </h4>
                    <p className="text-[11px] text-[#755562] mt-0.5 leading-relaxed">
                      Tambahkan variasi yang dapat dipilih pembeli saat memesan (e.g. Pilihan Aroma
                      Lilin, Warna Pita, Model Huruf Resin, Kartu Ucapan).
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAddOptionGroup('Pilihan Kustom Baru')}
                    className="px-3 py-1.5 rounded-xl bg-[#e05d82] text-white font-bold text-xs hover:bg-[#c8476c] transition-colors flex items-center gap-1 shrink-0 self-start sm:self-auto cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Opsi Kustom</span>
                  </button>
                </div>

                {/* Quick Preset Buttons */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-[#755562] font-semibold">Template Cepat:</span>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('aroma')}
                    className="px-2.5 py-1 rounded-lg bg-white border border-[#f3d7df] text-[10px] font-semibold text-[#755562] hover:bg-[#fde8ee] hover:text-[#e05d82] transition-colors cursor-pointer"
                  >
                    + Preset Aroma Lilin
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('pita')}
                    className="px-2.5 py-1 rounded-lg bg-white border border-[#f3d7df] text-[10px] font-semibold text-[#755562] hover:bg-[#fde8ee] hover:text-[#e05d82] transition-colors cursor-pointer"
                  >
                    + Preset Warna Pita
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('kartu')}
                    className="px-2.5 py-1 rounded-lg bg-white border border-[#f3d7df] text-[10px] font-semibold text-[#755562] hover:bg-[#fde8ee] hover:text-[#e05d82] transition-colors cursor-pointer"
                  >
                    + Preset Kartu Ucapan
                  </button>
                </div>

                {/* List of Custom Options */}
                {!editingProduct.options || editingProduct.options.length === 0 ? (
                  <div className="p-4 rounded-xl bg-white border border-dashed border-[#f3d7df] text-center">
                    <p className="text-xs text-[#755562]">
                      Belum ada opsi kustom untuk produk ini. Klik tombol{' '}
                      <strong>Tambah Opsi Kustom</strong> di atas atau gunakan salah satu{' '}
                      <strong>Template Cepat</strong>.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 pt-2">
                    {editingProduct.options.map((opt, optIdx) => (
                      <div
                        key={optIdx}
                        className="p-3.5 rounded-xl bg-white border border-[#f3d7df] shadow-2xs space-y-2.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex-1 flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-[#fde8ee] text-[#e05d82] text-[10px] font-bold flex items-center justify-center shrink-0">
                              {optIdx + 1}
                            </span>
                            <input
                              type="text"
                              required
                              placeholder="Nama Opsi (misal: Pilihan Aroma Lilin)"
                              value={opt.label}
                              onChange={(e) => handleUpdateOptionLabel(optIdx, e.target.value)}
                              className="w-full px-2.5 py-1 rounded-lg border border-[#f3d7df] bg-[#fff7f9] text-xs font-bold text-[#2e1c24] focus:outline-none focus:ring-1 focus:ring-[#e05d82]"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveOptionGroup(optIdx)}
                            className="p-1 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer shrink-0"
                            title="Hapus opsi ini"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Choices Chips */}
                        <div className="space-y-1.5 pl-7">
                          <span className="text-[10px] text-[#755562] font-semibold block">
                            Daftar Variasi Pilihan (klik ikon x untuk menghapus):
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {opt.choices.map((choice, cIdx) => (
                              <span
                                key={cIdx}
                                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#fde8ee] border border-[#f8ccd8] text-[11px] font-medium text-[#755562]"
                              >
                                <span>{choice}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveChoice(optIdx, cIdx)}
                                  className="text-zinc-400 hover:text-rose-600 cursor-pointer ml-0.5"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </span>
                            ))}
                          </div>

                          {/* Input to add choice */}
                          <div className="flex items-center gap-1.5 pt-1">
                            <input
                              type="text"
                              placeholder="Ketik pilihan variasi baru (misal: Vanilla Rose)..."
                              value={newChoiceInputs[optIdx] || ''}
                              onChange={(e) =>
                                setNewChoiceInputs({ ...newChoiceInputs, [optIdx]: e.target.value })
                              }
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  if (newChoiceInputs[optIdx]?.trim()) {
                                    handleAddChoice(optIdx, newChoiceInputs[optIdx]);
                                    setNewChoiceInputs({ ...newChoiceInputs, [optIdx]: '' });
                                  }
                                }
                              }}
                              className="flex-1 px-2.5 py-1 rounded-lg border border-[#f3d7df] bg-white text-xs text-[#2e1c24] focus:outline-none focus:ring-1 focus:ring-[#e05d82]"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (newChoiceInputs[optIdx]?.trim()) {
                                  handleAddChoice(optIdx, newChoiceInputs[optIdx]);
                                  setNewChoiceInputs({ ...newChoiceInputs, [optIdx]: '' });
                                }
                              }}
                              className="px-3 py-1 rounded-lg bg-[#df829b] text-white text-xs font-semibold hover:bg-[#c96c85] transition-colors cursor-pointer shrink-0"
                            >
                              + Tambah
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Material & Lead Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-[#2e1c24] mb-1">Material / Bahan</label>
                  <input
                    type="text"
                    value={editingProduct.material || ''}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, material: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-[#f3d7df] bg-[#fff7f9] text-sm text-[#2e1c24]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#2e1c24] mb-1">Estimasi Pengerjaan</label>
                  <input
                    type="text"
                    value={editingProduct.lead_time || ''}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, lead_time: e.target.value })
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-[#f3d7df] bg-[#fff7f9] text-sm text-[#2e1c24]"
                  />
                </div>
              </div>

              {/* Toggle Aktif */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="productActiveToggle"
                  checked={editingProduct.is_active !== false}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, is_active: e.target.checked })
                  }
                  className="w-4 h-4 accent-[#e05d82] cursor-pointer"
                />
                <label
                  htmlFor="productActiveToggle"
                  className="font-bold text-[#2e1c24] cursor-pointer"
                >
                  Tampilkan produk ini di halaman publik (Aktif)
                </label>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#f3d7df] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded-xl border border-[#f3d7df] text-xs font-bold text-[#755562] hover:bg-[#fff0f4] cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving || uploadingImages}
                  className="px-6 py-2 rounded-xl bg-[#e05d82] text-white text-xs font-bold hover:bg-[#c8476c] shadow-md shadow-[#e05d82]/20 flex items-center gap-2 cursor-pointer"
                >
                  {saving || uploadingImages ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  <span>Simpan Produk</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
