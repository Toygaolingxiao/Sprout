"use client";

import { useState, useTransition } from 'react';
import { toggleTask, deleteTask } from '@/lib/actions/tasks';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { CATEGORY_MAP } from '@/data/seed/categories';
import type { Task } from '@/types';

const GENDER_CONFIG = {
  female: { label: '女性', emoji: '♀', className: 'border-pink-400 text-pink-500 bg-pink-50' },
  male: { label: '男性', emoji: '♂', className: 'border-blue-400 text-blue-500 bg-blue-50' },
  both: { label: '共通', emoji: '👫', className: 'border-gray-300 text-gray-500 bg-gray-50' },
} as const;

interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  const [isPending, startTransition] = useTransition();
  const [isExpanded, setIsExpanded] = useState(false);
  const isLocal = task.id.startsWith('local-');

  function handleToggle() {
    if (isLocal) return;
    startTransition(async () => {
      const result = await toggleTask(task.id, !task.is_completed);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(!task.is_completed ? '✅ 完了しました！' : '↩️ 復活しました');
      }
    });
  }

  function handleDelete() {
    if (isLocal) return;
    startTransition(async () => {
      const result = await deleteTask(task.id);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success('🗑️ 削除しました');
      }
    });
  }

  const category = CATEGORY_MAP[task.category_id];
  const gender = GENDER_CONFIG[task.target_gender] ?? GENDER_CONFIG.both;

  return (
    <div
      className={`rounded-xl border transition-all ${
        task.is_completed ? 'border-primary/15' : 'bg-card shadow-sm'
      } ${isPending ? 'opacity-50' : ''}`}
      style={task.is_completed ? { background: 'var(--theme-completed-bg)', borderColor: 'var(--theme-completed-border)' } : undefined}
    >
      <div className="flex items-start gap-3 p-3">
        <Checkbox
          checked={task.is_completed}
          onCheckedChange={handleToggle}
          disabled={isLocal}
          className="mt-0.5"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              className={`text-sm font-medium ${
                task.is_completed ? 'line-through text-muted-foreground' : ''
              }`}
            >
              {task.title}
            </span>
            <Badge
              variant="outline"
              className="text-[10px] px-1.5 py-0"
              style={{ borderColor: category?.color, color: category?.color }}
            >
              {category?.label}
            </Badge>
            {task.target_gender !== 'both' && (
              <Badge
                variant="outline"
                className={`text-[10px] px-1.5 py-0 ${gender.className}`}
              >
                {gender.emoji} {gender.label}
              </Badge>
            )}
          </div>
          {task.description && (
            <p className="mt-1 text-xs text-muted-foreground">
              {task.description}
            </p>
          )}
          {task.due_date && (
            <p className="mt-1 text-xs text-muted-foreground">
              📅 {task.due_date}
            </p>
          )}
          {task.tips && (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              aria-expanded={isExpanded}
              className="mt-1.5 text-xs text-primary/80 hover:text-primary flex items-center gap-1 transition-colors"
            >
              <span>{isExpanded ? '▼' : '▶'}</span>
              <span>{isExpanded ? '要点を閉じる' : '要点・注意事項を見る'}</span>
            </button>
          )}
        </div>
        {task.is_custom && (
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive h-8 w-8 p-0"
            onClick={handleDelete}
            disabled={isPending}
            aria-label={`${task.title}を削除`}
          >
            ✕
          </Button>
        )}
      </div>
      {isExpanded && task.tips && (
        <div className="mx-3 mb-3 ml-10 rounded-lg p-3" style={{ background: 'var(--theme-tip-bg)', borderColor: 'var(--theme-tip-border)', borderWidth: '1px', borderStyle: 'solid' }}>
          <p className="text-xs font-medium mb-1.5" style={{ color: 'var(--theme-tip-title)' }}>💡 要点・注意事項</p>
          <div className="text-xs space-y-0.5 whitespace-pre-line leading-relaxed" style={{ color: 'var(--theme-tip-text)' }}>
            {task.tips}
          </div>
        </div>
      )}
    </div>
  );
}
