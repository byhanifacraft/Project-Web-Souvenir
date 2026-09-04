'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function AdminGalleryPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/workshop');
  }, [router]);

  return (
    <div className="py-24 text-center">
      <Loader2 className="w-8 h-8 text-[#e05d82] animate-spin mx-auto mb-3" />
      <p className="text-xs text-[#755562] font-semibold">
        Mengalihkan ke modul Kelola Workshop Studio...
      </p>
    </div>
  );
}
