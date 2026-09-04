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
          checkFallback();
        }
      })
      .catch(() => {
        checkFallback();
      });

    function checkFallback() {
      const authStatus = sessionStorage.getItem('craftbyhanifa_admin_auth');
      if (authStatus === 'true') {
        setIsAuthenticated(true);
        const storedEmail = sessionStorage.getItem('craftbyhanifa_admin_email');
        if (storedEmail) setAdminEmail(storedEmail);
      } else {
        setIsAuthenticated(false);
      }
    }
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

    sessionStorage.removeItem('craftbyhanifa_admin_auth');
    sessionStorage.removeItem('craftbyhanifa_admin_email');
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
      <div className="md:hidden bg-white border-b border-[#f3d7df] p-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full overflow-hidden relative border border-[#f3d7df] bg-white shadow-2xs shrink-0">
            <Image
              src="/images/products/avatar.jpg"
              alt="CraftByHanifa"
              fill
              className="object-cover"
            />
          </div>
          <span className="font-serif font-bold text-sm text-[#2e1c24]">CraftByHanifa CMS</span>
        </div>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-xl bg-[#fff7f9] text-[#2e1c24] hover:bg-[#fde8ee]"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {sidebarOpen && (
        <div className="md:hidden bg-white border-b border-[#f3d7df] p-4 space-y-2 animate-fadeIn z-20">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold ${
                  active ? 'bg-[#e05d82] text-white' : 'text-[#5e414d] hover:bg-[#fff0f4]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
          <div className="pt-2 border-t border-[#f3d7df] flex justify-between items-center">
            <Link href="/" target="_blank" className="text-xs font-bold text-[#e05d82]">
              Lihat Website Publik &rarr;
            </Link>
            <button
              onClick={handleLogout}
              className="text-xs font-bold text-rose-600 hover:underline"
            >
              Keluar
            </button>
          </div>
        </div>
      )}

      {/* Main Admin Page Content */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">{children}</main>
    </div>
  );
}
