"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from '@/lib/actions/auth';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center px-4">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg">
          <span className="text-2xl">🌱</span>
          <span>Sprout</span>
        </Link>
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
