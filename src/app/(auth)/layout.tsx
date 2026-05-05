import { getLocale, serverT } from '@/lib/i18n/server';
import Link from 'next/link';
import { LanguageSwitcher } from '@/components/settings/language-switcher';

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const tagline = serverT(locale, 'authLayout.tagline');

  return (
    <div data-theme="aqua" className="relative flex min-h-screen items-center justify-center px-4" style={{ background: 'linear-gradient(to bottom, var(--theme-gradient-from), var(--theme-gradient-to))' }}>
      <div className="absolute inset-x-0 top-0 z-10">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-end px-4">
          <LanguageSwitcher variant="compact" />
        </div>
      </div>
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" aria-label="Sprout home" className="inline-block">
            <h1 className="text-3xl sm:text-4xl font-bold hover:opacity-85 transition-opacity">🌱 Sprout</h1>
          </Link>
          <p className="mt-2 text-muted-foreground">
            {tagline}
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
