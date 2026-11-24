'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  BookOpen, Bot, FileText, Zap, Award, MessageSquare, ChevronDown, Search, Briefcase,
  Calculator as CalcIcon, Clock, TrendingUp, Check, RotateCcw, Shuffle, Download, ArrowRight,
} from 'lucide-react';
import FadeInUp from './FadeInUp';
import { MODULES, LESSONS, ROUTES, moduleLessons, totalMinutes } from '@/lib/lessons';
import { PROFESSIONS, STATUS_META } from '@/lib/professions';
import { useApp } from './Providers';

export function Manifesto() {
  const pains = [
    { pain: 'Боюсь, что ИИ заменит меня на работе', solution: 'Автоматизируется задача, а не должность. Разберись, какие твои задачи уже можно отдать.' },
    { pain: 'Не знаю, с чего начать — информации слишком много', solution: '53 урока в порядке: от первого запроса до своего продукта. Без прыжков по темам.' },
    { pain: 'Курсы стоят 50 000 ₽ и учат полгода', solution: 'Материалы открыты и бесплатны. Ты платишь за структуру, кабинет и сопровождение.' },
  ];
  const dist = [
    { label: 'Меняются', value: 78, color: '#7C3AED' },
    { label: 'Новые роли', value: 14, color: '#FF3D9A' },
    { label: 'Сокращаются', value: 8, color: '#FF4D4D' },
  ];
  return (
    <section className="relative py-24 md:py-32 px-6 overflow-hidden">
      <div className="aurora drift-b w-[420px] h-[420px] top-10 -left-32" style={{ background: 'radial-gradient(circle,rgba(124,58,237,.14),transparent 65%)' }} />
      <div className="relative max-w-[960px] mx-auto text-center">
        <FadeInUp>
          <h2 className="font-heading font-extrabold text-[clamp(28px,5vw,56px)] leading-[1.14] tracking-tight mb-6">
            Тебя заменят <span className="text-text-muted line-through decoration-accent-danger/60">не нейросети.</span><br />
            Тебя заменит тот, кто <span className="text-accent">научился</span> ими пользоваться.
          </h2>
          <p className="text-text-secondary text-lg max-w-[620px] mx-auto">
            На карте 100 профессий у источника: 78 меняются, 14 появляются, 8 сокращаются. Исчезновение — редкость. Перестройка — норма.
          </p>
        </FadeInUp>

        <FadeInUp delay={.1}>
          <div className="mt-10 bg-surface border border-border-subtle rounded-2xl p-6 text-left">
            <div className="flex h-3 rounded-full overflow-hidden bg-surface-elevated">
              {dist.map((d) => (
                <motion.div key={d.label} initial={{ width: 0 }} whileInView={{ width: `${d.value}%` }} viewport={{ once: true }} transition={{ duration: .9, ease: [0.22, 1, 0.36, 1] }} style={{ background: d.color }} />
              ))}
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4">
              {dist.map((d) => (
                <div key={d.label} className="flex items-center gap-2 text-sm">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ background: d.color }} />
                  <span className="text-text-secondary">{d.label}</span>
                  <span className="font-mono font-bold" style={{ color: d.color }}>{d.value}</span>
                </div>
              ))}
              <span className="text-xs text-text-muted ml-auto">Данные карты профессий AI Mayak</span>
            </div>
          </div>
        </FadeInUp>

        <div className="grid md:grid-cols-3 gap-5 mt-8">
          {pains.map((p, i) => (
            <FadeInUp key={i} delay={i * .1}>
              <div className="bg-surface border border-border-subtle rounded-2xl p-6 text-left card-hover h-full">
                <p className="text-text-secondary text-sm leading-relaxed mb-4">«{p.pain}»</p>
                <div className="flex items-start gap-2">
                  <Check size={16} className="text-accent mt-0.5 shrink-0" />
                  <p className="text-sm font-medium leading-relaxed">{p.solution}</p>
                </div>
              </div>
            </FadeInUp>
          ))}
        </div>
      </div>
    </section>
  );
}

