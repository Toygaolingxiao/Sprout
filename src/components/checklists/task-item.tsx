'use client';

import { useTransition } from 'react';
import { toggleTask, deleteTask } from '@/lib/actions/tasks';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CATEGORY_MAP } from '@/data/seed/categories';
import type { Task } from '@/types';

interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      await toggleTask(task.id, !task.is_completed);
    });
  }

  function handleDelete() {
    startTransition(async () => {
      await deleteTask(task.id);
    });
  }

  const category = CATEGORY_MAP[task.category_id];

  return (
    <div
      className={`flex items-start gap-3 rounded-lg border p-3 transition-colors ${
        task.is_completed ? 'bg-muted/50 opacity-70' : 'bg-card'
      } ${isPending ? 'opacity-50' : ''}`}
    >
      <Checkbox
        checked={task.is_completed}
        onCheckedChange={handleToggle}
        className="mt-0.5"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`text-sm font-medium ${
              task.is_completed ? 'line-through text-muted-foreground' : ''
            }`}
          >
            {task.title}
          </span>
          <Badge
            variant="outline"
            className="text-xs"
            style={{ borderColor: category?.color, color: category?.color }}
          >
            {category?.label}
          </Badge>
        </div>
        {task.description && (
          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
            {task.description}
          </p>
        )}
        {task.due_date && (
          <p className="mt-1 text-xs text-muted-foreground">
            📅 {task.due_date}
          </p>
        )}
      </div>
      {task.is_custom && (
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive h-8 w-8 p-0"
          onClick={handleDelete}
          disabled={isPending}
        >
          ✕
        </Button>
      )}
    </div>
  );
}
