'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Play, BookOpen, Briefcase, Wrench, FileText } from 'lucide-react';

type Line = { role: 'user' | 'ai'; text: string };
const SCRIPT: Line[] = [
  { role: 'user', text: 'У меня салон красоты. Что здесь может делать ИИ?' },
  { role: 'ai', text: 'Три задачи с быстрой отдачей: ответы на типовые вопросы в переписке, описания услуг для карточек и посты из фото работ. Начни с переписки — там больше всего рутины.' },
  { role: 'user', text: 'С чего начать сегодня?' },
  { role: 'ai', text: 'Выпиши 10 вопросов, которые клиенты задают чаще всего. Дай их ассистенту вместе с твоими ответами и попроси собрать шаблоны в твоём тоне. Проверь каждый вручную — и можно использовать.' },
];

function Terminal() {
  const [lines, setLines] = useState<Line[]>([]);
  const [text, setText] = useState('');
  const [phase, setPhase] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);
  const iv = useRef<ReturnType<typeof setInterval> | null>(null);
  const to = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (phase >= SCRIPT.length) {
      to.current = setTimeout(() => { setLines([]); setText(''); setPhase(0); }, 3600);
      return () => { if (to.current) clearTimeout(to.current); };
    }
    const cur = SCRIPT[phase];
    let i = 0; setText('');
    const speed = cur.role === 'user' ? 34 : 16;
    iv.current = setInterval(() => {
      if (i < cur.text.length) { i++; setText(cur.text.slice(0, i)); }
      else {
        if (iv.current) { clearInterval(iv.current); iv.current = null; }
        to.current = setTimeout(() => { setLines((p) => [...p, cur]); setText(''); setPhase((p) => p + 1); }, cur.role === 'user' ? 450 : 1400);
      }
    }, speed);
    return () => { if (iv.current) clearInterval(iv.current); if (to.current) clearTimeout(to.current); };
  }, [phase]);

  useEffect(() => { const el = boxRef.current; if (el) el.scrollTop = el.scrollHeight; }, [lines, text]);
  const isUser = phase % 2 === 0;

  return (
    <div className="w-full max-w-[500px] bg-surface/90 backdrop-blur rounded-2xl border border-border-subtle overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,.6)]">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border-subtle">
        <span className="w-3 h-3 rounded-full bg-[#FF5F57]" /><span className="w-3 h-3 rounded-full bg-[#FEBC2E]" /><span className="w-3 h-3 rounded-full bg-[#28C840]" />
        <span className="ml-3 text-xs text-text-muted font-mono">генератор идей · демо</span>
      </div>
      <div ref={boxRef} className="p-5 h-[320px] overflow-y-auto scroll-slim">
        {lines.map((l, i) => (
          <div key={i} className={`mb-3 ${l.role === 'user' ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block max-w-[88%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed text-left ${l.role === 'user' ? 'bg-accent/10 border border-accent/25 text-text-primary' : 'bg-surface-elevated border border-border-subtle text-text-secondary'}`}>{l.text}</div>
          </div>
        ))}
        {text && (
          <div className={isUser ? 'text-right' : 'text-left'}>
            <div className={`inline-block max-w-[88%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed text-left ${isUser ? 'bg-accent/10 border border-accent/25 text-text-primary' : 'bg-surface-elevated border border-border-subtle text-text-secondary'}`}>
              {text}<span className="typing-cursor" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const NUMBERS = [
  { icon: BookOpen, value: '53', label: 'урока ядра', color: '#C6FF00' },
  { icon: Briefcase, value: '20', label: 'профессий в карте', color: '#FFB020' },
  { icon: Wrench, value: '24', label: 'инструмента', color: '#22D3EE' },
  { icon: FileText, value: '50', label: 'идей и шаблонов', color: '#FF3D9A' },
];

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const fade = useTransform(scrollYProgress, [0, .8], [1, .25]);

  return (
    <section ref={ref} className="relative min-h-[100svh] flex items-center overflow-hidden hero-grid">
      <div className="aurora drift-a w-[560px] h-[560px] -top-40 -right-24" style={{ background: 'radial-gradient(circle,rgba(198,255,0,.16),transparent 65%)' }} />
      <div className="aurora drift-b w-[520px] h-[520px] top-1/3 -left-40" style={{ background: 'radial-gradient(circle,rgba(124,58,237,.18),transparent 65%)' }} />
      <div className="aurora drift-a w-[420px] h-[420px] -bottom-32 right-1/4" style={{ background: 'radial-gradient(circle,rgba(34,211,238,.12),transparent 65%)' }} />

      <div className="relative max-w-[1280px] mx-auto px-6 pt-28 pb-20 w-full">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-10 items-center">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, ease: [0.22, 1, 0.36, 1] }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent/10 border border-accent/25 rounded-full mb-6">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <span className="text-xs font-medium text-accent">Первый поток · демо-доступ открыт бесплатно</span>
            </div>

            <h1 className="font-heading font-extrabold text-[clamp(34px,6vw,72px)] leading-[1.04] tracking-tight mb-6">
              Перестань бояться ИИ. <span className="gradient-text">Начни им пользоваться.</span>
            </h1>

            <p className="text-lg md:text-xl text-text-secondary leading-relaxed mb-8 max-w-[540px]">
              53 урока основного курса, карта профессий, тренажёр промптов и 50 идей для дела.
              Прогресс, заметки и сертификат — в одном кабинете.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Link href="/login?tier=2" className="btn-primary inline-flex items-center justify-center gap-2 px-8 py-[18px] text-base">
                Открыть доступ<ArrowRight size={18} />
              </Link>
              <a href="#program" className="btn-ghost inline-flex items-center justify-center gap-2 px-8 py-[18px] text-base font-medium">
                <Play size={16} />Посмотреть программу
              </a>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-[560px]">
              {NUMBERS.map((n) => {
                const Icon = n.icon;
                return (
                  <div key={n.label} className="bg-surface/70 border border-border-subtle rounded-xl px-3 py-3">
                    <Icon size={16} style={{ color: n.color }} className="mb-1.5" />
                    <p className="font-heading font-bold text-xl leading-none">{n.value}</p>
                    <p className="text-[11px] text-text-muted mt-1 leading-tight">{n.label}</p>
                  </div>
                );
              })}
            </div>

            <p className="text-xs text-text-muted mt-5 max-w-[560px] leading-relaxed">
              В основе — открытая академия AI Mayak: 53 урока ядра и 105 уроков углублённой библиотеки, 100 профессий, 193 инструмента.
              Мы отобрали ядро, адаптировали примеры под сервисы, доступные из России, и добавили кабинет с трекингом.
            </p>
          </motion.div>

          <motion.div style={{ y, opacity: fade }} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .8, delay: .25, ease: [0.22, 1, 0.36, 1] }} className="flex justify-center lg:justify-end">
            <Terminal />
          </motion.div>
        </div>
      </div>
    </section>
  );
}