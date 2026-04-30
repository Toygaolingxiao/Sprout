'use client';

import { useTranslation } from '@/lib/i18n/context';
import { useRouter } from 'next/navigation';
import { LOCALE_LABELS, type Locale } from '@/lib/i18n';
import { cn } from '@/lib/utils';

const LOCALES = Object.entries(LOCALE_LABELS) as [Locale, string][];

interface LanguageSwitcherProps {
  variant?: 'default' | 'compact';
  className?: string;
}

export function LanguageSwitcher({ variant = 'default', className }: LanguageSwitcherProps) {
  const { locale, setLocale } = useTranslation();
  const router = useRouter();

  function handleChange(key: Locale) {
    setLocale(key);
    // Force server components to re-render with the new locale cookie
    router.refresh();
  }

  const compact = variant === 'compact';

  return (
    <div
      className={cn(
        compact
          ? 'inline-flex flex-nowrap items-center gap-1 rounded-full border border-border/60 bg-background/70 p-1 shadow-sm backdrop-blur'
          : 'flex gap-2 flex-wrap',
        className,
      )}
    >
      {LOCALES.map(([key, label]) => (
        <button
          key={key}
          type="button"
          onClick={() => handleChange(key)}
          className={cn(`font-medium transition-all ${
            locale === key
              ? compact
                ? 'rounded-full bg-primary px-3 py-1.5 text-xs text-primary-foreground shadow-sm'
                : 'rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground shadow-sm'
              : compact
                ? 'rounded-full px-3 py-1.5 text-xs text-muted-foreground hover:bg-background/80'
                : 'rounded-lg bg-muted px-4 py-2 text-sm text-muted-foreground hover:bg-muted/80'
          }`)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
