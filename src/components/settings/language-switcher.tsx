'use client';

import { useTranslation } from '@/lib/i18n/context';
import { useRouter } from 'next/navigation';
import { LOCALE_LABELS, type Locale } from '@/lib/i18n';

const LOCALES = Object.entries(LOCALE_LABELS) as [Locale, string][];

export function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation();
  const router = useRouter();

  function handleChange(key: Locale) {
    setLocale(key);
    // Force server components to re-render with the new locale cookie
    router.refresh();
  }

  return (
    <div className="flex gap-2 flex-wrap">
      {LOCALES.map(([key, label]) => (
        <button
          key={key}
          type="button"
          onClick={() => handleChange(key)}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
            locale === key
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
