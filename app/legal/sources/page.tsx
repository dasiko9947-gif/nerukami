import type { Metadata } from 'next';
import { docBySlug } from '@/lib/legal';

export const metadata: Metadata = { title: 'Источники и лицензия' };
const doc = docBySlug('sources')!;

export default function SourcesPage() {
  return (
    <article className="bg-surface border border-border-subtle rounded-2xl p-6 md:p-10">
      <p className="text-xs text-text-muted mb-2">Редакция от {doc.updated}</p>
      <h1 className="font-heading font-bold text-[clamp(26px,4vw,40px)] mb-4">{doc.title}</h1>
      <p className="text-text-secondary leading-relaxed mb-8 max-w-[760px]">{doc.intro}</p>
      <div className="space-y-7">
        {doc.sections.map((s) => (
          <section key={s.h}>
            <h2 className="font-heading font-semibold text-lg mb-2.5">{s.h}</h2>
            {s.p?.map((p, i) => <p key={i} className="text-text-secondary leading-relaxed mb-2">{p}</p>)}
            {s.list && <ul className="space-y-2">{s.list.map((li, i) => <li key={i} className="text-text-secondary leading-relaxed flex gap-3"><span className="text-accent mt-1">·</span><span>{li}</span></li>)}</ul>}
          </section>
        ))}
      </div>
    </article>
  );
}