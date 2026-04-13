import type { LifeStage } from '@/types';

export const STAGES: { id: LifeStage; label: string; emoji: string; description: string }[] = [
  { id: 'prenatal_care', label: '妊活', emoji: '🌱', description: '妊活中のチェックリスト' },
  { id: 'pregnancy', label: '妊娠', emoji: '🤰', description: '妊娠中のチェックリスト' },
  { id: 'postpartum', label: '産後', emoji: '👶', description: '産後のチェックリスト' },
  { id: 'childcare', label: '育児', emoji: '🍼', description: '育児中のチェックリスト' },
];

export const STAGE_MAP = Object.fromEntries(STAGES.map((s) => [s.id, s])) as Record<
  LifeStage,
  (typeof STAGES)[number]
>;
