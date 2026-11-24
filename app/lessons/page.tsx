'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, CheckCircle2, Circle, Clock, BookmarkPlus, X, Check, RotateCcw } from 'lucide-react';
import AppShell from '@/components/AppShell';
import { useApp } from '@/components/Providers';
import { LESSONS, MODULES, ROUTES, stats, totalMinutes, type Route } from '@/lib/lessons';

type Sort = 'n' | 'minutes' | 'status';

export default function LessonsPage() {
  const { user, progress, views, toggleMany, restore, addView, removeView, toast } = useApp();
  const [q, setQ] = useState('');
  const [mod, setMod] = useState('all');
  const [route, setRoute] = useState('all');
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState<Sort>('n');
  const [sel, setSel] = useState<string[]>([]);

  const list = useMemo(() => {
    let r = LESSONS.filter((l) => {
      const okQ = !q.trim() || `${l.n} ${l.title} ${l.lead} ${l.tools.join(' ')}`.toLowerCase().includes(q.trim().toLowerCase());
      const okM = mod === 'all' || String(l.module) === mod;
      const okR = route === 'all' || l.route === route;
      const okS = status === 'all' || (status === 'done' ? !!progress[l.slug] : !progress[l.slug]);
      return okQ && okM && okR && okS;
    });
    if (sort === 'minutes') r = [...r].sort((a, b) => a.minutes - b.minutes);
    if (sort === 'status') r = [...r].sort((a, b) => Number(!!progress[a.slug]) - Number(!!progress[b.slug]) || a.n - b.n);
    return r;
  }, [q, mod, route, status, sort, progress]);

  if (!user) return <AppShell title="Уроки"><div /></AppShell>;
  const s = stats(progress);
  const allSelected = list.length > 0 && list.every((l) => sel.includes(l.slug));

  const bulk = (done: boolean) => {
    if (!sel.length) return;
    const snapshot = { ...progress };
    const count = sel.length;
    toggleMany(sel, done);
    setSel([]);
    toast(done ? `Отмечено уроков: ${count}` : `Снято отметок: ${count}`, 'ok', { label: 'Отменить', run: () => restore(snapshot) });
  };

  return (
    <AppShell title="Уроки" subtitle={`53 урока · 7 модулей · ${Math.round(totalMinutes / 60)} часов практики. Пройдено ${s.done}.`}>
      <div className="bg-surface border border-border-subtle rounded-2xl p-4 md:p-5 mb-4">
        <div className="h-2 rounded-full bg-surface-elevated overflow-hidden mb-4"><div className="h-full gradient-line transition-all duration-700" style={{ width: `${s.pct}%` }} /></div>

        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex items-center bg-surface-elevated border border-border-subtle rounded-xl px-4 py-2.5 flex-1 focus-within:border-accent/50 transition-colors">
            <Search size={17} className="text-text-muted mr-2.5 shrink-0" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Поиск по названию, теме, инструменту" aria-label="Поиск уроков" className="w-full bg-transparent outline-none text-sm placeholder:text-text-muted" />
            {q && <button onClick={() => setQ('')} aria-label="Очистить поиск"><X size={15} className="text-text-muted hover:text-text-primary" /></button>}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <select value={mod} onChange={(e) => setMod(e.target.value)} aria-label="Модуль" className="field py-2.5 text-sm">
              <option value="all">Все модули</option>
              {MODULES.map((m) => <option key={m.id} value={String(m.id)}>{m.id}. {m.title}</option>)}
            </select>
            <select value={route} onChange={(e) => setRoute(e.target.value)} aria-label="Маршрут" className="field py-2.5 text-sm">
              <option value="all">Все маршруты</option>
              {(Object.keys(ROUTES) as Route[]).map((r) => <option key={r} value={r}>{ROUTES[r].label}</option>)}
            </select>
            <select value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Статус" className="field py-2.5 text-sm">
              <option value="all">Любой статус</option><option value="todo">Не пройдено</option><option value="done">Пройдено</option>
            </select>
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} aria-label="Сортировка" className="field py-2.5 text-sm">
              <option value="n">По порядку</option><option value="minutes">Сначала короткие</option><option value="status">Сначала непройденные</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-3">
          <button onClick={() => { const name = `${mod === 'all' ? 'Все модули' : MODULES[Number(mod) - 1].title}${status !== 'all' ? ` · ${status === 'done' ? 'пройдено' : 'не пройдено'}` : ''}`; addView({ name, q, module: mod, route, status, sort }); toast('Вид сохранён'); }} className="btn-ghost px-3 py-2 text-xs inline-flex items-center gap-1.5"><BookmarkPlus size={14} />Сохранить вид</button>
          {views.map((v) => (
            <span key={v.id} className="inline-flex items-center gap-1.5 bg-surface-elevated border border-border-subtle rounded-lg pl-3 pr-1.5 py-1.5 text-xs">
              <button onClick={() => { setQ(v.q); setMod(v.module); setRoute(v.route); setStatus(v.status); setSort(v.sort as Sort); toast(`Вид «${v.name}» применён`, 'info'); }} className="hover:text-accent">{v.name}</button>
              <button onClick={() => { removeView(v.id); toast('Вид удалён', 'info'); }} aria-label="Удалить вид" className="text-text-muted hover:text-accent-danger"><X size={13} /></button>
            </span>
          ))}
          <button onClick={() => { setQ(''); setMod('all'); setRoute('all'); setStatus('all'); setSort('n'); }} className="text-xs text-text-muted hover:text-text-primary inline-flex items-center gap-1.5 ml-auto"><RotateCcw size={13} />Сбросить фильтры</button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-3 px-1">
        <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
          <input type="checkbox" checked={allSelected} onChange={(e) => setSel(e.target.checked ? list.map((l) => l.slug) : [])} />
          Выбрать все ({list.length})
        </label>
        {sel.length > 0 && (
          <>
            <span className="text-sm text-accent">Выбрано: {sel.length}</span>
            <button onClick={() => bulk(true)} className="btn-ghost px-3 py-1.5 text-xs inline-flex items-center gap-1.5"><Check size={13} />Отметить пройденными</button>
            <button onClick={() => bulk(false)} className="btn-ghost px-3 py-1.5 text-xs">Снять отметки</button>
            <button onClick={() => setSel([])} className="text-xs text-text-muted hover:text-text-primary">Отменить выбор</button>
          </>
        )}
      </div>

      {list.length === 0 ? (
        <div className="bg-surface border border-border-subtle rounded-2xl p-10 text-center">
          <p className="text-text-secondary mb-4">Под фильтры ничего не подошло.</p>
          <button onClick={() => { setQ(''); setMod('all'); setRoute('all'); setStatus('all'); }} className="btn-ghost px-5 py-2.5 text-sm">Сбросить фильтры</button>
        </div>
      ) : (
        <div className="space-y-2">
          {list.map((l) => {
            const done = !!progress[l.slug];
            const checked = sel.includes(l.slug);
            return (
              <div key={l.slug} className={`bg-surface border rounded-2xl p-4 flex items-center gap-4 transition-colors ${done ? 'border-accent-success/25' : 'border-border-subtle hover:border-accent/30'}`}>
                <input type="checkbox" checked={checked} aria-label={`Выбрать урок ${l.n}`} onChange={(e) => setSel((s2) => e.target.checked ? [...s2, l.slug] : s2.filter((x) => x !== l.slug))} />
                <button onClick={() => { const snap = { ...progress }; toggleMany([l.slug], !done); toast(done ? `Отметка снята: урок ${l.n}` : `Урок ${l.n} пройден`, 'ok', { label: 'Отменить', run: () => restore(snap) }); }} aria-label={done ? 'Снять отметку' : 'Отметить пройденным'} className="shrink-0">
                  {done ? <CheckCircle2 size={22} className="text-accent-success" /> : <Circle size={22} className="text-text-muted hover:text-accent" />}
                </button>
                <Link href={`/lessons/${l.slug}`} className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs text-text-muted">{String(l.n).padStart(2, '0')}</span>
                    <span className="font-medium text-sm md:text-base">{l.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: `${ROUTES[l.route].color}1F`, color: ROUTES[l.route].color }}>{ROUTES[l.route].label}</span>
                  </div>
                  <p className="text-xs text-text-muted mt-1 truncate">{l.lead}</p>
                </Link>
                <div className="hidden sm:flex items-center gap-1.5 text-xs text-text-muted shrink-0"><Clock size={13} />{l.minutes} мин</div>
                <Link href={`/lessons/${l.slug}`} className="btn-ghost px-3 py-2 text-xs shrink-0">{done ? 'Повторить' : 'Открыть'}</Link>
              </div>
            );
          })}
        </div>
      )}

      <p className="text-xs text-text-muted mt-6">Материалы основаны на открытом курсе AI Mayak (CC BY 4.0), адаптированы под сервисы, доступные из России.</p>
    </AppShell>
  );
}