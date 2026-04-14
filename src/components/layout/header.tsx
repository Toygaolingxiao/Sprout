"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from '@/lib/actions/auth';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n/context';

export function Header() {
  const pathname = usePathname();
  const { t } = useTranslation();

  const DESKTOP_NAV = [
    { href: '/dashboard', label: t('nav.home') },
    { href: '/checklists', label: t('nav.checklist') },
    { href: '/family', label: t('nav.family') },
    { href: '/settings', label: t('nav.settings') },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/10" style={{ background: `linear-gradient(to right, var(--theme-gradient-from), var(--theme-gradient-via), var(--theme-gradient-to))` }}>
      <div className="container flex h-14 items-center gap-4 px-4 max-w-2xl mx-auto">
        <Link href="/dashboard" className="flex items-center gap-1.5 font-bold text-lg text-primary flex-shrink-0">
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
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
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
