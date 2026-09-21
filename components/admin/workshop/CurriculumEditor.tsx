'use client';

import React from 'react';
import { CurriculumStep } from '@/types/workshop';
import { Trash2, Plus, MoveUp, MoveDown, BookOpen } from 'lucide-react';

interface CurriculumEditorProps {
  steps: CurriculumStep[];
  onChange: (steps: CurriculumStep[]) => void;
}

export default function CurriculumEditor({ steps, onChange }: CurriculumEditorProps) {
  const handleUpdate = (index: number, field: keyof CurriculumStep, val: string) => {
    const updated = [...steps];
    updated[index] = { ...updated[index], [field]: val };
    onChange(updated);
  };

  const handleAdd = () => {
    const nextNum = (steps.length + 1).toString().padStart(2, '0');
    onChange([...steps, { step: nextNum, title: 'Materi Baru', desc: 'Deskripsi materi sesi...' }]);
  };

  const handleDelete = (index: number) => {
    if (steps.length <= 1) {
      alert('Minimal harus ada 1 materi kurikulum.');
      return;
    }
    onChange(steps.filter((_, idx) => idx !== index));
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= steps.length) return;
    const clone = [...steps];
    const temp = clone[index];
    clone[index] = clone[targetIdx];
    clone[targetIdx] = temp;
    onChange(clone);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200">
        <div>
          <h2 className="font-serif font-bold text-lg text-zinc-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#c45a76]" />
            <span>Kurikulum Materi Pembelajaran Workshop</span>
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            Ubah 4 tahap materi pembelajaran lilin aromaterapi yang dipelajari peserta.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="px-4 py-2 rounded-xl bg-white border border-[#ebdcd5] text-xs font-bold text-[#c45a76] hover:bg-[#fdf0f3] flex items-center gap-1.5 cursor-pointer shadow-2xs"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Modul Baru</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl bg-white border border-[#ebdcd5] shadow-xs space-y-3 relative group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#c45a76] bg-[#fdf0f3] px-2.5 py-1 rounded-lg">
                Step #{idx + 1}
              </span>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleMove(idx, 'up')}
                  disabled={idx === 0}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 disabled:opacity-20 cursor-pointer"
                  title="Geser Naik"
                >
                  <MoveUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleMove(idx, 'down')}
                  disabled={idx === steps.length - 1}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 disabled:opacity-20 cursor-pointer"
                  title="Geser Turun"
                >
                  <MoveDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(idx)}
                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 cursor-pointer"
                  title="Hapus Modul"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-zinc-700 mb-1">
                  Judul Materi:
                </label>
                <input
                  type="text"
                  value={step.title}
                  onChange={(e) => handleUpdate(idx, 'title', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 font-semibold focus:outline-none focus:border-[#c45a76]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-zinc-700 mb-1">Deskripsi:</label>
                <textarea
                  rows={3}
                  value={step.desc}
                  onChange={(e) => handleUpdate(idx, 'desc', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-zinc-200 text-xs focus:outline-none focus:border-[#c45a76]"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
