"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'ホーム', icon: '🏠' },
  { href: '/checklists', label: 'リスト', icon: '✅' },
  { href: '/family', label: '家族', icon: '👨‍👩‍👧' },
  { href: '/settings', label: '設定', icon: '⚙️' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-primary/10 bg-gradient-to-r from-green-50/90 via-white/95 to-amber-50/90 backdrop-blur supports-[backdrop-filter]:bg-white/80 sm:hidden">
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
