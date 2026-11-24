'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Download, Search, RotateCcw, Shuffle, ExternalLink, Check } from 'lucide-react';
import AppShell from '@/components/AppShell';
import { useApp } from '@/components/Providers';
import { PROMPTS, IDEAS, CHECKLISTS, TEMPLATES, TOOLS, LIBRARY_URL } from '@/lib/materials';

const TABS = [
  { id: 'builder', label: 'Тренажёр промпта' },
  { id: 'prompts', label: `Промпты (${PROMPTS.length})` },
  { id: 'ideas', label: `50 идей` },
  { id: 'checks', label: 'Чек-листы' },
  { id: 'templates', label: 'Шаблоны' },
  { id: 'tools', label: `Инструменты (${TOOLS.length})` },
  { id: 'calc', label: 'Юнит-экономика' },
] as const;
type Tab = (typeof TABS)[number]['id'];

const ROLES = ['Опытный маркетолог', 'Аналитик данных', 'Редактор', 'Юрист-консультант', 'Продуктовый дизайнер', 'Наставник по бизнесу'];
const TASKS = ['Собрать план на неделю', 'Написать текст под аудиторию', 'Разобрать данные и выводы', 'Проверить документ на риски', 'Придумать 5 гипотез', 'Объяснить сложное просто'];
const FORMATS = ['Маркированный список', 'Таблица', 'Пошаговая инструкция', 'JSON', 'Короткий текст 900 знаков', 'Три варианта на выбор'];
const TONES = ['Деловой, без канцелярита', 'Дружелюбный', 'Нейтральный', 'Прямой и краткий', 'Обучающий'];
const LENGTHS = ['Кратко', 'Средне', 'Подробно'];
const LIMITS = ['Без обещаний дохода', 'Без выдуманных фактов и ссылок', 'Только доступные в РФ сервисы', 'С указанием рисков', 'Без воды и штампов'];
const LANGS = ['Русский', 'Английский', 'Русский + английский'];

