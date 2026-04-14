import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '利用規約 - Sprout 🌱',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="text-2xl font-bold mb-8">利用規約</h1>
        <div className="prose prose-sm max-w-none space-y-6 text-foreground/90">
          <p className="text-muted-foreground text-xs">最終更新日: 2026年4月14日</p>

          <section>
            <h2 className="text-lg font-bold mt-6 mb-2">第1条（適用）</h2>
            <p>
              本規約は、Sprout（以下「本サービス」）の利用に関するすべての条件を定めるものです。
              ユーザーは、本サービスを利用することにより、本規約に同意したものとみなされます。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mt-6 mb-2">第2条（アカウント）</h2>
            <ol className="list-decimal pl-5 space-y-1">
              <li>ユーザーは、正確な情報を提供してアカウントを作成するものとします。</li>
              <li>アカウントの管理責任はユーザー自身にあり、第三者への譲渡・貸与はできません。</li>
              <li>パスワードの漏洩等による不正利用の責任は、ユーザーが負うものとします。</li>
            </ol>
          </section>

          <section>
            <h2 className="text-lg font-bold mt-6 mb-2">第3条（禁止事項）</h2>
            <p>ユーザーは以下の行為を行ってはなりません。</p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>法令または公序良俗に違反する行為</li>
              <li>本サービスの運営を妨害する行為</li>
              <li>他のユーザーの個人情報を不正に収集する行為</li>
              <li>本サービスを不正な目的で利用する行為</li>
              <li>本サービスのリバースエンジニアリング、逆コンパイル等の行為</li>
              <li>その他、運営者が不適切と判断する行為</li>
            </ol>
          </section>

          <section>
            <h2 className="text-lg font-bold mt-6 mb-2">第4条（サービスの提供）</h2>
            <ol className="list-decimal pl-5 space-y-1">
              <li>本サービスは「現状有姿」で提供されます。</li>
              <li>運営者は、事前の通知なくサービスの内容を変更、または提供を中止できるものとします。</li>
              <li>本サービスの提供する情報は、医療上のアドバイスではありません。医療に関する判断は必ず医療専門家にご相談ください。</li>
            </ol>
          </section>

          <section>
            <h2 className="text-lg font-bold mt-6 mb-2">第5条（免責事項）</h2>
            <ol className="list-decimal pl-5 space-y-1">
              <li>本サービスの利用により生じた損害について、運営者は一切の責任を負いません。</li>
              <li>本サービスに掲載されている情報の正確性・完全性について保証するものではありません。</li>
              <li>サーバー障害、システムメンテナンス等による一時的な利用停止について、運営者は責任を負いません。</li>
            </ol>
          </section>

          <section>
            <h2 className="text-lg font-bold mt-6 mb-2">第6条（知的財産権）</h2>
            <p>
              本サービスに関する著作権、商標権その他の知的財産権は、運営者に帰属します。
              ユーザーが投稿したコンテンツの著作権はユーザーに帰属しますが、本サービスの運営に必要な範囲で利用を許諾するものとします。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mt-6 mb-2">第7条（退会）</h2>
            <p>
              ユーザーは、設定画面からいつでもアカウントを削除し、退会することができます。
              退会時に、ユーザーのデータは合理的な期間内に削除されます。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mt-6 mb-2">第8条（規約の変更）</h2>
            <p>
              運営者は、必要に応じて本規約を変更できるものとします。
              変更後の規約は、本サービス上に掲示した時点で効力を生じるものとします。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mt-6 mb-2">第9条（準拠法・管轄）</h2>
            <p>
              本規約は日本法に準拠し、本サービスに関する紛争は東京地方裁判所を第一審の専属的合意管轄裁判所とします。
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
