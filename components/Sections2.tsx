'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, Star, ArrowRight, Shield, Clock, Zap, Mail } from 'lucide-react';
import FadeInUp from './FadeInUp';
import { TIERS, type Tier } from '@/lib/store';
import { totalMinutes } from '@/lib/lessons';

const DEADLINE = new Date('2026-12-15T23:59:59+02:00');

function Deadline() {
  const [left, setLeft] = useState<{ d: number; h: number; m: number } | null>(null);
  useEffect(() => {
    const tick = () => {
      const diff = DEADLINE.getTime() - Date.now();
      if (diff <= 0) { setLeft(null); return; }
      setLeft({ d: Math.floor(diff / 864e5), h: Math.floor((diff / 36e5) % 24), m: Math.floor((diff / 6e4) % 60) });
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);
  if (!left) return null;
  return (
    <div className="flex items-center gap-2 justify-center flex-wrap">
      <Clock size={16} className="text-accent" />
      <span className="text-text-secondary text-sm">Цена запуска действует до 15 декабря:</span>
      <span className="flex gap-1 font-mono font-bold text-accent">
        <span className="bg-surface-elevated px-2 py-1 rounded">{left.d}д</span>
        <span className="bg-surface-elevated px-2 py-1 rounded">{String(left.h).padStart(2, '0')}ч</span>
        <span className="bg-surface-elevated px-2 py-1 rounded">{String(left.m).padStart(2, '0')}м</span>
      </span>
    </div>
  );
}

const PLANS: { tier: Tier; badge: string | null; old: number; features: string[]; cta: string }[] = [
  { tier: 1, badge: null, old: 9990, cta: 'Начать со «Старта»', features: ['53 урока основного курса', 'Тренажёр промптов и 50 идей', 'Трекер прогресса и заметки', 'Карта профессий', 'Сертификат после финиша', '3 месяца доступа'] },
  { tier: 2, badge: 'ХИТ', old: 14990, cta: 'Забрать «Свой»', features: ['Всё из «Старта»', '12 месяцев доступа вместо 3', 'Чек-лист 50 идей в PDF', 'Шаблоны: бриф, КП, письма, сдача', 'Калькулятор юнит-экономики', 'Приоритетный ответ поддержки'] },
  { tier: 3, badge: 'PRO', old: 29990, cta: 'Стать инженером', features: ['Всё из «Своего»', 'Генератор идей: диалог о твоих задачах', 'До 30 сообщений в день — 4–5 разборов', 'ИИ задаёт вопросы и доводит идею до плана', 'Маршрут «Строю»: продукт и автоматизация', 'Ранний доступ к новым модулям'] },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative py-24 md:py-32 px-6">
      <div className="aurora drift-a w-[460px] h-[460px] top-20 -left-32" style={{ background: 'radial-gradient(circle,rgba(198,255,0,.1),transparent 65%)' }} />
      <div className="relative max-w-[1280px] mx-auto">
        <FadeInUp>
          <h2 className="font-heading font-bold text-[clamp(28px,4vw,48px)] text-center mb-4">Выбери свой тариф</h2>
          <p className="text-text-secondary text-center text-lg mb-6">Единоразовая оплата. Без подписок и скрытых платежей.</p>
          <div className="mb-6"><Deadline /></div>
          <div className="max-w-[720px] mx-auto mb-12 bg-warn/10 border border-warn/30 rounded-xl p-4 text-sm text-text-secondary text-center">
            <span className="text-warn font-medium">Приём оплаты ещё не подключён.</span> Сейчас работает демо-доступ: регистрация открывает все 53 урока и материалы бесплатно. Тариф ниже выбирается как план — его можно поменять в настройках.
          </div>
        </FadeInUp>

        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {PLANS.map((p, i) => {
            const t = TIERS[p.tier];
            const hit = p.badge === 'ХИТ';
            return (
              <FadeInUp key={p.tier} delay={i * .1}>
                <div className={`relative bg-surface border rounded-2xl p-7 h-full flex flex-col transition-all duration-300 ${hit ? 'border-accent glow-accent' : 'border-border-subtle hover:border-accent/30'}`}>
                  {p.badge && (
                    <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold ${hit ? 'bg-accent text-bg-base' : 'bg-accent-purple text-white'}`}>{p.badge}</div>
                  )}
                  <div className="mb-5">
                    <h3 className="font-heading font-bold text-xl mb-1">{t.name}</h3>
                    <p className="text-text-muted text-sm">{t.months} месяца доступа</p>
                  </div>
                  <div className="mb-6">
                    <p className="font-heading font-extrabold text-4xl">{t.price.toLocaleString('ru-RU')} ₽</p>
                    <p className="text-text-muted text-sm line-through mt-1">{p.old.toLocaleString('ru-RU')} ₽</p>
                  </div>
                  <ul className="space-y-3 mb-8 flex-grow">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm">
                        <Check size={16} className="text-accent mt-0.5 shrink-0" /><span className="text-text-secondary">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link href={`/login?tier=${p.tier}`} className={`w-full py-4 rounded-xl font-bold text-base text-center transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[.98] ${hit ? 'bg-accent text-bg-base hover:shadow-[0_8px_32px_rgba(198,255,0,.35)]' : 'bg-surface-elevated border border-border-subtle hover:border-accent/30'}`}>
                    {p.cta}
                  </Link>
                </div>
              </FadeInUp>
            );
          })}
        </div>

        <FadeInUp delay={.3}>
          <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm text-text-muted">
            <span className="flex items-center gap-2"><Shield size={16} className="text-accent" />Возврат 14 дней</span>
            <span className="flex items-center gap-2"><Zap size={16} className="text-accent" />Доступ сразу после регистрации</span>
            <span className="flex items-center gap-2"><Star size={16} className="text-accent" />Без подписок</span>
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}

export function Reviews() {
  const checks = [
    { icon: Check, title: 'Программа открыта целиком', text: 'Все 7 модулей и 53 урока видны до регистрации. Никаких сюрпризов внутри.' },
    { icon: Shield, title: 'Возврат 14 дней', text: 'Когда подключим оплату — вернём всю сумму по первому письму, без анкет.' },
    { icon: Star, title: 'Отвечает человек', text: 'Поддержка — автор курса. Обычно отвечаю в течение дня.' },
  ];
  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-[1000px] mx-auto">
        <FadeInUp>
          <h2 className="font-heading font-bold text-[clamp(28px,4vw,48px)] text-center mb-4">Отзывов пока нет. И это честно.</h2>
          <p className="text-text-secondary text-center text-lg mb-12 max-w-[640px] mx-auto">Это первый поток. Мы не рисуем чужие скриншоты и не придумываем учеников. Вместо отзывов — три вещи, которые можно проверить прямо сейчас.</p>
        </FadeInUp>
        <div className="grid md:grid-cols-3 gap-6">
          {checks.map((c, i) => {
            const Icon = c.icon;
            return (
              <FadeInUp key={i} delay={i * .1}>
                <div className="bg-surface border border-border-subtle rounded-2xl p-6 h-full card-hover">
                  <div className="w-11 h-11 rounded-xl bg-accent/10 grid place-items-center mb-4"><Icon size={20} className="text-accent" strokeWidth={1.5} /></div>
                  <h3 className="font-semibold mb-2">{c.title}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{c.text}</p>
                </div>
              </FadeInUp>
            );
          })}
        </div>
        <FadeInUp delay={.3}>
          <div className="mt-8 bg-surface-elevated border border-accent/20 rounded-2xl p-6 md:p-8 text-center">
            <p className="leading-relaxed max-w-[660px] mx-auto">
              Первым <span className="text-accent font-bold">30 участникам</span> — цена запуска и личное сопровождение.
              Взамен просим честный отзыв: он появится здесь с именем и профессией. <span className="text-text-secondary">Плохой тоже опубликуем.</span>
            </p>
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}

const FAQ_ITEMS = [
  { q: 'В интернете есть бесплатные курсы. Зачем платить?', a: 'Есть, и хорошие — мы опираемся на открытую академию AI Mayak, ссылка в футере. Только там 158 уроков текста без ведения, а часть примеров на сервисах, которые из России не открыть. Мы отобрали ядро из 53 уроков, переписали примеры под доступные инструменты и добавили кабинет: трекер, заметки, тренажёр промптов, материалы и сертификат. Платишь не за текст, а за структуру и сопровождение.' },
  { q: 'Почему так дёшево?', a: 'Курс делает один человек: без студии, продюсеров и рекламных бюджетов. Мы не платим за производство контента — он открытый. Деньги идут на сервер, разработку кабинета и поддержку. Поэтому 2 990, а не 50 000.' },
  { q: 'Почему 53 урока, а не 60?', a: 'Ровно столько в основном курсе источника: 53 урока ядра плюс 105 уроков углублённой библиотеки, итого 158. Мы не округляем цифры в свою пользу. Ядро — здесь, библиотека открыта по ссылке в разделе «Материалы».' },
  { q: 'Я не технарь. Потяну?', a: 'Да. Первые уроки проходят прямо в браузере, ничего не нужно устанавливать. Программировать не учим — учим ставить задачи ИИ и проверять ответы. Маршрут «Строю» необязательный.' },
  { q: 'Сколько времени нужно в день?', a: `Около 20 минут. Весь курс — примерно ${Math.round(totalMinutes / 60)} часов. Темп твой: доступ 3 или 12 месяцев, за пропуск ничего не сгорает.` },
  { q: 'Нужно ли отдельно платить за нейросети?', a: 'На старте нет. Начинаем с бесплатных лимитов сервисов, которые работают из России. Где платный тариф действительно нужен — говорим прямо и считаем окупаемость в калькуляторе.' },
  { q: 'Что происходит после регистрации?', a: 'Открывается кабинет: 53 урока, материалы, карта профессий и трекер. Первый урок можно пройти в тот же вечер. Сейчас это демо-доступ, оплата не подключена.' },
  { q: 'Где хранятся мои данные?', a: 'Аккаунт, прогресс и заметки хранятся в твоём браузере, пароль — в виде хеша PBKDF2. На сервер ничего не отправляется. Подробности в политике конфиденциальности; экспорт данных есть в настройках.' },
  { q: 'Сертификат официальный?', a: 'Это сертификат нашей платформы: имя, программа, дата и уникальный номер. Документом государственного образца он не является. Ценность — в реально пройденных 53 уроках.' },
];

export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="py-24 md:py-32 px-6">
      <div className="max-w-[760px] mx-auto">
        <FadeInUp><h2 className="font-heading font-bold text-[clamp(28px,4vw,48px)] text-center mb-12">Частые вопросы</h2></FadeInUp>
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, i) => (
            <FadeInUp key={i} delay={i * .04}>
              <div className="bg-surface border border-border-subtle rounded-2xl overflow-hidden hover:border-accent/25 transition-colors">
                <button onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left">
                  <span className="font-medium pr-2">{item.q}</span>
                  <motion.span animate={{ rotate: open === i ? 45 : 0 }} transition={{ duration: .2 }} className="text-accent text-2xl font-light shrink-0 leading-none">+</motion.span>
                </button>
                {open === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} transition={{ duration: .3 }} className="overflow-hidden">
                    <p className="px-6 pb-5 text-text-secondary text-sm leading-relaxed">{item.a}</p>
                  </motion.div>
                )}
              </div>
            </FadeInUp>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FinalCTA() {
  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-[940px] mx-auto">
        <FadeInUp>
          <div className="relative bg-surface border border-border-subtle rounded-3xl p-10 md:p-16 text-center overflow-hidden">
            <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 30% 20%,rgba(198,255,0,.12),transparent 55%),radial-gradient(circle at 80% 80%,rgba(124,58,237,.14),transparent 55%),radial-gradient(circle at 60% 0%,rgba(34,211,238,.08),transparent 50%)' }} />
            <div className="relative">
              <h2 className="font-heading font-extrabold text-[clamp(28px,4vw,48px)] leading-tight mb-6">
                Начни сегодня —<br />первый урок через <span className="text-accent">3 минуты</span>
              </h2>
              <p className="text-text-secondary text-lg mb-8 max-w-[560px] mx-auto">
                Регистрация открывает все 53 урока и материалы бесплатно. Первый поток — 30 мест с личным сопровождением.
              </p>
              <Link href="/login?tier=2" className="btn-primary inline-flex items-center gap-2 px-10 py-[18px] text-lg">
                Открыть доступ<ArrowRight size={20} />
              </Link>
              <p className="text-text-muted text-xs mt-4">Оплата пока не подключена. Возврат 14 дней — с момента запуска продаж.</p>
            </div>
          </div>
        </FadeInUp>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border-subtle py-12 px-6">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-2">
            <p className="font-heading font-bold text-xl mb-3 flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-sm gradient-line" />AI-Академия</p>
            <p className="text-text-secondary text-sm leading-relaxed max-w-[380px]">
              Платформа, которая превращает страх перед ИИ в рабочий навык: 53 урока, карта профессий, тренажёр промптов и материалы для дела.
            </p>
            <a href="mailto:support@ai-academy.ru" className="inline-flex items-center gap-2 text-sm text-accent hover:underline mt-4"><Mail size={15} />support@ai-academy.ru</a>
          </div>
          <div>
            <h4 className="font-medium text-sm mb-3">Платформа</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/lessons" className="text-text-secondary hover:text-accent transition-colors">Уроки</Link></li>
              <li><Link href="/materials" className="text-text-secondary hover:text-accent transition-colors">Материалы</Link></li>
              <li><Link href="/professions" className="text-text-secondary hover:text-accent transition-colors">Карта профессий</Link></li>
              <li><Link href="/dashboard" className="text-text-secondary hover:text-accent transition-colors">Личный кабинет</Link></li>
              <li><Link href="/certificate" className="text-text-secondary hover:text-accent transition-colors">Сертификат</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-sm mb-3">Документы</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/legal/offer" className="text-text-secondary hover:text-accent transition-colors">Оферта</Link></li>
              <li><Link href="/legal/privacy" className="text-text-secondary hover:text-accent transition-colors">Политика конфиденциальности</Link></li>
              <li><Link href="/legal/refund" className="text-text-secondary hover:text-accent transition-colors">Возврат</Link></li>
              <li><Link href="/legal/sources" className="text-text-secondary hover:text-accent transition-colors">Источники и лицензия</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border-subtle pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-text-muted text-xs">© 2026 AI-Академия</p>
          <p className="text-text-muted text-xs text-center md:text-right max-w-[460px] leading-relaxed">
            Материалы основаны на открытом проекте{' '}
            <a href="https://aimayak.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-text-secondary">AI Mayak</a>, лицензия{' '}
            <a href="https://creativecommons.org/licenses/by/4.0/deed.ru" target="_blank" rel="noopener noreferrer" className="underline hover:text-text-secondary">CC BY 4.0</a>.
            Проект независим и не связан с Anthropic и другими разработчиками ИИ.
          </p>
        </div>
      </div>
    </footer>
  );
}