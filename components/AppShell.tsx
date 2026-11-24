'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, BookOpen, FileText, Briefcase, Award, Settings, LogOut, Info } from 'lucide-react';
import { useApp } from './Providers';
import { stats, totalMinutes } from '@/lib/lessons';
import { TIERS } from '@/lib/store';

const MENU = [
  { href: '/dashboard', label: 'Обзор', icon: LayoutDashboard },
  { href: '/lessons', label: 'Уроки', icon: BookOpen },
  { href: '/materials', label: 'Материалы', icon: FileText },
  { href: '/professions', label: 'Профессии', icon: Briefcase },
  { href: '/certificate', label: 'Сертификат', icon: Award },
  { href: '/profile', label: 'Настройки', icon: Settings },
];

export default function AppShell({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle?: string }) {
  const { ready, user, progress, logout, toast } = useApp();
  const path = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (ready && !user) router.replace(`/login?next=${encodeURIComponent(path)}`);
  }, [ready, user, path, router]);

  if (!ready || !user) {
    return (
      <div className="pt-[112px] px-6 max-w-[1280px] mx-auto">
        <div className="skeleton h-10 w-64 rounded-lg mb-4" />
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="skeleton h-48 rounded-2xl lg:col-span-2" /><div className="skeleton h-48 rounded-2xl" />
        </div>
      </div>
    );
  }

  const s = stats(progress);
  const tier = TIERS[user.tier];
  const isActive = (href: string) => path === href || (href === '/lessons' && path.startsWith('/lessons'));

  return (
    <div className="pt-[72px] min-h-screen">
      <div className="max-w-[1400px] mx-auto flex">
        <aside className="hidden lg:flex flex-col w-[260px] shrink-0 border-r border-border-subtle h-[calc(100vh-72px)] sticky top-[72px] p-5 overflow-y-auto scroll-slim">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-full bg-accent/15 border border-accent/30 text-accent font-bold grid place-items-center">{user.name.slice(0, 1).toUpperCase()}</div>
            <div className="min-w-0">
              <p className="font-medium truncate">{user.name}</p>
              <p className="text-xs text-text-muted truncate">{tier.name} · {tier.months} мес</p>
            </div>
          </div>

          <div className="bg-surface border border-border-subtle rounded-xl p-4 mb-5">
            <div className="flex justify-between text-xs mb-2"><span className="text-text-secondary">Прогресс</span><span className="font-mono text-accent font-bold">{s.done}/{s.total}</span></div>
            <div className="h-2 rounded-full bg-surface-elevated overflow-hidden">
              <div className="h-full gradient-line transition-all duration-700" style={{ width: `${s.pct}%` }} />
            </div>
            <p className="text-[11px] text-text-muted mt-2">{s.minutesDone} из {totalMinutes} минут · серия {s.streak} дн</p>
          </div>

          <nav className="flex flex-col gap-1">
            {MENU.map((m) => {
              const Icon = m.icon;
              return (
                <Link key={m.href} href={m.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${isActive(m.href) ? 'bg-accent/12 text-accent font-medium' : 'text-text-secondary hover:text-text-primary hover:bg-surface'}`}>
                  <Icon size={17} />{m.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-5">
            <div className="bg-warn/10 border border-warn/25 rounded-xl p-3 text-[11px] text-text-secondary leading-relaxed mb-3">
              <Info size={13} className="text-warn inline mr-1" />
              Демо-режим: аккаунт и прогресс хранятся в этом браузере. Оплата не подключена.
            </div>
            <button onClick={() => { logout(); toast('Ты вышел из аккаунта', 'info'); router.push('/'); }} className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-text-secondary hover:text-accent-danger hover:bg-surface transition-colors">
              <LogOut size={16} />Выйти
            </button>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <div className="lg:hidden sticky top-[72px] z-30 bg-bg-base/90 backdrop-blur border-b border-border-subtle">
            <div className="flex gap-1 overflow-x-auto scroll-slim px-4 py-2.5">
              {MENU.map((m) => {
                const Icon = m.icon;
                return (
                  <Link key={m.href} href={m.href} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs whitespace-nowrap transition-colors ${isActive(m.href) ? 'bg-accent/12 text-accent font-medium' : 'text-text-secondary'}`}>
                    <Icon size={14} />{m.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="p-5 md:p-8">
            <header className="mb-6">
              <h1 className="font-heading font-bold text-[clamp(24px,3.5vw,36px)] leading-tight">{title}</h1>
              {subtitle && <p className="text-text-secondary mt-1.5">{subtitle}</p>}
            </header>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}