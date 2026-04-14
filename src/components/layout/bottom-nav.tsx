"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '@/lib/i18n/context';

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useTranslation();

  const NAV_ITEMS = [
    { href: '/dashboard', label: t('nav.home'), icon: '🏠' },
    { href: '/checklists', label: t('nav.list'), icon: '✅' },
    { href: '/family', label: t('nav.family'), icon: '👨‍👩‍👧' },
    { href: '/settings', label: t('nav.settings'), icon: '⚙️' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-primary/10 sm:hidden" style={{ background: `linear-gradient(to right, var(--theme-gradient-from), var(--theme-gradient-via), var(--theme-gradient-to))` }}>
      <div className="flex items-center justify-around h-16 pb-[env(safe-area-inset-bottom)] max-w-lg mx-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-2 text-xs transition-colors ${
                isActive
                  ? 'text-primary font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
