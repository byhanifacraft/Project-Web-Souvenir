'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Sparkles,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  Loader2,
  Layers,
  BookOpen,
  Calendar,
  Images,
  Edit2,
  ArrowUp,
  ArrowDown,
  Upload,
  Clock,
  Users,
  Gift,
  Check,
  X,
} from 'lucide-react';
import { WorkshopPackage, CurriculumStep, ReservationStep } from '@/types/workshop';
import { GalleryImageItem, SiteContentItem } from '@/types/store';
import {
  DEFAULT_WORKSHOP_PACKAGES,
  DEFAULT_CURRICULUM_STEPS,
  DEFAULT_RESERVATION_STEPS,
} from '@/lib/workshopDefaults';

export default function AdminWorkshopPage() {
  const [activeTab, setActiveTab] = useState<'packages' | 'curriculum' | 'reservation' | 'gallery'>(
    'packages'
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  // 1. Data States
  const [packages, setPackages] = useState<WorkshopPackage[]>(DEFAULT_WORKSHOP_PACKAGES);
  const [curriculum, setCurriculum] = useState<CurriculumStep[]>(DEFAULT_CURRICULUM_STEPS);
  const [reservationSteps, setReservationSteps] =
    useState<ReservationStep[]>(DEFAULT_RESERVATION_STEPS);
  const [galleryImages, setGalleryImages] = useState<GalleryImageItem[]>([]);
  const [siteContent, setSiteContent] = useState<Record<string, SiteContentItem>>({});

  // 2. Modal States for Package Editing / Adding
  const [editingPackage, setEditingPackage] = useState<WorkshopPackage | null>(null);
  const [isAddingPackage, setIsAddingPackage] = useState(false);

  // 3. Modal / Upload State for Gallery Photo
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [newGalleryCaption, setNewGalleryCaption] = useState('');
  const newGalleryCategory = 'workshop';
  const [newGalleryCategoryLabel, setNewGalleryCategoryLabel] = useState('Workshop Studio');

  useEffect(() => {
    fetch('/api/store', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.siteContent) {
          setSiteContent(data.siteContent);

          // Parse Packages
          if (data.siteContent['workshop_packages']?.content) {
            try {
              const parsed = JSON.parse(data.siteContent['workshop_packages'].content);
              if (Array.isArray(parsed) && parsed.length > 0) setPackages(parsed);
            } catch (e) {
              console.warn('Error parsing workshop_packages:', e);
            }
          }

          // Parse Curriculum
          if (data.siteContent['workshop_curriculum']?.content) {
            try {
              const parsed = JSON.parse(data.siteContent['workshop_curriculum'].content);
              if (Array.isArray(parsed) && parsed.length > 0) setCurriculum(parsed);
            } catch (e) {
              console.warn('Error parsing workshop_curriculum:', e);
            }
          }

          // Parse Reservation Steps
          if (data.siteContent['workshop_reservation_steps']?.content) {
            try {
              const parsed = JSON.parse(data.siteContent['workshop_reservation_steps'].content);
              if (Array.isArray(parsed) && parsed.length > 0) setReservationSteps(parsed);
            } catch (e) {
              console.warn('Error parsing workshop_reservation_steps:', e);
            }
          }
        }

        if (data.galleryImages && Array.isArray(data.galleryImages)) {
          setGalleryImages(data.galleryImages);
        }
      })
      .catch((err) => console.error('Error fetching workshop data:', err))
      .finally(() => setLoading(false));
  }, []);

  const showNotification = (msg: string) => {
    setSaveSuccess(msg);
    setTimeout(() => setSaveSuccess(null), 4000);
  };

  // --- SAVE ALL WORKSHOP CONTENT ---
  const handleSaveAll = async (
    customPackages?: WorkshopPackage[],
    customCurriculum?: CurriculumStep[],
    customReservation?: ReservationStep[],
    customGallery?: GalleryImageItem[]
  ) => {
    try {
      setSaving(true);
      const pkgsToSave = customPackages || packages;
      const currToSave = customCurriculum || curriculum;
      const resToSave = customReservation || reservationSteps;
      const galToSave = customGallery || galleryImages;

      const updatedSiteContent = {
        ...siteContent,
        workshop_packages: {
          section_key: 'workshop_packages',
          title: 'Paket Workshop Lilin Aromaterapi',
          content: JSON.stringify(pkgsToSave),
        },
        workshop_curriculum: {
          section_key: 'workshop_curriculum',
          title: 'Kurikulum Belajar Workshop',
          content: JSON.stringify(currToSave),
        },
        workshop_reservation_steps: {
          section_key: 'workshop_reservation_steps',
          title: 'Langkah Reservasi Workshop',
          content: JSON.stringify(resToSave),
        },
      };

      const res = await fetch('/api/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteContent: updatedSiteContent,
          galleryImages: galToSave,
        }),
      });

      if (res.ok) {
        setSiteContent(updatedSiteContent);
        showNotification('Perubahan Workshop berhasil disimpan ke database & live website!');
      } else {
        alert('Gagal menyimpan perubahan ke server.');
      }
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan jaringan saat menyimpan.');
    } finally {
      setSaving(false);
    }
  };

  // --- PACKAGE ACTIONS ---
  const handleSavePackageModal = async (pkg: WorkshopPackage) => {
    let updated: WorkshopPackage[];
    if (isAddingPackage) {
      updated = [...packages, pkg];
    } else {
      updated = packages.map((p) => (p.id === pkg.id ? pkg : p));
    }
    setPackages(updated);
    setEditingPackage(null);
    setIsAddingPackage(false);
    await handleSaveAll(updated, undefined, undefined, undefined);
  };

  const handleDeletePackage = async (id: string) => {
    if (confirm('Hapus paket workshop ini? Tindakan ini tidak dapat dibatalkan.')) {
      const updated = packages.filter((p) => p.id !== id);
      setPackages(updated);
      await handleSaveAll(updated, undefined, undefined, undefined);
    }
  };

  const handleMovePackage = async (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= packages.length) return;
    const clone = [...packages];
    const temp = clone[index];
    clone[index] = clone[targetIdx];
    clone[targetIdx] = temp;
    setPackages(clone);
    await handleSaveAll(clone, undefined, undefined, undefined);
  };

  // --- CURRICULUM ACTIONS ---
  const handleCurriculumChange = (index: number, field: keyof CurriculumStep, value: string) => {
    const updated = [...curriculum];
    updated[index] = { ...updated[index], [field]: value };
    setCurriculum(updated);
  };

  const handleAddCurriculumStep = () => {
    const newStep: CurriculumStep = {
      step: `0${curriculum.length + 1}`,
      title: 'Langkah Baru Praktik Lilin',
      desc: 'Deskripsi materi dan teknik yang dipelajari peserta.',
    };
    const updated = [...curriculum, newStep];
    setCurriculum(updated);
  };

  const handleDeleteCurriculumStep = (index: number) => {
    if (confirm('Hapus langkah kurikulum ini?')) {
      const updated = curriculum.filter((_, i) => i !== index);
      setCurriculum(updated);
    }
  };

  // --- RESERVATION STEP ACTIONS ---
  const handleReservationChange = (index: number, field: keyof ReservationStep, value: string) => {
    const updated = [...reservationSteps];
    updated[index] = { ...updated[index], [field]: value };
    setReservationSteps(updated);
  };

  const handleAddReservationStep = () => {
    const newStep: ReservationStep = {
      step: `${reservationSteps.length + 1}`,
      title: 'Langkah Baru',
      desc: 'Penjelasan langkah yang perlu dilakukan calon peserta.',
    };
    const updated = [...reservationSteps, newStep];
    setReservationSteps(updated);
  };

  const handleDeleteReservationStep = (index: number) => {
    if (confirm('Hapus langkah pendaftaran ini?')) {
      const updated = reservationSteps.filter((_, i) => i !== index);
      setReservationSteps(updated);
    }
  };

  // --- GALLERY ACTIONS ---
  const handleUploadGalleryPhoto = async (file: File) => {
    try {
      setUploadingGallery(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', 'gallery');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        const newItem: GalleryImageItem = {
          id: `gal-${Date.now()}`,
          image_url: data.url,
          caption: newGalleryCaption || 'Suasana kegiatan workshop studio CraftByHanifa',
          sort_order: galleryImages.length + 1,
          category: newGalleryCategory || 'workshop',
          category_label: newGalleryCategoryLabel || 'Workshop Studio',
        };
        const updated = [...galleryImages, newItem];
        setGalleryImages(updated);
        setNewGalleryCaption('');
        await handleSaveAll(undefined, undefined, undefined, updated);
        showNotification('Foto dokumentasi studio berhasil diunggah!');
      } else {
        alert(data.error || 'Gagal mengunggah foto.');
      }
    } catch {
      alert('Terjadi kesalahan jaringan saat upload foto.');
    } finally {
      setUploadingGallery(false);
    }
  };

  const handleDeleteGalleryImage = async (id: string) => {
    if (confirm('Hapus foto ini dari galeri dokumentasi workshop?')) {
      const updated = galleryImages.filter((g) => g.id !== id);
      setGalleryImages(updated);
      await handleSaveAll(undefined, undefined, undefined, updated);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
        <Loader2 className="w-8 h-8 text-[#e05d82] animate-spin" />
        <p className="text-xs font-semibold text-[#755562]">Memuat data workshop...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl pb-16">
      {/* Toast Notification */}
      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between shadow-sm animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveSuccess}</span>
          </div>
          <button
            onClick={() => setSaveSuccess(null)}
            className="text-emerald-500 hover:text-emerald-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#2e1c24] flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#e05d82]" />
            <span>Kelola Workshop Studio</span>
          </h1>
          <p className="text-xs text-[#755562] mt-1">
            Atur paket kelas, rincian biaya, kurikulum belajar, alur reservasi, dan foto dokumentasi
            workshop.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href="/workshop"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl border border-[#ebdcd5] bg-white text-zinc-700 text-xs font-semibold hover:bg-zinc-50 transition-colors"
          >
            Lihat Halaman Live
          </a>
          <button
            onClick={() => handleSaveAll()}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-[#e05d82] hover:bg-[#c8476c] text-white text-xs font-bold transition-all shadow-md shadow-[#e05d82]/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Simpan Semua Perubahan</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 p-1.5 bg-white border border-[#f3d7df] rounded-2xl shadow-2xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('packages')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'packages'
              ? 'bg-[#fde8ee] text-[#c45a76] shadow-2xs'
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>1. Paket Workshop ({packages.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('curriculum')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'curriculum'
              ? 'bg-[#fde8ee] text-[#c45a76] shadow-2xs'
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>2. Kurikulum Praktik ({curriculum.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reservation')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'reservation'
              ? 'bg-[#fde8ee] text-[#c45a76] shadow-2xs'
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>3. Langkah Reservasi ({reservationSteps.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('gallery')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'gallery'
              ? 'bg-[#fde8ee] text-[#c45a76] shadow-2xs'
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
          }`}
        >
          <Images className="w-4 h-4" />
          <span>4. Foto Dokumentasi ({galleryImages.length})</span>
        </button>
      </div>

      {/* ================= TAB 1: PAKET WORKSHOP ================= */}
      {activeTab === 'packages' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-zinc-900">Daftar Pilihan Paket Kelas</h2>
              <p className="text-xs text-zinc-500">
                Atur judul, biaya per orang, durasi, fasilitas materi, karya bawa pulang, dan teks
                template WhatsApp.
              </p>
            </div>
            <button
              onClick={() => {
                setIsAddingPackage(true);
                setEditingPackage({
                  id: `pkg-${Date.now()}`,
                  name: 'Paket Workshop Baru',
                  badge: '',
                  tagline: 'Deskripsi singkat paket kelas baru',
                  price: 'Rp 200.000',
                  duration: '2 Jam',
                  capacity: '1 - 6 Orang',
                  description: 'Penjelasan lengkap apa yang didapatkan peserta...',
                  features: [
                    '100% natural soy wax nabati',
                    'Alat & apron studio lengkap',
                    'Welcome drink & snack',
                  ],
                  takeHome: [
                    '1 Jar Lilin Aromaterapi buatan sendiri',
                    'Gift box cantik',
                    'Sertifikat keikutsertaan',
                  ],
                  buttonLabel: 'Daftar Paket Ini',
                  waMessage:
                    'Halo Kak Hanifa, saya ingin mendaftar sesi paket workshop ini. Mohon info jadwalnya.',
                });
              }}
              className="px-4 py-2 rounded-xl bg-[#c45a76] hover:bg-[#a8445e] text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Paket Baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((pkg, idx) => (
              <div
                key={pkg.id}
                className="bg-white rounded-3xl p-6 border border-[#ebdcd5] shadow-2xs flex flex-col justify-between relative hover:border-[#c45a76]/40 transition-all"
              >
                {pkg.badge && (
                  <div className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-gradient-to-r from-[#c45a76] to-[#df829b] text-white text-[10px] font-bold uppercase tracking-wider shadow-xs">
                    {pkg.badge}
                  </div>
                )}

                <div>
                  <div className="flex items-start justify-between gap-2 mb-2 pt-1">
                    <div>
                      <h3 className="font-serif font-bold text-lg text-zinc-900 leading-tight">
                        {pkg.name}
                      </h3>
                      <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2">{pkg.tagline}</p>
                    </div>
                  </div>

                  <div className="py-3 my-3 border-y border-zinc-100 bg-[#faf6f2]/60 -mx-6 px-6">
                    <div className="flex items-baseline gap-1">
                      <span className="font-serif font-bold text-2xl text-[#c45a76]">
                        {pkg.price}
                      </span>
                      <span className="text-[11px] text-zinc-400">/ orang</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 text-[11px] text-zinc-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#c45a76]" />
                        {pkg.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-zinc-400" />
                        {pkg.capacity}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs mb-4">
                    <div>
                      <span className="font-bold text-zinc-700 block mb-1">
                        Materi & Fasilitas ({pkg.features.length}):
                      </span>
                      <ul className="space-y-1 text-zinc-600 max-h-28 overflow-y-auto pr-1">
                        {pkg.features.map((f, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2 border-t border-zinc-100">
                      <span className="font-bold text-[#c45a76] block mb-1">
                        Karya Bawa Pulang ({pkg.takeHome.length}):
                      </span>
                      <ul className="space-y-1 text-zinc-600">
                        {pkg.takeHome.map((th, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <Gift className="w-3.5 h-3.5 text-[#c45a76] shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{th}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2 border-t border-zinc-100 text-[11px] text-zinc-500">
                      <span className="font-semibold text-zinc-700">Tombol:</span> {pkg.buttonLabel}
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-4 border-t border-zinc-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleMovePackage(idx, 'up')}
                      disabled={idx === 0}
                      className="w-7 h-7 rounded-lg border border-zinc-200 text-zinc-600 flex items-center justify-center hover:bg-zinc-50 disabled:opacity-30 cursor-pointer"
                      title="Geser ke kiri"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMovePackage(idx, 'down')}
                      disabled={idx === packages.length - 1}
                      className="w-7 h-7 rounded-lg border border-zinc-200 text-zinc-600 flex items-center justify-center hover:bg-zinc-50 disabled:opacity-30 cursor-pointer"
                      title="Geser ke kanan"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setIsAddingPackage(false);
                        setEditingPackage(pkg);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDeletePackage(pkg.id)}
                      className="w-7 h-7 rounded-lg text-rose-600 hover:bg-rose-50 flex items-center justify-center cursor-pointer transition-colors"
                      title="Hapus Paket"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 2: KURIKULUM BELAJAR ================= */}
      {activeTab === 'curriculum' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-zinc-900">Kurikulum Praktik Workshop</h2>
              <p className="text-xs text-zinc-500">
                Atur langkah-langkah materi yang dipelajari peserta pada bagian &quot;Kurikulum
                Praktik: Apa Saja yang Dipelajari?&quot;.
              </p>
            </div>
            <button
              onClick={handleAddCurriculumStep}
              className="px-4 py-2 rounded-xl bg-[#c45a76] hover:bg-[#a8445e] text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Langkah Materi</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {curriculum.map((step, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-3xl border border-[#ebdcd5] shadow-2xs space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-zinc-400">Kode Langkah:</span>
                    <input
                      type="text"
                      value={step.step}
                      onChange={(e) => handleCurriculumChange(idx, 'step', e.target.value)}
                      className="w-16 px-2 py-1 text-center font-serif font-bold text-base bg-[#faf6f2] border border-[#ebdcd5] rounded-xl text-[#c45a76]"
                      placeholder="01"
                    />
                  </div>
                  {curriculum.length > 1 && (
                    <button
                      onClick={() => handleDeleteCurriculumStep(idx)}
                      className="text-zinc-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                      title="Hapus langkah ini"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Judul Langkah:
                  </label>
                  <input
                    type="text"
                    value={step.title}
                    onChange={(e) => handleCurriculumChange(idx, 'title', e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#ebdcd5] focus:outline-hidden focus:border-[#c45a76] bg-white font-medium"
                    placeholder="Contoh: Seni Blending Fragrance Oil"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Deskripsi Materi:
                  </label>
                  <textarea
                    rows={3}
                    value={step.desc}
                    onChange={(e) => handleCurriculumChange(idx, 'desc', e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#ebdcd5] focus:outline-hidden focus:border-[#c45a76] bg-white leading-relaxed"
                    placeholder="Jelaskan apa yang dipelajari pada langkah ini..."
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={() => handleSaveAll()}
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-[#c45a76] hover:bg-[#a8445e] text-white text-xs font-bold transition-all shadow-md shadow-[#c45a76]/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Simpan Perubahan Kurikulum</span>
            </button>
          </div>
        </div>
      )}

      {/* ================= TAB 3: LANGKAH RESERVASI ================= */}
      {activeTab === 'reservation' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-zinc-900">Alur Reservasi Workshop</h2>
              <p className="text-xs text-zinc-500">
                Atur tahapan proses pendaftaran peserta pada bagian &quot;4 Langkah Mudah Reservasi
                Workshop&quot;.
              </p>
            </div>
            <button
              onClick={handleAddReservationStep}
              className="px-4 py-2 rounded-xl bg-[#c45a76] hover:bg-[#a8445e] text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Tahapan</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {reservationSteps.map((step, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-3xl border border-[#ebdcd5] shadow-2xs space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-zinc-400">Nomor Tahap:</span>
                    <input
                      type="text"
                      value={step.step}
                      onChange={(e) => handleReservationChange(idx, 'step', e.target.value)}
                      className="w-14 px-2 py-1 text-center font-serif font-bold text-base bg-[#faf6f2] border border-[#ebdcd5] rounded-xl text-[#c45a76]"
                      placeholder="1"
                    />
                  </div>
                  {reservationSteps.length > 1 && (
                    <button
                      onClick={() => handleDeleteReservationStep(idx)}
                      className="text-zinc-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                      title="Hapus langkah ini"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Judul Tahapan:
                  </label>
                  <input
                    type="text"
                    value={step.title}
                    onChange={(e) => handleReservationChange(idx, 'title', e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#ebdcd5] focus:outline-hidden focus:border-[#c45a76] bg-white font-medium"
                    placeholder="Contoh: Chat WhatsApp Admin"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">
                    Deskripsi Tahapan:
                  </label>
                  <textarea
                    rows={3}
                    value={step.desc}
                    onChange={(e) => handleReservationChange(idx, 'desc', e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#ebdcd5] focus:outline-hidden focus:border-[#c45a76] bg-white leading-relaxed"
                    placeholder="Jelaskan apa yang harus dilakukan peserta..."
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={() => handleSaveAll()}
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-[#c45a76] hover:bg-[#a8445e] text-white text-xs font-bold transition-all shadow-md shadow-[#c45a76]/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Simpan Perubahan Reservasi</span>
            </button>
          </div>
        </div>
      )}

      {/* ================= TAB 4: FOTO DOKUMENTASI STUDIO ================= */}
      {activeTab === 'gallery' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-[#ebdcd5] shadow-2xs space-y-4">
            <h2 className="text-base font-bold text-zinc-900">
              Upload Foto Dokumentasi Studio Baru
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
                  value={newGalleryCaption}
                  onChange={(e) => setNewGalleryCaption(e.target.value)}
                  placeholder="Contoh: Sesi penuangan lilin soy wax oleh peserta"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#ebdcd5] focus:outline-hidden focus:border-[#c45a76]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">
                  Label Tag Foto:
                </label>
                <input
                  type="text"
                  value={newGalleryCategoryLabel}
                  onChange={(e) => setNewGalleryCategoryLabel(e.target.value)}
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
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleUploadGalleryPhoto(e.target.files[0]);
                    }
                  }}
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryImages.map((item) => (
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
                  <button
                    onClick={() => handleDeleteGalleryImage(item.id)}
                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-rose-600 transition-colors cursor-pointer"
                    title="Hapus foto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
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
        </div>
      )}

      {/* ================= MODAL EDIT / TAMBAH PAKET ================= */}
      {editingPackage && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#ebdcd5] my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 mb-6">
              <h3 className="font-serif font-bold text-lg text-zinc-900">
                {isAddingPackage ? 'Tambah Paket Workshop Baru' : `Edit ${editingPackage.name}`}
              </h3>
              <button
                onClick={() => setEditingPackage(null)}
                className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-zinc-700 mb-1">Nama Paket:</label>
                <input
                  type="text"
                  value={editingPackage.name}
                  onChange={(e) => setEditingPackage({ ...editingPackage, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#ebdcd5] focus:outline-hidden focus:border-[#c45a76] font-semibold"
                  placeholder="Contoh: Paket Basic (Intro to Candle Making)"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Harga Tampil:</label>
                  <input
                    type="text"
                    value={editingPackage.price}
                    onChange={(e) =>
                      setEditingPackage({ ...editingPackage, price: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#ebdcd5] focus:outline-hidden focus:border-[#c45a76]"
                    placeholder="Rp 150.000"
                  />
                </div>
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Durasi Sesi:</label>
                  <input
                    type="text"
                    value={editingPackage.duration}
                    onChange={(e) =>
                      setEditingPackage({ ...editingPackage, duration: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#ebdcd5] focus:outline-hidden focus:border-[#c45a76]"
                    placeholder="1.5 - 2 Jam"
                  />
                </div>
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Kapasitas Peserta:</label>
                  <input
                    type="text"
                    value={editingPackage.capacity}
                    onChange={(e) =>
                      setEditingPackage({ ...editingPackage, capacity: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#ebdcd5] focus:outline-hidden focus:border-[#c45a76]"
                    placeholder="1 - 8 Orang"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">
                    Badge Atas (Opsional):
                  </label>
                  <input
                    type="text"
                    value={editingPackage.badge || ''}
                    onChange={(e) =>
                      setEditingPackage({ ...editingPackage, badge: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#ebdcd5] focus:outline-hidden focus:border-[#c45a76]"
                    placeholder="Contoh: Paling Populer, Custom Sesi"
                  />
                </div>
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">
                    Teks Tombol Reservasi:
                  </label>
                  <input
                    type="text"
                    value={editingPackage.buttonLabel}
                    onChange={(e) =>
                      setEditingPackage({ ...editingPackage, buttonLabel: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#ebdcd5] focus:outline-hidden focus:border-[#c45a76]"
                    placeholder="Contoh: Daftar Paket Basic"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Tagline Ringkas:</label>
                <input
                  type="text"
                  value={editingPackage.tagline}
                  onChange={(e) =>
                    setEditingPackage({ ...editingPackage, tagline: e.target.value })
                  }
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
                  value={editingPackage.features.join('\n')}
                  onChange={(e) =>
                    setEditingPackage({
                      ...editingPackage,
                      features: e.target.value.split('\n').filter((f) => f.trim().length > 0),
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#ebdcd5] focus:outline-hidden focus:border-[#c45a76] leading-relaxed"
                  placeholder="100% natural soy wax nabati murni&#10;Pilihan jenis sumbu&#10;Eksplorasi 6 aroma signature..."
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">
                  Karya Dibawa Pulang (1 Poin per Baris):
                </label>
                <textarea
                  rows={3}
                  value={editingPackage.takeHome.join('\n')}
                  onChange={(e) =>
                    setEditingPackage({
                      ...editingPackage,
                      takeHome: e.target.value.split('\n').filter((t) => t.trim().length > 0),
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#ebdcd5] focus:outline-hidden focus:border-[#c45a76] leading-relaxed"
                  placeholder="1 Jar Lilin Aromaterapi Soy Wax (100g)&#10;Box kemasan cantik berpita&#10;Sertifikat Resmi Keikutsertaan..."
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">
                  Template Pesan WhatsApp Otomatis:
                </label>
                <textarea
                  rows={2}
                  value={editingPackage.waMessage}
                  onChange={(e) =>
                    setEditingPackage({ ...editingPackage, waMessage: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#ebdcd5] focus:outline-hidden focus:border-[#c45a76]"
                  placeholder="Halo Kak Hanifa, saya ingin mendaftar..."
                />
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-zinc-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditingPackage(null)}
                className="px-4 py-2.5 rounded-xl border border-zinc-200 text-zinc-600 font-semibold hover:bg-zinc-50 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => handleSavePackageModal(editingPackage)}
                className="px-6 py-2.5 rounded-xl bg-[#c45a76] hover:bg-[#a8445e] text-white font-bold transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Paket</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
