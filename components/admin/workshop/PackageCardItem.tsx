'use client';

import React from 'react';
import Image from 'next/image';
import { WorkshopPackage, normalizeTakeHomeItem } from '@/types/workshop';
import { Clock, Users, Check, Gift, ArrowUp, ArrowDown, Edit2, Trash2 } from 'lucide-react';

interface PackageCardItemProps {
  pkg: WorkshopPackage;
  index: number;
  totalPackages: number;
  onEdit: (pkg: WorkshopPackage) => void;
  onDelete: (id: string) => void;
  onMove: (index: number, direction: 'up' | 'down') => void;
}

export default function PackageCardItem({
  pkg,
  index,
  totalPackages,
  onEdit,
  onDelete,
  onMove,
}: PackageCardItemProps) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-[#ebdcd5] shadow-2xs flex flex-col justify-between relative hover:border-[#c45a76]/40 transition-all">
      {pkg.badge && (
        <div className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-gradient-to-r from-[#c45a76] to-[#df829b] text-white text-[10px] font-bold uppercase tracking-wider shadow-xs">
          {pkg.badge}
        </div>
      )}

      <div>
        <div className="flex items-start justify-between gap-2 mb-2 pt-1">
          <div>
            <h3 className="font-serif font-bold text-lg text-zinc-900 leading-tight">{pkg.name}</h3>
            <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2">{pkg.tagline}</p>
          </div>
        </div>

        <div className="py-3 my-3 border-y border-zinc-100 bg-[#faf6f2]/60 -mx-6 px-6">
          <div className="flex items-baseline gap-1">
            <span className="font-serif font-bold text-2xl text-[#c45a76]">{pkg.price}</span>
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
            <ul className="space-y-1.5 text-zinc-600">
              {pkg.takeHome.map((rawTh, i) => {
                const th = normalizeTakeHomeItem(rawTh);
                return (
                  <li key={i} className="flex items-center gap-2">
                    {th.image_url ? (
                      <Image
                        src={th.image_url}
                        alt={th.title}
                        width={24}
                        height={24}
                        className="w-6 h-6 rounded-md object-cover border border-[#ebdcd5] shrink-0"
                      />
                    ) : (
                      <Gift className="w-3.5 h-3.5 text-[#c45a76] shrink-0" />
                    )}
                    <span className="line-clamp-1 truncate">{th.title}</span>
                  </li>
                );
              })}
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
            type="button"
            onClick={() => onMove(index, 'up')}
            disabled={index === 0}
            className="w-7 h-7 rounded-lg border border-zinc-200 text-zinc-600 flex items-center justify-center hover:bg-zinc-50 disabled:opacity-30 cursor-pointer"
            title="Geser ke kiri"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onMove(index, 'down')}
            disabled={index === totalPackages - 1}
            className="w-7 h-7 rounded-lg border border-zinc-200 text-zinc-600 flex items-center justify-center hover:bg-zinc-50 disabled:opacity-30 cursor-pointer"
            title="Geser ke kanan"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(pkg)}
            className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
          <button
            type="button"
            onClick={() => onDelete(pkg.id)}
            className="w-7 h-7 rounded-lg text-rose-600 hover:bg-rose-50 flex items-center justify-center cursor-pointer transition-colors"
            title="Hapus Paket"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
