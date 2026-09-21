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
  X,
  Megaphone,
  Flame,
  MapPin,
  Eye,
  EyeOff,
} from 'lucide-react';
import { WorkshopPackage, CurriculumStep, ReservationStep } from '@/types/workshop';
import { GalleryImageItem, SiteContentItem, WorkshopNewsItem } from '@/types/store';
import {
  DEFAULT_WORKSHOP_PACKAGES,
  DEFAULT_CURRICULUM_STEPS,
  DEFAULT_RESERVATION_STEPS,
} from '@/lib/workshopDefaults';
import CurriculumEditor from '@/components/admin/workshop/CurriculumEditor';
import ReservationStepsEditor from '@/components/admin/workshop/ReservationStepsEditor';
import PackageCardItem from '@/components/admin/workshop/PackageCardItem';
import PackageFormModal from '@/components/admin/workshop/PackageFormModal';
import WorkshopNewsEditorModal from '@/components/admin/workshop/WorkshopNewsEditorModal';
import WorkshopGallerySection from '@/components/admin/workshop/WorkshopGallerySection';

export default function AdminWorkshopPage() {
  const [activeTab, setActiveTab] = useState<
    'packages' | 'curriculum' | 'reservation' | 'gallery' | 'news'
  >('packages');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  // 1. Data States
  const [packages, setPackages] = useState<WorkshopPackage[]>(DEFAULT_WORKSHOP_PACKAGES);
  const [curriculum, setCurriculum] = useState<CurriculumStep[]>(DEFAULT_CURRICULUM_STEPS);
  const [reservationSteps, setReservationSteps] =
    useState<ReservationStep[]>(DEFAULT_RESERVATION_STEPS);
  const [galleryImages, setGalleryImages] = useState<GalleryImageItem[]>([]);
  const [workshopNews, setWorkshopNews] = useState<WorkshopNewsItem[]>([]);
  const [siteContent, setSiteContent] = useState<Record<string, SiteContentItem>>({});

  // 2. Modal States
  const [editingPackage, setEditingPackage] = useState<WorkshopPackage | null>(null);
  const [isAddingPackage, setIsAddingPackage] = useState(false);
  const [editingNews, setEditingNews] = useState<WorkshopNewsItem | null>(null);
  const [isAddingNews, setIsAddingNews] = useState(false);

  useEffect(() => {
    fetch('/api/store', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.siteContent) {
          setSiteContent(data.siteContent);

          if (data.siteContent['workshop_packages']?.content) {
            try {
              const parsed = JSON.parse(data.siteContent['workshop_packages'].content);
              if (Array.isArray(parsed) && parsed.length > 0) setPackages(parsed);
            } catch (e) {
              console.warn('Error parsing workshop_packages:', e);
            }
          }

          if (data.siteContent['workshop_curriculum']?.content) {
            try {
              const parsed = JSON.parse(data.siteContent['workshop_curriculum'].content);
              if (Array.isArray(parsed) && parsed.length > 0) setCurriculum(parsed);
            } catch (e) {
              console.warn('Error parsing workshop_curriculum:', e);
            }
          }

          if (data.siteContent['workshop_reservation_steps']?.content) {
            try {
              const parsed = JSON.parse(data.siteContent['workshop_reservation_steps'].content);
              if (Array.isArray(parsed) && parsed.length > 0) setReservationSteps(parsed);
            } catch (e) {
              console.warn('Error parsing workshop_reservation_steps:', e);
            }
          }
        }

        if (data.siteContent?.['workshop_gallery']?.content) {
          try {
            const parsed = JSON.parse(data.siteContent['workshop_gallery'].content);
            if (Array.isArray(parsed)) setGalleryImages(parsed);
          } catch (e) {
            console.warn('Error parsing workshop_gallery:', e);
          }
        } else if (data.galleryImages && Array.isArray(data.galleryImages)) {
          setGalleryImages(data.galleryImages);
        }

        if (data.siteContent?.['workshop_news']?.content) {
          try {
            const parsed = JSON.parse(data.siteContent['workshop_news'].content);
            if (Array.isArray(parsed)) setWorkshopNews(parsed);
          } catch (e) {
            console.warn('Error parsing workshop_news:', e);
          }
        } else if (data.workshopNews && Array.isArray(data.workshopNews)) {
          setWorkshopNews(data.workshopNews);
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
    customGallery?: GalleryImageItem[],
    customNews?: WorkshopNewsItem[]
  ) => {
    try {
      setSaving(true);
      const pkgsToSave = customPackages !== undefined ? customPackages : packages;
      const currToSave = customCurriculum !== undefined ? customCurriculum : curriculum;
      const resToSave = customReservation !== undefined ? customReservation : reservationSteps;
      const galToSave = customGallery !== undefined ? customGallery : galleryImages;
      const newsToSave = customNews !== undefined ? customNews : workshopNews;

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
        workshop_gallery: {
          section_key: 'workshop_gallery',
          title: 'Foto Dokumentasi Workshop Studio',
          content: JSON.stringify(galToSave),
        },
        workshop_news: {
          section_key: 'workshop_news',
          title: 'Berita & Event Promosi Workshop',
          content: JSON.stringify(newsToSave),
        },
      };

      const res = await fetch('/api/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteContent: updatedSiteContent,
          galleryImages: galToSave,
          workshopNews: newsToSave,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        if (data.data?.siteContent) {
          setSiteContent(data.data.siteContent);
        } else {
          setSiteContent(updatedSiteContent);
        }
        if (data.data?.galleryImages && Array.isArray(data.data.galleryImages)) {
          setGalleryImages(data.data.galleryImages);
        }
        if (data.data?.workshopNews && Array.isArray(data.data.workshopNews)) {
          setWorkshopNews(data.data.workshopNews);
        }
        showNotification(
          'Perubahan Workshop & Berita berhasil disimpan ke database & live website!'
        );
      } else {
        alert(data.error || 'Gagal menyimpan perubahan ke server.');
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
    await handleSaveAll(updated, undefined, undefined, undefined, undefined);
  };

  const handleDeletePackage = async (id: string) => {
    if (confirm('Hapus paket workshop ini? Tindakan ini tidak dapat dibatalkan.')) {
      const updated = packages.filter((p) => p.id !== id);
      setPackages(updated);
      await handleSaveAll(updated, undefined, undefined, undefined, undefined);
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
    await handleSaveAll(clone, undefined, undefined, undefined, undefined);
  };

  // --- NEWS ACTIONS ---
  const handleSaveNewsModal = async (newsItem: WorkshopNewsItem) => {
    let updated: WorkshopNewsItem[];
    if (isAddingNews) {
      updated = [newsItem, ...workshopNews];
    } else {
      updated = workshopNews.map((n) => (n.id === newsItem.id ? newsItem : n));
    }
    setWorkshopNews(updated);
    setEditingNews(null);
    setIsAddingNews(false);
    await handleSaveAll(undefined, undefined, undefined, undefined, updated);
  };

  const handleDeleteNews = async (id: string) => {
    if (confirm('Hapus berita atau promosi event workshop ini?')) {
      const updated = workshopNews.filter((n) => n.id !== id);
      setWorkshopNews(updated);
      await handleSaveAll(undefined, undefined, undefined, undefined, updated);
    }
  };

  const handleToggleActiveNews = async (id: string) => {
    const updated = workshopNews.map((n) => (n.id === id ? { ...n, is_active: !n.is_active } : n));
    setWorkshopNews(updated);
    await handleSaveAll(undefined, undefined, undefined, undefined, updated);
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
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#2e1c24] flex items-center gap-2">
            <Sparkles className="w-5 sm:w-6 h-5 sm:h-6 text-[#e05d82] shrink-0" />
            <span>Kelola Workshop Studio</span>
          </h1>
          <p className="text-xs text-[#755562] mt-1">
            Atur paket kelas, rincian biaya, kurikulum belajar, alur reservasi, dan foto dokumentasi
            workshop.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
          <a
            href="/workshop"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl border border-[#ebdcd5] bg-white text-zinc-700 text-xs font-semibold hover:bg-zinc-50 transition-colors text-center"
          >
            Lihat Halaman Live
          </a>
          <button
            onClick={() => handleSaveAll()}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-[#e05d82] hover:bg-[#c8476c] text-white text-xs font-bold transition-all shadow-md shadow-[#e05d82]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Simpan Semua Perubahan</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 p-1.5 bg-white border border-[#f3d7df] rounded-2xl shadow-2xs overflow-x-auto scrollbar-none w-full">
        <button
          onClick={() => setActiveTab('packages')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap shrink-0 min-h-[40px] cursor-pointer ${
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
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap shrink-0 min-h-[40px] cursor-pointer ${
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
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap shrink-0 min-h-[40px] cursor-pointer ${
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
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap shrink-0 min-h-[40px] cursor-pointer ${
            activeTab === 'gallery'
              ? 'bg-[#fde8ee] text-[#c45a76] shadow-2xs'
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
          }`}
        >
          <Images className="w-4 h-4" />
          <span>4. Foto Dokumentasi ({galleryImages.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('news')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap shrink-0 min-h-[40px] cursor-pointer ${
            activeTab === 'news'
              ? 'bg-[#fde8ee] text-[#c45a76] shadow-2xs'
              : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          <span>5. Berita & Event Promosi ({workshopNews.length})</span>
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
              <PackageCardItem
                key={pkg.id}
                pkg={pkg}
                index={idx}
                totalPackages={packages.length}
                onEdit={(item) => {
                  setIsAddingPackage(false);
                  setEditingPackage(item);
                }}
                onDelete={handleDeletePackage}
                onMove={handleMovePackage}
              />
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 2: KURIKULUM BELAJAR ================= */}
      {activeTab === 'curriculum' && (
        <div className="space-y-6">
          <CurriculumEditor steps={curriculum} onChange={(updated) => setCurriculum(updated)} />
          <div className="pt-4 flex justify-end">
            <button
              onClick={() => handleSaveAll(undefined, curriculum, undefined, undefined, undefined)}
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
          <ReservationStepsEditor
            steps={reservationSteps}
            onChange={(updated) => setReservationSteps(updated)}
          />
          <div className="pt-4 flex justify-end">
            <button
              onClick={() =>
                handleSaveAll(undefined, undefined, reservationSteps, undefined, undefined)
              }
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
          <WorkshopGallerySection
            images={galleryImages}
            onChange={async (updated) => {
              setGalleryImages(updated);
              await handleSaveAll(undefined, undefined, undefined, updated, undefined);
            }}
            showNotification={showNotification}
          />
        </div>
      )}

      {/* ================= TAB 5: BERITA & EVENT PROMOSI ================= */}
      {activeTab === 'news' && (
        <div className="space-y-6">
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#ebdcd5] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                <Flame className="w-5 h-5 text-[#e05d82]" />
                <span>Berita, Pengumuman & Event Promosi Workshop</span>
              </h2>
              <p className="text-xs text-zinc-500 mt-1 max-w-2xl leading-relaxed">
                Kelola pengumuman <em>Coming Soon</em>, pembukaan registrasi kelas akhir pekan, atau
                dokumentasi kegiatan. Daftar ini ditampilkan otomatis pada{' '}
                <strong>slider beranda</strong> dan sebagai <strong>berita interaktif</strong> saat
                foto di halaman workshop diklik.
              </p>
            </div>

            <button
              onClick={() => {
                setIsAddingNews(true);
                setEditingNews({
                  id: `news-${Date.now()}`,
                  title: 'Judul Pengumuman Workshop Baru',
                  image_url: '/images/products/studio-workshop.jpg',
                  summary:
                    'Ringkasan singkat mengenai acara atau informasi terbaru workshop yang menarik perhatian...',
                  content:
                    'Tuliskan deskripsi lengkap acara di sini. Misalnya materi belajar yang akan diajarkan, profil instruktur, alat & bahan yang disediakan, serta benefit yang didapatkan peserta...',
                  date: 'Coming Soon - November 2026',
                  location: 'Studio CraftByHanifa, Magetan',
                  status: 'coming_soon',
                  status_label: 'Segera Hadir',
                  category_label: 'Agenda Workshop',
                  wa_message: 'Halo Kak Hanifa, saya ingin info pendaftaran acara workshop ini.',
                  sort_order: workshopNews.length + 1,
                  is_active: true,
                });
              }}
              className="px-4 py-2.5 rounded-xl bg-[#c45a76] hover:bg-[#a8445e] text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Berita / Event Baru</span>
            </button>
          </div>

          {/* List of News Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {workshopNews.map((item) => {
              const statusColors: Record<string, string> = {
                coming_soon: 'bg-amber-100 text-amber-800 border-amber-200',
                open_registration: 'bg-emerald-100 text-emerald-800 border-emerald-200',
                completed: 'bg-zinc-100 text-zinc-700 border-zinc-200',
                special_event: 'bg-purple-100 text-purple-800 border-purple-200',
              };

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-3xl border overflow-hidden shadow-2xs flex flex-col justify-between transition-all hover:shadow-md ${
                    item.is_active ? 'border-[#ebdcd5]' : 'border-zinc-200 opacity-70 bg-zinc-50/50'
                  }`}
                >
                  <div>
                    {/* Thumbnail Image */}
                    <div className="relative aspect-[16/9] w-full bg-zinc-100 overflow-hidden">
                      <Image src={item.image_url} alt={item.title} fill className="object-cover" />
                      <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border shadow-2xs uppercase tracking-wider ${
                            statusColors[item.status] || 'bg-zinc-100 text-zinc-700 border-zinc-200'
                          }`}
                        >
                          {item.status_label || item.status}
                        </span>
                        {!item.is_active && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-zinc-800/80 text-white shadow-2xs">
                            Nonaktif
                          </span>
                        )}
                      </div>

                      <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                        <button
                          onClick={() => handleToggleActiveNews(item.id)}
                          className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors cursor-pointer shadow-xs ${
                            item.is_active
                              ? 'bg-white/90 text-emerald-700 hover:bg-white'
                              : 'bg-zinc-800/80 text-zinc-300 hover:bg-zinc-800'
                          }`}
                          title={item.is_active ? 'Sembunyikan dari publik' : 'Tampilkan ke publik'}
                        >
                          {item.is_active ? (
                            <Eye className="w-3.5 h-3.5" />
                          ) : (
                            <EyeOff className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDeleteNews(item.id)}
                          className="w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-rose-600 transition-colors cursor-pointer shadow-xs"
                          title="Hapus berita"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Content preview */}
                    <div className="p-4 sm:p-5 space-y-3">
                      <div className="flex items-center gap-2 text-[11px] text-[#8e5264] font-semibold">
                        <Calendar className="w-3.5 h-3.5 shrink-0 text-[#e05d82]" />
                        <span className="truncate">{item.date}</span>
                      </div>

                      <h3 className="font-serif font-bold text-sm text-zinc-900 line-clamp-2 leading-snug">
                        {item.title}
                      </h3>

                      <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed">
                        {item.summary}
                      </p>

                      <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 pt-1">
                        <MapPin className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        <span className="truncate">{item.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="p-4 pt-0">
                    <button
                      onClick={() => {
                        setIsAddingNews(false);
                        setEditingNews({ ...item });
                      }}
                      className="w-full py-2.5 px-3 rounded-xl bg-[#fdf2f4] hover:bg-[#fce5ea] text-[#c45a76] text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-[#f3d7df]"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Rincian Berita & Event</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 flex justify-end">
            <button
              onClick={() =>
                handleSaveAll(undefined, undefined, undefined, undefined, workshopNews)
              }
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-[#c45a76] hover:bg-[#a8445e] text-white text-xs font-bold transition-all shadow-md shadow-[#c45a76]/20 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Simpan Perubahan Berita & Event</span>
            </button>
          </div>
        </div>
      )}

      {/* ================= MODAL EDIT / TAMBAH PAKET ================= */}
      {editingPackage && (
        <PackageFormModal
          initialData={editingPackage}
          isAdding={isAddingPackage}
          onClose={() => setEditingPackage(null)}
          onSave={handleSavePackageModal}
        />
      )}

      {/* ================= MODAL EDIT / TAMBAH BERITA & EVENT ================= */}
      {editingNews && (
        <WorkshopNewsEditorModal
          initialData={editingNews}
          isAdding={isAddingNews}
          onClose={() => setEditingNews(null)}
          onSave={handleSaveNewsModal}
        />
      )}
    </div>
  );
}
