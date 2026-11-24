import { LESSONS, type ProgressMap } from './lessons';

export type Tier = 1 | 2 | 3;
export type Account = { id: string; email: string; name: string; hash: string; salt: string; tier: Tier; createdAt: string; coachHour: number };
export type SavedView = { id: string; name: string; q: string; module: string; route: string; status: string; sort: string };
type DB = {
  accounts: Account[]; session: string | null;
  progress: Record<string, ProgressMap>; notes: Record<string, Record<string, string>>; views: Record<string, SavedView[]>;
};

const KEY = 'ai-academy.v1';
const blank = (): DB => ({ accounts: [], session: null, progress: {}, notes: {}, views: {} });

export function load(): DB {
  if (typeof window === 'undefined') return blank();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return blank();
    const p = JSON.parse(raw) as Partial<DB>;
    return { ...blank(), ...p, accounts: p.accounts ?? [], progress: p.progress ?? {}, notes: p.notes ?? {}, views: p.views ?? {} };
  } catch { return blank(); }
}
function save(db: DB) { if (typeof window !== 'undefined') window.localStorage.setItem(KEY, JSON.stringify(db)); }

function hex(bytes: Uint8Array) { return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join(''); }
function randomHex(n: number) {
  const a = new Uint8Array(n);
  const c = (globalThis as { crypto?: Crypto }).crypto;
  if (c && typeof c.getRandomValues === 'function') c.getRandomValues(a);
  else for (let i = 0; i < n; i++) a[i] = Math.floor(Math.random() * 256);
  return hex(a);
}

export function uid() {
  const c = (globalThis as { crypto?: Crypto }).crypto;
  return c && typeof c.randomUUID === 'function' ? c.randomUUID() : `${Date.now().toString(36)}-${randomHex(6)}`;
}

async function hashPassword(pw: string, salt: string) {
  const subtle = (globalThis as { crypto?: Crypto }).crypto?.subtle;
  if (subtle) {
    const enc = new TextEncoder();
    const key = await subtle.importKey('raw', enc.encode(pw), 'PBKDF2', false, ['deriveBits']);
    const bits = await subtle.deriveBits({ name: 'PBKDF2', salt: enc.encode(salt), iterations: 120000, hash: 'SHA-256' }, key, 256);
    return hex(new Uint8Array(bits));
  }
  let h = 2166136261;
  const s = salt + pw;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0).toString(16);
}

export const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[a-zA-Zа-яА-Я]{2,}$/.test(v.trim());
export function validate(name: string, email: string, pw: string, isRegister: boolean) {
  const e: Record<string, string> = {};
  if (isRegister && name.trim().length < 2) e.name = 'Имя от 2 символов';
  if (!emailOk(email)) e.email = 'Похоже, в адресе опечатка';
  if (pw.length < 8) e.password = 'Пароль от 8 символов';
  return e;
}

export function current(): Account | null {
  const db = load();
  return db.accounts.find((a) => a.id === db.session) ?? null;
}
export function progressOf(id: string): ProgressMap { return load().progress[id] ?? {}; }
export function notesOf(id: string) { return load().notes[id] ?? {}; }
export function viewsOf(id: string) { return load().views[id] ?? []; }

export async function register(input: { name: string; email: string; password: string; tier: Tier }) {
  const db = load();
  const email = input.email.trim().toLowerCase();
  if (db.accounts.some((a) => a.email === email)) return { ok: false as const, error: 'Такой email уже зарегистрирован. Войди.' };
  const salt = randomHex(16);
  const acc: Account = { id: uid(), email, name: input.name.trim(), salt, hash: await hashPassword(input.password, salt), tier: input.tier, createdAt: new Date().toISOString(), coachHour: 10 };
  db.accounts.push(acc); db.session = acc.id; db.progress[acc.id] = {}; db.notes[acc.id] = {}; db.views[acc.id] = [];
  save(db);
  return { ok: true as const, account: acc };
}

export async function login(input: { email: string; password: string }) {
  const db = load();
  const email = input.email.trim().toLowerCase();
  const acc = db.accounts.find((a) => a.email === email);
  if (!acc) return { ok: false as const, error: 'Аккаунт не найден. Зарегистрируйся.' };
  const h = await hashPassword(input.password, acc.salt);
  if (h !== acc.hash) return { ok: false as const, error: 'Неверный пароль' };
  db.session = acc.id; save(db);
  return { ok: true as const, account: acc };
}

export function logout() { const db = load(); db.session = null; save(db); }

