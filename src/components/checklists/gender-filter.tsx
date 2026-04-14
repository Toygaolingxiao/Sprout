"use client";

import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/i18n/context';
import type { TargetGender } from '@/types';

interface GenderFilterProps {
  value: TargetGender | 'all';
  onChange: (value: TargetGender | 'all') => void;
}

export function GenderFilter({ value, onChange }: GenderFilterProps) {
  const { t } = useTranslation();

  const GENDER_OPTIONS: { value: TargetGender | 'all'; label: string; emoji: string }[] = [
    { value: 'all', label: t('gender.all'), emoji: '👥' },
    { value: 'female', label: t('gender.female'), emoji: '♀' },
    { value: 'male', label: t('gender.male'), emoji: '♂' },
  ];

  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
      {GENDER_OPTIONS.map((opt) => (
        <Button
          key={opt.value}
          variant={value === opt.value ? 'default' : 'outline'}
          size="sm"
          className="text-xs h-9 px-3.5"
          onClick={() => onChange(opt.value)}
        >
          {opt.emoji} {opt.label}
        </Button>
      ))}
    </div>
  );
}
