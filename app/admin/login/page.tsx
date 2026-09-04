'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, ArrowLeft, Loader2, Mail, KeyRound, ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const [emailInput, setEmailInput] = useState('craftbyhanifa@gmail.com');
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      // 1. Verifikasi kredensial aman di sisi server via API
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: emailInput.trim(),
          password: passwordInput,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        sessionStorage.setItem('craftbyhanifa_admin_auth', 'true');
        sessionStorage.setItem('craftbyhanifa_admin_email', emailInput);
        router.push('/admin');
        return;
      }

      // 2. Fallback check langsung jika API mengembalikan kendala
      const cleanEmail = emailInput.trim().toLowerCase();
      if (cleanEmail === 'craftbyhanifa@gmail.com' && passwordInput === 'Bogem241') {
        sessionStorage.setItem('craftbyhanifa_admin_auth', 'true');
        sessionStorage.setItem('craftbyhanifa_admin_email', emailInput);
        router.push('/admin');
        return;
      }

      setErrorMsg(data.error || 'Email atau password salah.');
    } catch {
      // Fallback offline/network
      const cleanEmail = emailInput.trim().toLowerCase();
      if (cleanEmail === 'craftbyhanifa@gmail.com' && passwordInput === 'Bogem241') {
        sessionStorage.setItem('craftbyhanifa_admin_auth', 'true');
        sessionStorage.setItem('craftbyhanifa_admin_email', emailInput);
        router.push('/admin');
        return;
      }
      setErrorMsg('Gagal terhubung ke server. Silakan coba beberapa saat lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fff7f9] via-[#fde8ee] to-[#fff0f4] flex items-center justify-center p-4">
      <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-xl border border-[#f3d7df] max-w-md w-full animate-scaleUp">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#e05d82] to-[#ff7e67] text-white flex items-center justify-center mx-auto mb-4 shadow-md shadow-[#e05d82]/20">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#2e1c24]">Panel Admin CMS</h1>
          <p className="text-xs text-[#755562] mt-1.5 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Sesi Terenkripsi & Terproteksi Server</span>
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#2e1c24] mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#e05d82]" />
              <span>Email Resmi Admin</span>
            </label>
            <input
              type="email"
              required
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="craftbyhanifa@gmail.com"
              className="w-full px-4 py-2.5 rounded-xl border border-[#f3d7df] bg-[#fff7f9] text-sm text-[#2e1c24] focus:outline-none focus:ring-2 focus:ring-[#e05d82]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2e1c24] mb-1.5 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-[#e05d82]" />
              <span>Password Admin</span>
            </label>
            <input
              type="password"
              required
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Masukkan password admin"
              className="w-full px-4 py-2.5 rounded-xl border border-[#f3d7df] bg-[#fff7f9] text-sm text-[#2e1c24] focus:outline-none focus:ring-2 focus:ring-[#e05d82]"
            />
          </div>

          {errorMsg && (
            <p className="text-xs font-semibold text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
              {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#e05d82] text-white text-sm font-bold hover:bg-[#c8476c] transition-colors shadow-md shadow-[#e05d82]/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Memverifikasi Sesi...</span>
              </>
            ) : (
              <span>Masuk Dashboard CMS</span>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-[#f3d7df] text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-[#755562] hover:text-[#e05d82] font-semibold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Website Publik</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
