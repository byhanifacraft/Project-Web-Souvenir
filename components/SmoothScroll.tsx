'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Lenis from 'lenis';

export default function SmoothScroll() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Jangan aktifkan jika user mengaktifkan "prefers-reduced-motion" untuk aksesibilitas
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    // Inisialisasi Lenis dengan inertia curve yang halus & premium
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      prevent: (node) => {
        return (
          node.hasAttribute('data-lenis-prevent') ||
          Boolean(node.closest?.('[data-lenis-prevent]')) ||
          Boolean(node.closest?.('[role="dialog"]')) ||
          document.body.style.overflow === 'hidden'
        );
      },
    });

    lenisRef.current = lenis;

    // Sinkronkan Lenis dengan requestAnimationFrame
    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    const handleStop = () => {
      if (!lenis.isStopped) lenis.stop();
    };
    const handleStart = () => {
      if (lenis.isStopped) lenis.start();
    };
    window.addEventListener('lenis:stop', handleStop);
    window.addEventListener('lenis:start', handleStart);

    // Tangani link anchor internal (misal #katalog, #tentang-kami, dsb)
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest('a');
      if (!target) return;
      const href = target.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        const elem = document.querySelector(href);
        if (elem) {
          e.preventDefault();
          lenis.scrollTo(elem as HTMLElement, { offset: -80 });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    // Pantau secara reaktif jika ada modal/dialog yang terbuka agar scroll background halaman terkunci total
    const checkModalState = () => {
      const hasModal =
        document.body.style.overflow === 'hidden' ||
        document.documentElement.style.overflow === 'hidden' ||
        document.querySelector('[role="dialog"]') !== null;

      if (hasModal) {
        if (!lenis.isStopped) {
          lenis.stop();
        }
      } else {
        if (lenis.isStopped) {
          lenis.start();
        }
      }
    };

    const modalObserver = new MutationObserver(() => {
      checkModalState();
    });

    modalObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ['style', 'class'],
      childList: true,
      subtree: true,
    });

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      window.removeEventListener('lenis:stop', handleStop);
      window.removeEventListener('lenis:start', handleStart);
      modalObserver.disconnect();
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Saat berpindah halaman (route change), reset scroll ke paling atas seketika
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }
  }, [pathname]);

  return null;
}
