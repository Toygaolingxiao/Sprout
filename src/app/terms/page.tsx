import type { Metadata } from 'next';
import { getLocale, serverT } from '@/lib/i18n/server';
import { TERMS_COPY, resolveLegalLocale } from '@/lib/legal-copy';
import Link from 'next/link';

export async function generateMetadata(): Promise<Metadata> {
  const locale = resolveLegalLocale(await getLocale());
  const copy = TERMS_COPY[locale];

  return {
    title: `${copy.heading} - Sprout 🌱`,
  };
}

export default async function TermsPage() {
  const locale = resolveLegalLocale(await getLocale());
  const copy = TERMS_COPY[locale];
  const homeLabel = serverT(locale, 'nav.home');
  const loginLabel = serverT(locale, 'auth.login');

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-12">
        <nav className="mb-6 flex items-center justify-end gap-2 text-sm">
          <Link
            href="/"
            className="rounded-full border border-border/70 bg-background px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            {homeLabel}
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-border/70 bg-background px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            {loginLabel}
          </Link>
        </nav>
        <h1 className="text-2xl font-bold mb-8">{copy.heading}</h1>
        <div className="prose prose-sm max-w-none space-y-6 text-foreground/90">
          <p className="text-muted-foreground text-xs">{copy.updatedAtLabel}: {copy.updatedAt}</p>

          {copy.sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-lg font-bold mt-6 mb-2">{section.title}</h2>
              {section.lead && <p>{section.lead}</p>}
              {section.paragraphs?.map((text) => (
                <p key={text}>{text}</p>
              ))}
              {section.orderedItems && (
                <ol className="list-decimal pl-5 space-y-1">
                  {section.orderedItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ol>
              )}
              {section.bulletItems && (
                <ul className="list-disc pl-5 space-y-1">
                  {section.bulletItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
