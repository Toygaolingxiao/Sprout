"use client";

import { useState, useTransition } from 'react';
import { toggleTask, deleteTask } from '@/lib/actions/tasks';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { CATEGORY_MAP } from '@/data/seed/categories';
import { useTranslation } from '@/lib/i18n/context';
import { translateTaskField } from '@/lib/i18n/task-translations';
import type { Task } from '@/types';

interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  const [isPending, startTransition] = useTransition();
  const [isExpanded, setIsExpanded] = useState(false);
  const isLocal = task.id.startsWith('local-');
  const { locale, t } = useTranslation();

  const translatedTitle = translateTaskField(locale, task.stage_id, task.title, 'title');
  const translatedDescription = task.description
    ? translateTaskField(locale, task.stage_id, task.description, 'description')
    : null;
  const translatedTips = task.tips
    ? translateTaskField(locale, task.stage_id, task.tips, 'tips')
    : null;

  function handleToggle() {
    if (isLocal) return;
    startTransition(async () => {
      const result = await toggleTask(task.id, !task.is_completed);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(!task.is_completed ? t('checklist.taskCompleted') : t('checklist.taskRestored'));
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
        toast.success(t('checklist.taskDeleted'));
      }
    });
  }

  const category = CATEGORY_MAP[task.category_id];
  const gender = {
    female: { label: t('gender.femaleLabel'), emoji: '♀', className: 'border-pink-400 text-pink-500 bg-pink-50' },
    male: { label: t('gender.maleLabel'), emoji: '♂', className: 'border-blue-400 text-blue-500 bg-blue-50' },
    both: { label: t('gender.bothLabel'), emoji: '👫', className: 'border-gray-300 text-gray-500 bg-gray-50' },
  }[task.target_gender] ?? { label: t('gender.bothLabel'), emoji: '👫', className: 'border-gray-300 text-gray-500 bg-gray-50' };

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
              {translatedTitle}
            </span>
            <Badge
              variant="outline"
              className="text-[10px] px-1.5 py-0"
              style={{ borderColor: category?.color, color: category?.color }}
            >
              {category ? t(`category.${category.id}` as any) : ''}
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
          {translatedDescription && (
            <p className="mt-1 text-xs text-muted-foreground">
              {translatedDescription}
            </p>
          )}
          {task.due_date && !task.is_completed && (
            <DueDateBadge dueDate={task.due_date} />
          )}
          {task.due_date && task.is_completed && (
            <p className="mt-1 text-xs text-muted-foreground">
              📅 {task.due_date}
            </p>
          )}
          {translatedTips && (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              aria-expanded={isExpanded}
              className="mt-1.5 py-2 -my-1 text-xs text-primary/80 hover:text-primary flex items-center gap-1 transition-colors"
            >
              <span>{isExpanded ? '▼' : '▶'}</span>
              <span>{isExpanded ? t('checklist.hideTip') : t('checklist.showTip')}</span>
            </button>
          )}
        </div>
        {task.is_custom && (
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive h-10 w-10 p-0"
            onClick={handleDelete}
            disabled={isPending}
            aria-label={t('checklist.deleteTask', { title: translatedTitle })}
          >
            ✕
          </Button>
        )}
      </div>
      {isExpanded && translatedTips && (
        <div className="mx-3 mb-3 ml-8 sm:ml-10 rounded-lg p-3" style={{ background: 'var(--theme-tip-bg)', borderColor: 'var(--theme-tip-border)', borderWidth: '1px', borderStyle: 'solid' }}>
          <p className="text-xs font-medium mb-1.5" style={{ color: 'var(--theme-tip-title)' }}>{t('checklist.tipTitle')}</p>
          <div className="text-xs space-y-0.5 whitespace-pre-line leading-relaxed" style={{ color: 'var(--theme-tip-text)' }}>
            <Linkify text={translatedTips} />
          </div>
        </div>
      )}
    </div>
  );
}

function DueDateBadge({ dueDate }: { dueDate: string }) {
  const { t } = useTranslation();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate + 'T00:00:00');
  const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  let label: string;
  let className: string;

  if (diffDays < 0) {
    label = t('date.overdue', { n: Math.abs(diffDays) });
    className = 'text-red-600 bg-red-50';
  } else if (diffDays === 0) {
    label = t('date.today');
    className = 'text-orange-600 bg-orange-50';
  } else if (diffDays <= 7) {
    label = t('date.daysLeft', { n: diffDays });
    className = 'text-orange-600 bg-orange-50';
  } else if (diffDays <= 30) {
    label = t('date.daysLeft', { n: diffDays });
    className = 'text-amber-600 bg-amber-50';
  } else {
    const weeks = Math.floor(diffDays / 7);
    label = t('date.weeksLeft', { n: weeks });
    className = 'text-muted-foreground bg-muted/50';
  }

  return (
    <p className="mt-1 flex items-center gap-1.5 text-xs">
      <span className="text-muted-foreground">📅 {dueDate}</span>
      <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${className}`}>
        {label}
      </span>
    </p>
  );
}

const URL_REGEX = /(https?:\/\/[^\s]+)/g;

function Linkify({ text }: { text: string }) {
  const parts = text.split(URL_REGEX);
  return (
    <>
      {parts.map((part, i) =>
        URL_REGEX.test(part) ? (
          <a
            key={i}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-2 hover:text-primary/80"
          >
            {decodeURIComponent(new URL(part).pathname.replace(/^\/search\//, '') || part)}
          </a>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}
