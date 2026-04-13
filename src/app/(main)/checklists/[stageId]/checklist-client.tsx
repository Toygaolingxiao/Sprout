'use client';

import { useState } from 'react';
import { TaskList } from '@/components/checklists/task-list';
import { TaskForm } from '@/components/checklists/task-form';
import { CategoryFilter } from '@/components/checklists/category-filter';
import type { Task, LifeStage, CategoryId } from '@/types';

interface ChecklistClientProps {
  tasks: Task[];
  stageId: LifeStage;
}

export function ChecklistClient({ tasks, stageId }: ChecklistClientProps) {
  const [filter, setFilter] = useState<CategoryId | 'all'>('all');

  return (
    <div className="space-y-4">
      <CategoryFilter value={filter} onChange={setFilter} />
      <TaskList tasks={tasks} filter={filter} />
      <TaskForm stageId={stageId} />
    </div>
  );
}
