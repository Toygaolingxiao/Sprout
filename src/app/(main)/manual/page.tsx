import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getLocale, serverT } from '@/lib/i18n/server';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'マニュアル | Sprout',
  description: 'Sproutの利用マニュアル',
};

export default async function ManualPage() {
  const locale = await getLocale();
  const t = (key: Parameters<typeof serverT>[1], params?: Parameters<typeof serverT>[2]) => serverT(locale, key, params);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">{t('manual.title')}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t('manual.subtitle')}</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">1. {t('manual.section.start')}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2 leading-relaxed">
          <ol className="list-decimal pl-5 space-y-1">
            <li>新規登録（メールまたはGoogle）を行い、ログインします。</li>
            <li>設定画面でライフステージと日程を入力して保存します。</li>
            <li>ホーム画面で現在ステージのタスク一覧を確認します。</li>
          </ol>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">2. {t('manual.section.family')}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2 leading-relaxed">
          <ol className="list-decimal pl-5 space-y-1">
            <li>家族画面で招待リンクを生成します。</li>
            <li>パートナーが別アカウントでログインし、招待リンクを開きます。</li>
            <li>「家族グループに参加」を押すとタスクを共有できます。</li>
          </ol>
          <p className="text-xs text-muted-foreground">招待リンクは7日間有効です。</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">3. {t('manual.section.checklist')}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2 leading-relaxed">
          <ul className="list-disc pl-5 space-y-1">
            <li>ステージごとのタスクを確認し、左側のチェックで完了できます。</li>
            <li>カテゴリ・性別フィルターで必要なタスクだけに絞り込めます。</li>
            <li>「要点・注意事項を見る」からタスク詳細を展開できます。</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">4. {t('manual.section.troubleshoot')}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2 leading-relaxed">
          <ul className="list-disc pl-5 space-y-1">
            <li>招待リンクが無効な場合は、家族画面で再発行してください。</li>
            <li>画面が更新されない場合は再読み込みを行ってください。</li>
            <li>言語は設定画面の「言語」から切り替えできます。</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}