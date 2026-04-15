import type { Locale } from './index';
import type { LifeStage } from '@/types';

export type TaskTranslationField = 'title' | 'description' | 'tips';

export interface TaskTranslationValue {
  title?: string;
  description?: string;
  tips?: string;
}

export type TaskTranslations = Record<LifeStage, Record<string, TaskTranslationValue>>;

export const TASK_TRANSLATIONS: Record<Locale, TaskTranslations> = {
  zh: {
    prenatal_care: {
      '基礎体温の記録を開始する': {
        title: '开始记录基础体温',
        description: '每天早晨起床后使用基础体温计测量并记录体温。',
  tips: `・在口腔内（舌下）测量，每天尽量在相同时间进行
・连续记录3个月以上可观察排卵模式
・如果没有出现低温期与高温期的双相变化，可能存在无排卵情况，建议就医`,
      },
      'ブライダルチェック（婚前健診）を受ける': {
        title: '接受婚前检查（结婚体检）',
        description: '男女双方在备孕前进行全面检查。可在产科和泌尿科就诊。',
  tips: `【女性】在产科检查子宫、卵巢、激素值和性传播感染等项目（自费1〜3万日元）
・建议同时进行AMH检查以评估卵巢储备
【男性】在泌尿科进行精液检查、性传播感染检查、激素检查等（自费5,000〜1.5万日元）
・约一半的不孕原因来自男性
・即便结果异常也可通过早期发现与治疗提高受孕机会

🔍 搜索附近的产科 → https://www.google.com/maps/search/産婦人科`,
      },
      '精液検査を受ける': {
        title: '接受精液检查',
        description: '在泌尿科或不孕不育诊所确认精子状态。',
  tips: `・约一半的不孕原因来自男性
・检查精子数量、活动率、形态
・采样前禁欲2〜7天
・即使结果不理想，也可能通过生活方式改善或补充剂得到改善
・费用约为3,000〜5,000日元

🔍 搜索附近的泌尿科 → https://www.google.com/maps/search/泌尿器科`,
      },
      '風疹抗体検査を受ける': {
        title: '接受风疹抗体检查',
        description: '妊娠初期的风疹感染会导致先天性风疹综合征。',
  tips: `・特别是1979〜1987年出生的男性可能没有接种记录
・如果抗体值低，建议接种疫苗（女性接种后需避孕2个月）
・有些地区可以使用免费优惠券
・建议伴侣也一起检查`,
      },
      '歯科検診を受ける': {
        title: '接受牙科检查',
        description: '妊娠期间牙科治疗受到限制，建议事先完成护理。',
  tips: `・妊娠期间激素变化会使牙周病加重
・牙周病会增加早产、低体重儿风险
・怀孕前完成蛀牙治疗、牙结石清除和智齿处理
・妊娠期间尽量避免X光检查，建议提前完成治疗

🔍 搜索附近的牙科 → https://www.google.com/maps/search/歯科`,
      },
      '男性向け妊活サプリを検討する': {
        title: '考虑男性专用备孕补充剂',
      },
      '睡眠リズムを整える（早寝早起き）': {
        title: '调整睡眠节奏（早睡早起）',
      },
      'バランスの良い食事を意識する': {
        title: '注意均衡饮食',
      },
      '冷え対策を始める': {
        title: '开始预防寒冷',
      },
    },
    pregnancy: {},
    postpartum: {},
    childcare: {},
  },
};

export function translateTaskField(
  locale: Locale,
  stageId: LifeStage,
  original: string,
  field: TaskTranslationField,
): string {
  return TASK_TRANSLATIONS[locale]?.[stageId]?.[original]?.[field] ?? original;
}
