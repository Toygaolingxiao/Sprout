"use client";

import { Button } from '@/components/ui/button';
import type { TargetGender } from '@/types';

const GENDER_OPTIONS: { value: TargetGender | 'all'; label: string; emoji: string }[] = [
  { value: 'all', label: 'すべて', emoji: '👥' },
  { value: 'female', label: '女性向け', emoji: '♀' },
  { value: 'male', label: '男性向け', emoji: '♂' },
];

interface GenderFilterProps {
  value: TargetGender | 'all';
  onChange: (value: TargetGender | 'all') => void;
}

export function GenderFilter({ value, onChange }: GenderFilterProps) {
  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
      {GENDER_OPTIONS.map((opt) => (
        <Button
          key={opt.value}
          variant={value === opt.value ? 'default' : 'outline'}
          size="sm"
          className="text-xs h-7 px-2.5"
          onClick={() => onChange(opt.value)}
        >
          {opt.emoji} {opt.label}
        </Button>
      ))}
    </div>
  );
}
