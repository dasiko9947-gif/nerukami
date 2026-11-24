'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { ArrowRight, Flame, Clock, Download, CheckCircle2, Circle, NotebookPen, CalendarClock } from 'lucide-react';
import AppShell from '@/components/AppShell';
import ProgressRing from '@/components/ProgressRing';
import { useApp } from '@/components/Providers';
import { LESSONS, stats, achievements, nextLesson, MODULES, ROUTES, totalMinutes, bySlug } from '@/lib/lessons';
import { exportAll, TIERS } from '@/lib/store';

export default function DashboardPage() {
  const { user, progress, notes, toast } = useApp();
  if (!user) return <AppShell title="Кабинет"><div /></AppShell>;

  const s = stats(progress);
  const ach = achievements(progress);
  const next = nextLesson(progress);
  const hour = new Date().getHours();
  const hello = hour < 5 ? 'Доброй ночи' : hour < 12 ? 'Доброе утро' : hour < 18 ? 'Добрый день' : 'Добрый вечер';
  const plan = LESSONS.filter((l) => !progress[l.slug]).slice(0, 3);
  const noteList = Object.entries(notes).slice(-3).reverse();
  const maxWeek = Math.max(1, ...s.week.map((w) => w.count));

  const exportData = () => {
    const blob = new Blob([JSON.stringify(exportAll(user.id), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a');
    a.href = url; a.download = 'ai-academy-progress.json'; a.click(); URL.revokeObjectURL(url);
    toast('Прогресс выгружен в JSON');
  };

  return (
    <AppShell title={`${hello}, ${user.name}`} subtitle={s.done === 0 ? 'Начни с первого урока — он занимает 30 минут.' : `Ты прошёл ${s.done} из ${s.total} уроков. Следующий — №${next?.n ?? 53}.`}>
      <div className="grid lg:grid-cols-3 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5 }} className="lg:col-span-2 bg-surface border border-accent/25 rounded-2xl p-6 md:p-8 glow-accent relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 85% 15%,rgba(198,255,0,.1),transparent 55%)' }} />
          <div className="relative">
            <p className="text-xs text-accent font-medium mb-2">{s.complete ? 'Курс пройден' : 'Продолжить'}</p>
            {next ? (
              <>
                <h2 className="font-heading font-bold text-2xl md:text-3xl leading-tight mb-3">Урок {next.n}. {next.title}</h2>
                <p className="text-text-secondary leading-relaxed mb-5 max-w-[560px]">{next.lead}</p>
                <div className="flex flex-wrap items-center gap-3 mb-6 text-xs text-text-muted">
                  <span className="flex items-center gap-1.5"><Clock size={14} />{next.minutes} мин</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: ROUTES[next.route].color }} />{ROUTES[next.route].label}</span>
                  <span>{MODULES[next.module - 1].title}</span>
                </div>
                <Link href={`/lessons/${next.slug}`} className="btn-primary inline-flex items-center gap-2 px-7 py-3.5">Открыть урок<ArrowRight size={17} /></Link>
              </>
            ) : (
              <>
                <h2 className="font-heading font-bold text-2xl md:text-3xl mb-3">Все 53 урока пройдены</h2>
                <p className="text-text-secondary mb-6">Забери сертификат и выбери направление в углублённой библиотеке.</p>
                <Link href="/certificate" className="btn-primary inline-flex items-center gap-2 px-7 py-3.5">Забрать сертификат<ArrowRight size={17} /></Link>
              </>
            )}
          </div>
        </motion.div>

        <div className="bg-surface border border-border-subtle rounded-2xl p-6 flex flex-col items-center justify-center gap-4">
          <ProgressRing pct={s.pct} done={s.done} total={s.total} />
          <div className="grid grid-cols-2 gap-3 w-full text-center">
            <div className="bg-surface-elevated rounded-xl py-3">
              <p className="font-heading font-bold text-xl text-ember flex items-center justify-center gap-1"><Flame size={16} />{s.streak}</p>
              <p className="text-[11px] text-text-muted mt-0.5">дней подряд</p>
            </div>
            <div className="bg-surface-elevated rounded-xl py-3">
              <p className="font-heading font-bold text-xl text-info">{Math.round((totalMinutes - s.minutesDone) / 60)} ч</p>
              <p className="text-[11px] text-text-muted mt-0.5">осталось</p>
            </div>
          </div>
        </div>

        <div className="bg-surface border border-border-subtle rounded-2xl p-6">
          <h3 className="font-heading font-semibold mb-4 flex items-center gap-2"><CalendarClock size={17} className="text-accent" />План на сегодня</h3>
          {plan.length ? (
            <div className="space-y-2">
              {plan.map((l) => (
                <Link key={l.slug} href={`/lessons/${l.slug}`} className="flex items-start gap-3 p-3 rounded-xl bg-surface-elevated hover:bg-bg-base transition-colors">
                  <Circle size={15} className="text-text-muted mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{l.n}. {l.title}</p>
                    <p className="text-[11px] text-text-muted">{l.minutes} мин · {ROUTES[l.route].label}</p>
                  </div>
                </Link>
              ))}
              <p className="text-[11px] text-text-muted pt-1">Итого {plan.reduce((a, l) => a + l.minutes, 0)} минут. Напоминание в {user.coachHour}:00 — задаётся в настройках.</p>
            </div>
          ) : (
            <p className="text-sm text-text-secondary">План пуст: всё пройдено. Загляни в библиотеку источника.</p>
          )}
        </div>

        <div className="bg-surface border border-border-subtle rounded-2xl p-6">
          <h3 className="font-heading font-semibold mb-4">Активность за неделю</h3>
          <div className="flex items-end justify-between gap-2 h-[120px]">
            {s.week.map((w, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-[10px] font-mono text-text-muted">{w.count || ''}</span>
                <motion.div initial={{ height: 0 }} animate={{ height: `${Math.max(4, (w.count / maxWeek) * 88)}px` }} transition={{ duration: .6, delay: i * .05 }}
                  className="w-full rounded-t-md" style={{ background: w.today ? '#C6FF00' : w.count ? '#22D3EE' : '#262B36' }} />
                <span className={`text-[10px] ${w.today ? 'text-accent font-bold' : 'text-text-muted'}`}>{w.label}</span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-text-muted mt-3">Отметок уроков в день. Сегодня подсвечен лаймом.</p>
        </div>

        <div className="bg-surface border border-border-subtle rounded-2xl p-6">
          <h3 className="font-heading font-semibold mb-4">Модули</h3>
          <div className="space-y-3">
            {s.byModule.map((m) => (
              <div key={m.id}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-text-secondary truncate pr-2">{m.id}. {m.title}</span>
                  <span className="font-mono shrink-0" style={{ color: m.color }}>{m.done}/{m.total}</span>
                </div>
                <div className="h-1.5 rounded-full bg-surface-elevated overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${m.pct}%` }} transition={{ duration: .7 }} className="h-full rounded-full" style={{ background: m.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-surface border border-border-subtle rounded-2xl p-6">
          <h3 className="font-heading font-semibold mb-4">Достижения · {ach.filter((a) => a.ok).length} из {ach.length}</h3>
          <div className="grid sm:grid-cols-3 gap-3">
            {ach.map((a) => {
              const Icon = (Icons as unknown as Record<string, typeof Icons.Award>)[a.icon] ?? Icons.Award;
              return (
                <div key={a.id} className={`rounded-xl p-4 border transition-colors ${a.ok ? 'bg-surface-elevated' : 'bg-bg-base border-border-subtle opacity-60'}`} style={a.ok ? { borderColor: `${a.color}55` } : undefined}>
                  <Icon size={20} style={{ color: a.ok ? a.color : '#6E7787' }} className="mb-2" />
                  <p className="text-sm font-medium">{a.title}</p>
                  <p className="text-[11px] text-text-muted mt-0.5 leading-snug">{a.desc}</p>
                  {a.ok && <p className="text-[10px] mt-2 font-medium" style={{ color: a.color }}>получено</p>}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-surface border border-border-subtle rounded-2xl p-6">
          <h3 className="font-heading font-semibold mb-4 flex items-center gap-2"><NotebookPen size={17} className="text-hot" />Мои заметки</h3>
          {noteList.length ? (
            <div className="space-y-3">
              {noteList.map(([slug, text]) => {
                const l = bySlug(slug);
                return (
                  <Link key={slug} href={`/lessons/${slug}`} className="block p-3 rounded-xl bg-surface-elevated hover:bg-bg-base transition-colors">
                    <p className="text-xs text-accent mb-1">{l ? `${l.n}. ${l.title}` : slug}</p>
                    <p className="text-sm text-text-secondary line-clamp-3 leading-relaxed">{text}</p>
                  </Link>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-text-secondary">Заметки появляются, когда пишешь их внизу урока. Это твоя личная база промптов.</p>
          )}
        </div>

        <div className="lg:col-span-3 bg-surface border border-border-subtle rounded-2xl p-6 flex flex-wrap items-center gap-4 justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={20} className="text-accent-success" />
            <div>
              <p className="text-sm font-medium">Тариф-план: {TIERS[user.tier].name} · {TIERS[user.tier].months} мес</p>
              <p className="text-xs text-text-muted">Демо-доступ открыт бесплатно. Оплату подключим позже — план меняется в настройках.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={exportData} className="btn-ghost px-4 py-2.5 text-sm inline-flex items-center gap-2"><Download size={15} />Выгрузить прогресс</button>
            <Link href="/materials" className="btn-ghost px-4 py-2.5 text-sm inline-flex items-center gap-2">Материалы<ArrowRight size={15} /></Link>
            <Link href="/profile" className="btn-ghost px-4 py-2.5 text-sm">Настройки</Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}