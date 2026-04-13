import type { LifeStage } from '@/types';

export const STAGES: { id: LifeStage; label: string; emoji: string; description: string; period: string }[] = [
  { id: 'prenatal_care', label: '妊活', emoji: '🌱', description: '妊活中のチェックリスト', period: '妊娠を意識し始めてから妊娠確認まで。体づくり・検査・お金の準備を夫婦で進める時期です。' },
  { id: 'pregnancy', label: '妊娠', emoji: '🤰', description: '妊娠中のチェックリスト', period: '妊娠確認〜出産まで（約40週）。初期は届出・つわり対策、中期は買い物・名付け、後期は入院準備が中心です。' },
  { id: 'postpartum', label: '産後', emoji: '👶', description: '産後のチェックリスト', period: '出産直後〜産後半年頃。届出・手当の申請ラッシュと、母体の回復・授乳リズム確立の時期です。' },
  { id: 'childcare', label: '育児', emoji: '🍼', description: '育児中のチェックリスト', period: '生後数ヶ月〜3歳以降。予防接種・健診・離乳食・保活など、子どもの成長に合わせたタスクが続きます。' },
];

export const STAGE_MAP = Object.fromEntries(STAGES.map((s) => [s.id, s])) as Record<
  LifeStage,
  (typeof STAGES)[number]
>;
