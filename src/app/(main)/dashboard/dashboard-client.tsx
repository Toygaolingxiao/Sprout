"use client";

import { useState } from 'react';
import Link from 'next/link';
import { STAGES, STAGE_MAP } from '@/data/seed/stages';
import { TaskList } from '@/components/checklists/task-list';
import { CategoryFilter } from '@/components/checklists/category-filter';
import { GenderFilter } from '@/components/checklists/gender-filter';
import { TaskForm } from '@/components/checklists/task-form';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Task, LifeStage, CategoryId, TargetGender, Profile } from '@/types';

interface StageStats {
  stage_id: string;
  total: number;
  completed: number;
  percentage: number;
}

interface DashboardClientProps {
  profile: Profile | null;
  tasks: Task[];
  currentStage: LifeStage;
  stats: { stages: StageStats[]; upcoming: { stage_id: string; due_date: string | null }[] } | null;
  dbOffline: boolean;
  dbError?: string;
}

export function DashboardClient({ profile, tasks, currentStage, stats, dbOffline, dbError }: DashboardClientProps) {
  const [categoryFilter, setCategoryFilter] = useState<CategoryId | 'all'>('all');
  const [genderFilter, setGenderFilter] = useState<TargetGender | 'all'>('all');

  const stage = STAGE_MAP[currentStage];
  const currentStats = stats?.stages.find((s) => s.stage_id === currentStage);
  const completed = tasks.filter((t) => t.is_completed).length;
  const total = tasks.length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  const filteredTasks = tasks.filter((t) => {
    if (categoryFilter !== 'all' && t.category_id !== categoryFilter) return false;
    if (genderFilter !== 'all' && t.target_gender !== genderFilter && t.target_gender !== 'both') return false;
    return true;
  });

  // Top priority: incomplete tasks first 5
  const priorityTasks = filteredTasks.filter((t) => !t.is_completed).slice(0, 5);
  const remainingIncomplete = filteredTasks.filter((t) => !t.is_completed).length - priorityTasks.length;

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold">
          おかえりなさい{profile?.nickname ? `、${profile.nickname}さん` : ''} 👋
        </h1>
        <p className="text-sm text-muted-foreground mt-1">今日も一歩ずつ、ふたりで進みましょう</p>
      </div>

      {/* DB offline warning */}
      {dbOffline && (
        <Card className="border-amber-400 bg-amber-50">
          <CardContent className="py-3">
            <p className="text-sm text-amber-800">⚠️ DB接続待機中 — プレビュー表示です</p>
            {dbError && <p className="text-xs text-amber-600 mt-1">原因: {dbError}</p>}
          </CardContent>
        </Card>
      )}

      {/* Stage selector pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {STAGES.map((s) => {
          const st = stats?.stages.find((x) => x.stage_id === s.id);
          const isActive = s.id === currentStage;
          return (
            <Link
              key={s.id}
              href={`/checklists/${s.id}`}
              className={`flex-shrink-0 flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              <span>{s.emoji}</span>
              <span>{s.label}</span>
              {st && st.total > 0 && (
                <Badge variant={isActive ? 'secondary' : 'outline'} className="ml-0.5 text-[10px] h-4 px-1">
                  {st.completed}/{st.total}
                </Badge>
              )}
            </Link>
          );
        })}
      </div>

      {/* Current stage progress */}
      <Card>
        <CardContent className="pt-5 pb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">{stage.emoji}</span>
              <span className="font-semibold">{stage.label}</span>
            </div>
            <span className="text-sm text-muted-foreground">{completed}/{total}完了</span>
          </div>
          <Progress value={pct} className="h-2.5" />
          <p className="text-xs text-muted-foreground mt-1.5 text-right">{pct}%</p>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="space-y-2">
        <CategoryFilter value={categoryFilter} onChange={setCategoryFilter} />
        <GenderFilter value={genderFilter} onChange={setGenderFilter} />
      </div>

      {/* Priority tasks — next 5 to do */}
      {priorityTasks.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground mb-2">📋 次にやること</h2>
          <TaskList tasks={priorityTasks} />
          {remainingIncomplete > 0 && (
            <Link
              href={`/checklists/${currentStage}`}
              className="mt-3 block text-center text-sm text-primary hover:underline"
            >
              残り {remainingIncomplete} 件を見る →
            </Link>
          )}
        </div>
      )}

      {/* Completed summary */}
      {completed > 0 && (
        <Link
          href={`/checklists/${currentStage}`}
          className="block text-center text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          ✅ 完了済み {completed}件 — すべて見る
        </Link>
      )}

      {/* Task form */}
      {!dbOffline && <TaskForm stageId={currentStage} />}

      {/* Other stages quick nav */}
      {stats && (
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground mb-3">📊 他のステージ</h2>
          <div className="grid gap-2 grid-cols-2">
            {stats.stages
              .filter((s) => s.stage_id !== currentStage)
              .map((s) => {
                const info = STAGE_MAP[s.stage_id as LifeStage];
                return (
                  <Link key={s.stage_id} href={`/checklists/${s.stage_id}`}>
                    <Card className="hover:shadow-sm transition-shadow">
                      <CardContent className="py-3 px-3">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-sm">{info.emoji}</span>
                          <span className="text-xs font-medium">{info.label}</span>
                          {s.total > 0 && (
                            <span className="text-[10px] text-muted-foreground ml-auto">
                              {s.completed}/{s.total}
                            </span>
                          )}
                        </div>
                        {s.total > 0 && <Progress value={s.percentage} className="h-1" />}
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
