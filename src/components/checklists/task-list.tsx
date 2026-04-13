"use client";

import { TaskItem } from './task-item';
import type { Task, CategoryId } from '@/types';

interface TaskListProps {
  tasks: Task[];
  filter?: CategoryId | 'all';
}

export function TaskList({ tasks, filter = 'all' }: TaskListProps) {
  const filtered = filter === 'all' ? tasks : tasks.filter((t) => t.category_id === filter);

  if (filtered.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        <p>タスクがありません</p>
      </div>
    );
  }

  const incomplete = filtered.filter((t) => !t.is_completed);
  const completed = filtered.filter((t) => t.is_completed);

  return (
    <div className="space-y-2">
      {incomplete.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
      {completed.length > 0 && (
        <details className="mt-4">
          <summary className="cursor-pointer text-sm text-muted-foreground mb-2">
            完了済み ({completed.length})
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
