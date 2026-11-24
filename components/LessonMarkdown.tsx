'use client';

import { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, '').trim().replace(/\s+/g, '-').slice(0, 60);

export function extractToc(md: string) {
  return md
    .split('\n')
    .filter((l) => /^##\s+/.test(l))
    .map((l) => {
      const text = l.replace(/^##\s+/, '').replace(/[*_`#]/g, '').trim();
      return { id: slugify(text), text };
    })
    .filter((h) => h.text.length > 0);
}

export default function LessonMarkdown({ source }: { source: string }) {
  const body = useMemo(() => source.replace(/^---[\s\S]*?---\s*/, ''), [source]);

  const components: Components = {
    h1: ({ children }) => <h1 className="font-heading font-extrabold text-3xl mt-2 mb-5 leading-tight">{children}</h1>,
    h2: ({ children }) => {
      const id = slugify(String(children));
      return <h2 id={id} className="font-heading font-bold text-2xl mt-10 mb-4 leading-snug scroll-mt-[100px]">{children}</h2>;
    },
    h3: ({ children }) => <h3 className="font-heading font-semibold text-lg mt-7 mb-3">{children}</h3>,
    h4: ({ children }) => <h4 className="font-semibold text-base mt-5 mb-2 text-text-primary">{children}</h4>,
    p: ({ children }) => <p className="text-text-secondary leading-[1.8] mb-4">{children}</p>,
    ul: ({ children }) => <ul className="space-y-2 mb-5 pl-1">{children}</ul>,
    ol: ({ children }) => <ol className="space-y-2 mb-5 list-decimal pl-5 marker:text-accent marker:font-mono">{children}</ol>,
    li: ({ children }) => (
      <li className="text-text-secondary leading-[1.75] flex gap-3 [&>ol]:mt-2 [&>ul]:mt-2">
        <span className="text-accent mt-[2px] shrink-0">·</span>
        <span className="min-w-0">{children}</span>
      </li>
    ),
    strong: ({ children }) => <strong className="text-text-primary font-semibold">{children}</strong>,
    em: ({ children }) => <em className="text-text-primary/90 italic">{children}</em>,
    a: ({ href, children }) => (
      <a href={href} target={href?.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="text-accent underline decoration-accent/40 hover:decoration-accent break-words">{children}</a>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-accent bg-accent/5 rounded-r-xl pl-4 pr-4 py-3 my-5 [&>p]:mb-0">{children}</blockquote>
    ),
    code: ({ className, children }) => {
      const isBlock = /language-/.test(className ?? '');
      if (isBlock) return <code className={`code-block block ${className ?? ''}`}>{children}</code>;
      return <code className="font-mono text-[13px] bg-surface-elevated border border-border-subtle rounded px-1.5 py-0.5 text-accent">{children}</code>;
    },
    pre: ({ children }) => (
      <pre className="bg-bg-base border border-border-subtle rounded-xl p-4 my-5 overflow-x-auto scroll-slim text-text-secondary">{children}</pre>
    ),
    table: ({ children }) => (
      <div className="overflow-x-auto scroll-slim my-5 border border-border-subtle rounded-xl">
        <table className="w-full text-sm border-collapse">{children}</table>
      </div>
    ),
    thead: ({ children }) => <thead className="bg-surface-elevated">{children}</thead>,
    th: ({ children }) => <th className="text-left font-semibold px-4 py-3 border-b border-border-subtle whitespace-nowrap">{children}</th>,
    td: ({ children }) => <td className="px-4 py-3 border-b border-border-subtle/60 text-text-secondary align-top">{children}</td>,
    hr: () => <hr className="my-8 border-border-subtle" />,
    img: ({ src, alt }) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={typeof src === 'string' ? src : ''} alt={alt ?? ''} className="rounded-xl border border-border-subtle my-5 max-w-full h-auto" loading="lazy" />
    ),
  };

  return (
    <div className="lesson-md">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>{body}</ReactMarkdown>
    </div>
  );
}