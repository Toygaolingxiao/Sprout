"use client";

import { TaskItem } from './task-item';
import type { Task } from '@/types';

interface TaskListProps {
  tasks: Task[];
}

export function TaskList({ tasks }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        <p>タスクがありません</p>
      </div>
    );
  }

  const incomplete = tasks.filter((t) => !t.is_completed);
  const completed = tasks.filter((t) => t.is_completed);

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
