import type { Metadata } from 'next';
import Link from 'next/link';
import { getLocale, serverT } from '@/lib/i18n/server';
import { resolveLegalLocale } from '@/lib/legal-copy';
import { getTokushoDocument } from '@/lib/tokusho';

export async function generateMetadata(): Promise<Metadata> {
  const locale = resolveLegalLocale(await getLocale());
  const copy = getTokushoDocument(locale, process.env.BILLING_ENABLED === '1');
  return { title: `${copy.heading} - Sprout 🌱` };
}

export default async function TokushoPage() {
  const locale = resolveLegalLocale(await getLocale());
  const copy = getTokushoDocument(locale, process.env.BILLING_ENABLED === '1');
  const homeLabel = serverT(locale, 'nav.home');
  const loginLabel = serverT(locale, 'auth.login');

  return (
    <div data-theme="cream" className="min-h-screen bg-background">
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
        <h1 className="mb-4 text-2xl font-bold">{copy.heading}</h1>
        <p className="text-xs text-muted-foreground">{copy.updatedAtLabel}: {copy.updatedAt}</p>
        <p className="mt-6 text-sm leading-6 text-foreground/90">{copy.intro}</p>
        <p className="mt-3 text-sm font-medium">{copy.salesStatus}</p>
        <dl className="mt-8 space-y-4">
          {copy.fields.map((field) => (
            <div key={field.label} className="grid gap-1 border-b border-border/70 pb-4 sm:grid-cols-[11rem_1fr]">
              <dt className="text-sm font-medium">{field.label}</dt>
              <dd className="text-sm leading-6 text-foreground/90">{field.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
