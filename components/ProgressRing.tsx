'use client';

import { motion } from 'framer-motion';

export default function ProgressRing({ pct, done, total, size = 168 }: { pct: number; done: number; total: number; size?: number }) {
  const stroke = 12, r = (size - stroke) / 2, c = 2 * Math.PI * r;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#C6FF00" /><stop offset="55%" stopColor="#22D3EE" /><stop offset="100%" stopColor="#7C3AED" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#262B36" strokeWidth={stroke} />
        <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="url(#ringGrad)" strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} initial={{ strokeDashoffset: c }} animate={{ strokeDashoffset: c - (c * pct) / 100 }} transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-heading font-extrabold text-3xl">{pct}%</span>
        <span className="text-xs text-text-muted mt-0.5">{done} из {total}</span>
      </div>
    </div>
  );
}