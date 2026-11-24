'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export type Tier = 0 | 1 | 2 | 3;
export type User = { id: string; email: string; name: string; tier: Tier; createdAt: string } | null;

type ToastKind = 'ok' | 'warn' | 'info';
type Toast = { id: string; text: string; kind: ToastKind; action?: { label: string; run: () => void } };

type Ctx = {
  ready: boolean;
  user: User;
  loading: boolean;
  register: (email: string, password: string, name: string) => Promise<{ ok: boolean; error?: string }>;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  toast: (text: string, kind?: ToastKind, action?: Toast['action']) => void;
};

const AppCtx = createContext<Ctx | null>(null);

export function useApp() {
  const c = useContext(AppCtx);
  if (!c) throw new Error('useApp должен вызываться внутри Providers');
  return c;
}

async function api(path: string, body?: unknown) {
  const res = await fetch(path, {
    method: body ? 'POST' : 'GET',
    headers: body ? { 'Content-Type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'include',
  });
  return res.json();
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const refresh = useCallback(async () => {
    try {
      const data = await api('/api/auth/me');
      setUser(data.user ?? null);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refresh().finally(() => setReady(true));
    const active = timers.current;
    return () => { Object.values(active).forEach(clearTimeout); };
  }, [refresh]);

  const dismiss = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
    if (timers.current[id]) { clearTimeout(timers.current[id]); delete timers.current[id]; }
  }, []);

  const toast = useCallback((text: string, kind: ToastKind = 'ok', action?: Toast['action']) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t.slice(-3), { id, text, kind, action }]);
    timers.current[id] = setTimeout(() => dismiss(id), action ? 7000 : 3600);
  }, [dismiss]);

  const register = useCallback(async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      const data = await api('/api/auth/register', { email, password, name });
      if (data.ok) { await refresh(); toast('Аккаунт создан. Доступ открыт.'); }
      return data as { ok: boolean; error?: string };
    } catch {
      toast('Сеть недоступна. Попробуй ещё раз.', 'warn');
      return { ok: false, error: 'Сеть недоступна' };
    } finally { setLoading(false); }
  }, [refresh, toast]);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const data = await api('/api/auth/login', { email, password });
      if (data.ok) { await refresh(); toast('С возвращением!'); }
      return data as { ok: boolean; error?: string };
    } catch {
      toast('Сеть недоступна. Попробуй ещё раз.', 'warn');
      return { ok: false, error: 'Сеть недоступна' };
    } finally { setLoading(false); }
  }, [refresh, toast]);

  const logout = useCallback(async () => {
    await api('/api/auth/logout');
    setUser(null);
    toast('Ты вышел из аккаунта', 'info');
  }, [toast]);

  const value = useMemo<Ctx>(() => ({
    ready, user, loading, register, login, logout, refresh, toast,
  }), [ready, user, loading, register, login, logout, refresh, toast]);

  return (
    <AppCtx.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-[90] flex flex-col gap-2 w-[min(360px,calc(100vw-32px))]" role="status" aria-live="polite">
        <AnimatePresence initial={false}>
          {toasts.map((t) => {
            const Icon = t.kind === 'ok' ? CheckCircle2 : t.kind === 'warn' ? AlertTriangle : Info;
            const color = t.kind === 'ok' ? '#00E676' : t.kind === 'warn' ? '#FFB020' : '#22D3EE';
            return (
              <motion.div key={t.id} layout initial={{ opacity: 0, x: 40, scale: 0.96 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: 40, scale: 0.96 }} transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="bg-surface-elevated border border-border-subtle rounded-xl p-3.5 shadow-2xl flex items-start gap-3">
                <Icon size={18} style={{ color }} className="mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-snug">{t.text}</p>
                  {t.action && (
                    <button onClick={() => { t.action!.run(); dismiss(t.id); }} className="mt-1.5 text-xs font-bold text-accent hover:underline">
                      {t.action.label}
                    </button>
                  )}
                </div>
                <button onClick={() => dismiss(t.id)} aria-label="Закрыть уведомление" className="text-text-muted hover:text-text-primary"><X size={16} /></button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </AppCtx.Provider>
  );
}
