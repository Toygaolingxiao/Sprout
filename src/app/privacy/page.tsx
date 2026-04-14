import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'プライバシーポリシー - Sprout 🌱',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="text-2xl font-bold mb-8">プライバシーポリシー</h1>
        <div className="prose prose-sm max-w-none space-y-6 text-foreground/90">
          <p className="text-muted-foreground text-xs">最終更新日: 2026年4月14日</p>

          <section>
            <h2 className="text-lg font-bold mt-6 mb-2">1. 収集する情報</h2>
            <p>本サービスでは、以下の情報を収集します。</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>アカウント情報</strong>：メールアドレス、ニックネーム、認証情報（Google認証を含む）</li>
              <li><strong>プロフィール情報</strong>：現在のライフステージ、出産予定日、妊娠予定時期</li>
              <li><strong>利用データ</strong>：チェックリストの完了状況、カスタムタスクの内容</li>
              <li><strong>技術情報</strong>：IPアドレス、ブラウザ種別、アクセス日時（ログとして自動収集）</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold mt-6 mb-2">2. 情報の利用目的</h2>
            <p>収集した情報は、以下の目的で利用します。</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>本サービスの提供・運営・改善</li>
              <li>ユーザーサポートへの対応</li>
              <li>タスクスケジュールの自動計算機能の提供</li>
              <li>家族グループ内でのデータ共有機能の提供</li>
              <li>利用状況の分析およびサービス改善</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold mt-6 mb-2">3. 情報の共有</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>家族グループ</strong>：同じ家族グループに所属するメンバー間で、チェックリストの進捗やタスク情報が共有されます。</li>
              <li><strong>第三者提供</strong>：法令に基づく場合を除き、ユーザーの同意なく第三者に個人情報を提供することはありません。</li>
              <li><strong>外部サービス</strong>：認証基盤としてSupabase（米国）を利用しています。</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold mt-6 mb-2">4. データの保管</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>データはSupabase（クラウドデータベース）に暗号化された接続を通じて保管されます。</li>
              <li>行レベルセキュリティ（RLS）により、他の家族グループのデータにアクセスできない仕組みを採用しています。</li>
              <li>パスワードはハッシュ化して保存され、平文では保存しません。</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold mt-6 mb-2">5. ユーザーの権利</h2>
            <p>ユーザーは以下の権利を有します。</p>
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>アクセス権</strong>：自身のデータの内容を確認する権利</li>
              <li><strong>訂正権</strong>：設定画面からプロフィール情報をいつでも変更できます</li>
              <li><strong>削除権</strong>：アカウントを削除することで、関連するデータを削除できます</li>
              <li><strong>データポータビリティ</strong>：将来的にデータのエクスポート機能を提供予定です</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold mt-6 mb-2">6. Cookieの使用</h2>
            <p>
              本サービスでは、認証セッションの維持のためにCookieを使用します。
              これは本サービスの適切な動作に必要なもので、トラッキング目的のCookieは使用していません。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mt-6 mb-2">7. 未成年者の利用</h2>
            <p>
              本サービスは主に成人の利用を想定しています。
              16歳未満の方は、保護者の同意を得た上でご利用ください。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mt-6 mb-2">8. ポリシーの変更</h2>
            <p>
              本ポリシーは必要に応じて更新される場合があります。
              重要な変更がある場合は、本サービス上で通知します。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mt-6 mb-2">9. お問い合わせ</h2>
            <p>
              プライバシーに関するお問い合わせは、本サービスの設定画面内のお問い合わせ機能よりご連絡ください。
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
