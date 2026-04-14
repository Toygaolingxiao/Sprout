"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { STAGES, STAGE_MAP } from '@/data/seed/stages';
import { TaskList } from '@/components/checklists/task-list';
import { CategoryFilter } from '@/components/checklists/category-filter';
import { GenderFilter } from '@/components/checklists/gender-filter';
import { TaskForm } from '@/components/checklists/task-form';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/lib/i18n/context';
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
  stats: { stages: StageStats[]; upcoming: { stage_id: string; due_date: string | null; title: string }[] } | null;
  dbOffline: boolean;
  dbError?: string;
}

export function DashboardClient({ profile, tasks, currentStage, stats, dbOffline, dbError }: DashboardClientProps) {
  const [categoryFilter, setCategoryFilter] = useState<CategoryId | 'all'>('all');
  const [genderFilter, setGenderFilter] = useState<TargetGender | 'all'>('all');
  const { t } = useTranslation();

  function daysUntilDue(dateStr: string): string {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dateStr + 'T00:00:00');
    const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    if (diff < 0) return t('date.daysAgo', { n: Math.abs(diff) });
    if (diff === 0) return t('date.today');
    if (diff <= 30) return t('date.daysLeft', { n: diff });
    const weeks = Math.floor(diff / 7);
    return t('date.weeksLeft', { n: weeks });
  }

  const stage = STAGE_MAP[currentStage];
  const currentStats = stats?.stages.find((s) => s.stage_id === currentStage);
  const completed = tasks.filter((t) => t.is_completed).length;
  const total = tasks.length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  const filteredTasks = useMemo(() => tasks.filter((t) => {
    if (categoryFilter !== 'all' && t.category_id !== categoryFilter) return false;
    if (genderFilter !== 'all' && t.target_gender !== genderFilter && t.target_gender !== 'both') return false;
    return true;
  }), [tasks, categoryFilter, genderFilter]);

  // Top priority: incomplete tasks first 5
  const incompleteTasks = useMemo(() => filteredTasks.filter((t) => !t.is_completed), [filteredTasks]);
  const priorityTasks = incompleteTasks.slice(0, 5);
  const remainingIncomplete = incompleteTasks.length - priorityTasks.length;

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="rounded-2xl p-4 sm:p-5 border border-primary/10" style={{ background: `linear-gradient(to bottom right, var(--theme-gradient-from), var(--theme-gradient-to))` }}>
        <h1 className="text-xl font-bold text-foreground">
          {t('dashboard.welcome')}{profile?.nickname ? `${t('dashboard.honorific') ? '、' + profile.nickname + t('dashboard.honorific') : '、' + profile.nickname}` : ''} 👋
        </h1>
        <p className="text-sm text-muted-foreground mt-1">{t('dashboard.message')}</p>
        {(profile?.expected_due_date || profile?.expected_pregnancy_date) && (
          <div className="mt-3 flex flex-wrap gap-3 text-xs">
            {profile?.expected_pregnancy_date && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/60 px-2.5 py-1 font-medium text-foreground/80">
                {t('dashboard.pregnancyDate')} <span className="font-semibold">{profile.expected_pregnancy_date}</span>
              </span>
            )}
            {profile?.expected_due_date && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/60 px-2.5 py-1 font-medium text-foreground/80">
                {t('dashboard.dueDate')} <span className="font-semibold">{profile.expected_due_date}</span>
                <span className="text-muted-foreground">({daysUntilDue(profile.expected_due_date)})</span>
              </span>
            )}
          </div>
        )}
      </div>

      {/* DB offline warning */}
      {dbOffline && (
        <Card className="border-amber-400 bg-amber-50">
          <CardContent className="py-3">
            <p className="text-sm text-amber-800">{t('dashboard.dbWarning')}</p>
            {dbError && <p className="text-xs text-amber-600 mt-1">{t('dashboard.cause')} {dbError}</p>}
          </CardContent>
        </Card>
      )}

      {/* Stage selector pills */}
      <div className="scroll-fade-right">
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
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
              <span>{t(`stage.${s.id}` as any)}</span>
              {st && st.total > 0 && (
                <Badge variant={isActive ? 'secondary' : 'outline'} className="ml-0.5 text-[10px] h-4 px-1">
                  {st.completed}/{st.total}
                </Badge>
              )}
            </Link>
          );
        })}
      </div>
      </div>

      {/* Current stage progress */}
      <Card>
        <CardContent className="pt-5 pb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">{stage.emoji}</span>
              <span className="font-semibold">{t(`stage.${currentStage}` as any)}</span>
            </div>
            <span className="text-sm text-muted-foreground">{completed}/{total}{t('dashboard.completed')}</span>
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

      {/* Upcoming schedule */}
      {stats?.upcoming && stats.upcoming.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground mb-2">{t('dashboard.upcoming')}</h2>
          <Card>
            <CardContent className="py-3 px-4 space-y-2">
              {stats.upcoming.map((item, i) => {
                const stageInfo = STAGE_MAP[item.stage_id as LifeStage];
                const due = new Date(item.due_date + 'T00:00:00');
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                const relLabel = diffDays === 0 ? t('date.today') : diffDays <= 30 ? t('date.daysLeft', { n: diffDays }) : t('date.weeksLeft', { n: Math.floor(diffDays / 7) });
                const urgencyClass = diffDays <= 7 ? 'text-orange-600 bg-orange-50' : diffDays <= 30 ? 'text-amber-600 bg-amber-50' : 'text-muted-foreground bg-muted/50';

                return (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <span className="text-xs">{stageInfo?.emoji}</span>
                    <span className="flex-1 truncate">{item.title}</span>
                    <span className={`text-[10px] font-medium rounded-full px-2 py-0.5 whitespace-nowrap ${urgencyClass}`}>
                      {relLabel}
                    </span>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap hidden sm:inline">{item.due_date}</span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Priority tasks — next 5 to do */}
      {priorityTasks.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground mb-2">{t('dashboard.nextTodo')}</h2>
          <TaskList tasks={priorityTasks} />
          {remainingIncomplete > 0 && (
            <Link
              href={`/checklists/${currentStage}`}
              className="mt-3 block text-center text-sm text-primary hover:underline"
            >
              {t('dashboard.remaining', { n: remainingIncomplete })}
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
          {t('dashboard.completedSummary', { n: completed })}
        </Link>
      )}

      {/* Task form */}
      {!dbOffline && <TaskForm stageId={currentStage} />}

      {/* Other stages quick nav */}
      {stats && (
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground mb-3">{t('dashboard.otherStages')}</h2>
          <div className="grid gap-3 grid-cols-2">
            {stats.stages
              .filter((s) => s.stage_id !== currentStage)
              .map((s) => {
                const info = STAGE_MAP[s.stage_id as LifeStage];
                return (
                  <Link key={s.stage_id} href={`/checklists/${s.stage_id}`}>
                    <Card className="hover:shadow-md transition-all border-primary/5 hover:border-primary/15">
                      <CardContent className="py-3 px-2.5 sm:px-3.5">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <span className="text-base">{info.emoji}</span>
                          <span className="text-xs font-semibold">{t(`stage.${s.stage_id}` as any)}</span>
                          {s.total > 0 && (
                            <span className="text-[10px] text-muted-foreground ml-auto">
                              {s.completed}/{s.total}
                            </span>
                          )}
                        </div>
                        {s.total > 0 && <Progress value={s.percentage} className="h-1.5" />}
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
