export type Route = 'use' | 'earn' | 'build';

export type Lesson = {
  n: number;
  slug: string;          // = имя файла в public/content без .md
  file: string;          // путь для fetch
  title: string;
  module: number;
  minutes: number;
  route: Route;
  origin: string;        // номер урока в источнике
  ru?: string;           // заметка об адаптации под РФ
};

export const MODULES = [
  { id: 1, title: 'Первый контакт', desc: 'Первые 30 минут, страх, механика LLM, история, семья.', color: '#C6FF00' },
  { id: 2, title: 'Как думать вместе с ИИ', desc: 'Промпт, мышление по умолчанию, безопасность, выбор модели.', color: '#22D3EE' },
  { id: 3, title: 'Работа руками', desc: 'Тексты, почта, встречи, презентации, переводы, картинки, видео, звук.', color: '#7C3AED' },
  { id: 4, title: 'Деньги и рынок', desc: 'Сколько тратить, стек инструментов, профессии, будущее, агенты.', color: '#FFB020' },
  { id: 5, title: 'Своя услуга', desc: 'Кейсы, идеи, ниша, юнит-экономика, цена, упаковка.', color: '#FF3D9A' },
  { id: 6, title: 'Клиенты и продажи', desc: 'Первые клиенты, портфолио, переписка, сделка, сдача, бренд, реклама.', color: '#FF7A45' },
  { id: 7, title: 'Продукт и автоматизация', desc: 'Консалтинг, фабрика, план 90 дней, no-code, сайт, свой путь.', color: '#00E676' },
];

export const ROUTES: Record<Route, { label: string; color: string; desc: string }> = {
  use: { label: 'Пользуюсь', color: '#C6FF00', desc: 'Применяю ИИ в своей работе' },
  earn: { label: 'Зарабатываю', color: '#FFB020', desc: 'Продаю услугу с ИИ' },
  build: { label: 'Строю', color: '#22D3EE', desc: 'Собираю свой продукт' },
};

const L = (n: number, slug: string, title: string, module: number, minutes: number, route: Route, origin: string, ru?: string): Lesson => ({
  n, slug, file: `/content/${slug}.md`, title, module, minutes, route, origin, ru,
});

