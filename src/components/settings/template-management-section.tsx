"use client";

import { useState, useTransition } from 'react';
import { resetStageTemplates, deleteCustomTasksByStage, deleteAllCustomTasks } from '@/lib/actions/tasks';
import { STAGES } from '@/data/seed/stages';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { useTranslation } from '@/lib/i18n/context';
import type { TranslationKey } from '@/lib/i18n';
import type { LifeStage, TaskPriority } from '@/types';

interface TemplateManagementSectionProps {
  defaultStage: LifeStage;
}

export function TemplateManagementSection({ defaultStage }: TemplateManagementSectionProps) {
  const { t } = useTranslation();
  const [stageId, setStageId] = useState<LifeStage>(defaultStage);
  const [selectedPriorities, setSelectedPriorities] = useState<TaskPriority[]>(['high', 'medium', 'low']);
  const [isResetPending, startResetTransition] = useTransition();
  const [isDeleteStagePending, startDeleteStageTransition] = useTransition();
  const [isDeleteAllPending, startDeleteAllTransition] = useTransition();

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
      toast.success(t('settings.templatesResetSuccess', { n: result?.insertedCount ?? 0 }));
    });
  }

  function handleDeleteStageCustom() {
    startDeleteStageTransition(async () => {
      const result = await deleteCustomTasksByStage(stageId);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success(t('settings.customTasksDeleted', { n: result?.deletedCount ?? 0 }));
    });
  }

  function handleDeleteAllCustom() {
    startDeleteAllTransition(async () => {
      const result = await deleteAllCustomTasks();
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success(t('settings.allCustomTasksDeleted', { n: result?.deletedCount ?? 0 }));
    });
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{t('settings.templateTools')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{t('settings.templateToolsDesc')}</p>

        <div className="space-y-2">
          <label htmlFor="template-stage" className="text-sm font-medium">
            {t('settings.templateTargetStage')}
          </label>
          <select
            id="template-stage"
            value={stageId}
            onChange={(event) => setStageId(event.target.value as LifeStage)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            disabled={isResetPending || isDeleteStagePending || isDeleteAllPending}
          >
            {STAGES.map((stage) => (
              <option key={stage.id} value={stage.id}>
                {stage.emoji} {t(`stage.${stage.id}` as TranslationKey)}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">{t('settings.templatePriorityFilter')}</p>
          <div className="flex flex-wrap gap-4">
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

        <div className="space-y-2">
          <Button
            className="w-full"
            onClick={handleResetTemplates}
            disabled={isResetPending || selectedPriorities.length === 0}
          >
            {isResetPending ? t('settings.templatesResetting') : t('settings.resetTemplatesShort')}
          </Button>
          <Button
            className="w-full"
            variant="outline"
            onClick={handleDeleteStageCustom}
            disabled={isDeleteStagePending}
          >
            {isDeleteStagePending ? t('settings.customTasksDeleting') : t('settings.deleteCustomTasksShort')}
          </Button>
          <Button
            className="w-full"
            variant="outline"
            onClick={handleDeleteAllCustom}
            disabled={isDeleteAllPending}
          >
            {isDeleteAllPending ? t('settings.customTasksDeleting') : t('settings.deleteAllCustomTasksShort')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
