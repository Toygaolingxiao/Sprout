"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from '@/lib/actions/auth';
import { Button } from '@/components/ui/button';

const DESKTOP_NAV = [
  { href: '/dashboard', label: 'ホーム' },
  { href: '/checklists', label: 'チェックリスト' },
  { href: '/family', label: '家族' },
  { href: '/settings', label: '設定' },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center gap-6 px-4">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg">
          <span className="text-2xl">🌱</span>
          <span>Sprout</span>
        </Link>
        <nav className="hidden sm:flex items-center gap-1 flex-1">
          {DESKTOP_NAV.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
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
        <div className="ml-auto">
          <form action={signOut}>
            <Button variant="ghost" size="sm" type="submit">
              ログアウト
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}
