'use client';

import React from 'react';
import { ReservationStep } from '@/types/workshop';
import { Plus, Trash2, Calendar } from 'lucide-react';

interface ReservationStepsEditorProps {
  steps: ReservationStep[];
  onChange: (steps: ReservationStep[]) => void;
}

export default function ReservationStepsEditor({ steps, onChange }: ReservationStepsEditorProps) {
  const handleUpdate = (index: number, field: keyof ReservationStep, value: string) => {
    const updated = [...steps];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const handleAdd = () => {
    const newStep: ReservationStep = {
      step: `${steps.length + 1}`,
      title: 'Langkah Baru',
      desc: 'Penjelasan langkah yang perlu dilakukan calon peserta.',
    };
    onChange([...steps, newStep]);
  };

  const handleDelete = (index: number) => {
    if (steps.length <= 1) {
      alert('Minimal harus ada 1 langkah reservasi.');
      return;
    }
    if (confirm('Hapus langkah pendaftaran ini?')) {
      onChange(steps.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#c45a76]" />
            <span>Alur Reservasi Workshop</span>
          </h2>
          <p className="text-xs text-zinc-500">
            Atur tahapan proses pendaftaran peserta pada bagian &quot;4 Langkah Mudah Reservasi
            Workshop&quot;.
          </p>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="px-4 py-2 rounded-xl bg-[#c45a76] hover:bg-[#a8445e] text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Tahapan</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {steps.map((step, idx) => (
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
                  onChange={(e) => handleUpdate(idx, 'step', e.target.value)}
                  className="w-14 px-2 py-1 text-center font-serif font-bold text-base bg-[#faf6f2] border border-[#ebdcd5] rounded-xl text-[#c45a76]"
                  placeholder="1"
                />
              </div>
              {steps.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleDelete(idx)}
                  className="text-zinc-400 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                  title="Hapus langkah ini"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1">Judul Tahapan:</label>
              <input
                type="text"
                value={step.title}
                onChange={(e) => handleUpdate(idx, 'title', e.target.value)}
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
                onChange={(e) => handleUpdate(idx, 'desc', e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#ebdcd5] focus:outline-hidden focus:border-[#c45a76] bg-white leading-relaxed"
                placeholder="Jelaskan apa yang harus dilakukan peserta..."
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
