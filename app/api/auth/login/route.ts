import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail, verifyPassword, createSession, SESSION_COOKIE } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body as { email?: string; password?: string };

    if (!email || !password) {
      return NextResponse.json({ ok: false, error: 'Email и пароль обязательны' }, { status: 400 });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return NextResponse.json({ ok: false, error: 'Аккаунт не найден. Зарегистрируйся.' }, { status: 401 });
    }

    const valid = await verifyPassword(password, user.password_hash);
    if (!valid) {
      return NextResponse.json({ ok: false, error: 'Неверный пароль' }, { status: 401 });
    }

    const token = await createSession(user.id);

    const res = NextResponse.json({ ok: true, user: { id: user.id, email: user.email, name: user.name } });
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true, secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', path: '/', maxAge: 30 * 24 * 60 * 60,
    });
    return res;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Ошибка сервера';
    console.error('[login]', msg);
    return NextResponse.json({ ok: false, error: 'Что-то пошло не так. Попробуй ещё раз.' }, { status: 500 });
  }
}