export const LESSONS: Lesson[] = [
  L(1, '00pre-your-first-30-minutes', 'Твои первые 30 минут с ИИ — самый первый шаг', 1, 30, 'use', '00pre', 'В оригинале старт на Claude. Из России проще начать с GigaChat, YandexGPT или DeepSeek — приёмы те же.'),
  L(2, '00d-ai-without-fear', 'ИИ без страха — что заберёт и что не заберёт', 1, 40, 'use', '00d'),
  L(3, '00b-how-llm-works', 'Как работает LLM изнутри — без математики, через образы', 1, 45, 'use', '00b'),
  L(4, '00-what-is-ai', 'История ИИ: от Тьюринга до Claude — почему сейчас перелом', 1, 55, 'use', '00'),
  L(5, '00g-ai-for-family', 'ИИ для семьи и детей — безопасность, обучение, развитие', 1, 50, 'use', '00g'),
  L(6, '06-prompting-fundamentals', 'Как ставить задачу ИИ: основы промпта', 2, 30, 'use', '06'),
  L(7, '03-default-shift-mindset', 'Сдвиг по умолчанию (Default Shift) — мышление под ИИ-эпоху', 2, 20, 'use', '03'),
  L(8, '61b-ai-ethics-safety', 'Этика и безопасность ИИ — галлюцинации, атаки, предвзятость', 2, 50, 'use', '61b'),
  L(9, '00c-ai-models-comparison', 'Сравнение ИИ-моделей 2026 — Claude, GPT, Gemini, открытые модели', 2, 55, 'use', '00c', 'Часть сервисов из сравнения недоступна из РФ напрямую. Смотри колонку доступности в каталоге инструментов.'),
  L(10, '67-ai-copywriting', 'ИИ-копирайтинг через промпт-конвейер', 3, 25, 'use', '67'),
  L(11, '73-ai-email-communications', 'ИИ в переписке — умная почта, черновики писем, ответы', 3, 45, 'use', '73'),
  L(12, '74-ai-meetings', 'Встречи с ИИ — Otter.ai, Fireflies и автоматические протоколы', 3, 40, 'use', '74', 'Otter и Fireflies работают не для всех. Подойдёт любая расшифровка, в том числе встроенная в мессенджер.'),
  L(13, '70-ai-presentations', 'ИИ-презентации — Gamma, Beautiful.ai и PowerPoint', 3, 25, 'use', '70'),
  L(14, '75-ai-translation', 'Переводы и локализация: DeepL и ассистенты', 3, 35, 'use', '75'),
  L(15, '18c-ai-image-generation-pipeline', 'Картинки с помощью ИИ — Midjourney, Flux, Recraft, Ideogram', 3, 60, 'use', '18c', 'Из России доступны Kandinsky и Shedevrum; зарубежные сервисы требуют обхода и оплаты.'),
  L(16, '71-ai-video-generation', 'ИИ-видеогенерация — Runway, Kling, Luma и другие', 3, 35, 'use', '71'),
  L(17, '69-music-ai-suno', 'Музыка через ИИ — Suno и звуковой дизайн', 3, 20, 'use', '69'),
  L(18, '00e-investment-roadmap', 'Сколько тратить на ИИ: от $0 до $2000 в месяц', 4, 50, 'use', '00e', 'Цены в оригинале в долларах. Пересчитывай по актуальному курсу и проверяй способы оплаты.'),
  L(19, 'd04-ai-stack-costs', 'Сколько стоит набор ИИ-инструментов — и как не переплачивать', 4, 20, 'use', 'd04'),
  L(20, '100-future-professions-and-hybrids', 'Профессии будущего: 100 новых и гибридных ИИ-профессий', 4, 90, 'use', '100'),
  L(21, '108-ai-roadmap-2027-2030', 'Будущее ИИ в 2027–2030: как готовиться', 4, 55, 'use', '108'),
  L(22, '47-monetization-cases', 'Кейсы монетизации — 5 разборов с цифрами', 5, 35, 'earn', '47'),
  L(23, '100-ai-business-ideas-smb', '100+ идей ИИ-бизнеса для владельцев малого бизнеса', 5, 120, 'earn', '100'),
  L(24, '38b-niche-selection-methodology', 'Выбор ниши — как найти нишу с реальным спросом', 5, 50, 'earn', '38b'),
  L(25, '88-niche-trend-analysis', 'Анализ ниш и трендов — Exploding Topics, Google Trends, Reddit', 5, 40, 'earn', '88', 'Для рунета добавляй Wordstat: он показывает локальный спрос точнее.'),
  L(26, 'd01-unit-economics-simple', 'Сколько стоит клиент и сколько он приносит — юнит-экономика', 5, 20, 'earn', 'd01'),
  L(27, 'd02-pricing-simple', 'Как назначить цену — пол, рынок и ценность для клиента', 5, 20, 'earn', 'd02'),
  L(28, 'd03-break-even-and-cash', 'Точка безубыточности и запас денег', 5, 20, 'earn', 'd03'),
  L(29, '42-packaging', 'Пакетирование — услуга в трёх понятных пакетах', 5, 25, 'earn', '42'),
  L(30, '39-monetization-pricing', 'Ценообразование — цена по ценности для клиента', 5, 25, 'earn', '39'),
  L(31, '39e-pricing-strategy-deep', 'Цена ИИ-продукта — от ценности к тарифам и упаковке', 5, 60, 'earn', '39e'),
  L(32, '38-monetization-clients', 'Первые клиенты среди знакомых — карта доверия', 6, 25, 'earn', '38'),
  L(33, '41-portfolio-case-studies', 'Портфолио и кейсы — как показать ценность своей работы', 6, 25, 'earn', '41'),
  L(34, '45-cold-outreach', 'Холодные письма с помощью ИИ: почта и LinkedIn', 6, 30, 'earn', '45', 'LinkedIn в России заблокирован. Те же приёмы работают в почте, Telegram и профильных чатах.'),
  L(35, '39c-cold-outreach-deep', 'Холодные письма и сообщения: как достучаться, когда никто не отвечает', 6, 45, 'earn', '39c'),
  L(36, '45b-closing-objections', 'Как довести сделку до подписи — интерес клиента в договор', 6, 55, 'earn', '45b'),
  L(37, '46-delivery-retention', 'Сдача работы и удержание клиента', 6, 25, 'earn', '46'),
  L(38, '67c-personal-brand-ai', 'Личный бренд с ИИ — тексты, клон голоса, единый образ', 6, 55, 'earn', '67c'),
  L(39, '72-content-pipeline-complete', 'Полный контент-конвейер — от идеи до публикации', 6, 35, 'earn', '72'),
  L(40, '39d-lead-magnets-funnels', 'Лид-магниты — воронка от бесплатного материала к платной услуге', 6, 50, 'earn', '39d'),
  L(41, '92-ai-advertising', 'ИИ в рекламе — тексты объявлений, A/B-тесты, отчёты', 6, 35, 'earn', '92'),
  L(42, '93-sales-ai', 'ИИ в продажах — отбор заявок, повторные письма, возражения', 6, 35, 'earn', '93'),
  L(43, '113-build-along-ai-consulting', 'Практика ИИ-консалтинга: план на 30 дней по шагам', 7, 60, 'earn', '113'),
  L(44, '48-factory-model', 'Модель фабрики: шаблоны и повторяемость', 7, 30, 'earn', '48'),
  L(45, '49-graduation', 'Итог: твой план ИИ-бизнеса на 30–60–90 дней', 7, 35, 'earn', '49'),
  L(46, '01-agentic-market', 'Что такое ИИ-агент и почему это важно сейчас', 7, 25, 'build', '01'),
  L(47, '77-no-code-ai', 'Сайты и приложения без кода: v0, Webflow, Framer', 7, 35, 'build', '77', 'Часть конструкторов требует обхода. Альтернатива — российские конструкторы или Next.js.'),
  L(48, '79-zapier-ai', 'Zapier ИИ — тысячи приложений и умные сценарии', 7, 35, 'build', '79', 'Zapier и Make из РФ недоступны напрямую. Self-hosted n8n решает ту же задачу.'),
  L(49, '05c-access-levels-pricing', 'Тарифы ассистентов: Free, Pro, Max, Team или API', 7, 50, 'build', '05c', 'В оригинале — тарифы Claude. Проверяй доступность оплаты из своей страны.'),
  L(50, '05b-claude-code-desktop', 'Кодинг-ассистент в приложении для компьютера: без терминала', 7, 35, 'build', '05b', 'Claude Code доступен не всем. Тот же цикл работает с любым доступным ассистентом в редакторе.'),
  L(51, '15-websites-webapps', 'Сайты и веб-приложения с нуля', 7, 25, 'build', '15'),
  L(52, '100-intrigue', 'Самый неожиданный урок', 7, 15, 'build', '100'),
  L(53, '49b-choose-your-path', 'Выбери свой путь: карта углублённой библиотеки', 7, 45, 'build', '49b'),
];

