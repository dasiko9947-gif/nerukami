'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, Sparkles, ShieldCheck, Loader2 } from 'lucide-react';
import { useApp } from '@/components/Providers';

export default function LoginPage() {
  const { register, login, user, ready, loading, toast } = useApp();
  const router = useRouter();
  const [mode, setMode] = useState<'in' | 'up'>('up');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.get('mode') === 'in') setMode('in');
  }, []);

  useEffect(() => {
    if (ready && user) {
      const next = new URLSearchParams(window.location.search).get('next') || '/dashboard';
      router.replace(next);
    }
  }, [ready, user, router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (mode === 'up' && name.trim().length < 2) errs.name = 'Имя от 2 символов';
    if (!/^[^\s@]+@[^\s@]+\.[a-zA-Zа-яА-Я]{2,}$/.test(email.trim())) errs.email = 'Похоже, в адресе опечатка';
    if (pw.length < 8) errs.password = 'Пароль от 8 символов';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    const res = mode === 'up'
      ? await register(email, pw, name)
      : await login(email, pw);

    if (!res.ok && res.error) setErrors({ form: res.error });
  };

  return (
    <div className="pt-[72px] min-h-screen relative overflow-hidden">
      <div className="aurora drift-a w-[520px] h-[520px] -top-32 -right-24" style={{ background: 'radial-gradient(circle,rgba(198,255,0,.12),transparent 65%)' }} />
      <div className="aurora drift-b w-[460px] h-[460px] bottom-0 -left-32" style={{ background: 'radial-gradient(circle,rgba(124,58,237,.16),transparent 65%)' }} />

      <div className="relative max-w-[1080px] mx-auto px-6 py-12 grid lg:grid-cols-2 gap-10 items-start">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6 }} className="order-2 lg:order-1">
          <h1 className="font-heading font-extrabold text-[clamp(28px,4vw,44px)] leading-tight mb-4">
            {mode === 'up' ? 'Открой доступ к 53 урокам' : 'С возвращением'}
          </h1>
          <p className="text-text-secondary leading-relaxed mb-6">
            Регистрация занимает 20 секунд. Откроются три бесплатных урока, трекер прогресса и бот-наставник.
          </p>
          <div className="space-y-3 mb-6">
            {[
              { icon: Sparkles, text: '53 урока основного курса + материалы: промпты, чек-листы, шаблоны' },
              { icon: ShieldCheck, text: 'Пароль хранится как хеш bcrypt. Данные в базе на нашем сервере, не в браузере.' },
              { icon: ArrowRight, text: 'Первые 3 урока бесплатно навсегда. Остальные — после оплаты.' },
            ].map((r, i) => {
              const Icon = r.icon;
              return (
                <div key={i} className="flex items-start gap-3 bg-surface border border-border-subtle rounded-xl p-4">
                  <Icon size={17} className="text-accent mt-0.5 shrink-0" />
                  <p className="text-sm text-text-secondary leading-relaxed">{r.text}</p>
                </div>
              );
            })}
          </div>
          <div className="bg-warn/10 border border-warn/30 rounded-xl p-4 text-xs text-text-secondary leading-relaxed">
            Регистрируясь, ты соглашаешься с{' '}
            <Link href="/legal/offer" className="text-accent underline">офертой</Link> и{' '}
            <Link href="/legal/privacy" className="text-accent underline">политикой конфиденциальности</Link>.
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6, delay: .1 }} className="order-1 lg:order-2">
          <div className="bg-surface border border-border-subtle rounded-2xl p-6 md:p-8">
            <div className="flex gap-1 p-1 bg-surface-elevated rounded-xl mb-6">
              {(['up', 'in'] as const).map((m) => (
                <button key={m} onClick={() => { setMode(m); setErrors({}); }}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${mode === m ? 'bg-accent text-bg-base' : 'text-text-secondary hover:text-text-primary'}`}>
                  {m === 'up' ? 'Регистрация' : 'Вход'}
                </button>
              ))}
            </div>

            <form onSubmit={submit} className="space-y-4" noValidate>
              {mode === 'up' && (
                <div>
                  <label htmlFor="name" className="block text-sm text-text-secondary mb-1.5">Имя</label>
                  <input id="name" className="field" value={name} onChange={(e) => setName(e.target.value)} placeholder="Как к тебе обращаться" autoComplete="given-name" />
                  {errors.name && <p className="text-xs text-accent-danger mt-1.5">{errors.name}</p>}
                </div>
              )}
              <div>
                <label htmlFor="email" className="block text-sm text-text-secondary mb-1.5">Email</label>
                <input id="email" type="email" className="field" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" />
                {errors.email && <p className="text-xs text-accent-danger mt-1.5">{errors.email}</p>}
              </div>
              <div>
                <label htmlFor="pw" className="block text-sm text-text-secondary mb-1.5">Пароль</label>
                <div className="relative">
                  <input id="pw" type={show ? 'text' : 'password'} className="field pr-12" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Минимум 8 символов" autoComplete={mode === 'up' ? 'new-password' : 'current-password'} />
                  <button type="button" onClick={() => setShow((v) => !v)} aria-label={show ? 'Скрыть пароль' : 'Показать пароль'} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary">
                    {show ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-accent-danger mt-1.5">{errors.password}</p>}
              </div>

              {errors.form && <p className="text-sm text-accent-danger bg-accent-danger/10 border border-accent-danger/25 rounded-xl px-4 py-3">{errors.form}</p>}

              <button type="submit" disabled={loading} className="btn-primary w-full py-4 text-base inline-flex items-center justify-center gap-2 disabled:opacity-60">
                {loading ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
                {mode === 'up' ? 'Создать аккаунт и открыть доступ' : 'Войти'}
              </button>
            </form>

            <p className="text-[11px] text-text-muted text-center mt-4">
              Аккаунт живёт на сервере. Войти можно с любого устройства.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}