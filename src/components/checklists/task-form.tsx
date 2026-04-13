"use client";

import { useState, useTransition } from 'react';
import { createTask } from '@/lib/actions/tasks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { CATEGORIES } from '@/data/seed/categories';
import type { LifeStage, CategoryId } from '@/types';

interface TaskFormProps {
  stageId: LifeStage;
}

export function TaskForm({ stageId }: TaskFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createTask({
        title: formData.get('title') as string,
        stage_id: stageId,
        category_id: formData.get('category_id') as CategoryId,
        description: (formData.get('description') as string) || undefined,
        due_date: (formData.get('due_date') as string) || undefined,
      });
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success('➕ タスクを追加しました');
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
        ＋ タスクを追加
      </Button>
    );
  }

  return (
    <form action={handleSubmit} className="space-y-3 rounded-lg border p-4 bg-card">
      <div className="space-y-2">
        <Label htmlFor="title">タスク名</Label>
        <Input id="title" name="title" required placeholder="例: 母子手帳を受け取る" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="category_id">カテゴリ</Label>
        <select
          id="category_id"
          name="category_id"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          defaultValue="other"
        >
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">説明（任意）</Label>
        <Input id="description" name="description" placeholder="メモや補足情報" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="due_date">期限（任意）</Label>
        <Input id="due_date" name="due_date" type="date" />
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={isPending} className="flex-1">
          {isPending ? '追加中...' : '追加'}
        </Button>
        <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>
          キャンセル
        </Button>
      </div>
    </form>
  );
}