export default function MaterialsPage() {
  const { toast, user } = useApp();
  const [tab, setTab] = useState<Tab>('builder');
  const [q, setQ] = useState('');

  const [role, setRole] = useState(ROLES[0]);
  const [task, setTask] = useState(TASKS[0]);
  const [context, setContext] = useState('Я работаю один, продаю услуги малому бизнесу в своём городе.');
  const [format, setFormat] = useState(FORMATS[0]);
  const [tone, setTone] = useState(TONES[0]);
  const [length, setLength] = useState(LENGTHS[1]);
  const [limit, setLimit] = useState(LIMITS[1]);
  const [lang, setLang] = useState(LANGS[0]);
  const [askFirst, setAskFirst] = useState(true);

  const prompt = useMemo(
    () => `Роль: ${role}.\nЗадача: ${task}.\nКонтекст: ${context.trim() || '—'}\nФормат ответа: ${format}.\nТон: ${tone}.\nОбъём: ${length}.\nОграничения: ${limit}.\nЯзык ответа: ${lang}.${askFirst ? '\nЕсли данных не хватает — сначала задай уточняющие вопросы, потом выполняй.' : ''}`,
    [role, task, context, format, tone, length, limit, lang, askFirst]
  );

  const copy = async (text: string, label = 'Скопировано') => {
    try { await navigator.clipboard.writeText(text); toast(label); }
    catch { toast('Копирование недоступно — выдели текст вручную', 'warn'); }
  };
  const download = (name: string, text: string) => {
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a');
    a.href = url; a.download = name; a.click(); URL.revokeObjectURL(url);
    toast('Файл сохранён');
  };

  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [niche, setNiche] = useState('all');
  const niches = useMemo(() => ['all', ...Array.from(new Set(IDEAS.map((i) => i.niche)))], []);
  const ideas = IDEAS.filter((i) => (niche === 'all' || i.niche === niche) && (!q.trim() || i.text.toLowerCase().includes(q.toLowerCase())));
  const prompts = PROMPTS.filter((p) => !q.trim() || `${p.title} ${p.body} ${p.cat}`.toLowerCase().includes(q.toLowerCase()));
  const [toolCat, setToolCat] = useState('all');
  const [onlyRu, setOnlyRu] = useState(false);
  const [onlyFree, setOnlyFree] = useState(false);
  const toolCats = useMemo(() => ['all', ...Array.from(new Set(TOOLS.map((t) => t.cat)))], []);
  const tools = TOOLS.filter((t) => (toolCat === 'all' || t.cat === toolCat) && (!onlyRu || t.ru) && (!onlyFree || t.free) && (!q.trim() || `${t.name} ${t.note}`.toLowerCase().includes(q.toLowerCase())));

  const [price, setPrice] = useState(15000);
  const [clients, setClients] = useState(6);
  const [repeat, setRepeat] = useState(3);
  const [margin, setMargin] = useState(70);
  const [cac, setCac] = useState(2000);
  const [fixed, setFixed] = useState(12000);
  const [hoursPer, setHoursPer] = useState(5);
  const rate = 1500;
  const ltv = Math.round(price * repeat * (margin / 100));
  const profitPer = Math.round(price * (margin / 100) - hoursPer * rate);
  const monthly = profitPer * clients - fixed;
  const breakeven = profitPer > 0 ? Math.ceil(fixed / profitPer) : null;
  const payback = ltv > cac ? (cac / Math.max(1, price * (margin / 100))).toFixed(1) : null;

  if (!user) return <AppShell title="Материалы"><div /></AppShell>;

  const selects: [string, string[], (v: string) => void][] = [
    ['Роль', ROLES, setRole], ['Задача', TASKS, setTask], ['Формат', FORMATS, setFormat],
    ['Тон', TONES, setTone], ['Объём', LENGTHS, setLength], ['Ограничения', LIMITS, setLimit], ['Язык', LANGS, setLang],
  ];
  const values = [role, task, format, tone, length, limit, lang];

  return (
    <AppShell title="Материалы" subtitle="Тренажёр промптов, 12 рабочих промптов, 50 идей, чек-листы, шаблоны и каталог инструментов.">
      <div className="flex gap-1 overflow-x-auto scroll-slim pb-2 mb-5">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => { setTab(t.id); setQ(''); }} className={`px-4 py-2.5 rounded-xl text-sm whitespace-nowrap transition-colors ${tab === t.id ? 'bg-accent text-bg-base font-bold' : 'bg-surface border border-border-subtle text-text-secondary hover:text-text-primary'}`}>{t.label}</button>
        ))}
      </div>

      {tab === 'builder' && (
        <div className="grid lg:grid-cols-[1fr_1fr] gap-4 items-start">
          <div className="bg-surface border border-border-subtle rounded-2xl p-6 space-y-4">
            <h2 className="font-heading font-semibold">Настройки промпта</h2>
            {selects.map(([label, opts, setter], i) => (
              <div key={label}>
                <label className="block text-xs text-text-secondary mb-1.5">{label}</label>
                <select value={values[i]} onChange={(e) => setter(e.target.value)} className="field py-2.5 text-sm">
                  {opts.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ))}
            <div>
              <label className="block text-xs text-text-secondary mb-1.5">Контекст: кто ты и что за задача</label>
              <textarea value={context} onChange={(e) => setContext(e.target.value)} rows={4} className="field text-sm resize-y" />
            </div>
            <label className="flex items-center gap-2.5 text-sm text-text-secondary cursor-pointer">
              <input type="checkbox" checked={askFirst} onChange={(e) => setAskFirst(e.target.checked)} />Сначала уточняющие вопросы
            </label>
            <div className="flex flex-wrap gap-2 pt-1">
              <button onClick={() => { setRole(ROLES[0]); setTask(TASKS[0]); setFormat(FORMATS[0]); setTone(TONES[0]); setLength(LENGTHS[1]); setLimit(LIMITS[1]); setLang(LANGS[0]); setContext('Я работаю один, продаю услуги малому бизнесу в своём городе.'); setAskFirst(true); toast('Настройки сброшены', 'info'); }} className="btn-ghost px-4 py-2.5 text-sm inline-flex items-center gap-2"><RotateCcw size={15} />Сброс</button>
              <button onClick={() => { const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)]; setRole(pick(ROLES)); setTask(pick(TASKS)); setFormat(pick(FORMATS)); setTone(pick(TONES)); setLength(pick(LENGTHS)); setLimit(pick(LIMITS)); toast('Случайная комбинация', 'info'); }} className="btn-ghost px-4 py-2.5 text-sm inline-flex items-center gap-2"><Shuffle size={15} />Пример</button>
            </div>
          </div>

          <div className="bg-surface border border-accent/25 rounded-2xl p-6 lg:sticky lg:top-[92px] glow-accent">
            <h2 className="font-heading font-semibold mb-3">Готовый промпт</h2>
            <pre className="code-block bg-bg-base border border-border-subtle rounded-xl p-4 text-text-secondary max-h-[420px] overflow-y-auto scroll-slim">{prompt}</pre>
            <div className="flex flex-wrap gap-2 mt-4">
              <button onClick={() => copy(prompt, 'Промпт скопирован')} className="btn-primary px-5 py-3 text-sm inline-flex items-center gap-2"><Copy size={15} />Скопировать</button>
              <button onClick={() => download('prompt.md', prompt)} className="btn-ghost px-4 py-3 text-sm inline-flex items-center gap-2"><Download size={15} />Скачать .md</button>
            </div>
            <p className="text-[11px] text-text-muted mt-3">Меняй настройки — текст пересобирается сразу. Вставляй в любой ассистент.</p>
          </div>
        </div>
      )}

      {tab !== 'builder' && tab !== 'calc' && tab !== 'checks' && (
        <div className="flex items-center bg-surface border border-border-subtle rounded-xl px-4 py-2.5 mb-4 focus-within:border-accent/50">
          <Search size={17} className="text-text-muted mr-2.5" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Поиск по материалам" aria-label="Поиск по материалам" className="w-full bg-transparent outline-none text-sm placeholder:text-text-muted" />
        </div>
      )}

      {tab === 'prompts' && (
        <div className="grid md:grid-cols-2 gap-3">
          {prompts.map((p) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-surface border border-border-subtle rounded-2xl p-5 card-hover">
              <div className="flex items-center justify-between gap-2 mb-2">
                <h3 className="font-semibold text-sm">{p.title}</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-info/15 text-info shrink-0">{p.cat}</span>
              </div>
              <pre className="code-block text-text-secondary bg-bg-base border border-border-subtle rounded-xl p-3 mb-3 max-h-[180px] overflow-y-auto scroll-slim">{p.body}</pre>
              <div className="flex gap-2">
                <button onClick={() => copy(p.body, 'Промпт скопирован')} className="btn-ghost px-3 py-2 text-xs inline-flex items-center gap-1.5"><Copy size={13} />Копировать</button>
                <button onClick={() => download(`${p.id}.md`, p.body)} className="btn-ghost px-3 py-2 text-xs inline-flex items-center gap-1.5"><Download size={13} />.md</button>
              </div>
            </motion.div>
          ))}
          {!prompts.length && <p className="text-text-secondary text-sm">Ничего не найдено.</p>}
        </div>
      )}

      {tab === 'ideas' && (
        <div>
          <div className="flex flex-wrap gap-2 mb-4">
            {niches.map((n) => (
              <button key={n} onClick={() => setNiche(n)} className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${niche === n ? 'bg-accent text-bg-base font-bold' : 'bg-surface border border-border-subtle text-text-secondary hover:text-text-primary'}`}>{n === 'all' ? 'Все ниши' : n}</button>
            ))}
            <button onClick={() => download('50-idey.md', '# 50 идей для дела с ИИ\n\n' + IDEAS.map((i) => `${i.id}. [${i.niche}] ${i.text}`).join('\n'))} className="btn-ghost px-3 py-1.5 text-xs inline-flex items-center gap-1.5 ml-auto"><Download size={13} />Скачать список</button>
          </div>
          <div className="grid md:grid-cols-2 gap-2">
            {ideas.map((i) => (
              <div key={i.id} className="bg-surface border border-border-subtle rounded-xl p-4 flex items-start gap-3">
                <span className="font-mono text-xs text-accent shrink-0 mt-0.5">{String(i.id).padStart(2, '0')}</span>
                <div className="min-w-0">
                  <p className="text-sm leading-relaxed">{i.text}</p>
                  <span className="text-[10px] text-text-muted">{i.niche}</span>
                </div>
                <button onClick={() => copy(i.text, 'Идея скопирована')} aria-label="Скопировать идею" className="ml-auto text-text-muted hover:text-accent shrink-0"><Copy size={14} /></button>
              </div>
            ))}
            {!ideas.length && <p className="text-text-secondary text-sm">Ничего не найдено.</p>}
          </div>
        </div>
      )}

      {tab === 'checks' && (
        <div className="grid md:grid-cols-2 gap-4">
          {CHECKLISTS.map((c) => {
            const doneCount = c.items.filter((_, i) => checked[`${c.id}-${i}`]).length;
            return (
              <div key={c.id} className="bg-surface border border-border-subtle rounded-2xl p-6">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <h3 className="font-heading font-semibold">{c.title}</h3>
                  <span className="text-xs font-mono text-accent shrink-0">{doneCount}/{c.items.length}</span>
                </div>
                <div className="h-1.5 rounded-full bg-surface-elevated overflow-hidden mb-4"><div className="h-full bg-accent transition-all duration-500" style={{ width: `${(doneCount / c.items.length) * 100}%` }} /></div>
                <div className="space-y-2.5">
                  {c.items.map((it, i) => {
                    const key = `${c.id}-${i}`;
                    return (
                      <label key={key} className="flex items-start gap-3 text-sm cursor-pointer">
                        <input type="checkbox" checked={!!checked[key]} onChange={(e) => setChecked((s) => ({ ...s, [key]: e.target.checked }))} className="mt-0.5" />
                        <span className={checked[key] ? 'text-text-muted line-through' : 'text-text-secondary'}>{it}</span>
                      </label>
                    );
                  })}
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => download(`${c.id}.md`, `# ${c.title}\n\n` + c.items.map((i) => `- [ ] ${i}`).join('\n'))} className="btn-ghost px-3 py-2 text-xs inline-flex items-center gap-1.5"><Download size={13} />Скачать</button>
                  <button onClick={() => { setChecked((s) => { const n = { ...s }; c.items.forEach((_, i) => delete n[`${c.id}-${i}`]); return n; }); toast('Чек-лист сброшен', 'info'); }} className="btn-ghost px-3 py-2 text-xs">Сбросить</button>
                  {doneCount === c.items.length && <span className="text-xs text-accent-success inline-flex items-center gap-1.5 ml-auto"><Check size={14} />Готово</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === 'templates' && (
        <div className="grid md:grid-cols-2 gap-3">
          {TEMPLATES.filter((t) => !q.trim() || `${t.title} ${t.body}`.toLowerCase().includes(q.toLowerCase())).map((t) => (
            <div key={t.id} className="bg-surface border border-border-subtle rounded-2xl p-5">
              <h3 className="font-semibold text-sm mb-3">{t.title}</h3>
              <pre className="code-block text-text-secondary bg-bg-base border border-border-subtle rounded-xl p-3 mb-3 max-h-[240px] overflow-y-auto scroll-slim">{t.body}</pre>
              <div className="flex gap-2">
                <button onClick={() => copy(t.body, 'Шаблон скопирован')} className="btn-ghost px-3 py-2 text-xs inline-flex items-center gap-1.5"><Copy size={13} />Копировать</button>
                <button onClick={() => download(`${t.id}.md`, t.body)} className="btn-ghost px-3 py-2 text-xs inline-flex items-center gap-1.5"><Download size={13} />.md</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'tools' && (
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {toolCats.map((c) => (
              <button key={c} onClick={() => setToolCat(c)} className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${toolCat === c ? 'bg-accent text-bg-base font-bold' : 'bg-surface border border-border-subtle text-text-secondary'}`}>{c === 'all' ? 'Все категории' : c}</button>
            ))}
            <label className="flex items-center gap-2 text-xs text-text-secondary cursor-pointer ml-2"><input type="checkbox" checked={onlyRu} onChange={(e) => setOnlyRu(e.target.checked)} />Доступно из РФ</label>
            <label className="flex items-center gap-2 text-xs text-text-secondary cursor-pointer"><input type="checkbox" checked={onlyFree} onChange={(e) => setOnlyFree(e.target.checked)} />Есть бесплатный тариф</label>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {tools.map((t) => (
              <div key={t.name} className="bg-surface border border-border-subtle rounded-2xl p-5 card-hover">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-sm">{t.name}</h3>
                  <span className="text-[10px] text-text-muted">{t.cat}</span>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed mb-3">{t.note}</p>
                <div className="flex flex-wrap gap-1.5">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${t.free ? 'bg-accent-success/15 text-accent-success' : 'bg-warn/15 text-warn'}`}>{t.free ? 'есть free' : 'платный'}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${t.ru ? 'bg-info/15 text-info' : 'bg-accent-danger/15 text-accent-danger'}`}>{t.ru ? 'из РФ' : 'нужен обход'}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-elevated text-text-secondary">{t.level}</span>
                </div>
              </div>
            ))}
            {!tools.length && <p className="text-text-secondary text-sm">Под фильтры ничего не подошло.</p>}
          </div>
          <div className="mt-5 bg-surface border border-border-subtle rounded-2xl p-5">
            <p className="text-sm text-text-secondary mb-2">Углублённая библиотека источника: 105 уроков, 193 инструмента и 150 материалов — открыто и бесплатно.</p>
            <a href={LIBRARY_URL} target="_blank" rel="noopener noreferrer" className="text-sm text-accent hover:underline inline-flex items-center gap-1.5">Открыть AI Mayak<ExternalLink size={14} /></a>
          </div>
        </div>
      )}

      {tab === 'calc' && (
        <div className="grid lg:grid-cols-[1fr_1fr] gap-4 items-start">
          <div className="bg-surface border border-border-subtle rounded-2xl p-6 space-y-5">
            <h2 className="font-heading font-semibold">Юнит-экономика услуги</h2>
            {([
              ['Цена услуги, ₽', price, setPrice, 1000, 150000, 500],
              ['Клиентов в месяц', clients, setClients, 1, 40, 1],
              ['Покупок за всё время', repeat, setRepeat, 1, 12, 1],
              ['Маржа, %', margin, setMargin, 10, 100, 5],
              ['Стоимость привлечения, ₽', cac, setCac, 0, 50000, 500],
              ['Постоянные расходы, ₽/мес', fixed, setFixed, 0, 200000, 1000],
              ['Часов на клиента', hoursPer, setHoursPer, 1, 40, 1],
            ] as [string, number, (n: number) => void, number, number, number][]).map(([label, val, setter, min, max, step]) => (
              <div key={label}>
                <label className="flex items-center justify-between text-sm mb-2"><span className="text-text-secondary">{label}</span><span className="font-mono font-bold text-accent">{val.toLocaleString('ru-RU')}</span></label>
                <input type="range" min={min} max={max} step={step} value={val} onChange={(e) => setter(Number(e.target.value))} aria-label={label} />
              </div>
            ))}
            <button onClick={() => { setPrice(15000); setClients(6); setRepeat(3); setMargin(70); setCac(2000); setFixed(12000); setHoursPer(5); toast('Значения сброшены', 'info'); }} className="btn-ghost px-4 py-2.5 text-sm inline-flex items-center gap-2"><RotateCcw size={15} />Сброс</button>
          </div>
          <div className="bg-surface border border-border-subtle rounded-2xl p-6 lg:sticky lg:top-[92px]">
            <h2 className="font-heading font-semibold mb-4">Результат</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                ['LTV', `${ltv.toLocaleString('ru-RU')} ₽`, '#22D3EE'],
                ['LTV / CAC', cac > 0 ? (ltv / cac).toFixed(1) : '—', ltv > cac * 3 ? '#00E676' : '#FFB020'],
                ['Прибыль с клиента', `${profitPer.toLocaleString('ru-RU')} ₽`, profitPer > 0 ? '#C6FF00' : '#FF4D4D'],
                ['Прибыль в месяц', `${monthly.toLocaleString('ru-RU')} ₽`, monthly > 0 ? '#00E676' : '#FF4D4D'],
                ['Точка безубыточности', breakeven ? `${breakeven} кл.` : 'не достигается', '#FF3D9A'],
                ['Окупаемость CAC', payback ? `${payback} покупки` : 'не окупается', '#FF7A45'],
              ].map(([label, value, color]) => (
                <div key={label} className="bg-surface-elevated border border-border-subtle rounded-xl p-4">
                  <p className="text-[11px] text-text-muted mb-1">{label}</p>
                  <p className="font-heading font-bold text-lg" style={{ color }}>{value}</p>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-text-muted mt-4 leading-relaxed">Ставка твоего времени в расчёте: {rate} ₽/ч. Это модель на твоих допущениях, а не прогноз дохода.</p>
            <button onClick={() => download('unit-economics.md', `# Юнит-экономика\n\nЦена: ${price}\nКлиентов/мес: ${clients}\nПовторных покупок: ${repeat}\nМаржа: ${margin}%\nCAC: ${cac}\nПостоянные: ${fixed}\nЧасов на клиента: ${hoursPer}\n\nLTV: ${ltv}\nПрибыль с клиента: ${profitPer}\nПрибыль в месяц: ${monthly}\nТочка безубыточности: ${breakeven ?? 'не достигается'}`)} className="btn-ghost px-4 py-2.5 text-sm inline-flex items-center gap-2 mt-4"><Download size={15} />Скачать расчёт</button>
          </div>
        </div>
      )}
    </AppShell>
  );
}