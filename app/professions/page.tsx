'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, ExternalLink } from 'lucide-react';
import AppShell from '@/components/AppShell';
import { useApp } from '@/components/Providers';
import { PROFESSIONS, PROF_CATS, STATUS_META, type ProfStatus } from '@/lib/professions';
import { bySlug } from '@/lib/lessons';

export default function ProfessionsPage() {
  const { user, progress } = useApp();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('all');
  const [st, setSt] = useState('all');

  const list = useMemo(() => PROFESSIONS.filter((p) =>
    (!q.trim() || `${p.name} ${p.ai} ${p.human} ${p.skills.join(' ')}`.toLowerCase().includes(q.trim().toLowerCase())) &&
    (cat === 'all' || p.cat === cat) && (st === 'all' || p.status === st)
  ), [q, cat, st]);

  if (!user) return <AppShell title="Карта профессий"><div /></AppShell>;

  return (
    <AppShell title="Карта профессий" subtitle={`${PROFESSIONS.length} профессий разобрано: что берёт ИИ, что остаётся человеку, с каких уроков начать.`}>
      <div className="bg-surface border border-border-subtle rounded-2xl p-5 mb-4">
        <div className="grid grid-cols-3 gap-3 mb-4">
          {([['changes', 78], ['new', 14], ['shrinks', 8]] as [ProfStatus, number][]).map(([k, n]) => (
            <div key={k} className="bg-surface-elevated rounded-xl p-4 text-center">
              <p className="font-heading font-bold text-2xl" style={{ color: STATUS_META[k].color }}>{n}</p>
              <p className="text-[11px] text-text-muted mt-0.5">{STATUS_META[k].label}</p>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-text-muted mb-4">Распределение по 100 профессиям — данные карты AI Mayak. Ниже — наши подробные разборы.</p>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex items-center bg-surface-elevated border border-border-subtle rounded-xl px-4 py-2.5 flex-1 focus-within:border-accent/50">
            <Search size={17} className="text-text-muted mr-2.5" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Профессия или навык" aria-label="Поиск профессии" className="w-full bg-transparent outline-none text-sm placeholder:text-text-muted" />
          </div>
          <select value={cat} onChange={(e) => setCat(e.target.value)} aria-label="Отрасль" className="field py-2.5 text-sm sm:w-[220px]">
            <option value="all">Все отрасли</option>{PROF_CATS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={st} onChange={(e) => setSt(e.target.value)} aria-label="Статус" className="field py-2.5 text-sm sm:w-[180px]">
            <option value="all">Любой статус</option>
            {(Object.keys(STATUS_META) as ProfStatus[]).map((k) => <option key={k} value={k}>{STATUS_META[k].label}</option>)}
          </select>
        </div>
      </div>

      <p className="text-sm text-text-secondary mb-3 px-1">Найдено: {list.length}</p>

      <div className="grid md:grid-cols-2 gap-4">
        {list.map((p) => (
          <div key={p.name} className="bg-surface border border-border-subtle rounded-2xl p-6 card-hover">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <h3 className="font-heading font-semibold text-lg">{p.name}</h3>
                <p className="text-xs text-text-muted mt-0.5">{p.cat}</p>
              </div>
              <span className="text-[10px] px-2.5 py-1 rounded-full font-medium shrink-0" style={{ background: `${STATUS_META[p.status].color}22`, color: STATUS_META[p.status].color }}>{STATUS_META[p.status].label}</span>
            </div>
            <div className="space-y-2 mb-4">
              <div className="bg-surface-elevated rounded-xl p-3"><p className="text-[11px] text-info mb-1">ИИ берёт на себя</p><p className="text-sm text-text-secondary leading-relaxed">{p.ai}</p></div>
              <div className="bg-surface-elevated rounded-xl p-3"><p className="text-[11px] text-accent mb-1">Остаётся человеку</p><p className="text-sm text-text-secondary leading-relaxed">{p.human}</p></div>
            </div>
            <p className="text-xs text-text-muted mb-2">Навыки на старт</p>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {p.skills.map((s) => <span key={s} className="text-[11px] px-2.5 py-1 rounded-lg bg-surface-elevated border border-border-subtle text-text-secondary">{s}</span>)}
            </div>
            <p className="text-xs text-text-muted mb-2">С этих уроков начать</p>
            <div className="space-y-1 mb-4">
              {p.lessons.map((slug) => {
                const l = bySlug(slug); if (!l) return null;
                return (
                  <Link key={slug} href={`/lessons/${slug}`} className="flex items-center gap-2 text-xs text-text-secondary hover:text-accent py-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${progress[slug] ? 'bg-accent-success' : 'bg-border-subtle'}`} />
                    <span className="font-mono text-text-muted">{String(l.n).padStart(2, '0')}</span>
                    <span className="truncate">{l.title}</span>
                    <ArrowRight size={12} className="ml-auto shrink-0" />
                  </Link>
                );
              })}
            </div>
            <p className="text-xs text-text-muted mb-1.5">Как заработать</p>
            <ul className="text-xs text-text-secondary space-y-1">{p.earn.map((e) => <li key={e}>· {e}</li>)}</ul>
          </div>
        ))}
      </div>

      {!list.length && (
        <div className="bg-surface border border-border-subtle rounded-2xl p-10 text-center">
          <p className="text-text-secondary mb-4">Под фильтры ничего не подошло.</p>
          <button onClick={() => { setQ(''); setCat('all'); setSt('all'); }} className="btn-ghost px-5 py-2.5 text-sm">Сбросить</button>
        </div>
      )}

      <div className="mt-6 bg-surface border border-border-subtle rounded-2xl p-5">
        <p className="text-sm text-text-secondary mb-2">Полная карта источника — 100 профессий с тремя способами заработка по каждой.</p>
        <a href="https://aimayak.com/ru/" target="_blank" rel="noopener noreferrer" className="text-sm text-accent hover:underline inline-flex items-center gap-1.5">Открыть карту AI Mayak<ExternalLink size={14} /></a>
      </div>
    </AppShell>
  );
}