'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion';
import { Menu, X, LayoutDashboard, LogOut } from 'lucide-react';
import { useApp } from './Providers';

const SECTIONS = [
  { id: 'program', label: 'Программа' },
  { id: 'pricing', label: 'Тарифы' },
  { id: 'faq', label: 'Вопросы' },
];
const ROUTES = [
  { href: '/lessons', label: 'Уроки' },
  { href: '/materials', label: 'Материалы' },
  { href: '/professions', label: 'Профессии' },
];

export default function Navbar() {
  const path = usePathname();
  const router = useRouter();
  const { user, ready, logout, toast } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');
  const { scrollYProgress } = useScroll();
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: .001 });
  const onLanding = path === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [path]);

  useEffect(() => {
    if (!onLanding) { setActive(''); return; }
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver((entries) => {
      const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(visible.target.id);
    }, { rootMargin: '-92px 0px -55% 0px', threshold: [0.05, 0.25, 0.5] });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [onLanding]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open]);

  const initials = (user?.name ?? '?').trim().slice(0, 1).toUpperCase();

  return (
    <>
      <header className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${scrolled || !onLanding ? 'bg-bg-base/85 backdrop-blur-xl border-b border-border-subtle' : 'bg-transparent'}`}>
        <div className="max-w-[1280px] mx-auto px-6 h-[72px] flex items-center justify-between gap-4">
          <Link href="/" className="font-heading font-bold text-lg tracking-tight shrink-0 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm gradient-line" />AI-Академия
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {SECTIONS.map((s) => (
              <a key={s.id} href={onLanding ? `#${s.id}` : `/#${s.id}`}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${active === s.id ? 'text-accent bg-accent/10' : 'text-text-secondary hover:text-text-primary'}`}>
                {s.label}
              </a>
            ))}
            <span className="w-px h-5 bg-border-subtle mx-2" />
            {ROUTES.map((r) => (
              <Link key={r.href} href={r.href}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${path.startsWith(r.href) ? 'text-accent bg-accent/10' : 'text-text-secondary hover:text-text-primary'}`}>
                {r.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            {ready && user ? (
              <>
                <Link href="/dashboard" className="btn-ghost px-4 py-2 text-sm font-medium inline-flex items-center gap-2">
                  <LayoutDashboard size={16} />Кабинет
                </Link>
                <Link href="/profile" aria-label="Настройки профиля" className="w-9 h-9 rounded-full bg-accent/15 border border-accent/30 text-accent font-bold grid place-items-center text-sm">{initials}</Link>
                <button onClick={() => { logout(); toast('Ты вышел из аккаунта', 'info'); router.push('/'); }} aria-label="Выйти" className="p-2 text-text-muted hover:text-accent-danger transition-colors"><LogOut size={18} /></button>
              </>
            ) : (
              <>
                <Link href="/login" className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary">Войти</Link>
                <Link href="/login?tier=2" className="btn-primary px-5 py-2.5 text-sm">Открыть доступ</Link>
              </>
            )}
          </div>

          <button onClick={() => setOpen((v) => !v)} aria-label={open ? 'Закрыть меню' : 'Открыть меню'} aria-expanded={open} className="lg:hidden p-2 text-text-secondary hover:text-text-primary">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        <motion.div style={{ scaleX: bar }} className="h-[2px] gradient-line origin-left" />
      </header>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: .22 }}
            className="fixed inset-0 z-40 bg-bg-base/97 backdrop-blur-xl pt-[84px] px-6 pb-8 overflow-y-auto scroll-slim lg:hidden">
            <div className="flex flex-col gap-1 max-w-[520px] mx-auto">
              {SECTIONS.map((s) => (
                <a key={s.id} href={onLanding ? `#${s.id}` : `/#${s.id}`} onClick={() => setOpen(false)} className="py-3.5 border-b border-border-subtle font-heading font-bold text-xl">{s.label}</a>
              ))}
              {ROUTES.map((r) => (
                <Link key={r.href} href={r.href} onClick={() => setOpen(false)} className="py-3.5 border-b border-border-subtle font-heading font-bold text-xl">{r.label}</Link>
              ))}
              <div className="pt-6 flex flex-col gap-3">
                {ready && user ? (
                  <>
                    <Link href="/dashboard" onClick={() => setOpen(false)} className="btn-primary py-4 text-center text-base">Личный кабинет</Link>
                    <button onClick={() => { logout(); setOpen(false); router.push('/'); toast('Ты вышел из аккаунта', 'info'); }} className="btn-ghost py-4 text-base">Выйти</button>
                  </>
                ) : (
                  <>
                    <Link href="/login?tier=2" onClick={() => setOpen(false)} className="btn-primary py-4 text-center text-base">Открыть доступ</Link>
                    <Link href="/login" onClick={() => setOpen(false)} className="btn-ghost py-4 text-center text-base">Войти</Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}