"use client";

import { useState, useTransition } from 'react';
import { createTask } from '@/lib/actions/tasks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { CATEGORIES } from '@/data/seed/categories';
import { useTranslation } from '@/lib/i18n/context';
import type { TranslationKey } from '@/lib/i18n';
import type { LifeStage, CategoryId, TaskPriority } from '@/types';

interface TaskFormProps {
  stageId: LifeStage;
}

export function TaskForm({ stageId }: TaskFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { t } = useTranslation();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createTask({
        title: formData.get('title') as string,
        stage_id: stageId,
        category_id: formData.get('category_id') as CategoryId,
        description: (formData.get('description') as string) || undefined,
        due_date: (formData.get('due_date') as string) || undefined,
        priority: (formData.get('priority') as TaskPriority) || 'medium',
      });
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(t('checklist.taskAdded'));
        setIsOpen(false);
      }
    });
  }

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        className="w-full border-dashed"
        onClick={() => setIsOpen(true)}
      >
        {t('checklist.addTask')}
      </Button>
    );
  }

  return (
    <form action={handleSubmit} className="space-y-3 rounded-lg border p-4 bg-card">
      <div className="space-y-2">
        <Label htmlFor="title">{t('checklist.taskName')}</Label>
        <Input id="title" name="title" required placeholder={t('checklist.taskPlaceholder')} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="category_id">{t('checklist.category')}</Label>
        <select
          id="category_id"
          name="category_id"
          aria-label={t('checklist.categorySelect')}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          defaultValue="other"
        >
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {t(`category.${c.id}` as TranslationKey)}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">{t('checklist.description')}</Label>
        <Input id="description" name="description" placeholder={t('checklist.descPlaceholder')} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="due_date">{t('checklist.dueDateLabel')}</Label>
        <Input id="due_date" name="due_date" type="date" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="priority">{t('checklist.priority')}</Label>
        <select
          id="priority"
          name="priority"
          aria-label={t('checklist.priority')}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          defaultValue="medium"
        >
          <option value="high">{t('checklist.priorityHigh')}</option>
          <option value="medium">{t('checklist.priorityMedium')}</option>
          <option value="low">{t('checklist.priorityLow')}</option>
        </select>
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={isPending} className="flex-1">
          {isPending ? t('checklist.adding') : t('checklist.add')}
        </Button>
        <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>
          {t('checklist.cancel')}
        </Button>
      </div>
    </form>
  );
}
