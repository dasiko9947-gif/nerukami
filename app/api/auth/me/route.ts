import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser, getUserTier, SESSION_COOKIE } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ ok: true, user: null });
  }

  const user = await getSessionUser(token);
  if (!user) {
    const res = NextResponse.json({ ok: true, user: null });
    res.cookies.set(SESSION_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 });
    return res;
  }

  const tier = await getUserTier(user.id);

  return NextResponse.json({
    ok: true,
    user: { id: user.id, email: user.email, name: user.name, tier, createdAt: user.created_at },
  });
}