export async function ensureDemo() {
  const db = load();
  const email = 'demo@ai-academy.ru';
  let acc = db.accounts.find((a) => a.email === email);
  if (!acc) {
    const salt = randomHex(16);
    acc = { id: uid(), email, name: 'Влад', salt, hash: await hashPassword('demo1234', salt), tier: 2, createdAt: new Date(Date.now() - 8 * 864e5).toISOString(), coachHour: 10 };
    db.accounts.push(acc);
    const p: ProgressMap = {};
    LESSONS.slice(0, 9).forEach((l, i) => {
      const d = new Date(); d.setDate(d.getDate() - (6 - Math.floor(i / 1.5)));
      d.setHours(10, 15 + i, 0, 0);
      p[l.slug] = d.toISOString();
    });
    db.progress[acc.id] = p;
    db.notes[acc.id] = { 'prompt-basics': 'Мой рабочий каркас: роль → задача → контекст → формат → ограничения. Пример результата даёт больше, чем прилагательные.' };
    db.views[acc.id] = [{ id: uid(), name: 'Что осталось по работе', q: '', module: 'all', route: 'use', status: 'todo', sort: 'n' }];
  }
  db.session = acc.id; save(db);
  return acc;
}

export function updateAccount(id: string, patch: Partial<Pick<Account, 'name' | 'email' | 'tier' | 'coachHour'>>) {
  const db = load();
  const acc = db.accounts.find((a) => a.id === id); if (!acc) return { ok: false as const, error: 'Аккаунт не найден' };
  if (patch.email) {
    const e = patch.email.trim().toLowerCase();
    if (db.accounts.some((a) => a.email === e && a.id !== id)) return { ok: false as const, error: 'Email занят другим аккаунтом' };
    acc.email = e;
  }
  if (patch.name !== undefined) acc.name = patch.name.trim();
  if (patch.tier !== undefined) acc.tier = patch.tier;
  if (patch.coachHour !== undefined) acc.coachHour = patch.coachHour;
  save(db); return { ok: true as const, account: acc };
}

export async function changePassword(id: string, oldPw: string, newPw: string) {
  const db = load();
  const acc = db.accounts.find((a) => a.id === id); if (!acc) return { ok: false as const, error: 'Аккаунт не найден' };
  if ((await hashPassword(oldPw, acc.salt)) !== acc.hash) return { ok: false as const, error: 'Текущий пароль неверный' };
  if (newPw.length < 8) return { ok: false as const, error: 'Новый пароль от 8 символов' };
  acc.salt = randomHex(16); acc.hash = await hashPassword(newPw, acc.salt); save(db);
  return { ok: true as const };
}

export function setLesson(id: string, slug: string, done: boolean) {
  const db = load(); const p = { ...(db.progress[id] ?? {}) };
  if (done) p[slug] = new Date().toISOString(); else delete p[slug];
  db.progress[id] = p; save(db); return p;
}
export function setMany(id: string, slugs: string[], done: boolean) {
  const db = load(); const p = { ...(db.progress[id] ?? {}) };
  slugs.forEach((s) => { if (done) p[s] = new Date().toISOString(); else delete p[s]; });
  db.progress[id] = p; save(db); return p;
}
export function replaceProgress(id: string, p: ProgressMap) { const db = load(); db.progress[id] = p; save(db); return p; }
export function saveNote(id: string, slug: string, text: string) {
  const db = load(); const n = { ...(db.notes[id] ?? {}) };
  if (text.trim()) n[slug] = text; else delete n[slug];
  db.notes[id] = n; save(db); return n;
}
export function addView(id: string, v: Omit<SavedView, 'id'>) {
  const db = load(); const list = [...(db.views[id] ?? []), { ...v, id: uid() }];
  db.views[id] = list; save(db); return list;
}
export function removeView(id: string, viewId: string) {
  const db = load(); const list = (db.views[id] ?? []).filter((v) => v.id !== viewId);
  db.views[id] = list; save(db); return list;
}
export function exportAll(id: string) {
  const db = load(); const acc = db.accounts.find((a) => a.id === id);
  return { exportedAt: new Date().toISOString(), account: acc ? { email: acc.email, name: acc.name, tier: acc.tier, createdAt: acc.createdAt } : null, progress: db.progress[id] ?? {}, notes: db.notes[id] ?? {}, views: db.views[id] ?? [] };
}
export function deleteAccount(id: string) {
  const db = load();
  db.accounts = db.accounts.filter((a) => a.id !== id);
  delete db.progress[id]; delete db.notes[id]; delete db.views[id];
  if (db.session === id) db.session = null;
  save(db);
}
export function certNumber(id: string) {
  let h = 5381; for (let i = 0; i < id.length; i++) h = (h * 33) ^ id.charCodeAt(i);
  return `AI-2026-${(h >>> 0).toString(36).toUpperCase().padStart(5, '0').slice(0, 5)}`;
}
export const TIERS: Record<Tier, { name: string; price: number; months: number }> = {
  1: { name: 'Старт', price: 2990, months: 3 },
  2: { name: 'Свой', price: 3990, months: 12 },
  3: { name: 'Инженер', price: 9990, months: 12 },
};