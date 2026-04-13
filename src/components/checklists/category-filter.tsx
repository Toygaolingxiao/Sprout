"use client";

import { useState } from 'react';
import { CATEGORIES } from '@/data/seed/categories';
import { Badge } from '@/components/ui/badge';
import type { CategoryId } from '@/types';

interface CategoryFilterProps {
  value: CategoryId | 'all';
  onChange: (value: CategoryId | 'all') => void;
}

export function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge
        variant={value === 'all' ? 'default' : 'outline'}
        className="cursor-pointer"
        onClick={() => onChange('all')}
      >
        すべて
      </Badge>
      {CATEGORIES.map((cat) => (
        <Badge
          key={cat.id}
          variant={value === cat.id ? 'default' : 'outline'}
          className="cursor-pointer"
          style={
            value === cat.id
              ? { backgroundColor: cat.color, borderColor: cat.color }
              : { borderColor: cat.color, color: cat.color }
          }
          onClick={() => onChange(cat.id)}
        >
          {cat.label}
        </Badge>
      ))}
    </div>
  );
}
