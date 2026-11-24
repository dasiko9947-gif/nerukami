import Link from 'next/link';
import { DOCS } from '@/lib/legal';
import { Footer } from '@/components/Sections2';

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pt-[72px] min-h-screen">
      <div className="max-w-[1100px] mx-auto px-6 py-10">
        <nav className="flex flex-wrap gap-2 mb-8">
          {DOCS.map((d) => (
            <Link key={d.slug} href={`/legal/${d.slug}`} className="px-4 py-2 rounded-xl bg-surface border border-border-subtle text-sm text-text-secondary hover:text-accent hover:border-accent/30 transition-colors">
              {d.title}
            </Link>
          ))}
        </nav>
        {children}
      </div>
      <Footer />
    </div>
  );
}