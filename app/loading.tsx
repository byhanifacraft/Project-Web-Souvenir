import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4 py-20 animate-fadeIn">
      <div className="w-12 h-12 rounded-full border-3 border-[#fce7ed] border-t-[#e05d82] animate-spin" />
      <p className="text-xs text-zinc-400 font-medium tracking-wide">
        Memuat data kreasi CraftByHanifa...
      </p>
    </div>
  );
}
