"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from '@/lib/actions/auth';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n/context';

const MAIN_ROUTES = ['/dashboard', '/checklists', '/family', '/settings'];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();

  const DESKTOP_NAV = [
    { href: '/dashboard', label: t('nav.home') },
    { href: '/checklists', label: t('nav.checklist') },
    { href: '/family', label: t('nav.family') },
    { href: '/settings', label: t('nav.settings') },
  ];

  useEffect(() => {
    for (const route of MAIN_ROUTES) {
      if (!pathname.startsWith(route)) {
        router.prefetch(route);
      }
    }
  }, [pathname, router]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/10" style={{ background: `linear-gradient(to right, var(--theme-gradient-from), var(--theme-gradient-via), var(--theme-gradient-to))` }}>
      <div className="w-full flex h-14 items-center gap-4 px-4 max-w-2xl mx-auto">
        <Link href="/dashboard" prefetch className="flex items-center gap-1.5 font-bold text-lg text-primary flex-shrink-0">
          <span className="text-2xl">🌱</span>
          <span>Sprout</span>
        </Link>
        <nav className="hidden sm:flex items-center gap-1 flex-1 min-w-0">
          {DESKTOP_NAV.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch
                onMouseEnter={() => router.prefetch(item.href)}
                className={`min-w-20 rounded-md px-3 py-1.5 text-center text-sm font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex-shrink-0">
          <form action={signOut}>
            <Button variant="ghost" size="sm" type="submit">
              {t('nav.logout')}
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
