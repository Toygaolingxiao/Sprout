"use client";

import { useTheme } from './theme-provider';
import { useTranslation } from '@/lib/i18n/context';

const FONT_SIZES = [
  { id: 'small' as const, sampleClass: 'text-xs' },
  { id: 'medium' as const, sampleClass: 'text-sm' },
  { id: 'large' as const, sampleClass: 'text-base' },
];

export function FontSizeSwitcher() {
  const { fontSize, setFontSize } = useTheme();
  const { t } = useTranslation();

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{t('settings.textSize')}</p>
      <div className="grid grid-cols-3 gap-2">
        {FONT_SIZES.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setFontSize(option.id)}
            aria-label={t(`settings.textSize.${option.id}` as any)}
            className={`h-10 w-full rounded-lg border px-3 py-2 text-center transition-colors ${
              fontSize === option.id
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border bg-background text-muted-foreground hover:bg-muted/70'
            }`}
          >
            <span className={`font-medium ${option.sampleClass}`}>
              {t(`settings.textSize.${option.id}` as any)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
