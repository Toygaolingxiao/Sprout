"use client";

import { useState, useTransition } from 'react';
import { TaskList } from '@/components/checklists/task-list';
import { TaskForm } from '@/components/checklists/task-form';
import { CategoryFilter } from '@/components/checklists/category-filter';
import { GenderFilter } from '@/components/checklists/gender-filter';
import { resetStageTemplates, deleteCustomTasksByStage, deleteAllCustomTasks } from '@/lib/actions/tasks';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { useTranslation } from '@/lib/i18n/context';
import type { Task, LifeStage, CategoryId, TargetGender, TaskPriority } from '@/types';

interface ChecklistClientProps {
  tasks: Task[];
  stageId: LifeStage;
  dbOffline?: boolean;
}

export function ChecklistClient({ tasks, stageId, dbOffline }: ChecklistClientProps) {
  const [categoryFilter, setCategoryFilter] = useState<CategoryId | 'all'>('all');
  const [genderFilter, setGenderFilter] = useState<TargetGender | 'all'>('all');
  const [selectedPriorities, setSelectedPriorities] = useState<TaskPriority[]>(['high', 'medium', 'low']);
  const [isResetPending, startResetTransition] = useTransition();
  const [isDeleteCustomPending, startDeleteCustomTransition] = useTransition();
  const [isDeleteAllCustomPending, startDeleteAllCustomTransition] = useTransition();
  const { t } = useTranslation();

  const filteredTasks = tasks.filter((t) => {
    if (categoryFilter !== 'all' && t.category_id !== categoryFilter) return false;
    if (genderFilter !== 'all' && t.target_gender !== genderFilter && t.target_gender !== 'both') return false;
    return true;
  });

  function togglePriority(priority: TaskPriority) {
    setSelectedPriorities((prev) =>
      prev.includes(priority) ? prev.filter((p) => p !== priority) : [...prev, priority]
    );
  }

  function handleResetTemplates() {
    startResetTransition(async () => {
      const result = await resetStageTemplates({ stageId, priorities: selectedPriorities });
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success(t('checklist.templatesResetSuccess', { n: result?.insertedCount ?? 0 }));
    });
  }

  function handleDeleteCustomTasks() {
    startDeleteCustomTransition(async () => {
      const result = await deleteCustomTasksByStage(stageId);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success(t('checklist.customTasksDeleted', { n: result?.deletedCount ?? 0 }));
    });
  }

  function handleDeleteAllCustomTasks() {
    startDeleteAllCustomTransition(async () => {
      const result = await deleteAllCustomTasks();
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success(t('checklist.allCustomTasksDeleted', { n: result?.deletedCount ?? 0 }));
    });
  }

  return (
    <div className="space-y-4">
      {!dbOffline && (
        <Card>
          <CardContent className="pt-4 space-y-3">
            <div className="space-y-1">
              <p className="text-sm font-medium">{t('checklist.templateTools')}</p>
              <p className="text-xs text-muted-foreground">{t('checklist.templateToolsDesc')}</p>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">{t('checklist.templatePriorityFilter')}</p>
              <div className="flex flex-wrap gap-3">
                <label className="inline-flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={selectedPriorities.includes('high')}
                    onCheckedChange={() => togglePriority('high')}
                    disabled={isResetPending}
                  />
                  {t('checklist.priorityHigh')}
                </label>
                <label className="inline-flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={selectedPriorities.includes('medium')}
                    onCheckedChange={() => togglePriority('medium')}
                    disabled={isResetPending}
                  />
                  {t('checklist.priorityMedium')}
                </label>
                <label className="inline-flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={selectedPriorities.includes('low')}
                    onCheckedChange={() => togglePriority('low')}
                    disabled={isResetPending}
                  />
                  {t('checklist.priorityLow')}
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <Button onClick={handleResetTemplates} disabled={isResetPending || selectedPriorities.length === 0}>
                {isResetPending ? t('checklist.templatesResetting') : t('checklist.resetTemplates')}
              </Button>
              <Button
                variant="outline"
                onClick={handleDeleteCustomTasks}
                disabled={isDeleteCustomPending}
              >
                {isDeleteCustomPending ? t('checklist.customTasksDeleting') : t('checklist.deleteCustomTasks')}
              </Button>
              <Button
                variant="outline"
                onClick={handleDeleteAllCustomTasks}
                disabled={isDeleteAllCustomPending}
              >
                {isDeleteAllCustomPending ? t('checklist.customTasksDeleting') : t('checklist.deleteAllCustomTasks')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        <CategoryFilter value={categoryFilter} onChange={setCategoryFilter} />
        <GenderFilter value={genderFilter} onChange={setGenderFilter} />
      </div>
      <TaskList tasks={filteredTasks} />
      {!dbOffline && <TaskForm stageId={stageId} />}
    </div>
  );
}
