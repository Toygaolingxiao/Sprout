"use client";

import { useState } from 'react';
import { TaskList } from '@/components/checklists/task-list';
import { TaskForm } from '@/components/checklists/task-form';
import { CategoryFilter } from '@/components/checklists/category-filter';
import { GenderFilter } from '@/components/checklists/gender-filter';
import { SponsorLinks } from '@/components/checklists/sponsor-links';
import type { Task, LifeStage, CategoryId, TargetGender } from '@/types';

interface ChecklistClientProps {
  tasks: Task[];
  stageId: LifeStage;
  dbOffline?: boolean;
}

export function ChecklistClient({ tasks, stageId, dbOffline }: ChecklistClientProps) {
  const [categoryFilter, setCategoryFilter] = useState<CategoryId | 'all'>('all');
  const [genderFilter, setGenderFilter] = useState<TargetGender | 'all'>('all');

  const filteredTasks = tasks.filter((t) => {
    if (categoryFilter !== 'all' && t.category_id !== categoryFilter) return false;
    if (genderFilter !== 'all' && t.target_gender !== genderFilter && t.target_gender !== 'both') return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <CategoryFilter value={categoryFilter} onChange={setCategoryFilter} />
        <GenderFilter value={genderFilter} onChange={setGenderFilter} />
      </div>
      <TaskList tasks={filteredTasks} />
      <SponsorLinks categoryFilter={categoryFilter} />
      {!dbOffline && <TaskForm stageId={stageId} />}
    </div>
  );
}
