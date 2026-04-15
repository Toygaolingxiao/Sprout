"use client";

import { useMemo } from 'react';
import { TaskItem } from './task-item';
import { useTranslation } from '@/lib/i18n/context';
import type { Task } from '@/types';

interface TaskListProps {
  tasks: Task[];
}

export function TaskList({ tasks }: TaskListProps) {
  const { t } = useTranslation();
  const { incomplete, completed } = useMemo(() => ({
    incomplete: tasks.filter((t) => !t.is_completed),
    completed: tasks.filter((t) => t.is_completed),
  }), [tasks]);

  if (tasks.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        <p>{t('checklist.noTasks')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {incomplete.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
      {completed.length > 0 && (
        <details className="mt-4" open>
          <summary aria-label={t('checklist.completedCount', { n: completed.length })} className="cursor-pointer text-sm text-muted-foreground mb-2 flex items-center gap-2 select-none">
            <span>{t('checklist.completedToggle', { n: completed.length })}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'var(--theme-restore-bg)', color: 'var(--theme-restore-text)' }}>{t('checklist.tapToRestore')}</span>
          </summary>
          <div className="space-y-2">
            {completed.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
