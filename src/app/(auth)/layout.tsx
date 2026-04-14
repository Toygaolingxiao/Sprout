import { getLocale, serverT } from '@/lib/i18n/server';

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const tagline = serverT(locale, 'authLayout.tagline');

  return (
    <div className="flex min-h-screen items-center justify-center px-4" style={{ background: 'linear-gradient(to bottom, var(--theme-gradient-from), var(--theme-gradient-to))' }}>
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold">🌱 Sprout</h1>
          <p className="mt-2 text-muted-foreground">
            {tagline}
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
