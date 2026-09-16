'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutTemplate,
  Package,
  Info,
  Phone,
  LayoutDashboard,
  LogOut,
  ExternalLink,
  Sparkles,
  Database,
  Menu,
  X,
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [adminEmail, setAdminEmail] = useState<string>('craftbyhanifa@gmail.com');
  const dataSource: 'supabase' | 'local' = isSupabaseConfigured ? 'supabase' : 'local';
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // If on /admin/login, don't show admin sidebar/header wrapper
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) return;

    // Verifikasi sesi terenkripsi server-side via cookie
    fetch('/api/auth/check')
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error('Not authenticated');
      })
      .then((data) => {
        if (data.authenticated) {
          setIsAuthenticated(true);
          if (data.user?.email) {
            setAdminEmail(data.user.email);
          }
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch(() => {
        setIsAuthenticated(false);
      });
  }, [pathname, isLoginPage]);

  // Protect all non-login admin routes
  useEffect(() => {
    if (isAuthenticated === false && !isLoginPage) {
      router.push('/admin/login');
    }
  }, [isAuthenticated, isLoginPage, router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    }

    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut().catch(() => {});
    }

    setIsAuthenticated(false);
    router.push('/admin/login');
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-[#fff7f9] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#e05d82] border-t-transparent animate-spin" />
      </div>
    );
  }

  const menuItems = [
    { label: 'Dashboard Ringkasan', href: '/admin', icon: LayoutDashboard },
    { label: '1. Kelola Beranda & Banner', href: '/admin/beranda', icon: LayoutTemplate },
    { label: '2. Kelola Produk Lilin', href: '/admin/produk', icon: Package },
    { label: '3. Kelola Workshop Studio', href: '/admin/workshop', icon: Sparkles },
    { label: '4. Tentang Kami & Visi', href: '/admin/tentang-kami', icon: Info },
    { label: '5. Kontak & Sosmed', href: '/admin/kontak', icon: Phone },
  ];

  return (
    <div className="min-h-screen bg-[#fff7f9] text-[#2e1c24] flex flex-col md:flex-row w-full overflow-x-hidden">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col justify-between w-64 bg-white border-r border-[#f3d7df] p-5 sticky top-0 h-screen shrink-0 shadow-xs">
        <div className="space-y-6">
          {/* Brand & Status */}
          <div>
            <Link href="/admin" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-full overflow-hidden relative border border-[#f3d7df] bg-white shadow-2xs group-hover:scale-105 transition-transform shrink-0">
                <Image
                  src="/images/products/avatar.jpg"
                  alt="CraftByHanifa"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h1 className="font-serif font-bold text-sm text-[#2e1c24] group-hover:text-[#e05d82] transition-colors leading-tight">
                  CraftByHanifa CMS
                </h1>
                <span className="text-[10px] text-[#9d7c8b] block">Panel Admin Mandiri</span>
              </div>
            </Link>

            <div className="mt-3 pt-3 border-t border-[#fce7ed] flex items-center justify-between">
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                  dataSource === 'supabase'
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}
              >
                <Database className="w-3 h-3" />
                {dataSource === 'supabase' ? 'Supabase Active' : 'Local Storage'}
              </span>

              <Link
                href="/"
                target="_blank"
                className="text-[11px] font-bold text-[#e05d82] hover:underline flex items-center gap-1"
                title="Buka Website Publik"
              >
                <span>Web</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-bold transition-all ${
                    active
                      ? 'bg-[#e05d82] text-white shadow-xs'
                      : 'text-[#5e414d] hover:bg-[#fff0f4] hover:text-[#e05d82]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom User & Logout */}
        <div className="pt-4 border-t border-[#f3d7df] flex items-center justify-between">
          <div className="text-xs min-w-0 pr-2">
            <span className="font-bold text-[#2e1c24] block truncate">Hanifa Kumala</span>
            <span className="text-[10px] text-[#755562] block truncate" title={adminEmail}>
              {adminEmail}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer shrink-0"
            title="Keluar dari Panel Admin"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Top Header for Mobile */}
      <div className="md:hidden bg-white/95 backdrop-blur-md border-b border-[#f3d7df] px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full overflow-hidden relative border border-[#f3d7df] bg-white shadow-2xs shrink-0">
            <Image
              src="/images/products/avatar.jpg"
              alt="CraftByHanifa"
              fill
              className="object-cover"
            />
          </div>
          <div className="min-w-0">
            <span className="font-serif font-bold text-sm text-[#2e1c24] block truncate">
              CraftByHanifa CMS
            </span>
            <span className="text-[10px] text-[#9d7c8b] block truncate">
              {dataSource === 'supabase' ? '🟢 Supabase Active' : '🟡 Local Storage'}
            </span>
          </div>
        </div>

        <button
          onClick={() => setSidebarOpen(true)}
          className="w-10 h-10 rounded-xl bg-[#fff7f9] text-[#2e1c24] hover:bg-[#fde8ee] flex items-center justify-center cursor-pointer transition-colors shrink-0"
          aria-label="Buka Menu Navigasi"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Slide-Over Drawer & Backdrop */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-fadeIn"
            onClick={() => setSidebarOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col justify-between p-5 z-10 animate-scaleUp overflow-y-auto">
            <div className="space-y-5">
              {/* Drawer Top Branding */}
              <div className="flex items-center justify-between pb-3 border-b border-[#fce7ed]">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full overflow-hidden relative border border-[#f3d7df] bg-white shadow-2xs shrink-0">
                    <Image
                      src="/images/products/avatar.jpg"
                      alt="CraftByHanifa"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="font-serif font-bold text-sm text-[#2e1c24]">CraftByHanifa</h2>
                    <span className="text-[10px] text-[#9d7c8b]">Panel Admin Mandiri</span>
                  </div>
                </div>

                <button
                  onClick={() => setSidebarOpen(false)}
                  className="w-9 h-9 rounded-xl bg-[#fff7f9] text-[#755562] hover:bg-[#fde8ee] flex items-center justify-center cursor-pointer"
                  aria-label="Tutup Menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status & Web Link */}
              <div className="flex items-center justify-between px-2 py-1.5 bg-[#fff7f9] rounded-xl border border-[#fce7ed] text-[11px]">
                <span className="font-bold text-[#755562] flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-[#e05d82]" />
                  <span>{dataSource === 'supabase' ? 'Supabase Cloud' : 'Local Storage'}</span>
                </span>
                <Link
                  href="/"
                  target="_blank"
                  className="font-bold text-[#e05d82] hover:underline flex items-center gap-1"
                >
                  <span>Lihat Web</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

              {/* Nav Links */}
              <nav className="space-y-1.5">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all min-h-[44px] ${
                        active
                          ? 'bg-[#e05d82] text-white shadow-sm'
                          : 'text-[#5e414d] hover:bg-[#fff0f4] active:bg-[#fde8ee]'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Account & Logout */}
            <div className="pt-4 mt-6 border-t border-[#f3d7df] flex items-center justify-between">
              <div className="text-xs min-w-0 pr-2">
                <span className="font-bold text-[#2e1c24] block truncate">Hanifa Kumala</span>
                <span className="text-[10px] text-[#755562] block truncate" title={adminEmail}>
                  {adminEmail}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer shrink-0"
                title="Keluar"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Admin Page Content */}
      <main className="flex-1 min-w-0 p-3 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">{children}</main>
    </div>
  );
}