export function BentoGrid() {
  const cards = [
    { icon: BookOpen, title: '53 урока основного курса', desc: `${Math.round(totalMinutes / 60)} часов практики в 7 модулях. Каждый урок — суть, промпт и задание.`, color: '#C6FF00', span: 'lg:col-span-2' },
    { icon: Bot, title: 'План дня и трекер', desc: 'Кабинет показывает следующий урок, серию дней и достижения. Прогресс не теряется.', color: '#22D3EE', span: '' },
    { icon: MessageSquare, title: 'Генератор идей', desc: 'Диалог, который накидывает идеи под твою задачу, спорит и помогает довести одну до плана.', color: '#FF3D9A', span: '' },
    { icon: FileText, title: '50 идей и шаблоны', desc: 'Чек-лист идей для малого дела, брифы, коммерческие, письма — копируй и применяй.', color: '#FFB020', span: '' },
    { icon: Zap, title: 'Тренажёр промптов', desc: 'Восемь настроек собирают рабочий промпт в реальном времени. Копируй в один клик.', color: '#7C3AED', span: '' },
    { icon: Award, title: 'Сертификат', desc: 'Именной сертификат с номером после всех 53 уроков. Скачивается картинкой.', color: '#00E676', span: '' },
  ];
  return (
    <section className="relative py-24 md:py-32 px-6">
      <div className="max-w-[1280px] mx-auto">
        <FadeInUp>
          <h2 className="font-heading font-bold text-[clamp(28px,4vw,48px)] text-center mb-4">Что внутри</h2>
          <p className="text-text-secondary text-center text-lg mb-12 max-w-[560px] mx-auto">Не тексты ради текстов, а инструменты, которыми пользуешься в тот же день</p>
        </FadeInUp>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((c, i) => {
            const Icon = c.icon;
            return (
              <FadeInUp key={i} delay={i * .07} className={c.span}>
                <div className="bg-surface border border-border-subtle rounded-2xl p-6 md:p-8 card-hover h-full group">
                  <div className="w-12 h-12 rounded-xl grid place-items-center mb-5 transition-colors" style={{ background: `${c.color}1A` }}>
                    <Icon size={24} strokeWidth={1.5} style={{ color: c.color }} />
                  </div>
                  <h3 className="font-heading font-semibold text-lg mb-2">{c.title}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{c.desc}</p>
                </div>
              </FadeInUp>
            );
          })}
        </div>
        <FadeInUp delay={.4}>
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <Link href="/lessons" className="btn-ghost px-5 py-3 text-sm font-medium inline-flex items-center gap-2">Открыть список уроков<ArrowRight size={15} /></Link>
            <Link href="/materials" className="btn-ghost px-5 py-3 text-sm font-medium inline-flex items-center gap-2">Материалы и тренажёр<ArrowRight size={15} /></Link>
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}

