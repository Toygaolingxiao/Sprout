import type { LifeStage, CategoryId } from '@/types';

export interface TemplateItem {
  stage_id: LifeStage;
  category_id: CategoryId;
  title: string;
  description?: string;
  sort_order: number;
}

export const CHECKLIST_TEMPLATES: TemplateItem[] = [
  // ── 妊活 ──
  { stage_id: 'prenatal_care', category_id: 'health',    title: '基礎体温の記録を開始する', description: '毎朝起床時に基礎体温を測定し記録', sort_order: 1 },
  { stage_id: 'prenatal_care', category_id: 'health',    title: '葉酸サプリを飲み始める', description: '妊娠1ヶ月前から400μg/日の摂取を推奨', sort_order: 2 },
  { stage_id: 'prenatal_care', category_id: 'health',    title: '産婦人科で初回相談', description: '不妊検査やブライダルチェックの相談', sort_order: 3 },
  { stage_id: 'prenatal_care', category_id: 'health',    title: '風疹抗体検査を受ける', description: '妊娠前に抗体価を確認、必要ならワクチン接種', sort_order: 4 },
  { stage_id: 'prenatal_care', category_id: 'health',    title: '歯科検診を受ける', description: '妊娠中は治療が制限されるため事前に', sort_order: 5 },
  { stage_id: 'prenatal_care', category_id: 'money',     title: '医療保険の確認・加入', description: '妊娠前に加入しておくと安心', sort_order: 6 },
  { stage_id: 'prenatal_care', category_id: 'money',     title: '妊活にかかる費用を確認', description: '不妊治療の助成金制度も調べる', sort_order: 7 },
  { stage_id: 'prenatal_care', category_id: 'other',     title: '生活習慣の見直し', description: '禁煙・節酒・規則正しい生活リズム', sort_order: 8 },

  // ── 妊娠 ──
  { stage_id: 'pregnancy', category_id: 'procedure', title: '妊娠届出書を提出する', description: '市区町村の窓口に提出し母子手帳を受け取る', sort_order: 1 },
  { stage_id: 'pregnancy', category_id: 'procedure', title: '母子手帳を受け取る', description: '妊婦健診の補助券も一緒にもらえる', sort_order: 2 },
  { stage_id: 'pregnancy', category_id: 'money',     title: '出産育児一時金の確認', description: '健康保険から50万円の支給（直接支払制度）', sort_order: 3 },
  { stage_id: 'pregnancy', category_id: 'money',     title: '高額療養費制度の確認', description: '帝王切開等の場合に利用可能', sort_order: 4 },
  { stage_id: 'pregnancy', category_id: 'procedure', title: '出産する病院を決める', description: '分娩予約は早めに（人気の病院は妊娠初期に）', sort_order: 5 },
  { stage_id: 'pregnancy', category_id: 'health',    title: '妊婦健診を定期的に受ける', description: '初期は月1回、後期は週1回', sort_order: 6 },
  { stage_id: 'pregnancy', category_id: 'other',     title: '両親学級・母親学級に参加', description: '出産・育児の基礎知識を学ぶ', sort_order: 7 },
  { stage_id: 'pregnancy', category_id: 'shopping',  title: 'ベビー用品の準備', description: 'ベビーベッド、チャイルドシート、衣類等', sort_order: 8 },
  { stage_id: 'pregnancy', category_id: 'shopping',  title: '入院準備バッグを用意', description: '母子手帳、保険証、着替え、ベビー服等', sort_order: 9 },
  { stage_id: 'pregnancy', category_id: 'procedure', title: '職場への報告・産休手続き', description: '安定期に入ったら上司に報告', sort_order: 10 },
  { stage_id: 'pregnancy', category_id: 'money',     title: '出産手当金の確認', description: '健康保険加入者が産休中に受給可能', sort_order: 11 },
  { stage_id: 'pregnancy', category_id: 'other',     title: '赤ちゃんの名前を考える', description: '出生届の期限は生後14日以内', sort_order: 12 },

  // ── 産後 ──
  { stage_id: 'postpartum', category_id: 'procedure', title: '出生届を提出する', description: '生後14日以内に市区町村の窓口へ', sort_order: 1 },
  { stage_id: 'postpartum', category_id: 'procedure', title: '健康保険に加入させる', description: '出生後すぐに親の健康保険に加入手続き', sort_order: 2 },
  { stage_id: 'postpartum', category_id: 'money',     title: '児童手当を申請する', description: '出生翌日から15日以内に申請（さかのぼり不可）', sort_order: 3 },
  { stage_id: 'postpartum', category_id: 'money',     title: '乳幼児医療費助成の申請', description: '自治体により助成内容が異なる', sort_order: 4 },
  { stage_id: 'postpartum', category_id: 'procedure', title: '出産育児一時金の申請', description: '直接支払制度を利用しない場合は自分で申請', sort_order: 5 },
  { stage_id: 'postpartum', category_id: 'health',    title: '産後1ヶ月健診を受ける', description: '母体の回復状況と赤ちゃんの成長を確認', sort_order: 6 },
  { stage_id: 'postpartum', category_id: 'health',    title: '産後ケア施設の利用を検討', description: '自治体の産後ケア事業を確認', sort_order: 7 },
  { stage_id: 'postpartum', category_id: 'procedure', title: '育児休業給付金の申請', description: '勤務先のハローワークを通じて申請', sort_order: 8 },
  { stage_id: 'postpartum', category_id: 'other',     title: '内祝い・お返しの準備', description: '出産祝いをいただいた方へのお返し', sort_order: 9 },

  // ── 育児 ──
  { stage_id: 'childcare', category_id: 'health',    title: '予防接種スケジュールを確認', description: '生後2ヶ月からヒブ・肺炎球菌等の接種開始', sort_order: 1 },
  { stage_id: 'childcare', category_id: 'health',    title: '乳児健診を受ける（3-4ヶ月）', description: '市区町村の集団健診を確認', sort_order: 2 },
  { stage_id: 'childcare', category_id: 'health',    title: '離乳食を開始する', description: '生後5-6ヶ月頃から開始', sort_order: 3 },
  { stage_id: 'childcare', category_id: 'health',    title: '1歳6ヶ月児健診を受ける', sort_order: 4 },
  { stage_id: 'childcare', category_id: 'health',    title: '3歳児健診を受ける', sort_order: 5 },
  { stage_id: 'childcare', category_id: 'procedure', title: '保育園・幼稚園を探す', description: '保活は早めに開始（地域により激戦）', sort_order: 6 },
  { stage_id: 'childcare', category_id: 'procedure', title: '保育園の申込をする', description: '自治体の締切を確認（通常10-11月頃）', sort_order: 7 },
  { stage_id: 'childcare', category_id: 'money',     title: '学資保険・教育資金の検討', description: '早めの積立で将来に備える', sort_order: 8 },
  { stage_id: 'childcare', category_id: 'shopping',  title: '月齢に合ったおもちゃ・絵本を用意', sort_order: 9 },
  { stage_id: 'childcare', category_id: 'other',     title: 'かかりつけ小児科を決める', description: '夜間・休日対応の病院も確認', sort_order: 10 },
];
