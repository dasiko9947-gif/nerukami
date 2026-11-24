import Link from 'next/link';
import { Footer } from '@/components/Sections2';

export default function NotFound() {
  return (
    <div className="pt-[72px] min-h-screen flex flex-col">
      <div className="flex-1 grid place-items-center px-6 py-20 relative overflow-hidden">
        <div className="aurora drift-a w-[420px] h-[420px] -top-20 -right-20" style={{ background: 'radial-gradient(circle,rgba(198,255,0,.12),transparent 65%)' }} />
        <div className="relative text-center">
          <p className="font-mono text-accent text-sm mb-3">ошибка 404</p>
          <h1 className="font-heading font-extrabold text-[clamp(36px,8vw,88px)] leading-none mb-5">Страница не найдена</h1>
          <p className="text-text-secondary max-w-[460px] mx-auto mb-8">Такой страницы нет. Возможно, ссылка устарела или в адресе опечатка.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/" className="btn-primary px-6 py-3.5">На главную</Link>
            <Link href="/lessons" className="btn-ghost px-6 py-3.5">К урокам</Link>
            <Link href="/materials" className="btn-ghost px-6 py-3.5">Материалы</Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}