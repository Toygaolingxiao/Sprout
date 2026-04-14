"use client";

import { useState } from 'react';
import { CATEGORIES } from '@/data/seed/categories';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/lib/i18n/context';
import type { CategoryId } from '@/types';

interface CategoryFilterProps {
  value: CategoryId | 'all';
  onChange: (value: CategoryId | 'all') => void;
}

export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  const { t } = useTranslation();

  return (
    <div role="group" aria-label={t('common.categoryFilter')} className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
      <Badge
        variant={value === 'all' ? 'default' : 'outline'}
        className="cursor-pointer"
        role="button"
        tabIndex={0}
        aria-pressed={value === 'all'}
        onClick={() => onChange('all')}
        onKeyDown={(e: React.KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onChange('all'); } }}
      >
        {t('common.all')}
      </Badge>
      {CATEGORIES.map((cat) => (
        <Badge
          key={cat.id}
          variant={value === cat.id ? 'default' : 'outline'}
          className="cursor-pointer"
          role="button"
          tabIndex={0}
          aria-pressed={value === cat.id}
          onKeyDown={(e: React.KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onChange(cat.id); } }}
          style={
            value === cat.id
              ? { backgroundColor: cat.color, borderColor: cat.color }
              : { borderColor: cat.color, color: cat.color }
          }
          onClick={() => onChange(cat.id)}
        >
          {t(`category.${cat.id}` as any)}
        </Badge>
      ))}
    </div>
  );
}
