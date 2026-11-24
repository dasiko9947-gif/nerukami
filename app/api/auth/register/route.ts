import { NextRequest, NextResponse } from 'next/server';
import { createUser, findUserByEmail, createSession, SESSION_COOKIE } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name } = body as { email?: string; password?: string; name?: string };

    if (!email || !password) {
      return NextResponse.json({ ok: false, error: 'Email и пароль обязательны' }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[a-zA-Zа-яА-Я]{2,}$/.test(email.trim())) {
      return NextResponse.json({ ok: false, error: 'Похоже, в адресе опечатка' }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ ok: false, error: 'Пароль от 8 символов' }, { status: 400 });
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      return NextResponse.json({ ok: false, error: 'Такой email уже зарегистрирован. Войди.' }, { status: 409 });
    }

    const user = await createUser(email, password, name ?? '');
    const token = await createSession(user.id);

    const res = NextResponse.json({ ok: true, user: { id: user.id, email: user.email, name: user.name } });
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true, secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', path: '/', maxAge: 30 * 24 * 60 * 60,
    });
    return res;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Ошибка сервера';
    if (msg.includes('unique constraint')) {
      return NextResponse.json({ ok: false, error: 'Такой email уже зарегистрирован.' }, { status: 409 });
    }
    console.error('[register]', msg);
    return NextResponse.json({ ok: false, error: 'Что-то пошло не так. Попробуй ещё раз.' }, { status: 500 });
  }
}