export type ProgressMap = Record<string, string>;

const pad = (n: number) => String(n).padStart(2, '0');
export const localDay = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const bySlug = (slug: string) => LESSONS.find((l) => l.slug === slug);
export const moduleLessons = (id: number) => LESSONS.filter((l) => l.module === id);
export const totalMinutes = LESSONS.reduce((s, l) => s + l.minutes, 0);
export const nextLesson = (p: ProgressMap) => LESSONS.find((l) => !p[l.slug]) ?? null;

export function stats(p: ProgressMap) {
  const done = LESSONS.filter((l) => p[l.slug]).length;
  const total = LESSONS.length;
  const pct = Math.round((done / total) * 100);
  const days = Object.values(p).map((v) => localDay(new Date(v)));
  const set = new Set(days);
  const today = new Date();
  const cursor = new Date(today);
  if (!set.has(localDay(cursor))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (set.has(localDay(cursor))) { streak++; cursor.setDate(cursor.getDate() - 1); }
  const names = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today); d.setDate(d.getDate() - (6 - i));
    const key = localDay(d);
    return { label: names[d.getDay()], count: days.filter((x) => x === key).length, today: i === 6 };
  });
  const byModule = MODULES.map((m) => {
    const ls = moduleLessons(m.id);
    const d = ls.filter((l) => p[l.slug]).length;
    return { ...m, done: d, total: ls.length, pct: Math.round((d / ls.length) * 100) };
  });
  const byRoute = (r: Route) => { const ls = LESSONS.filter((l) => l.route === r); return { done: ls.filter((l) => p[l.slug]).length, total: ls.length }; };
  const minutesDone = LESSONS.filter((l) => p[l.slug]).reduce((s, l) => s + l.minutes, 0);
  const lastAt = Object.values(p).sort().at(-1) ?? null;
  return { done, total, pct, streak, week, byModule, byRoute, minutesDone, lastAt, complete: done === total };
}

export function achievements(p: ProgressMap) {
  const s = stats(p);
  const modDone = s.byModule.some((m) => m.done === m.total);
  return [
    { id: 'first', title: 'Первый шаг', desc: 'Пройден первый урок', ok: s.done >= 1, icon: 'Sparkles', color: '#C6FF00' },
    { id: 'five', title: 'Разгон', desc: '5 уроков позади', ok: s.done >= 5, icon: 'Zap', color: '#22D3EE' },
    { id: 'module', title: 'Модуль закрыт', desc: 'Целиком пройден модуль', ok: modDone, icon: 'Layers', color: '#7C3AED' },
    { id: 'streak', title: 'Неделя без пропусков', desc: '7 дней подряд', ok: s.streak >= 7, icon: 'Flame', color: '#FF7A45' },
    { id: 'half', title: 'Половина пути', desc: '27 уроков из 53', ok: s.done >= 27, icon: 'Milestone', color: '#FFB020' },
    { id: 'prompt', title: 'Мастер промптов', desc: 'Модули 1 и 2 закрыты', ok: s.byModule[0].done === s.byModule[0].total && s.byModule[1].done === s.byModule[1].total, icon: 'Terminal', color: '#FF3D9A' },
    { id: 'earn', title: 'Своё дело', desc: '10 уроков маршрута «Зарабатываю»', ok: s.byRoute('earn').done >= 10, icon: 'BadgeRussianRuble', color: '#00E676' },
    { id: 'build', title: 'Инженер', desc: '5 уроков маршрута «Строю»', ok: s.byRoute('build').done >= 5, icon: 'Wrench', color: '#22D3EE' },
    { id: 'finish', title: 'Финиш', desc: 'Все 53 урока', ok: s.complete, icon: 'Award', color: '#C6FF00' },
  ];
}