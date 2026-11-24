'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Clock, RotateCcw, NotebookPen, ExternalLink, AlertTriangle, ListTree } from 'lucide-react';
import AppShell from '@/components/AppShell';
import LessonMarkdown, { extractToc } from '@/components/LessonMarkdown';
import { useApp } from '@/components/Providers';
import { LESSONS, MODULES, ROUTES, bySlug, moduleLessons, stats } from '@/lib/lessons';

export default function LessonPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ?? '';
  const lesson = bySlug(slug);
  const { user, progress, notes, toggle, restore, note, toast } = useApp();

  const [source, setSource] = useState('');
  const [state, setState] = useState<'loading' | 'ok' | 'error'>('loading');
  const [draft, setDraft] = useState('');
  const [saved, setSaved] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const loadedNote = useRef('');

  useEffect(() => {
    if (!lesson) return;
    let alive = true;
    setState('loading');
    setSource('');
    fetch(lesson.file)
      .then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.text(); })
      .then((t) => { if (alive) { setSource(t); setState('ok'); } })
      .catch(() => { if (alive) setState('error'); });
    return () => { alive = false; };
  }, [lesson]);

  useEffect(() => {
    if (!user || !lesson) return;
    if (loadedNote.current !== lesson.slug) {
      loadedNote.current = lesson.slug;
      setDraft(notes[lesson.slug] ?? '');
      setSaved(false);
    }
  }, [user, lesson, notes]);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const toc = useMemo(() => (source ? extractToc(source).slice(0, 40) : []), [source]);
  const words = useMemo(() => (source ? source.split(/\s+/).length : 0), [source]);
  const idx = useMemo(() => LESSONS.findIndex((l) => l.slug === slug), [slug]);
  const prev = idx > 0 ? LESSONS[idx - 1] : null;
  const next = idx >= 0 && idx < LESSONS.length - 1 ? LESSONS[idx + 1] : null;

  if (!lesson) {
    return (
      <AppShell title="Урок не найден">
        <div className="bg-surface border border-border-subtle rounded-2xl p-10 text-center">
          <p className="text-text-secondary mb-5">Такого урока нет в программе. Возможно, ссылка устарела.</p>
          <Link href="/lessons" className="btn-primary inline-flex px-6 py-3">Ко всем урокам</Link>
        </div>
      </AppShell>
    );
  }
  if (!user) return <AppShell title={lesson.title}><div /></AppShell>;

  const done = !!progress[lesson.slug];
  const s = stats(progress);
  const mod = MODULES[lesson.module - 1];
  const siblings = moduleLessons(lesson.module);
  const readMin = Math.max(1, Math.round(words / 180));

  const onNote = (v: string) => {
    setDraft(v); setSaved(false);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => { note(lesson.slug, v); setSaved(true); }, 600);
  };

  const mark = () => {
    const snap = { ...progress };
    toggle(lesson.slug, !done);
    toast(done ? 'Отметка снята' : `Урок пройден! ${s.done + 1} из ${s.total}`, 'ok', { label: 'Отменить', run: () => restore(snap) });
  };

  return (
    <AppShell title={`${lesson.n}. ${lesson.title}`} subtitle={`${mod.title} · ${ROUTES[lesson.route].label} · урок ${lesson.origin} в источнике`}>
      <nav className="flex items-center gap-2 text-xs text-text-muted mb-5 flex-wrap">
        <Link href="/lessons" className="hover:text-accent">Уроки</Link><span>/</span>
        <span className="text-text-secondary">{mod.title}</span><span>/</span>
        <span className="text-text-secondary">Урок {lesson.n}</span>
      </nav>

      <div className="grid lg:grid-cols-[1fr_290px] gap-6 items-start">
        <article className="min-w-0">
          {lesson.ru && (
            <div className="bg-info/10 border border-info/30 rounded-xl p-4 mb-4">
              <p className="text-xs text-info font-medium mb-1">Адаптация для России</p>
              <p className="text-sm text-text-secondary leading-relaxed">{lesson.ru}</p>
            </div>
          )}

          <div className="bg-surface border border-border-subtle rounded-2xl p-6 md:p-9">
            {state === 'loading' && (
              <div className="space-y-3">
                <div className="skeleton h-8 w-3/4 rounded-lg" />
                <div className="skeleton h-4 w-full rounded" />
                <div className="skeleton h-4 w-11/12 rounded" />
                <div className="skeleton h-4 w-10/12 rounded" />
                <div className="skeleton h-40 w-full rounded-xl mt-5" />
              </div>
            )}

            {state === 'error' && (
              <div className="text-center py-10">
                <AlertTriangle size={32} className="text-warn mx-auto mb-4" />
                <p className="font-medium mb-2">Не удалось загрузить текст урока</p>
                <p className="text-sm text-text-secondary mb-5 max-w-[420px] mx-auto">
                  Файл <span className="font-mono text-xs">{lesson.file}</span> не найден. Проверь, что папка <span className="font-mono text-xs">public/content</span> содержит 53 файла .md.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <button onClick={() => window.location.reload()} className="btn-ghost px-5 py-2.5 text-sm inline-flex items-center gap-2"><RotateCcw size={15} />Повторить</button>
                  <a href={`https://aimayak.com/ru/lessons/${lesson.slug}/`} target="_blank" rel="noopener noreferrer" className="btn-ghost px-5 py-2.5 text-sm inline-flex items-center gap-2">Открыть у источника<ExternalLink size={14} /></a>
                </div>
              </div>
            )}

            {state === 'ok' && (
              <>
                <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted mb-6 pb-5 border-b border-border-subtle">
                  <span className="flex items-center gap-1.5"><Clock size={13} />≈ {readMin} мин чтения</span>
                  <span>{words.toLocaleString('ru-RU')} слов</span>
                  <span className="px-2 py-0.5 rounded-full" style={{ background: `${ROUTES[lesson.route].color}1F`, color: ROUTES[lesson.route].color }}>{ROUTES[lesson.route].label}</span>
                </div>
                <LessonMarkdown source={source} />
                <div className="mt-10 pt-5 border-t border-border-subtle">
                  <p className="text-[11px] text-text-muted leading-relaxed">
                    Текст урока: открытый курс{' '}
                    <a href="https://aimayak.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-text-secondary">AI Mayak</a>, лицензия{' '}
                    <a href="https://creativecommons.org/licenses/by/4.0/deed.ru" target="_blank" rel="noopener noreferrer" className="underline hover:text-text-secondary">CC BY 4.0</a>.
                    Оригинал этой страницы: <a href={`https://aimayak.com/ru/lessons/${lesson.slug}/`} target="_blank" rel="noopener noreferrer" className="underline hover:text-text-secondary">aimayak.com</a>.
                    Заметка об адаптации под Россию, оформление и трекер прогресса — AI-Академия.
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="bg-surface border border-border-subtle rounded-2xl p-6 mt-4">
            <div className="flex items-center justify-between gap-3 mb-3">
              <h3 className="font-heading font-semibold flex items-center gap-2"><NotebookPen size={17} className="text-hot" />Моя заметка к уроку</h3>
              <span className={`text-xs ${saved ? 'text-accent-success' : 'text-text-muted'}`}>{saved ? 'сохранено' : draft ? 'сохранится само' : 'пусто'}</span>
            </div>
            <textarea value={draft} onChange={(e) => onNote(e.target.value)} rows={5} placeholder="Свои промпты, выводы, цифры, ссылки. Это твоя личная база." className="field resize-y text-sm leading-relaxed" />
            <div className="flex flex-wrap gap-2 mt-3">
              <button onClick={() => { note(lesson.slug, draft); setSaved(true); toast('Заметка сохранена'); }} className="btn-ghost px-4 py-2 text-sm">Сохранить сейчас</button>
              {draft && <button onClick={() => { onNote(''); note(lesson.slug, ''); toast('Заметка очищена', 'info'); }} className="btn-ghost px-4 py-2 text-sm">Очистить</button>}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 mt-4">
            {prev ? (
              <Link href={`/lessons/${prev.slug}`} className="bg-surface border border-border-subtle rounded-2xl p-5 card-hover">
                <span className="text-xs text-text-muted flex items-center gap-1.5 mb-1.5"><ArrowLeft size={13} />Предыдущий</span>
                <p className="text-sm font-medium">{prev.n}. {prev.title}</p>
              </Link>
            ) : <div />}
            {next && (
              <Link href={`/lessons/${next.slug}`} className="bg-surface border border-border-subtle rounded-2xl p-5 card-hover sm:text-right">
                <span className="text-xs text-text-muted flex items-center gap-1.5 mb-1.5 sm:justify-end">Следующий<ArrowRight size={13} /></span>
                <p className="text-sm font-medium">{next.n}. {next.title}</p>
              </Link>
            )}
          </div>
        </article>

        <aside className="lg:sticky lg:top-[92px] space-y-4">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className={`bg-surface border rounded-2xl p-5 ${done ? 'border-accent-success/40' : 'border-accent/25'}`}>
            <div className="flex items-center justify-between text-xs mb-2"><span className="text-text-secondary">Курс</span><span className="font-mono text-accent font-bold">{s.pct}%</span></div>
            <div className="h-2 rounded-full bg-surface-elevated overflow-hidden mb-4"><div className="h-full gradient-line transition-all duration-700" style={{ width: `${s.pct}%` }} /></div>
            <button onClick={mark} className={`w-full py-3.5 rounded-xl font-bold text-sm inline-flex items-center justify-center gap-2 transition-all ${done ? 'bg-surface-elevated border border-accent-success/40 text-accent-success' : 'btn-primary pulse-ok'}`}>
              {done ? <><Check size={17} />Пройдено · снять отметку</> : <><Check size={17} />Отметить пройденным</>}
            </button>
            {done && next && <Link href={`/lessons/${next.slug}`} className="btn-ghost w-full mt-2 py-3 text-sm text-center inline-flex items-center justify-center gap-2">Следующий урок<ArrowRight size={15} /></Link>}
          </motion.div>

          {toc.length > 0 && (
            <div className="bg-surface border border-border-subtle rounded-2xl p-5">
              <p className="text-xs text-text-muted mb-3 flex items-center gap-1.5"><ListTree size={13} />Содержание урока</p>
              <div className="space-y-1 max-h-[280px] overflow-y-auto scroll-slim pr-1">
                {toc.map((h) => (
                  <a key={h.id} href={`#${h.id}`} className="block text-xs text-text-secondary hover:text-accent py-1.5 px-2 rounded-lg hover:bg-surface-elevated transition-colors leading-snug">{h.text}</a>
                ))}
              </div>
            </div>
          )}

          <div className="bg-surface border border-border-subtle rounded-2xl p-5">
            <p className="text-xs text-text-muted mb-3">Модуль {mod.id}: {mod.title}</p>
            <div className="space-y-1 max-h-[300px] overflow-y-auto scroll-slim pr-1">
              {siblings.map((l) => (
                <Link key={l.slug} href={`/lessons/${l.slug}`} className={`flex items-center gap-2 text-xs py-1.5 px-2 rounded-lg transition-colors ${l.slug === lesson.slug ? 'bg-accent/12 text-accent font-medium' : 'text-text-secondary hover:bg-surface-elevated'}`}>
                  {progress[l.slug] ? <Check size={12} className="text-accent-success shrink-0" /> : <span className="w-3 h-3 rounded-full border border-border-subtle shrink-0" />}
                  <span className="truncate">{l.n}. {l.title}</span>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}