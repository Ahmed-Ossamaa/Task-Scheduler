'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

type BannerProps = {
  text?: string;
};

export function Banner({ text }: BannerProps) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="relative flex items-center justify-center py-2 px-4 bg-primary/10 text-primary text-[10px] font-bold tracking-[0.2em]">
      <span className="text-center">{text}</span>

      <button
        onClick={() => setVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100  hover:text-red-500 transition"
        aria-label="Close banner"
        title="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  );
}