export function ProfessionFinder() {
  const [q, setQ] = useState('');
  const [picked, setPicked] = useState<(typeof PROFESSIONS)[0] | null>(null);
  const [busy, setBusy] = useState(false);
  const list = useMemo(() => PROFESSIONS.filter((p) => p.name.toLowerCase().includes(q.trim().toLowerCase())).slice(0, 6), [q]);

  const pick = (p: (typeof PROFESSIONS)[0]) => {
    setBusy(true); setQ(p.name);
    setTimeout(() => { setPicked(p); setBusy(false); }, 700);
  };

  return (
    <section className="relative py-24 md:py-32 px-6">
      <div className="aurora drift-a w-[380px] h-[380px] bottom-0 -right-24" style={{ background: 'radial-gradient(circle,rgba(255,176,32,.12),transparent 65%)' }} />
      <div className="relative max-w-[820px] mx-auto">
        <FadeInUp>
          <h2 className="font-heading font-bold text-[clamp(28px,4vw,48px)] text-center mb-4">Найди свою профессию</h2>
          <p className="text-text-secondary text-center text-lg mb-10">Что ИИ берёт на себя, что остаётся тебе и с каких уроков начать</p>
        </FadeInUp>

        <FadeInUp delay={.1}>
          <div className="relative">
            <div className="flex items-center bg-surface border border-border-subtle rounded-2xl px-5 py-4 focus-within:border-accent/50 transition-colors">
              <Search size={20} className="text-text-muted mr-3 shrink-0" />
              <input value={q} onChange={(e) => { setQ(e.target.value); setPicked(null); }} placeholder="Маркетолог, юрист, бухгалтер, мастер салона..." aria-label="Поиск профессии"
                className="w-full bg-transparent outline-none text-base placeholder:text-text-muted" />
              {q && <button onClick={() => { setQ(''); setPicked(null); }} className="text-xs text-text-muted hover:text-text-primary shrink-0">сброс</button>}
            </div>
            {q && !picked && list.length > 0 && (
              <div className="absolute top-full inset-x-0 mt-2 bg-surface-elevated border border-border-subtle rounded-xl overflow-hidden z-20 shadow-2xl">
                {list.map((p) => (
                  <button key={p.name} onClick={() => pick(p)} className="w-full text-left px-5 py-3 hover:bg-surface transition-colors flex items-center gap-3 border-b border-border-subtle last:border-0">
                    <Briefcase size={16} style={{ color: STATUS_META[p.status].color }} />
                    <span className="flex-1">{p.name}</span>
                    <span className="text-xs text-text-muted">{p.cat}</span>
                  </button>
                ))}
              </div>
            )}
            {q && !picked && list.length === 0 && (
              <div className="absolute top-full inset-x-0 mt-2 bg-surface-elevated border border-border-subtle rounded-xl p-4 z-20 text-sm text-text-secondary">
                Такой профессии пока нет в нашей карте. <Link href="/professions" className="text-accent hover:underline">Открыть все 20</Link>
              </div>
            )}
          </div>
        </FadeInUp>

        {busy && (
          <div className="mt-8 bg-surface border border-border-subtle rounded-2xl p-8 text-center">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-text-secondary text-sm">Собираем разбор...</p>
          </div>
        )}

        {picked && !busy && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .45, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 bg-surface border border-accent/25 rounded-2xl p-7 glow-accent">
            <div className="flex items-center gap-3 mb-5 flex-wrap">
              <div className="w-10 h-10 rounded-xl bg-accent/10 grid place-items-center"><Briefcase size={20} className="text-accent" /></div>
              <h3 className="font-heading font-semibold text-xl">{picked.name}</h3>
              <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: `${STATUS_META[picked.status].color}22`, color: STATUS_META[picked.status].color }}>{STATUS_META[picked.status].label}</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 mb-5">
              <div className="bg-surface-elevated rounded-xl p-4 border border-border-subtle">
                <p className="text-xs text-info font-medium mb-1.5">Берёт на себя ИИ</p>
                <p className="text-sm text-text-secondary leading-relaxed">{picked.ai}</p>
              </div>
              <div className="bg-surface-elevated rounded-xl p-4 border border-border-subtle">
                <p className="text-xs text-accent font-medium mb-1.5">Остаётся тебе</p>
                <p className="text-sm text-text-secondary leading-relaxed">{picked.human}</p>
              </div>
            </div>
            <p className="text-text-secondary text-sm mb-3">Три навыка на старт:</p>
            <div className="grid gap-2 mb-5">
              {picked.skills.map((s, i) => (
                <div key={s} className="flex items-center gap-3 bg-surface-elevated rounded-xl px-4 py-2.5">
                  <span className="w-6 h-6 rounded-full bg-accent/20 grid place-items-center text-xs font-bold text-accent">{i + 1}</span>
                  <span className="text-sm font-medium">{s}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {picked.lessons.map((slug) => {
                const l = LESSONS.find((x) => x.slug === slug)!;
                return <Link key={slug} href={`/lessons/${slug}`} className="text-xs px-3 py-1.5 rounded-lg bg-surface-elevated border border-border-subtle hover:border-accent/40 transition-colors">Урок {l.n}: {l.title}</Link>;
              })}
            </div>
            <Link href="/professions" className="mt-5 inline-flex items-center gap-2 text-accent font-medium text-sm hover:underline">Вся карта профессий<ArrowRight size={14} /></Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}

const DEF = { rate: 1500, routine: 10, share: 60, price: 2990, clients: 4, costs: 1500, hours: 6 };

export function ValueCalculator() {
  const { toast } = useApp();
  const [v, setV] = useState(DEF);
  const set = (k: keyof typeof DEF) => (e: React.ChangeEvent<HTMLInputElement>) => setV((s) => ({ ...s, [k]: Number(e.target.value) }));

  const freed = Math.round(v.routine * 4 * (v.share / 100));
  const savedMoney = freed * v.rate;
  const revenue = v.price * v.clients;
  const profit = revenue - v.costs - v.hours * v.clients * v.rate;
  const weeks = savedMoney > 0 ? Math.max(1, Math.ceil(v.price / (savedMoney / 4))) : null;

  const exportCsv = () => {
    const rows = [['Параметр', 'Значение'], ['Ставка, ₽/ч', v.rate], ['Рутина, ч/нед', v.routine], ['Доля автоматизации, %', v.share], ['Цена услуги, ₽', v.price], ['Клиентов в месяц', v.clients], ['Расходы, ₽/мес', v.costs], ['Часы на клиента', v.hours], ['Свободных часов/мес', freed], ['Экономия, ₽/мес', savedMoney], ['Выручка, ₽/мес', revenue], ['Прибыль с учётом времени, ₽', profit]];
    const blob = new Blob(['\uFEFF' + rows.map((r) => r.join(';')).join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a');
    a.href = url; a.download = 'raschet-ai-academy.csv'; a.click(); URL.revokeObjectURL(url);
    toast('Расчёт сохранён в CSV');
  };

  const controls: { k: keyof typeof DEF; label: string; min: number; max: number; step: number; unit: string; icon: typeof Clock }[] = [
    { k: 'rate', label: 'Стоимость твоего часа', min: 300, max: 10000, step: 100, unit: '₽/ч', icon: CalcIcon },
    { k: 'routine', label: 'Рутина в неделю', min: 1, max: 40, step: 1, unit: 'ч', icon: Clock },
    { k: 'share', label: 'Что реально автоматизируется', min: 10, max: 90, step: 5, unit: '%', icon: TrendingUp },
    { k: 'price', label: 'Цена твоей услуги', min: 1000, max: 100000, step: 500, unit: '₽', icon: Briefcase },
    { k: 'clients', label: 'Клиентов в месяц', min: 1, max: 30, step: 1, unit: 'шт', icon: BookOpen },
    { k: 'costs', label: 'Расходы на инструменты', min: 0, max: 30000, step: 500, unit: '₽', icon: Zap },
    { k: 'hours', label: 'Часов на одного клиента', min: 1, max: 40, step: 1, unit: 'ч', icon: Clock },
  ];

  return (
    <section className="relative py-24 md:py-32 px-6">
      <div className="max-w-[1000px] mx-auto">
        <FadeInUp>
          <h2 className="font-heading font-bold text-[clamp(28px,4vw,48px)] text-center mb-4">Калькулятор твоей экономии</h2>
          <p className="text-text-secondary text-center text-lg mb-12">Двигай ползунки — цифры пересчитываются сразу. Это расчёт на твоих допущениях, не обещание дохода.</p>
        </FadeInUp>

        <FadeInUp delay={.1}>
          <div className="bg-surface border border-border-subtle rounded-2xl p-6 md:p-8">
            <div className="grid lg:grid-cols-[1.15fr_1fr] gap-8">
              <div className="space-y-5">
                {controls.map((c) => {
                  const Icon = c.icon;
                  return (
                    <div key={c.k}>
                      <label className="flex items-center justify-between gap-2 text-sm mb-2">
                        <span className="flex items-center gap-2 text-text-secondary"><Icon size={15} className="text-accent" />{c.label}</span>
                        <span className="font-mono font-bold text-accent">{v[c.k].toLocaleString('ru-RU')} {c.unit}</span>
                      </label>
                      <input type="range" min={c.min} max={c.max} step={c.step} value={v[c.k]} onChange={set(c.k)} aria-label={c.label} />
                    </div>
                  );
                })}
                <div className="flex flex-wrap gap-2 pt-1">
                  <button onClick={() => { setV(DEF); toast('Значения сброшены', 'info'); }} className="btn-ghost px-4 py-2.5 text-sm inline-flex items-center gap-2"><RotateCcw size={15} />Сброс</button>
                  <button onClick={() => { setV({ rate: 500 + Math.round(Math.random() * 45) * 100, routine: 3 + Math.floor(Math.random() * 25), share: 30 + Math.floor(Math.random() * 10) * 5, price: 3000 + Math.floor(Math.random() * 40) * 1000, clients: 1 + Math.floor(Math.random() * 12), costs: Math.floor(Math.random() * 12) * 500, hours: 2 + Math.floor(Math.random() * 14) }); toast('Подставлен случайный пример', 'info'); }} className="btn-ghost px-4 py-2.5 text-sm inline-flex items-center gap-2"><Shuffle size={15} />Пример</button>
                  <button onClick={exportCsv} className="btn-ghost px-4 py-2.5 text-sm inline-flex items-center gap-2"><Download size={15} />Скачать CSV</button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-surface-elevated border border-border-subtle rounded-xl p-5">
                  <p className="text-xs text-text-muted mb-1">Свободных часов в месяц</p>
                  <p className="font-heading font-extrabold text-3xl text-accent">{freed} ч</p>
                </div>
                <div className="bg-surface-elevated border border-border-subtle rounded-xl p-5">
                  <p className="text-xs text-text-muted mb-1">Стоимость этих часов</p>
                  <p className="font-heading font-extrabold text-3xl text-info">{savedMoney.toLocaleString('ru-RU')} ₽</p>
                </div>
                <div className="bg-surface-elevated border border-border-subtle rounded-xl p-5">
                  <p className="text-xs text-text-muted mb-1">Курс окупится за</p>
                  <p className="font-heading font-extrabold text-3xl text-warn">{weeks ? `${weeks} нед` : '—'}</p>
                </div>
                <div className={`bg-surface-elevated border rounded-xl p-5 ${profit >= 0 ? 'border-accent-success/30' : 'border-accent-danger/40'}`}>
                  <p className="text-xs text-text-muted mb-1">Услуга: прибыль с учётом твоего времени</p>
                  <p className="font-heading font-extrabold text-3xl" style={{ color: profit >= 0 ? '#00E676' : '#FF4D4D' }}>{profit.toLocaleString('ru-RU')} ₽</p>
                  {profit < 0 && <p className="text-xs text-accent-danger mt-2">Цена не покрывает часы. Подними цену или сократи время на клиента.</p>}
                </div>
                <Link href="/login?tier=2" className="btn-primary w-full py-4 text-center inline-flex items-center justify-center gap-2"><TrendingUp size={18} />Забрать навык</Link>
              </div>
            </div>
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}

export function CourseProgram() {
  const [open, setOpen] = useState<number | null>(1);
  return (
    <section id="program" className="relative py-24 md:py-32 px-6">
      <div className="max-w-[860px] mx-auto">
        <FadeInUp>
          <h2 className="font-heading font-bold text-[clamp(28px,4vw,48px)] text-center mb-4">Программа курса</h2>
          <p className="text-text-secondary text-center text-lg mb-3">7 модулей, 53 урока, {Math.round(totalMinutes / 60)} часов практики</p>
          <p className="text-text-muted text-center text-sm mb-12">Ядро открытого курса AI Mayak, адаптированное под сервисы, доступные из России. Углублённая библиотека — ещё 105 уроков у источника.</p>
        </FadeInUp>

        <div className="space-y-3">
          {MODULES.map((m, i) => {
            const ls = moduleLessons(m.id);
            const isOpen = open === m.id;
            return (
              <FadeInUp key={m.id} delay={i * .05}>
                <div className="bg-surface border border-border-subtle rounded-2xl overflow-hidden hover:border-accent/25 transition-colors">
                  <button onClick={() => setOpen(isOpen ? null : m.id)} aria-expanded={isOpen} className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left">
                    <div className="flex items-center gap-4 min-w-0">
                      <span className="font-mono text-sm font-bold shrink-0" style={{ color: m.color }}>{String(m.id).padStart(2, '0')}</span>
                      <div className="min-w-0">
                        <h3 className="font-semibold truncate">{m.title}</h3>
                        <p className="text-text-muted text-sm mt-0.5">{ls.length} уроков · {ls.reduce((s, l) => s + l.minutes, 0)} мин</p>
                      </div>
                    </div>
                    <ChevronDown size={20} className={`text-text-muted shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} transition={{ duration: .3 }} className="overflow-hidden">
                      <div className="px-6 pb-5">
                        <p className="text-text-secondary text-sm mb-4">{m.desc}</p>
                        <div className="grid sm:grid-cols-2 gap-1.5">
                          {ls.map((l) => (
                            <Link key={l.slug} href={`/lessons/${l.slug}`} className="flex items-center gap-2.5 text-sm text-text-secondary hover:text-text-primary py-1.5 px-2 -mx-2 rounded-lg hover:bg-surface-elevated transition-colors">
                              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: ROUTES[l.route].color }} />
                              <span className="font-mono text-xs text-text-muted shrink-0">{String(l.n).padStart(2, '0')}</span>
                              <span className="truncate">{l.title}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </FadeInUp>
            );
          })}
        </div>

        <FadeInUp delay={.4}>
          <div className="mt-6 flex flex-wrap gap-4 justify-center text-xs text-text-muted">
            {(Object.keys(ROUTES) as (keyof typeof ROUTES)[]).map((r) => (
              <span key={r} className="flex items-center gap-2"><span className="w-2 h-2 rounded-full" style={{ background: ROUTES[r].color }} />{ROUTES[r].label} — {ROUTES[r].desc}</span>
            ))}
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}