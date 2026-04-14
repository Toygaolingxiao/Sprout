'use client';

import { Progress } from '@/components/ui/progress';
import { CATEGORIES, CATEGORY_MAP } from '@/data/seed/categories';
import { useTranslation } from '@/lib/i18n/context';
import type { Task } from '@/types';

interface ProgressOverviewProps {
  tasks: Task[];
}

export function ProgressOverview({ tasks }: ProgressOverviewProps) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.is_completed).length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      {/* Overall */}
      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span className="font-medium">{t('checklist.title')}</span>
          <span className="text-muted-foreground">{completed}/{total} ({percentage}%)</span>
        </div>
        <Progress value={percentage} className="h-3" />
      </div>

      {/* By Category */}
      <div className="grid gap-2">
        {CATEGORIES.map((cat) => {
          const catTasks = tasks.filter((t) => t.category_id === cat.id);
          if (catTasks.length === 0) return null;
          const catCompleted = catTasks.filter((t) => t.is_completed).length;
          const catPct = Math.round((catCompleted / catTasks.length) * 100);
          return (
            <div key={cat.id} className="flex items-center gap-2 text-xs">
              <span style={{ color: cat.color }} className="w-12 text-right font-medium">
                {t(`category.${cat.id}` as any)}
              </span>
              <Progress value={catPct} className="h-1.5 flex-1" />
              <span className="w-8 text-muted-foreground">{catPct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
